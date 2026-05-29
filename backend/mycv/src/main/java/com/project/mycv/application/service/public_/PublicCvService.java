package com.project.mycv.application.service.public_;

import com.project.mycv.domain.dto.cv.CvProfileDetailDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface PublicCvService {

    /**
     * Retrieve a published, public CV by the owner's username.
     * Also increments view_count atomically.
     *
     * @throws com.project.mycv.config.exception.NotFoundException if the CV is not found,
     *         not published, or not public.
     */
    CvProfileDetailDTO getPublicCv(String username);

    /**
     * Record a CV view access log entry from the viewer's HTTP request.
     *
     * @throws com.project.mycv.config.exception.NotFoundException if no CV exists for the username.
     */
    void logCvView(String username, HttpServletRequest request);
}

