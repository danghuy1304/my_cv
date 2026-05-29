package com.project.mycv.domain.dto.cv.bulk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CvSkillItemDTO {
    private String skillCategory;
    private String skillName;
    private String skillLevel;
    private Integer displayOrder;
}

