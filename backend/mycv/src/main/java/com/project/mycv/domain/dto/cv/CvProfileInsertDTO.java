package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvProfileInsertDTO {
    private Long id;
    private Long userId;
    private String fullName;
    private String title;
    private String status;
    private Boolean isPublic;
    private Long viewCount;
}

