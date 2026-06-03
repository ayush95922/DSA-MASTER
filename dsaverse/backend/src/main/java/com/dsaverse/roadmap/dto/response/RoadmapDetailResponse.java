package com.dsaverse.roadmap.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapDetailResponse {

    private Long id;
    private String title;
    private String slug;
    private String description;
    private String type;
    private boolean enrolled;
    private String enrollmentStatus;
    private int progressPercentage;
    private String difficulty;
    private String estimatedDuration;
    private String prerequisites;
    private List<String> learningOutcomes;
    private String completionCriteria;
    private List<NodeInfo> nodes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeInfo {
        private Long id;
        private String title;
        private String description;
        private String topicSlug;
        private Integer xCoordinate;
        private Integer yCoordinate;
        private Integer nodeOrder;
        private boolean completed;
        private List<Long> dependencyIds; // IDs of nodes this node depends on
        private String theoryPage;
        private String revisionNotes;
        private String cheatSheet;
        private List<FlashcardInfo> flashcards;
        private List<ResourceLink> youtubeResources;
        private List<ResourceLink> leetcodeProblems;
        private List<ResourceLink> geeksforgeeksLinks;
        private List<PracticeQuestionInfo> practiceQuestions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlashcardInfo {
        private String front;
        private String back;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceLink {
        private String title;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PracticeQuestionInfo {
        private String title;
        private String slug;
        private String difficulty;
        private String topic;
        private String leetcodeUrl;
        private String gfgUrl;
        private String hackerrankUrl;
        private String youtubeUrl;
    }
}
