package com.dsaverse.roadmap.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_roadmap_enrollments",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "roadmap_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRoadmapEnrollment extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private Roadmap roadmap;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ENROLLED"; // ENROLLED, IN_PROGRESS, COMPLETED

    @Column(name = "completed_at")
    private Instant completedAt;
}
