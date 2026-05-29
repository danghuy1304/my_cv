package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvSkillDTO {
    private Long id;
    private String skillCategory;
    private String skillName;
    private String skillLevel;
    private Integer displayOrder;
    private LocalDateTime createdDate;
}

