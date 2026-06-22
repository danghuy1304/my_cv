package com.project.mycv.config.security;

import com.project.mycv.config.security.route.BypassRouteProperties;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtTokenFilter.class);
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

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
        String servletPath = request.getServletPath();
        String requestURI = request.getRequestURI();
        String contextPath = request.getContextPath();
        String method = request.getMethod();

        LOGGER.debug("🔍 Request Details: method={}, servletPath={}, requestURI={}, contextPath={}",
                method, servletPath, requestURI, contextPath);

        try {
            if (isByPassToken(request)) {
                LOGGER.debug("✅ Bypassing JWT check for {} {}", method, servletPath);
                filterChain.doFilter(request, response);
                return;
            }
            LOGGER.debug("🔒 Checking JWT for {} {}", method, servletPath);
            if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(SecurityConstant.TOKEN_PREFIX)) {
                sendUnauthorized(response, HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue());
                return;
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
                LOGGER.error("Expired JWT token: {}", ex.getMessage());
                sendUnauthorized(response, HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue());
            } catch (Exception e) {
                LOGGER.error("Exception JWT filter: {}", e.getMessage());
                sendUnauthorized(response, HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue());
            }
        } catch (Exception e) {
            LOGGER.error("JWT filter failed: {}", e.getMessage());
            sendUnauthorized(response, HTypeTokenInvalid.ACCESS_TOKEN_INVALID.getValue());
        }
    }

    /**
     * Write a 401 JSON response directly — filters bypass @RestControllerAdvice,
     * so we must write the response ourselves to ensure consistent format.
     */
    private void sendUnauthorized(HttpServletResponse response, String type) throws IOException {
        if (response.isCommitted()) return;
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"type\":\"" + type + "\",\"errors\":[\"" + type + "\"]}");
    }

    private boolean isByPassToken(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();
        List<BypassRouteProperties.BypassRoute> routes = bypassRouteProperties.getRoutes();

        if (routes == null) {
            LOGGER.warn("⚠️ Bypass routes is NULL! Request {} {} will be blocked.", method, path);
            return false;
        }

        boolean isBypassed = routes.stream()
                .anyMatch(r -> {
                    boolean pathMatch = PATH_MATCHER.match(r.getPath(), path);
                    boolean methodMatch = method.equalsIgnoreCase(r.getMethod());
                    if (pathMatch && methodMatch) {
                        LOGGER.debug("✅ Matched bypass rule: {} {} -> route: {} {}",
                                method, path, r.getMethod(), r.getPath());
                    }
                    return pathMatch && methodMatch;
                });

        if (!isBypassed) {
            LOGGER.debug("❌ No bypass match for {} {}", method, path);
        }

        return isBypassed;
    }
}
