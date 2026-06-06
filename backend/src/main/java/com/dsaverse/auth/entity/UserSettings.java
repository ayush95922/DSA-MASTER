package com.dsaverse.auth.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * User preferences and settings.
 */
@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 10, nullable = false)
    @Builder.Default
    private String theme = "DARK";

    @Column(name = "email_notifications", nullable = false)
    @Builder.Default
    private Boolean emailNotifications = true;

    @Column(name = "revision_reminders", nullable = false)
    @Builder.Default
    private Boolean revisionReminders = true;

    @Column(name = "daily_goal_questions", nullable = false)
    @Builder.Default
    private Integer dailyGoalQuestions = 5;

    @Column(name = "preferred_language", nullable = false, length = 10)
    @Builder.Default
    private String preferredLanguage = "en";
}
