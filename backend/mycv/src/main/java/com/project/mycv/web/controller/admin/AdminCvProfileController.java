package com.project.mycv.web.controller.admin;

import com.project.mycv.application.response.base.RestResponse;
import com.project.mycv.application.service.cv.CvProfileService;
import com.project.mycv.domain.dto.cv.CvProfileCreateDTO;
import com.project.mycv.domain.dto.cv.CvProfileUpdateDTO;
import com.project.mycv.domain.dto.cv.CvStatusUpdateDTO;
import com.project.mycv.domain.dto.cv.bulk.*;
import com.project.mycv.web.base.RestAPI;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestAPI("/api/v1/admin/cv-profiles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCvProfileController {

    private final CvProfileService cvProfileService;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return RestResponse.success(cvProfileService.getAll(page, size));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CvProfileCreateDTO dto) {
        return RestResponse.success(HttpStatus.CREATED, cvProfileService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailById(@PathVariable Long id) {
        return RestResponse.success(cvProfileService.getDetailById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody CvProfileUpdateDTO dto) {
        cvProfileService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody CvStatusUpdateDTO dto) {
        cvProfileService.updateStatus(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        cvProfileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-detail")
    public ResponseEntity<?> getMyDetail() {
        return RestResponse.success(cvProfileService.getMyDetail());
    }

    @PutMapping
    public ResponseEntity<?> updateMy(@RequestBody CvProfileUpdateDTO dto) {
        cvProfileService.updateMy(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateMyStatus(@RequestBody CvStatusUpdateDTO dto) {
        cvProfileService.updateMyStatus(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/skills")
    public ResponseEntity<?> updateMySkills(@RequestBody CvSkillsBulkDTO dto) {
        cvProfileService.updateMySkills(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/educations")
    public ResponseEntity<?> updateMyEducations(@RequestBody CvEducationsBulkDTO dto) {
        cvProfileService.updateMyEducations(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/projects")
    public ResponseEntity<?> updateMyProjects(@RequestBody CvProjectsBulkDTO dto) {
        cvProfileService.updateMyProjects(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/interests")
    public ResponseEntity<?> updateMyInterests(@RequestBody CvInterestsBulkDTO dto) {
        cvProfileService.updateMyInterests(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/certifications")
    public ResponseEntity<?> updateMyCertifications(@RequestBody CvCertificationsBulkDTO dto) {
        cvProfileService.updateMyCertifications(dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/activities")
    public ResponseEntity<?> updateMyActivities(@RequestBody CvActivitiesBulkDTO dto) {
        cvProfileService.updateMyActivities(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/avatar", consumes = {"multipart/form-data"})
    public ResponseEntity<?> uploadMyAvatar(@RequestParam("file") MultipartFile file) {
        String url = cvProfileService.uploadMyAvatar(file);
        return RestResponse.success(Map.of("avatarUrl", url));
    }

    @GetMapping("/access-logs")
    public ResponseEntity<?> getMyAccessLogs(@RequestParam(defaultValue = "50") int limit) {
        return RestResponse.success(cvProfileService.getMyAccessLogs(limit));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getMyStats() {
        return RestResponse.success(cvProfileService.getMyStats());
    }
}
