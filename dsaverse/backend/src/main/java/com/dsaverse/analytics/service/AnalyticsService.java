package com.dsaverse.analytics.service;

import com.dsaverse.analytics.dto.response.AnalyticsOverviewResponse;

public interface AnalyticsService {

    /**
     * Gathers historical snapshots, accuracy rates, and weak topics to assemble
     * the full user analytics overview.
     */
    AnalyticsOverviewResponse getAnalyticsOverview(Long userId);
}
