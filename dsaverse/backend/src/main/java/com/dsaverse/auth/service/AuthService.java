package com.dsaverse.auth.service;

import com.dsaverse.auth.dto.request.LoginRequest;
import com.dsaverse.auth.dto.request.RegisterRequest;
import com.dsaverse.auth.dto.response.AuthResponse;

public interface AuthService {

    /**
     * Register a new user with email and password.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate a user with email and password, returning JWT tokens.
     */
    AuthResponse login(LoginRequest request);

    /**
     * Refresh the access token using a valid refresh token.
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * Revoke all refresh tokens for a user (logout from all devices).
     */
    void logout(Long userId);

    /**
     * Get the current authenticated user's info.
     */
    AuthResponse.UserInfo getCurrentUser(Long userId);
}
