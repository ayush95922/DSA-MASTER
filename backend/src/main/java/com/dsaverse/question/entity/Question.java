package com.dsaverse.question.entity;

import com.dsaverse.common.audit.AuditableEntity;
import com.dsaverse.question.enums.Difficulty;
import com.dsaverse.topic.entity.Topic;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(name = "is_premium", nullable = false)
    @Builder.Default
    private boolean premium = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer points = 10;

    @Column(name = "company_tags", columnDefinition = "TEXT")
    private String companyTags;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ExternalLink> externalLinks = new ArrayList<>();

    @ManyToMany(mappedBy = "questions")
    @Builder.Default
    private List<Topic> topics = new ArrayList<>();
}

