package com.project.mycv.application.service.file;

import com.project.mycv.config.FileStorageProperties;
import com.project.mycv.config.exception.ClientException;
import com.project.mycv.constant.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileStorageServiceImpl.class);
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5 MB

    private final FileStorageProperties props;

    @Override
    public String storeAvatar(Long cvId, MultipartFile file) {
        validateImage(file);

        String ext      = getExtension(Objects.requireNonNull(file.getOriginalFilename()));
        String filename = "cv-" + cvId + "." + ext;
        Path   dir      = Paths.get(props.getDir(), "avatars");

        try {
            Files.createDirectories(dir);
            deleteExistingAvatarsForCv(dir, cvId); // remove old file (any ext)
            Files.copy(file.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            LOGGER.error("Failed to store avatar for cvId={}", cvId, e);
            throw new RuntimeException("Could not store avatar file", e);
        }

        return props.getBaseUrl() + "/uploads/avatars/" + filename;
    }

    @Override
    public void deleteAvatar(String avatarUrl) {
        if (avatarUrl == null || avatarUrl.isBlank()) return;
        try {
            String filename = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1);
            Path target = Paths.get(props.getDir(), "avatars", filename);
            Files.deleteIfExists(target);
        } catch (IOException e) {
            LOGGER.warn("Could not delete avatar: {}", avatarUrl, e);
        }
    }

    // ─── private helpers ─────────────────────────────────────────────────────

    private void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ClientException(MessageKeys.AVATAR_EMPTY);
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ClientException(MessageKeys.AVATAR_TOO_LARGE);
        }
        String ct = file.getContentType();
        if (ct == null || !ALLOWED_TYPES.contains(ct)) {
            throw new ClientException(MessageKeys.AVATAR_INVALID_TYPE);
        }
    }

    private String getExtension(String filename) {
        int idx = filename.lastIndexOf('.');
        return (idx < 0) ? "jpg" : filename.substring(idx + 1).toLowerCase();
    }

    private void deleteExistingAvatarsForCv(Path dir, Long cvId) throws IOException {
        if (!Files.exists(dir)) return;
        String prefix = "cv-" + cvId + ".";
        try (var stream = Files.list(dir)) {
            stream.filter(p -> p.getFileName().toString().startsWith(prefix))
                  .forEach(p -> {
                      try { Files.deleteIfExists(p); }
                      catch (IOException ex) { LOGGER.warn("Could not delete {}", p, ex); }
                  });
        }
    }
}
