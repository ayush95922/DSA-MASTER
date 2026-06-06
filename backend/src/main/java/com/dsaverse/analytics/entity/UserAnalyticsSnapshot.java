package com.dsaverse.analytics.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_analytics_snapshots",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "snapshot_date"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAnalyticsSnapshot extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    @Column(name = "total_solved", nullable = false)
    @Builder.Default
    private Integer totalSolved = 0;

    @Column(name = "easy_solved", nullable = false)
    @Builder.Default
    private Integer easySolved = 0;

    @Column(name = "medium_solved", nullable = false)
    @Builder.Default
    private Integer mediumSolved = 0;

    @Column(name = "hard_solved", nullable = false)
    @Builder.Default
    private Integer hardSolved = 0;
}
