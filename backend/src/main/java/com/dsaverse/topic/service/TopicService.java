package com.dsaverse.topic.service;

import com.dsaverse.topic.dto.response.CategoryResponse;
import com.dsaverse.topic.dto.response.TopicDetailResponse;

import java.util.List;

public interface TopicService {

    /**
     * Retrieves all categories and nested topics with progress metrics for the given user.
     */
    List<CategoryResponse> getAllCategoriesWithProgress(Long userId);

    /**
     * Retrieves a detailed DSA topic guide by slug with question lists and completion status.
     */
    TopicDetailResponse getTopicBySlug(String slug, Long userId);
}
