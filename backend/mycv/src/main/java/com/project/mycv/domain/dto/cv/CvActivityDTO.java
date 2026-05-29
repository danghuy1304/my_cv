package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvActivityDTO {
    private Long id;
    private String organization;
    private String role;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdDate;
}
