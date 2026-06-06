package com.dsaverse.topic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicDetailResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private TheoryInfo theory;
    private List<SubtopicInfo> subtopics;
    private List<QuestionInfo> questions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionInfo {
        private Long id;
        private String title;
        private String slug;
        private String difficulty;
        private Integer points;
        private boolean premium;
        private String status;
        private List<LinkInfo> externalLinks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LinkInfo {
        private String platformName;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TheoryInfo {
        private String overview;
        private String complexityAnalysis;
        private List<SectionInfo> sections;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionInfo {
        private String title;
        private String content;
        private Integer order;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubtopicInfo {
        private String name;
        private String slug;
        private String description;
    }
}
