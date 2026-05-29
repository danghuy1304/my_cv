package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CvInterestDTO {
    private Long id;
    private String interestName;
    private Integer displayOrder;
    private LocalDateTime createdDate;
}

