package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccessLogDTO {
    private Long id;
    private String ipAddress;
    private String userAgent;
    private String browser;
    private String operatingSystem;
    private String deviceType;
    private String referer;
    private String locationCountry;
    private String locationCity;
    private LocalDateTime accessedTime;
}
