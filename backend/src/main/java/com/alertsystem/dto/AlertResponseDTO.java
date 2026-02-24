package com.alertsystem.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AlertResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String severity;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private String status;
    private Long assignedToId;
    private String assignedToName;
}
