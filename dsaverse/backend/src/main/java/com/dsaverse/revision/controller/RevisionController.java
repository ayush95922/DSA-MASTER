package com.dsaverse.revision.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.revision.dto.request.ReviewRequest;
import com.dsaverse.revision.dto.response.FlashcardDeckResponse;
import com.dsaverse.revision.dto.response.FlashcardResponse;
import com.dsaverse.revision.dto.response.RevisionSetResponse;
import com.dsaverse.revision.service.RevisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revision")
@RequiredArgsConstructor
@Tag(name = "Revision", description = "Endpoints for spaced repetition learning and flashcards")
public class RevisionController {

    private final RevisionService revisionService;

    @GetMapping("/due")
    @Operation(summary = "Get all currently due revision items (questions and cards) for the user")
    public ResponseEntity<ApiResponse<RevisionSetResponse>> getDueReviews(
            @CurrentUser UserPrincipal currentUser) {
        RevisionSetResponse response = revisionService.getDueReviews(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Due revision items fetched successfully"));
    }

    @PostMapping("/questions/{questionId}/schedule")
    @Operation(summary = "Manually add/schedule a coding question to user revision system")
    public ResponseEntity<ApiResponse<Void>> scheduleQuestionReview(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long questionId) {
        revisionService.scheduleQuestionReview(currentUser.getId(), questionId);
        return ResponseEntity.ok(ApiResponse.success(null, "Question scheduled for revision successfully"));
    }

    @PostMapping("/questions/{questionId}/review")
    @Operation(summary = "Submit a spaced repetition review response score for a question")
    public ResponseEntity<ApiResponse<Void>> submitQuestionReview(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long questionId,
            @Valid @RequestBody ReviewRequest request) {
        revisionService.submitQuestionReview(currentUser.getId(), questionId, request.getRating());
        return ResponseEntity.ok(ApiResponse.success(null, "Question review logged successfully"));
    }

    @GetMapping("/decks")
    @Operation(summary = "Get all available flashcard decks")
    public ResponseEntity<ApiResponse<List<FlashcardDeckResponse>>> getDecks(
            @CurrentUser UserPrincipal currentUser) {
        List<FlashcardDeckResponse> response = revisionService.getFlashcardDecks(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Flashcard decks fetched successfully"));
    }

    @GetMapping("/decks/{deckId}/cards")
    @Operation(summary = "Get all cards within a specific deck")
    public ResponseEntity<ApiResponse<List<FlashcardResponse>>> getCardsByDeck(
            @PathVariable Long deckId) {
        List<FlashcardResponse> response = revisionService.getFlashcardsByDeck(deckId);
        return ResponseEntity.ok(ApiResponse.success(response, "Flashcards fetched successfully"));
    }

    @PostMapping("/cards/{cardId}/review")
    @Operation(summary = "Submit a spaced repetition review response score for a flashcard")
    public ResponseEntity<ApiResponse<Void>> submitCardReview(
            @CurrentUser UserPrincipal currentUser,
            @PathVariable Long cardId,
            @Valid @RequestBody ReviewRequest request) {
        revisionService.submitFlashcardReview(currentUser.getId(), cardId, request.getRating());
        return ResponseEntity.ok(ApiResponse.success(null, "Flashcard review logged successfully"));
    }

    @PostMapping("/sync")
    @Operation(summary = "Sync daily session review metrics")
    public ResponseEntity<ApiResponse<Void>> syncSession(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam int cardsReviewed,
            @RequestParam int questionsReviewed) {
        revisionService.triggerSessionSync(currentUser.getId(), cardsReviewed, questionsReviewed);
        return ResponseEntity.ok(ApiResponse.success(null, "Revision session synced successfully"));
    }
}
