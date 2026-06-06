package com.dsaverse.revision.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "revision_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisionSession extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "started_at", nullable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cards_reviewed", nullable = false)
    @Builder.Default
    private Integer cardsReviewed = 0;

    @Column(name = "questions_reviewed", nullable = false)
    @Builder.Default
    private Integer questionsReviewed = 0;
}
