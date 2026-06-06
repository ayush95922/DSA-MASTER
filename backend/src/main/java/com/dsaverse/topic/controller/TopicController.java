package com.dsaverse.topic.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.topic.dto.response.CategoryResponse;
import com.dsaverse.topic.dto.response.TopicDetailResponse;
import com.dsaverse.topic.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@Tag(name = "Topic", description = "Endpoints for topics learning")
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/categories")
    @Operation(summary = "Get all categories and nested topics with progress logs")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(
            @CurrentUser UserPrincipal currentUser) {
        List<CategoryResponse> response = topicService.getAllCategoriesWithProgress(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Categories retrieved successfully"));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed topic theory guide by slug")
    public ResponseEntity<ApiResponse<TopicDetailResponse>> getTopicBySlug(
            @PathVariable String slug,
            @CurrentUser UserPrincipal currentUser) {
        TopicDetailResponse response = topicService.getTopicBySlug(slug, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Topic details retrieved successfully"));
    }
}
