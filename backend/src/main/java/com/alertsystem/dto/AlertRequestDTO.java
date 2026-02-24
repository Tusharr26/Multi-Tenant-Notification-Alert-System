package com.alertsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlertRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Severity is required")
    private String severity;

    private Double latitude;
    private Double longitude;
}
