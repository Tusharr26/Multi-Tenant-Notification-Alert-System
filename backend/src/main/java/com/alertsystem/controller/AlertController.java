package com.alertsystem.controller;

import com.alertsystem.dto.AlertRequestDTO;
import com.alertsystem.dto.AlertResponseDTO;
import com.alertsystem.dto.ApiResponse;
import com.alertsystem.dto.DashboardStatsDTO;
import com.alertsystem.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<AlertResponseDTO>> createAlert(@Valid @RequestBody AlertRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success("Alert created", alertService.createAlert(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<List<AlertResponseDTO>>> getAlerts(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        return ResponseEntity
                .ok(ApiResponse.success("Alerts fetched", alertService.getAlerts(severity, type, startDate, endDate)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<AlertResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", alertService.updateStatus(id, status)));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<ApiResponse<AlertResponseDTO>> assignAlert(
            @PathVariable Long id,
            @RequestParam Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Alert assigned", alertService.assignAlert(id, userId)));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched", alertService.getDashboardStats()));
    }
}
