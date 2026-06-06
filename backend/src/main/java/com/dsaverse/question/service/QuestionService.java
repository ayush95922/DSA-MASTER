package com.dsaverse.question.service;

import com.dsaverse.question.dto.response.EditorialResponse;
import com.dsaverse.question.dto.response.QuestionDetailResponse;
import com.dsaverse.question.dto.response.QuestionListResponse;

import java.util.List;

public interface QuestionService {

    /**
     * Retrieves all questions with individual solved/attempt status details for the user.
     */
    List<QuestionListResponse> getAllQuestions(Long userId);

    /**
     * Retrieves a detailed puzzle overview by its slug.
     */
    QuestionDetailResponse getQuestionBySlug(String slug, Long userId);

    /**
     * Retrieves the editorial solutions guide for a question.
     */
    EditorialResponse getEditorialByQuestionSlug(String slug);
}
