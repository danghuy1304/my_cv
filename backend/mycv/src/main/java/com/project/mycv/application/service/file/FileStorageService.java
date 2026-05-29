package com.project.mycv.application.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Save avatar for a CV profile to disk, replacing any existing one.
     * File is named "cv-{cvId}.{ext}" under the avatars sub-directory.
     *
     * @return the publicly accessible URL of the stored file
     */
    String storeAvatar(Long cvId, MultipartFile file);

    /**
     * Delete the avatar file from disk given its full URL.
     * Silently ignores missing files.
     */
    void deleteAvatar(String avatarUrl);
}
