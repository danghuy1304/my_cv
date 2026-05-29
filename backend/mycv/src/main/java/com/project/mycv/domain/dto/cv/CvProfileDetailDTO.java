package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvProfileDetailDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String title;
    private LocalDate birthday;
    private String phone;
    private String email;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String address;
    private String summaryShort;
    private String summaryLong;
    private String avatarUrl;
    private String status;
    private Boolean isPublic;
    private Long viewCount;
    private LocalDateTime publishedAt;
    private LocalDateTime deletedAt;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private List<CvSkillDTO> skills;
    private List<CvEducationDTO> educations;
    private List<CvProjectDTO> projects;
    private List<CvActivityDTO> activities;
    private List<CvInterestDTO> interests;
    private List<CvCertificationDTO> certifications;
}

