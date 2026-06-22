package com.project.mycv.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.upload")
public class FileStorageProperties {
    private static final Logger LOGGER = LoggerFactory.getLogger(FileStorageProperties.class);
    
    private String dir = "./api/v1/uploads";
    private String baseUrl = "http://localhost:8080";
    
    @PostConstruct
    public void logConfig() {
        LOGGER.info("⚙️ FileStorageProperties initialized:");
        LOGGER.info("  → Upload directory: {}", dir);
        LOGGER.info("  → Base URL: {}", baseUrl);
    }
}
