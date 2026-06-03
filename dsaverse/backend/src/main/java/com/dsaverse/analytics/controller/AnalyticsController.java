package com.dsaverse.analytics.controller;

import com.dsaverse.analytics.dto.response.AnalyticsOverviewResponse;
import com.dsaverse.analytics.service.AnalyticsService;
import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Endpoints for user progress analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Get consolidated analytics overview and history")
    public ResponseEntity<ApiResponse<AnalyticsOverviewResponse>> getAnalyticsOverview(
            @CurrentUser UserPrincipal currentUser) {
        
        AnalyticsOverviewResponse response = analyticsService.getAnalyticsOverview(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Analytics overview retrieved successfully"));
    }
}
