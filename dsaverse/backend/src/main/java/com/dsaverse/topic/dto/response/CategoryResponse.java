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
public class CategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private List<TopicSummaryInfo> topics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicSummaryInfo {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private int totalQuestions; // questions inside this topic (we'll count attempts)
        private int solvedQuestions;
    }
}
