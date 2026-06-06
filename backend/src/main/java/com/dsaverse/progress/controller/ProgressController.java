package com.dsaverse.progress.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.progress.dto.request.NoteRequest;
import com.dsaverse.progress.dto.request.SubmissionRequest;
import com.dsaverse.progress.dto.response.SubmissionResponse;
import com.dsaverse.progress.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Progress & Submissions", description = "Endpoints for tracking user DSA solves, streaks, and achievements")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/questions/{slug}/submit")
    @Operation(summary = "Submit a code solution attempt for a question to log progress")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitAttempt(
            @PathVariable String slug,
            @Valid @RequestBody SubmissionRequest request,
            @CurrentUser UserPrincipal currentUser) {

        SubmissionResponse attempt = progressService.submitAttempt(currentUser.getId(), slug, request);
        return ResponseEntity.ok(ApiResponse.success(attempt, "Submission logged and progress updated successfully"));
    }

    @PostMapping("/questions/{slug}/bookmark")
    @Operation(summary = "Toggle bookmarked status for a specific question")
    public ResponseEntity<ApiResponse<Boolean>> toggleBookmark(
            @PathVariable String slug,
            @CurrentUser UserPrincipal currentUser) {
        boolean bookmarked = progressService.toggleBookmark(currentUser.getId(), slug);
        return ResponseEntity.ok(ApiResponse.success(bookmarked, "Bookmark status toggled successfully"));
    }

    @PostMapping("/questions/{slug}/notes")
    @Operation(summary = "Add or update study notes for a specific question")
    public ResponseEntity<ApiResponse<String>> updateNote(
            @PathVariable String slug,
            @Valid @RequestBody NoteRequest request,
            @CurrentUser UserPrincipal currentUser) {
        String updatedContent = progressService.updateNote(currentUser.getId(), slug, request.getContent());
        return ResponseEntity.ok(ApiResponse.success(updatedContent, "Notes updated successfully"));
    }
}
