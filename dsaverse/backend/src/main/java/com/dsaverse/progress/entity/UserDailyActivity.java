package com.dsaverse.progress.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_daily_activities",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "activity_date"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDailyActivity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "questions_solved", nullable = false)
    @Builder.Default
    private Integer questionsSolved = 0;

    @Column(name = "minutes_spent", nullable = false)
    @Builder.Default
    private Integer minutesSpent = 0;
}
