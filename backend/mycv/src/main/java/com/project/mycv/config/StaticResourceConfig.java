package com.project.mycv.config;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Static resource configuration - DISABLED
 * Now using UploadController to serve files directly via REST endpoint
 * This provides better control, logging, and security checks
 */
@Configuration
@RequiredArgsConstructor
public class StaticResourceConfig implements WebMvcConfigurer {

    private static final Logger LOGGER = LoggerFactory.getLogger(StaticResourceConfig.class);
    private final FileStorageProperties props;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // DISABLED: Using UploadController instead for better control
        // Keeping this class for reference
        /*
        Path uploadPath = Paths.get(props.getDir()).toAbsolutePath().normalize();
        String absPath = uploadPath.toUri().toString();
        if (!absPath.endsWith("/")) absPath += "/";
        
        LOGGER.info("📁 Configuring static resource handler:");
        LOGGER.info("  → Handler pattern: /api/v1/uploads/**");
        LOGGER.info("  → Physical path: {}", uploadPath);
        LOGGER.info("  → URI format: {}", absPath);
        LOGGER.info("  → Directory exists: {}", Files.exists(uploadPath));
        
        registry.addResourceHandler("/api/v1/uploads/**")
                .addResourceLocations(absPath);
        */
        
        LOGGER.info("ℹ️ StaticResourceConfig disabled - using UploadController for file serving");
    }
}
