package com.dsaverse.question.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hints",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"question_id", "hint_number"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hint extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "hint_number", nullable = false)
    private Integer hintNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
}
