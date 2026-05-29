package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvEducationDTO {
    private Long id;
    private String schoolName;
    private String major;
    private String degree;
    private String gpa;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdDate;
}

