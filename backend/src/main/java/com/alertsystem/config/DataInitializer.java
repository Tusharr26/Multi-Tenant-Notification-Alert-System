package com.alertsystem.config;

import com.alertsystem.model.Alert;
import com.alertsystem.model.Role;
import com.alertsystem.model.Tenant;
import com.alertsystem.model.User;
import com.alertsystem.repository.AlertRepository;
import com.alertsystem.repository.TenantRepository;
import com.alertsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final TenantRepository tenantRepository;
        private final AlertRepository alertRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                alertRepository.deleteAll();
                userRepository.deleteAll();
                tenantRepository.deleteAll();

                Tenant tenant1;
                User normalUser;

                // Create Tenant
                tenant1 = Tenant.builder()
                                .name("Acme Corp")
                                .tenantCode("ACME")
                                .build();
                tenant1 = tenantRepository.save(tenant1);

                // Create Super Admin
                User superAdmin = User.builder()
                                .name("Super Admin")
                                .email("super@admin.com")
                                .password(passwordEncoder.encode("admin123"))
                                .role(Role.SUPER_ADMIN)
                                .build();
                userRepository.save(superAdmin);

                // Create Tenant Admin
                User tenantAdmin = User.builder()
                                .name("Acme Admin")
                                .email("admin@acme.com")
                                .password(passwordEncoder.encode("password"))
                                .role(Role.TENANT_ADMIN)
                                .tenant(tenant1)
                                .build();
                tenantAdmin = userRepository.save(tenantAdmin);

                // Create User
                normalUser = User.builder()
                                .name("Acme User")
                                .email("user@acme.com")
                                .password(passwordEncoder.encode("password"))
                                .role(Role.USER)
                                .tenant(tenant1)
                                .build();
                userRepository.save(normalUser);

                // Create Sample Alerts
                String[] types = { "Fire", "Medical", "Crime", "System", "Other" };
                String[] severities = { "Low", "Medium", "High", "Critical" };
                String[] statuses = { "Open", "In Progress", "Closed" };
                java.util.Random random = new java.util.Random();

                for (int i = 1; i <= 20; i++) {
                        Alert alert = Alert.builder()
                                        .title("Sample Alert " + i)
                                        .description("This is an automatically generated description for alert " + i)
                                        .type(types[random.nextInt(types.length)])
                                        .severity(severities[random.nextInt(severities.length)])
                                        .status(statuses[random.nextInt(statuses.length)])
                                        .latitude(40.0 + (random.nextDouble() * 2))
                                        .longitude(-75.0 + (random.nextDouble() * 2))
                                        .tenant(tenant1)
                                        .timestamp(java.time.LocalDateTime.now().minusDays(random.nextInt(30)))
                                        .build();

                        // Randomly assign some to normalUser
                        if (random.nextBoolean() && !alert.getStatus().equals("Open")) {
                                alert.setAssignedTo(normalUser);
                        }

                        alertRepository.save(alert);
                }
        }
}
