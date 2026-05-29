package com.project.mycv.domain.dto.cv;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CvProfileCreateDTO {
    @NotBlank(message = "input.cv.full_name.not_blank")
    private String fullName;
    private String title;
}

