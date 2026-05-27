package com.project.mycv.application.service.token;

import com.project.mycv.application.mapper.TokenMapper;
import com.project.mycv.config.exception.AuthorizedException;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.domain.model.Token;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenServiceImpl.class);

    private final TokenMapper tokenMapper;

    @Value("${jwt.expiration-refresh-token}")
    private Long EXPIRATION_REFRESH_TOKEN;

    @Override
    public Optional<Token> findByToken(UUID refreshToken) {
        return tokenMapper.findByToken(refreshToken);
    }

    @Override
    public boolean validateToken(UUID token) {
        Token refreshToken = findByToken(token).orElseThrow(() -> new AuthorizedException(MessageKeys.TOKEN_NOT_FOUND));
        boolean valid = !refreshToken.isRevoked() && !refreshToken.isExpired();
        if (valid) {
            boolean isExpired = refreshToken.getExpiredAt().isBefore(LocalDateTime.now());
            refreshToken.setRevoked(isExpired);

            return !isExpired;
        }
        return false;
    }

    @Override
    public boolean revokeToken(UUID token) {
        int records = tokenMapper.revokeToken(token);
        return records > 0;
    }

    @Override
    public Token insert(Token entity) {
        Token refreshToken = findByToken(entity.getRefreshToken()).orElse(null);
        return tokenMapper.insert(entity);
    }

    @Override
    public Token update(Token entity, UUID refreshToken) {
        return null;
    }

    @Override
    public void delete(UUID refreshToken) {
        int records = tokenMapper.delete(refreshToken);
        if (records > 0) {
            LOGGER.info("Delete token records {}", records);
        }
    }
}
