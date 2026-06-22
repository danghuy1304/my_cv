package com.project.mycv.config.security.route;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "bypass")
public class BypassRouteProperties {
    private static final Logger LOGGER = LoggerFactory.getLogger(BypassRouteProperties.class);

    private List<BypassRoute> routes;

    @PostConstruct
    public void logRoutesLoaded() {
        if (routes == null || routes.isEmpty()) {
            LOGGER.error("❌ NO BYPASS ROUTES LOADED! Check bypass-routes.yml and spring.config.import");
        } else {
            LOGGER.info("✅ Loaded {} bypass routes:", routes.size());
            routes.forEach(r -> LOGGER.info("   - {} {}", r.getMethod(), r.getPath()));
        }
    }

    @Data
    public static class BypassRoute {
        private String path;
        private String method;
    }
}
