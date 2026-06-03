package com.dsaverse.progress.service;

import com.dsaverse.progress.dto.request.SubmissionRequest;
import com.dsaverse.progress.entity.UserQuestionAttempt;

public interface ProgressService {
    UserQuestionAttempt submitAttempt(Long userId, String slug, SubmissionRequest request);
    boolean toggleBookmark(Long userId, String slug);
    String updateNote(Long userId, String slug, String content);
}
