package com.dsaverse.topic.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theory_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheoryContent extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false, unique = true)
    private Topic topic;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "complexity_analysis", columnDefinition = "TEXT")
    private String complexityAnalysis;

    @OneToMany(mappedBy = "theory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TheorySection> sections = new ArrayList<>();
}
