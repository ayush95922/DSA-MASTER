package com.dsaverse.auth.controller;

import com.dsaverse.auth.dto.request.LoginRequest;
import com.dsaverse.auth.dto.request.RegisterRequest;
import com.dsaverse.auth.dto.response.AuthResponse;
import com.dsaverse.auth.service.AuthService;
import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST controller.
 * Handles registration, login, token refresh, logout, and current user retrieval.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and authorization endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Registration successful"));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody java.util.Map<String, String> request) {

        String refreshToken = request.get("refreshToken");
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and revoke all tokens")
    public ResponseEntity<ApiResponse<Void>> logout(@CurrentUser UserPrincipal user) {
        if (user == null) {
            throw new org.springframework.security.authentication.InsufficientAuthenticationException("User not authenticated");
        }
        authService.logout(user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<ApiResponse<AuthResponse.UserInfo>> getCurrentUser(
            @CurrentUser UserPrincipal user) {
        if (user == null) {
            throw new org.springframework.security.authentication.InsufficientAuthenticationException("User not authenticated");
        }

        AuthResponse.UserInfo userInfo = authService.getCurrentUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(userInfo));
    }
}
