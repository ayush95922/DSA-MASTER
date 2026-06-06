package com.dsaverse.question.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "approaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Approach extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "editorial_id", nullable = false)
    private Editorial editorial;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String type = "OPTIMAL"; // BRUTE_FORCE, BETTER, OPTIMAL

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "complexity_time", length = 100)
    private String complexityTime;

    @Column(name = "complexity_space", length = 100)
    private String complexitySpace;

    @Column(name = "java_code", columnDefinition = "TEXT")
    private String javaCode;

    @Column(name = "python_code", columnDefinition = "TEXT")
    private String pythonCode;

    @Column(name = "cpp_code", columnDefinition = "TEXT")
    private String cppCode;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;
}
