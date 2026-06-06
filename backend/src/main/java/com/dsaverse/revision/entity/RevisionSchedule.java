package com.dsaverse.revision.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import com.dsaverse.question.entity.Question;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "revision_schedules",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "question_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisionSchedule extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "interval_days", nullable = false)
    @Builder.Default
    private Integer intervalDays = 1;

    @Column(name = "ease_factor", nullable = false)
    @Builder.Default
    private Double easeFactor = 2.5;

    @Column(name = "repetitions", nullable = false)
    @Builder.Default
    private Integer repetitions = 0;

    @Column(name = "next_review_date", nullable = false)
    private LocalDateTime nextReviewDate;
}
