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
public class CvProjectDTO {
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
    private LocalDateTime createdDate;
    private List<CvProjectTaskDTO> tasks;
}

