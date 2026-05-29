package com.project.mycv.domain.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CvStatsDTO {
    private long totalViews;
    private Map<String, Long> deviceBreakdown;
    private Map<String, Long> browserBreakdown;
    private List<AccessLogDTO> recentLogs;
}
