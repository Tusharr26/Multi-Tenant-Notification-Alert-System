package com.alertsystem.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalAlerts;
    private Map<String, Long> severityBreakdown;
    private Map<String, Long> statusBreakdown;
}
