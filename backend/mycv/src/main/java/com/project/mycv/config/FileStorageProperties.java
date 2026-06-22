package com.project.mycv.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.upload")
public class FileStorageProperties {
    private String dir = "./api/v1/uploads";
    private String baseUrl = "http://localhost:8080";
}
