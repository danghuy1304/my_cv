package com.project.mycv.domain.dto.cv.bulk;

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
public class CvActivityItemDTO {
    private String organization;
    private String role;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
