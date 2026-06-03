package com.dsaverse.auth.service.impl;

import com.dsaverse.auth.dto.request.LoginRequest;
import com.dsaverse.auth.dto.request.RegisterRequest;
import com.dsaverse.auth.dto.response.AuthResponse;
import com.dsaverse.auth.entity.*;
import com.dsaverse.auth.repository.RefreshTokenRepository;
import com.dsaverse.auth.repository.RoleRepository;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.auth.service.AuthService;
import com.dsaverse.common.exception.BusinessException;
import com.dsaverse.common.exception.DuplicateResourceException;
import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.common.security.JwtTokenProvider;
import com.dsaverse.common.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        // Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }

        // Find default USER role
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "USER"));

        // Create user
        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .username(request.getUsername().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status("ACTIVE") // Skip email verification for MVP
                .emailVerifiedAt(Instant.now())
                .build();

        user = userRepository.save(user);

        // Assign role
        UserRole role = UserRole.builder()
                .user(user)
                .role(userRole)
                .build();
        user.getUserRoles().add(role);
        user = userRepository.save(user);

        // Create profile
        UserProfile profile = UserProfile.builder()
                .user(user)
                .fullName(request.getFullName())
                .build();
        user.setProfile(profile);

        // Create settings
        UserSettings settings = UserSettings.builder()
                .user(user)
                .build();
        user.setSettings(settings);

        user = userRepository.save(user);

        log.info("New user registered: {} ({})", user.getUsername(), user.getEmail());

        // Auto-login after registration
        return authenticateAndGenerateTokens(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Update last login
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        String refreshToken = createRefreshToken(user);

        log.info("User logged in: {}", user.getEmail());

        return buildAuthResponse(accessToken, refreshToken, user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        String tokenHash = hashToken(refreshToken);

        RefreshToken storedToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(tokenHash)
                .orElseThrow(() -> new org.springframework.security.authentication.InsufficientAuthenticationException("Invalid or expired refresh token"));

        // Check expiry
        if (storedToken.getExpiresAt().isBefore(Instant.now())) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new org.springframework.security.authentication.InsufficientAuthenticationException("Refresh token has expired");
        }

        // Revoke old token (rotation)
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        // Generate new tokens
        User user = storedToken.getUser();
        return authenticateAndGenerateTokens(user);
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("All refresh tokens revoked for user: {}", userId);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse.UserInfo getCurrentUser(Long userId) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return buildUserInfo(user);
    }

    // ==================== Private Helpers ====================

    private AuthResponse authenticateAndGenerateTokens(User user) {
        User userWithRoles = userRepository.findByIdWithRoles(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user.getId()));

        List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities =
                userWithRoles.getUserRoles().stream()
                        .map(ur -> new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + ur.getRole().getName()))
                        .toList();

        UserPrincipal userPrincipal = new UserPrincipal(
                userWithRoles.getId(),
                userWithRoles.getEmail(),
                userWithRoles.getUsername(),
                userWithRoles.getPasswordHash(),
                true,
                authorities
        );

        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        String refreshToken = createRefreshToken(userWithRoles);

        return buildAuthResponse(accessToken, refreshToken, userWithRoles);
    }

    private String createRefreshToken(User user) {
        String rawToken = UUID.randomUUID().toString();
        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpirationMs()))
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(900L) // 15 minutes in seconds
                .user(buildUserInfo(user))
                .build();
    }

    private AuthResponse.UserInfo buildUserInfo(User user) {
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .toList();

        return AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getProfile() != null ? user.getProfile().getFullName() : null)
                .avatarUrl(user.getProfile() != null ? user.getProfile().getAvatarUrl() : null)
                .level(user.getProfile() != null ? user.getProfile().getLevel() : "BEGINNER")
                .onboardingCompleted(user.getProfile() != null && user.getProfile().getOnboardingCompleted())
                .roles(roles)
                .build();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes());
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
