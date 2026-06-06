package com.dsaverse.admin.controller;

import com.dsaverse.admin.dto.request.BulkImportRequest;
import com.dsaverse.admin.dto.request.UpdateSettingRequest;
import com.dsaverse.admin.dto.response.AdminDashboardResponse;
import com.dsaverse.admin.entity.AuditLog;
import com.dsaverse.admin.service.AdminService;
import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Endpoints for platform administrators")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard analytics, settings, and import logs")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboardStats() {
        AdminDashboardResponse response = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(response, "Admin stats retrieved successfully"));
    }

    @PutMapping("/settings/{key}")
    @Operation(summary = "Update a specific system settings configuration value")
    public ResponseEntity<ApiResponse<Void>> updateSetting(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable String key,
            @Valid @RequestBody UpdateSettingRequest request) {
        adminService.updateSetting(key, request.getValue(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "System setting updated successfully"));
    }

    @PostMapping("/import")
    @Operation(summary = "Bulk import questions to the platform")
    public ResponseEntity<ApiResponse<Void>> executeBulkImport(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestBody BulkImportRequest request) {
        adminService.executeBulkImport(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Bulk content import executed successfully"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Retrieve system audit activity logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> response = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(response, "Audit logs retrieved successfully"));
    }
}
