package com.project.mycv.domain.dto.cv;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CvProfileUpdateDTO {
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
}

