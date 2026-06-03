package com.dsaverse.question.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "editorials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Editorial extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false, unique = true)
    private Question question;

    @Column(name = "solution_overview", columnDefinition = "TEXT")
    private String solutionOverview;

    @OneToMany(mappedBy = "editorial", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Approach> approaches = new ArrayList<>();
}
