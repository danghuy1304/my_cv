package com.project.mycv.config.security;

import com.project.mycv.config.exception.AuthorizedException;
import com.project.mycv.config.security.route.BypassRouteProperties;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.constant.SecurityConstant;
import com.project.mycv.constant.type.HTypeTokenInvalid;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenFilter.class);

    @Value("${api.version1}")
    private String API_VERSION1;
    private final CustomUserDetailService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final BypassRouteProperties bypassRouteProperties;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws IOException {
        final String authHeader = request.getHeader(SecurityConstant.HEADER_AUTHORIZATION);
        try {
            if (isByPassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }
            if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(SecurityConstant.TOKEN_PREFIX)) {
                throw new AuthorizedException(HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue(),
                        MessageKeys.AUTHORIZATION_FAIL);
            }
            final String token = authHeader.substring(7);

            try {
                final String userName = jwtTokenProvider.extractUsername(token);
                if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                    if (jwtTokenProvider.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
                filterChain.doFilter(request, response);
            } catch (ExpiredJwtException ex) {
                LOGGER.warn("Expired JWT token: {}", ex.getMessage());
                throw new AuthorizedException(HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue(),
                        MessageKeys.AUTHORIZATION_FAIL);
            } catch (Exception e) {
                LOGGER.warn("Exception JWT filter: {}", e.getMessage());
                throw new AuthorizedException(HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue(),
                        MessageKeys.AUTHORIZATION_FAIL);
            }
        } catch (Exception e) {
            LOGGER.warn("JWT filter failed: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
        }
    }

    private boolean isByPassToken(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();
        return bypassRouteProperties.getRoutes().stream()
                .anyMatch(r -> path.equals(r.getPath()) && method.equalsIgnoreCase(r.getMethod()));
    }
}
