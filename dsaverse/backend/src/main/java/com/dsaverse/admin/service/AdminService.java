package com.dsaverse.admin.service;

import com.dsaverse.admin.dto.request.BulkImportRequest;
import com.dsaverse.admin.dto.response.AdminDashboardResponse;
import com.dsaverse.admin.entity.AuditLog;

import java.util.List;

public interface AdminService {

    AdminDashboardResponse getDashboardStats();

    void updateSetting(String key, String value, Long adminUserId);

    void executeBulkImport(BulkImportRequest request, Long adminUserId);

    List<AuditLog> getAuditLogs();

    void logAction(Long userId, String action, String entityName, String entityId, String details, String ipAddress);
}
