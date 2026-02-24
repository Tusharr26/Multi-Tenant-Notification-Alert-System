package com.alertsystem.service;

import com.alertsystem.dto.AlertRequestDTO;
import com.alertsystem.dto.AlertResponseDTO;
import com.alertsystem.dto.DashboardStatsDTO;
import com.alertsystem.model.Alert;
import com.alertsystem.model.Tenant;
import com.alertsystem.model.User;
import com.alertsystem.repository.AlertRepository;
import com.alertsystem.repository.TenantRepository;
import com.alertsystem.repository.UserRepository;
import com.alertsystem.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;

    public AlertResponseDTO createAlert(AlertRequestDTO request) {
        Long tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new RuntimeException("No tenant context found");
        }

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Alert alert = Alert.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .severity(request.getSeverity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .tenant(tenant)
                .build();

        alert = alertRepository.save(alert);
        return mapToDTO(alert);
    }

    public List<AlertResponseDTO> getAlerts(String severity, String type, LocalDateTime startDate,
            LocalDateTime endDate) {
        Long tenantId = TenantContext.getCurrentTenant();
        List<Alert> alerts = alertRepository.findFilteredAlerts(tenantId, severity, type, startDate, endDate);
        return alerts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public AlertResponseDTO updateStatus(Long alertId, String status) {
        Alert alert = getAlertInTenant(alertId);
        alert.setStatus(status);
        alert = alertRepository.save(alert);
        return mapToDTO(alert);
    }

    public AlertResponseDTO assignAlert(Long alertId, Long userId) {
        Alert alert = getAlertInTenant(alertId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getTenant().getId().equals(TenantContext.getCurrentTenant())) {
            throw new RuntimeException("Cannot assign to user from different tenant");
        }

        alert.setAssignedTo(user);
        alert = alertRepository.save(alert);
        return mapToDTO(alert);
    }

    public DashboardStatsDTO getDashboardStats() {
        Long tenantId = TenantContext.getCurrentTenant();
        long total = alertRepository.countByTenantId(tenantId);

        List<Object[]> severityResults = alertRepository.countBySeverityAndTenantId(tenantId);
        Map<String, Long> severityBreakdown = new HashMap<>();
        for (Object[] result : severityResults) {
            severityBreakdown.put((String) result[0], (Long) result[1]);
        }

        List<Object[]> statusResults = alertRepository.countByStatusAndTenantId(tenantId);
        Map<String, Long> statusBreakdown = new HashMap<>();
        for (Object[] result : statusResults) {
            statusBreakdown.put((String) result[0], (Long) result[1]);
        }

        return DashboardStatsDTO.builder()
                .totalAlerts(total)
                .severityBreakdown(severityBreakdown)
                .statusBreakdown(statusBreakdown)
                .build();
    }

    private Alert getAlertInTenant(Long alertId) {
        Long tenantId = TenantContext.getCurrentTenant();
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        if (!alert.getTenant().getId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to alert");
        }
        return alert;
    }

    private AlertResponseDTO mapToDTO(Alert alert) {
        return AlertResponseDTO.builder()
                .id(alert.getId())
                .title(alert.getTitle())
                .description(alert.getDescription())
                .type(alert.getType())
                .severity(alert.getSeverity())
                .latitude(alert.getLatitude())
                .longitude(alert.getLongitude())
                .timestamp(alert.getTimestamp())
                .status(alert.getStatus())
                .assignedToId(alert.getAssignedTo() != null ? alert.getAssignedTo().getId() : null)
                .assignedToName(alert.getAssignedTo() != null ? alert.getAssignedTo().getName() : null)
                .build();
    }
}
