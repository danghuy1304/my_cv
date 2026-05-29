package com.project.mycv.web.controller.public_;

import com.project.mycv.application.response.base.RestResponse;
import com.project.mycv.application.service.public_.PublicCvService;
import com.project.mycv.web.base.RestAPI;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestAPI("/api/v1/cv")
@RequiredArgsConstructor
public class PublicCvController {

    private final PublicCvService publicCvService;

    /**
     * GET /api/v1/public/cv/{username}
     * Public CV detail — no authentication required.
     * Automatically increments view_count on each call.
     */
    @GetMapping("/{username}")
    public ResponseEntity<?> getPublicCv(@PathVariable String username) {
        return RestResponse.success(publicCvService.getPublicCv(username));
    }

    /**
     * POST /api/v1/public/cv/{username}/log
     * Called silently by the frontend when a visitor views the CV.
     * Parses IP, User-Agent, Referer and persists to access_logs.
     */
    @PostMapping("/{username}/log")
    public ResponseEntity<?> logCvView(
            @PathVariable String username,
            HttpServletRequest request) {
        publicCvService.logCvView(username, request);
        return ResponseEntity.ok().build();
    }
}

