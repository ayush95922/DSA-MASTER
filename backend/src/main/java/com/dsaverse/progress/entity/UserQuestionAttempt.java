package com.dsaverse.progress.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import com.dsaverse.question.entity.Question;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_question_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserQuestionAttempt extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "FAILED"; // SOLVED, ATTEMPTED, FAILED

    @Column(name = "execution_time")
    private Integer executionTime; // in milliseconds

    @Column(name = "memory_used")
    private Integer memoryUsed; // in kilobytes

    @Column(name = "submitted_code", columnDefinition = "TEXT")
    private String submittedCode;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String language = "JAVA";

    @Column(name = "attempted_at", nullable = false)
    @Builder.Default
    private Instant attemptedAt = Instant.now();
}
