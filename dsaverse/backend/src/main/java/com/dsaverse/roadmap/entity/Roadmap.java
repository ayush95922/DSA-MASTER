package com.dsaverse.roadmap.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Roadmap extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String type = "DSA"; // DSA, PLACEMENT

    @Column(length = 20)
    @Builder.Default
    private String difficulty = "MEDIUM"; // BEGINNER, MEDIUM, HARD

    @Column(name = "estimated_duration", length = 50)
    private String estimatedDuration;

    @Column(columnDefinition = "TEXT")
    private String prerequisites;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "learning_outcomes", columnDefinition = "jsonb")
    private List<String> learningOutcomes;

    @Column(name = "completion_criteria", columnDefinition = "TEXT")
    private String completionCriteria;

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoadmapNode> nodes = new ArrayList<>();
}
