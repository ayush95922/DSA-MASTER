package com.dsaverse.common.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;

/**
 * Custom annotation to inject the current authenticated user into controller methods.
 *
 * Usage:
 *   @GetMapping("/me")
 *   public ResponseEntity<?> getProfile(@CurrentUser UserPrincipal user) { ... }
 */
@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentUser {
}
