package com.dsaverse.progress.service;

import com.dsaverse.progress.dto.response.DashboardResponse;

public interface DashboardService {
    
    /**
     * Retrieves the consolidated dashboard summary for a specific user.
     *
     * @param userId The ID of the user requesting dashboard stats.
     * @return DashboardResponse containing streak, progress summary, heatmap, and recommendations.
     */
    DashboardResponse getDashboardSummary(Long userId);
}
