package com.dsaverse.question.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Represents external practice platform links for a question (e.g., LeetCode, GeeksforGeeks).
 */
@Entity
@Table(name = "external_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalLink extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "platform_name", nullable = false, length = 50)
    private String platformName;

    @Column(nullable = false, length = 255)
    private String url;
}
