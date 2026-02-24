package com.alertsystem.repository;

import com.alertsystem.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByTenantId(Long tenantId);
    
    @Query("SELECT a FROM Alert a WHERE a.tenant.id = :tenantId " +
           "AND (:severity IS NULL OR a.severity = :severity) " +
           "AND (:type IS NULL OR a.type = :type) " +
           "AND (:startDate IS NULL OR a.timestamp >= :startDate) " +
           "AND (:endDate IS NULL OR a.timestamp <= :endDate)")
    List<Alert> findFilteredAlerts(
        @Param("tenantId") Long tenantId,
        @Param("severity") String severity,
        @Param("type") String type,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.tenant.id = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);

    @Query("SELECT a.severity, COUNT(a) FROM Alert a WHERE a.tenant.id = :tenantId GROUP BY a.severity")
    List<Object[]> countBySeverityAndTenantId(@Param("tenantId") Long tenantId);

    @Query("SELECT a.status, COUNT(a) FROM Alert a WHERE a.tenant.id = :tenantId GROUP BY a.status")
    List<Object[]> countByStatusAndTenantId(@Param("tenantId") Long tenantId);
}
