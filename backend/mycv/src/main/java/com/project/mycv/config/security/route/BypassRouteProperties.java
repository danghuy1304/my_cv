package com.project.mycv.config.security.route;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "bypass")
public class BypassRouteProperties {
    private List<BypassRoute> routes;

    @Data
    public static class BypassRoute {
        private String path;
        private String method;
    }
}
