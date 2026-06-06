package com.dsaverse.progress.service.impl;

import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.entity.UserProfile;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.progress.dto.request.SubmissionRequest;
import com.dsaverse.progress.dto.response.SubmissionResponse;
import com.dsaverse.progress.entity.UserBookmark;
import com.dsaverse.progress.entity.UserDailyActivity;
import com.dsaverse.progress.entity.UserNote;
import com.dsaverse.progress.entity.UserQuestionAttempt;
import com.dsaverse.progress.entity.UserStreak;
import com.dsaverse.progress.repository.UserBookmarkRepository;
import com.dsaverse.progress.repository.UserDailyActivityRepository;
import com.dsaverse.progress.repository.UserNoteRepository;
import com.dsaverse.progress.repository.UserQuestionAttemptRepository;
import com.dsaverse.progress.repository.UserStreakRepository;
import com.dsaverse.progress.service.ProgressService;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProgressServiceImpl implements ProgressService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final UserQuestionAttemptRepository attemptRepository;
    private final UserDailyActivityRepository dailyActivityRepository;
    private final UserStreakRepository streakRepository;
    private final UserBookmarkRepository bookmarkRepository;
    private final UserNoteRepository noteRepository;

    @Override
    public SubmissionResponse submitAttempt(Long userId, String slug, SubmissionRequest request) {
        log.info("Logging submission attempt for user {} on question {}", userId, slug);

        // 1. Fetch User and Question
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "slug", slug));

        // 2. Persist the attempt
        UserQuestionAttempt attempt = UserQuestionAttempt.builder()
                .user(user)
                .question(question)
                .status(request.getStatus().toUpperCase())
                .submittedCode(request.getSubmittedCode())
                .language(request.getLanguage().toUpperCase())
                .executionTime(request.getExecutionTime() != null ? request.getExecutionTime() : 120)
                .memoryUsed(request.getMemoryUsed() != null ? request.getMemoryUsed() : 1024)
                .attemptedAt(Instant.now())
                .build();

        UserQuestionAttempt savedAttempt = attemptRepository.save(attempt);

        // 3. If SOLVED, update Daily Activity and Streaks
        if ("SOLVED".equalsIgnoreCase(request.getStatus())) {
            updateDailyActivity(user);
            updateUserStreak(user);
            updateUserLevel(user);
        }

        // Return a safe DTO instead of the raw entity to avoid serialization issues
        return SubmissionResponse.builder()
                .id(savedAttempt.getId())
                .questionId(question.getId())
                .questionSlug(question.getSlug())
                .status(savedAttempt.getStatus())
                .language(savedAttempt.getLanguage())
                .submittedCode(savedAttempt.getSubmittedCode())
                .executionTime(savedAttempt.getExecutionTime())
                .memoryUsed(savedAttempt.getMemoryUsed())
                .attemptedAt(savedAttempt.getAttemptedAt())
                .build();
    }

    @Override
    @Transactional
    public boolean toggleBookmark(Long userId, String slug) {
        log.info("Toggling bookmark for user {} on question {}", userId, slug);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "slug", slug));

        Optional<UserBookmark> existing = bookmarkRepository.findByUserIdAndQuestionId(userId, question.getId());
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false;
        } else {
            UserBookmark bookmark = UserBookmark.builder()
                    .user(user)
                    .question(question)
                    .build();
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    @Override
    @Transactional
    public String updateNote(Long userId, String slug, String content) {
        log.info("Updating note for user {} on question {} to: {}", userId, slug, content);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "slug", slug));

        UserNote note = noteRepository.findByUserIdAndQuestionId(userId, question.getId())
                .orElseGet(() -> UserNote.builder()
                        .user(user)
                        .question(question)
                        .build());
        
        note.setContent(content);
        noteRepository.save(note);
        return content;
    }

    private void updateDailyActivity(User user) {
        LocalDate today = LocalDate.now();
        UserDailyActivity activity = dailyActivityRepository.findByUserIdAndActivityDate(user.getId(), today)
                .orElseGet(() -> UserDailyActivity.builder()
                        .user(user)
                        .activityDate(today)
                        .questionsSolved(0)
                        .minutesSpent(0)
                        .build());

        activity.setQuestionsSolved(activity.getQuestionsSolved() + 1);
        activity.setMinutesSpent(activity.getMinutesSpent() + 15); // assume avg 15 minutes per solve
        dailyActivityRepository.save(activity);
    }

    private void updateUserStreak(User user) {
        LocalDate today = LocalDate.now();
        UserStreak streak = streakRepository.findByUserId(user.getId())
                .orElseGet(() -> UserStreak.builder()
                        .user(user)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());

        LocalDate lastActive = streak.getLastActiveDate();

        if (lastActive == null) {
            streak.setCurrentStreak(1);
            streak.setLongestStreak(Math.max(1, streak.getLongestStreak()));
        } else if (lastActive.equals(today.minusDays(1))) {
            // Consecutive active day
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            streak.setLongestStreak(Math.max(streak.getCurrentStreak(), streak.getLongestStreak()));
        } else if (!lastActive.equals(today)) {
            // Streak broken
            streak.setCurrentStreak(1);
            streak.setLongestStreak(Math.max(1, streak.getLongestStreak()));
        }
        
        streak.setLastActiveDate(today);
        streakRepository.save(streak);
    }

    private void updateUserLevel(User user) {
        long solvedCount = attemptRepository.countSolvedQuestionsByUserId(user.getId());
        UserProfile profile = user.getProfile();
        
        if (profile != null) {
            String newLevel;
            if (solvedCount >= 30) {
                newLevel = "EXPERT";
            } else if (solvedCount >= 10) {
                newLevel = "INTERMEDIATE";
            } else {
                newLevel = "BEGINNER";
            }
            
            if (!newLevel.equals(profile.getLevel())) {
                profile.setLevel(newLevel);
                userRepository.save(user);
                log.info("User {} level automatically upgraded to {}", user.getUsername(), newLevel);
            }
        }
    }
}
