package com.dsaverse.progress.service.impl;

import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.entity.UserSettings;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.progress.dto.response.DashboardResponse;
import com.dsaverse.progress.entity.UserDailyActivity;
import com.dsaverse.progress.entity.UserStreak;
import com.dsaverse.progress.repository.UserDailyActivityRepository;
import com.dsaverse.progress.repository.UserStreakRepository;
import com.dsaverse.progress.repository.UserQuestionAttemptRepository;
import com.dsaverse.progress.service.DashboardService;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.enums.Difficulty;
import com.dsaverse.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final UserStreakRepository userStreakRepository;
    private final UserDailyActivityRepository userDailyActivityRepository;
    private final UserQuestionAttemptRepository userQuestionAttemptRepository;
    private final QuestionRepository questionRepository;

    @Override
    public DashboardResponse getDashboardSummary(Long userId) {
        // 1. Fetch user to get settings
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserSettings settings = user.getSettings();
        int dailyGoalTarget = (settings != null) ? settings.getDailyGoalQuestions() : 1;

        // 2. Fetch daily activity for today
        LocalDate today = LocalDate.now();
        int dailyGoalCompleted = userDailyActivityRepository.findByUserIdAndActivityDate(userId, today)
                .map(UserDailyActivity::getQuestionsSolved)
                .orElse(0);

        // 3. Fetch streak stats
        UserStreak streak = userStreakRepository.findByUserId(userId)
                .orElse(UserStreak.builder()
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());

        // 4. Fetch progress stats grouped by difficulty
        long totalSolved = userQuestionAttemptRepository.countSolvedQuestionsByUserId(userId);
        long easySolved = userQuestionAttemptRepository.countSolvedQuestionsByUserIdAndDifficulty(userId, Difficulty.EASY);
        long mediumSolved = userQuestionAttemptRepository.countSolvedQuestionsByUserIdAndDifficulty(userId, Difficulty.MEDIUM);
        long hardSolved = userQuestionAttemptRepository.countSolvedQuestionsByUserIdAndDifficulty(userId, Difficulty.HARD);

        // 5. Fetch recent 365 days of activity for the heatmap
        LocalDate startDate = today.minusDays(365);
        List<UserDailyActivity> recentActivities = userDailyActivityRepository.findAllRecentActivity(userId, startDate);

        List<DashboardResponse.HeatmapItem> heatmapItems = recentActivities.stream()
                .map(activity -> DashboardResponse.HeatmapItem.builder()
                        .date(activity.getActivityDate())
                        .count(activity.getQuestionsSolved())
                        .build())
                .collect(Collectors.toList());

        // 6. Fetch 3 recommended questions
        List<Question> recommendations = questionRepository.findRandomRecommendations(PageRequest.of(0, 3));
        List<DashboardResponse.RecommendedQuestionInfo> recommendedInfos = recommendations.stream()
                .map(q -> DashboardResponse.RecommendedQuestionInfo.builder()
                        .id(q.getId())
                        .title(q.getTitle())
                        .slug(q.getSlug())
                        .difficulty(q.getDifficulty())
                        .premium(q.isPremium())
                        .build())
                .collect(Collectors.toList());

        // Assemble and return DTO
        return DashboardResponse.builder()
                .dailyGoal(DashboardResponse.DailyGoalInfo.builder()
                        .target(dailyGoalTarget)
                        .completed(dailyGoalCompleted)
                        .build())
                .streak(DashboardResponse.StreakInfo.builder()
                        .currentStreak(streak.getCurrentStreak())
                        .longestStreak(streak.getLongestStreak())
                        .lastActiveDate(streak.getLastActiveDate())
                        .build())
                .progressSummary(DashboardResponse.ProgressSummaryInfo.builder()
                        .totalSolved(totalSolved)
                        .easySolved(easySolved)
                        .mediumSolved(mediumSolved)
                        .hardSolved(hardSolved)
                        .build())
                .heatmap(heatmapItems)
                .recommendedQuestions(recommendedInfos)
                .build();
    }
}
