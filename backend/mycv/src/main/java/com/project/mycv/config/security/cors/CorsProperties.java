package com.project.mycv.config.security.cors;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "app.security.cors")
public class CorsProperties {
    private List<String> allowedOrigins;
}
