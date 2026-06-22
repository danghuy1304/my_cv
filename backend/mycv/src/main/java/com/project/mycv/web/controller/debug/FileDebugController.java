package com.project.mycv.web.controller.debug;

import com.project.mycv.config.FileStorageProperties;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Debug controller to check file storage status
 * TODO: Remove in production or add security
 */
@RestController
@RequestMapping("/api/v1/debug")
@RequiredArgsConstructor
public class FileDebugController {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileDebugController.class);
    private final FileStorageProperties props;

    @GetMapping("/storage-info")
    public ResponseEntity<Map<String, Object>> getStorageInfo() {
        Map<String, Object> info = new HashMap<>();
        Path uploadPath = Paths.get(props.getDir()).toAbsolutePath().normalize();
        Path avatarsPath = uploadPath.resolve("avatars");
        
        info.put("uploadDir", props.getDir());
        info.put("baseUrl", props.getBaseUrl());
        info.put("absolutePath", uploadPath.toString());
        info.put("uploadDirExists", Files.exists(uploadPath));
        info.put("avatarsDirExists", Files.exists(avatarsPath));
        
        try {
            if (Files.exists(avatarsPath)) {
                List<String> files = Files.list(avatarsPath)
                    .map(p -> p.getFileName().toString())
                    .collect(Collectors.toList());
                info.put("avatarFiles", files);
                info.put("avatarFilesCount", files.size());
            } else {
                info.put("avatarFiles", List.of());
                info.put("avatarFilesCount", 0);
            }
        } catch (IOException e) {
            LOGGER.error("Error listing files", e);
            info.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(info);
    }

    @GetMapping("/check-file/{filename}")
    public ResponseEntity<Map<String, Object>> checkFile(@PathVariable String filename) {
        Map<String, Object> info = new HashMap<>();
        Path uploadPath = Paths.get(props.getDir()).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve("avatars").resolve(filename);
        
        info.put("filename", filename);
        info.put("fullPath", filePath.toString());
        info.put("exists", Files.exists(filePath));
        
        if (Files.exists(filePath)) {
            try {
                info.put("size", Files.size(filePath));
                info.put("readable", Files.isReadable(filePath));
                info.put("contentType", Files.probeContentType(filePath));
            } catch (IOException e) {
                info.put("error", e.getMessage());
            }
        }
        
        return ResponseEntity.ok(info);
    }
}
