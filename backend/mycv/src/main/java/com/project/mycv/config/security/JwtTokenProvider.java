package com.project.mycv.config.security;

import com.github.f4b6a3.ulid.UlidCreator;
import com.project.mycv.application.service.token.TokenService;
import com.project.mycv.domain.dto.UserDTO;
import com.project.mycv.domain.model.Token;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    @Value("${jwt.expiration.refresh-token}")
    private int expirationRefresh;

    @Value("${jwt.expiration.access-token}")
    private int expirationAccess;

    @Value("${jwt.secret-key}")
    private String secretKey;

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final TokenService tokenService;

    public String generateAccessToken(UserDTO userDto) {
        Map<String, Object> claims = Map.of(
                "id", userDto.getId(),
                "role", userDto.getRole().getRoleName()
        );
        return Jwts.builder()
                .claims(claims)
                .subject(userDto.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationAccess * 1000L))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(UserDTO userDto) {
        String refreshToken = UlidCreator.getUlid().toString();
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime expiredDate = currentDate.plusSeconds(expirationRefresh);
        Token token = new Token();
        token.setRefreshToken(refreshToken);
        token.setCreatedDate(currentDate);
        token.setRevoked(false);
        token.setExpired(false);
        token.setExpiredDate(expiredDate);
        token.setUserId(userDto.getId());
        tokenService.insert(token);
        return refreshToken;
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Timestamp getExpirationDate(String token) {
        return new Timestamp(extractClaim(token, Claims::getExpiration).getTime());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenExpired(String token) {
        return getExpirationDate(token).before(new Date());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("id", String.class);
        } catch (ExpiredJwtException e) {
            logger.error("Token expired", e);
            throw e;
        } catch (JwtException e) {
            logger.error("Invalid token", e);
            throw e;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature.");
        }
        return false;
    }
}
