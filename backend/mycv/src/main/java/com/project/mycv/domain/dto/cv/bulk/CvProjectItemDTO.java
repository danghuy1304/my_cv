package com.project.mycv.domain.dto.cv.bulk;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CvProjectItemDTO {
    /** Populated by MyBatis useGeneratedKeys after insert — not set by client. */
    private Long id;
    private String projectName;
    private String companyName;
    private Integer teamSize;
    private String roleInProject;
    private String techFrontend;
    private String techBackend;
    private String techDevopsTools;
    private String urlDemo;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<CvProjectTaskItemDTO> tasks;
}

