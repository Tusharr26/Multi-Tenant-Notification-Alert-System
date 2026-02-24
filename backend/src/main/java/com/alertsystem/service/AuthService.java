package com.alertsystem.service;

import com.alertsystem.dto.AuthResponse;
import com.alertsystem.dto.LoginRequest;
import com.alertsystem.dto.RegisterRequest;
import com.alertsystem.model.Role;
import com.alertsystem.model.Tenant;
import com.alertsystem.model.User;
import com.alertsystem.repository.TenantRepository;
import com.alertsystem.repository.UserRepository;
import com.alertsystem.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Tenant tenant = null;
        if (request.getRole() != Role.SUPER_ADMIN) {
            String code = request.getTenantCode();
            if (code == null || code.isBlank()) {
                throw new RuntimeException("Tenant code is required for non-super admins");
            }
            Optional<Tenant> existingTenant = tenantRepository.findByTenantCode(code);
            if (existingTenant.isPresent()) {
                tenant = existingTenant.get();
            } else {
                // If tenant config says auto-create, you could create here
                // For now, expecting tenant to exist or simple registration creates it
                tenant = new Tenant();
                tenant.setName("Tenant " + code);
                tenant.setTenantCode(code);
                tenant = tenantRepository.save(tenant);
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .tenant(tenant)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);

        Long tenantId = tenant != null ? tenant.getId() : null;

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(), tenantId);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);

        Long tenantId = user.getTenant() != null ? user.getTenant().getId() : null;

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name(), tenantId);
    }
}
