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
public class RoadmapResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String type;
    private boolean enrolled;
    private String enrollmentStatus; // ENROLLED, IN_PROGRESS, COMPLETED or null
    private int progressPercentage;
    private int totalNodes;
    private int completedNodes;
    private String difficulty;
    private String estimatedDuration;
    private String prerequisites;
    private List<String> learningOutcomes;
    private String completionCriteria;
}
