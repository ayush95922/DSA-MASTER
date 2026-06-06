package com.dsaverse.progress.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.progress.dto.response.DashboardResponse;
import com.dsaverse.progress.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for user dashboard widgets")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get consolidated dashboard summary stats")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardSummary(
            @CurrentUser UserPrincipal currentUser) {
        
        DashboardResponse response = dashboardService.getDashboardSummary(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Dashboard stats retrieved successfully"));
    }
}
