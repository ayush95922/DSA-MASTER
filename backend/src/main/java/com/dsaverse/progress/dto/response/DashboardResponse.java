package com.dsaverse.progress.dto.response;

import com.dsaverse.question.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private DailyGoalInfo dailyGoal;
    private StreakInfo streak;
    private ProgressSummaryInfo progressSummary;
    private List<HeatmapItem> heatmap;
    private List<RecommendedQuestionInfo> recommendedQuestions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyGoalInfo {
        private Integer target;
        private Integer completed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StreakInfo {
        private Integer currentStreak;
        private Integer longestStreak;
        private LocalDate lastActiveDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgressSummaryInfo {
        private long totalSolved;
        private long easySolved;
        private long mediumSolved;
        private long hardSolved;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeatmapItem {
        private LocalDate date;
        private Integer count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendedQuestionInfo {
        private Long id;
        private String title;
        private String slug;
        private Difficulty difficulty;
        private boolean premium;
    }
}
