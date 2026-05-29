package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessLogInsertDTO {
    private Long cvId;
    private String ipAddress;
    private String userAgent;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private String referer;
    private String locationCountry;
    private String locationCity;
}

