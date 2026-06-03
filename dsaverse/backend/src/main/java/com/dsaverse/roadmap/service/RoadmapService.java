package com.dsaverse.roadmap.service;

import com.dsaverse.roadmap.dto.response.RoadmapDetailResponse;
import com.dsaverse.roadmap.dto.response.RoadmapResponse;

import java.util.List;

public interface RoadmapService {

    /**
     * Retrieves all roadmaps with the active user's enrollment and progress statistics.
     */
    List<RoadmapResponse> getAllRoadmaps(Long userId);

    /**
     * Retrieves a detailed roadmap by its slug, mapping step graphs, dependency links, and progress checks.
     */
    RoadmapDetailResponse getRoadmapBySlug(String slug, Long userId);

    /**
     * Enrolls the user into a specific roadmap.
     */
    void enrollInRoadmap(String slug, Long userId);

    /**
     * Marks a specific roadmap step as completed.
     */
    void completeRoadmapNode(Long nodeId, Long userId);
}
