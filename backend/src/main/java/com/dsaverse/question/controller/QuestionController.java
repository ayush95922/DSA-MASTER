package com.dsaverse.question.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.question.dto.response.EditorialResponse;
import com.dsaverse.question.dto.response.QuestionDetailResponse;
import com.dsaverse.question.dto.response.QuestionListResponse;
import com.dsaverse.question.service.QuestionService;
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
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Question", description = "Endpoints for practice questions")
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    @Operation(summary = "Get all questions with user completion logs")
    public ResponseEntity<ApiResponse<List<QuestionListResponse>>> getAllQuestions(
            @CurrentUser UserPrincipal currentUser) {
        List<QuestionListResponse> response = questionService.getAllQuestions(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Questions retrieved successfully"));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed question description and hints")
    public ResponseEntity<ApiResponse<QuestionDetailResponse>> getQuestionBySlug(
            @PathVariable String slug,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDetailResponse response = questionService.getQuestionBySlug(slug, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Question details retrieved successfully"));
    }

    @GetMapping("/{slug}/editorial")
    @Operation(summary = "Get solution editorial and complexity analysis")
    public ResponseEntity<ApiResponse<EditorialResponse>> getEditorialBySlug(
            @PathVariable String slug) {
        EditorialResponse response = questionService.getEditorialByQuestionSlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response, "Editorial retrieved successfully"));
    }
}
