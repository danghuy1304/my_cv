package com.project.mycv.web.controller;

import com.project.mycv.config.FileStorageProperties;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Serves uploaded static files (avatars, etc.)
 * This controller handles serving files from the upload directory
 */
@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UploadController.class);
    private final FileStorageProperties props;

    /**
     * Serve avatar files
     * GET /api/v1/uploads/avatars/{filename}
     */
    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(props.getDir()).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve("avatars").resolve(filename).normalize();
            
            LOGGER.info("📥 Serving avatar: {}", filename);
            LOGGER.debug("  → Full path: {}", filePath);
            
            // Security check: prevent path traversal attacks
            if (!filePath.startsWith(uploadPath)) {
                LOGGER.warn("⚠️ Path traversal attempt detected: {}", filename);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Check if file exists
            if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
                LOGGER.warn("❌ File not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            // Load file as Resource
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                LOGGER.warn("❌ File not readable: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type
            String contentType;
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException e) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }
            
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }
            
            LOGGER.info("✅ Serving file: {} (type: {}, size: {} bytes)", 
                       filename, contentType, resource.contentLength());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
                    
        } catch (MalformedURLException e) {
            LOGGER.error("❌ Malformed URL for file: {}", filename, e);
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            LOGGER.error("❌ Error serving file: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
