package com.dsaverse.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDetailResponse {

    private Long id;
    private String name;
    private String slug;
    private String logo;
    private String description;
    private String tier;
    private int readinessPercentage;
    private List<InterviewRoundInfo> interviewRounds;
    private List<PrepWeekInfo> preparationTimeline;
    private List<FaqInfo> faqs;
    private List<InterviewExperienceInfo> interviewExperiences;
    private Map<String, Integer> topicWeightages;
    private List<CompanyRoadmapWeek> companyRoadmap;
    private List<CompanyQuestionInfo> questions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewRoundInfo {
        private String name; // e.g. Online Assessment, Technical Screen
        private String focus; // e.g. Graphs, DP, System Design
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrepWeekInfo {
        private Integer weekNumber;
        private String focusArea; // e.g. Core Structures, Advanced Dynamic Programming
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FaqInfo {
        private String question;
        private String answer;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewExperienceInfo {
        private String title;
        private String rounds;
        private List<String> questionsAsked;
        private String difficulty;
        private String tips;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyRoadmapWeek {
        private Integer weekNumber;
        private String topics;
        private String focus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyQuestionInfo {
        private Long id;
        private String title;
        private String slug;
        private String difficulty;
        private String topic;
        private String pattern;
        private String frequency; // HIGH, MEDIUM, LOW
        private String leetcodeUrl;
        private String geeksforgeeksUrl;
        private String hackerrankUrl;
        private String youtubeUrl;
        private boolean solved;
        private boolean bookmarked;
        private String notes;
    }
}
