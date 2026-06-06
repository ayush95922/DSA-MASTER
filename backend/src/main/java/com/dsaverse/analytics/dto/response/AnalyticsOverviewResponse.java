package com.dsaverse.analytics.dto.response;

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
public class AnalyticsOverviewResponse {

    private long totalSolved;
    private long easySolved;
    private long mediumSolved;
    private long hardSolved;
    private double accuracyRate; // Solved attempts vs total attempts percentage
    private List<PerformanceSnapshot> history;
    private List<WeakTopicInfo> weakTopics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PerformanceSnapshot {
        private LocalDate date;
        private int easySolved;
        private int mediumSolved;
        private int hardSolved;
        private int totalSolved;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeakTopicInfo {
        private String topicName;
        private String slug;
        private int totalQuestions;
        private int solvedQuestions;
        private double accuracy; // Solved ratio
      }
}
