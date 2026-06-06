package com.dsaverse.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalQuestions;
    private long totalTopics;
    private long totalRoadmaps;
    private long totalAttempts;
    private List<SettingInfo> settings;
    private List<ImportInfo> recentImports;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SettingInfo {
        private String key;
        private String value;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportInfo {
        private Long id;
        private String fileName;
        private String status;
        private int recordsProcessed;
        private String errors;
        private String importedBy;
        private String createdAt;
    }
}
