package com.project.mycv.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Serves uploaded static files (e.g. avatars) under /uploads/**.
 * The physical path is resolved from app.upload.dir in application.yaml.
 */
@Configuration
@RequiredArgsConstructor
public class StaticResourceConfig implements WebMvcConfigurer {

    private final FileStorageProperties props;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absPath = Paths.get(props.getDir()).toAbsolutePath().normalize().toUri().toString();
        if (!absPath.endsWith("/")) absPath += "/";
        registry.addResourceHandler("/api/v1/uploads/**")
                .addResourceLocations(absPath);
    }
}
