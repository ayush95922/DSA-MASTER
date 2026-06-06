package com.dsaverse.admin.service.impl;

import com.dsaverse.admin.dto.request.BulkImportRequest;
import com.dsaverse.admin.dto.response.AdminDashboardResponse;
import com.dsaverse.admin.entity.AuditLog;
import com.dsaverse.admin.entity.ContentImport;
import com.dsaverse.admin.entity.SystemSettings;
import com.dsaverse.admin.repository.AuditLogRepository;
import com.dsaverse.admin.repository.ContentImportRepository;
import com.dsaverse.admin.repository.SystemSettingsRepository;
import com.dsaverse.admin.service.AdminService;
import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.progress.repository.UserQuestionAttemptRepository;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.enums.Difficulty;
import com.dsaverse.question.repository.QuestionRepository;
import com.dsaverse.roadmap.repository.RoadmapRepository;
import com.dsaverse.topic.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final RoadmapRepository roadmapRepository;
    private final UserQuestionAttemptRepository attemptRepository;
    private final AuditLogRepository auditLogRepository;
    private final ContentImportRepository contentImportRepository;
    private final SystemSettingsRepository settingsRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalQuestions = questionRepository.count();
        long totalTopics = topicRepository.count();
        long totalRoadmaps = roadmapRepository.count();
        long totalAttempts = attemptRepository.count();

        List<AdminDashboardResponse.SettingInfo> settings = settingsRepository.findAll().stream()
                .map(s -> AdminDashboardResponse.SettingInfo.builder()
                        .key(s.getSettingKey())
                        .value(s.getSettingValue())
                        .description(s.getDescription())
                        .build())
                .collect(Collectors.toList());

        List<AdminDashboardResponse.ImportInfo> imports = contentImportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(i -> AdminDashboardResponse.ImportInfo.builder()
                        .id(i.getId())
                        .fileName(i.getFileName())
                        .status(i.getStatus())
                        .recordsProcessed(i.getRecordsProcessed())
                        .errors(i.getErrors())
                        .importedBy(i.getImportedBy() != null ? i.getImportedBy().getUsername() : "SYSTEM")
                        .createdAt(i.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalQuestions(totalQuestions)
                .totalTopics(totalTopics)
                .totalRoadmaps(totalRoadmaps)
                .totalAttempts(totalAttempts)
                .settings(settings)
                .recentImports(imports)
                .build();
    }

    @Override
    public void updateSetting(String key, String value, Long adminUserId) {
        SystemSettings setting = settingsRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("SystemSetting", "key", key));

        String oldValue = setting.getSettingValue();
        setting.setSettingValue(value);
        settingsRepository.save(setting);

        logAction(
                adminUserId,
                "UPDATE_SETTING",
                "SystemSetting",
                key,
                String.format("Updated setting key '%s' from '%s' to '%s'", key, oldValue, value),
                "127.0.0.1"
        );
    }

    @Override
    public void executeBulkImport(BulkImportRequest request, Long adminUserId) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminUserId));

        ContentImport contentImport = ContentImport.builder()
                .fileName(request.getFileName())
                .status("IN_PROGRESS")
                .importedBy(admin)
                .recordsProcessed(0)
                .build();
        contentImport = contentImportRepository.save(contentImport);

        try {
            int count = 0;
            for (BulkImportRequest.QuestionImportInfo qInfo : request.getQuestions()) {
                Difficulty difficulty = Difficulty.valueOf(qInfo.getDifficulty().toUpperCase());
                
                Question question = Question.builder()
                        .title(qInfo.getTitle())
                        .slug(qInfo.getSlug())
                        .difficulty(difficulty)
                        .description(qInfo.getDescription())
                        .constraints(qInfo.getConstraints())
                        .inputFormat(qInfo.getInputFormat())
                        .outputFormat(qInfo.getOutputFormat())
                        .build();

                questionRepository.save(question);
                count++;
            }

            contentImport.setStatus("SUCCESS");
            contentImport.setRecordsProcessed(count);
            contentImportRepository.save(contentImport);

            logAction(
                    adminUserId,
                    "BULK_IMPORT_QUESTIONS",
                    "ContentImport",
                    contentImport.getId().toString(),
                    String.format("Successfully imported %d questions from file '%s'", count, request.getFileName()),
                    "127.0.0.1"
            );

        } catch (Exception e) {
            contentImport.setStatus("FAILED");
            contentImport.setErrors(e.getMessage());
            contentImportRepository.save(contentImport);

            logAction(
                    adminUserId,
                    "BULK_IMPORT_FAILED",
                    "ContentImport",
                    contentImport.getId().toString(),
                    String.format("Failed bulk import from file '%s'. Reason: %s", request.getFileName(), e.getMessage()),
                    "127.0.0.1"
            );
            throw new RuntimeException("Bulk import failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public void logAction(Long userId, String action, String entityName, String entityId, String details, String ipAddress) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;
        
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .build();

        auditLogRepository.save(auditLog);
    }
}
