package com.dsaverse.topic.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "theory_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheorySection extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theory_id", nullable = false)
    private TheoryContent theory;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "section_order", nullable = false)
    @Builder.Default
    private Integer sectionOrder = 0;
}
