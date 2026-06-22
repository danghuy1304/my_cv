package com.project.mycv.config.security;

import com.project.mycv.config.security.cors.CorsProperties;
import com.project.mycv.config.security.route.BypassRouteProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSecurityConfig.class);

    private final JwtTokenFilter jwtTokenFilter;
    private final BypassRouteProperties bypassRouteProperties;
    private final CorsProperties corsProperties;

    /**
     * Security filter chain security filter chain.
     *
     * @param http the http
     * @return the security filter chain
     * @throws Exception the exception
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        List<BypassRouteProperties.BypassRoute> routes = bypassRouteProperties.getRoutes();
        String[] publicPaths;

        if (routes == null || routes.isEmpty()) {
            LOGGER.warn("⚠️ Bypass routes is null or empty! All endpoints will require authentication.");
            publicPaths = new String[0];
        } else {
            publicPaths = routes.stream()
                    .map(BypassRouteProperties.BypassRoute::getPath)
                    .distinct()
                    .toArray(String[]::new);
            LOGGER.info("✅ Loaded {} public paths for SecurityFilterChain: {}",
                    publicPaths.length, Arrays.toString(publicPaths));
        }
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e)
                                -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED)) // 401
                        .accessDeniedHandler((req, res, e)
                                -> res.sendError(HttpServletResponse.SC_FORBIDDEN))        // 403
                )
                .authorizeHttpRequests((requests) -> {
                    requests
                            .requestMatchers(publicPaths)
                            .permitAll()
                            .anyRequest().authenticated();
                })
                .sessionManagement(
                        httpSecuritySessionManagementConfigurer
                                -> httpSecuritySessionManagementConfigurer
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(corsProperties.getAllowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Nếu cần gửi cookie, token

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
