package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvProfileDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String title;
    private String email;
    private String phone;
    private String avatarUrl;
    private String status;
    private Boolean isPublic;
    private Long viewCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}

