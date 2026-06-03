package com.dsaverse.roadmap.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.roadmap.dto.response.RoadmapDetailResponse;
import com.dsaverse.roadmap.dto.response.RoadmapResponse;
import com.dsaverse.roadmap.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
@Tag(name = "Roadmap", description = "Endpoints for learning roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    @Operation(summary = "Get all roadmaps with user progress")
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getAllRoadmaps(
            @CurrentUser UserPrincipal currentUser) {
        List<RoadmapResponse> response = roadmapService.getAllRoadmaps(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Roadmaps retrieved successfully"));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed roadmap graph by slug")
    public ResponseEntity<ApiResponse<RoadmapDetailResponse>> getRoadmapBySlug(
            @PathVariable String slug,
            @CurrentUser UserPrincipal currentUser) {
        RoadmapDetailResponse response = roadmapService.getRoadmapBySlug(slug, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Roadmap details retrieved successfully"));
    }

    @PostMapping("/{slug}/enroll")
    @Operation(summary = "Enroll in a learning roadmap")
    public ResponseEntity<ApiResponse<Void>> enrollInRoadmap(
            @PathVariable String slug,
            @CurrentUser UserPrincipal currentUser) {
        roadmapService.enrollInRoadmap(slug, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully enrolled in roadmap"));
    }

    @PostMapping("/nodes/{nodeId}/complete")
    @Operation(summary = "Mark a roadmap node as completed")
    public ResponseEntity<ApiResponse<Void>> completeRoadmapNode(
            @PathVariable Long nodeId,
            @CurrentUser UserPrincipal currentUser) {
        roadmapService.completeRoadmapNode(nodeId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Roadmap step completed successfully"));
    }
}
