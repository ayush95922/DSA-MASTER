package com.dsaverse.revision.service;

import com.dsaverse.revision.dto.response.FlashcardDeckResponse;
import com.dsaverse.revision.dto.response.FlashcardResponse;
import com.dsaverse.revision.dto.response.RevisionSetResponse;

import java.util.List;

public interface RevisionService {

    RevisionSetResponse getDueReviews(Long userId);

    void scheduleQuestionReview(Long userId, Long questionId);

    void submitQuestionReview(Long userId, Long questionId, int rating);

    List<FlashcardDeckResponse> getFlashcardDecks(Long userId);

    List<FlashcardResponse> getFlashcardsByDeck(Long deckId);

    void submitFlashcardReview(Long userId, Long flashcardId, int rating);

    void triggerSessionSync(Long userId, int cardsReviewed, int questionsReviewed);
}
