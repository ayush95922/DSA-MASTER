package com.dsaverse.auth.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

/**
 * Extended user profile with personal details, college info, and onboarding data.
 */
@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 200)
    private String college;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(length = 20)
    @Builder.Default
    private String level = "BEGINNER";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "target_companies", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> targetCompanies = new ArrayList<>();

    @Column(name = "onboarding_completed", nullable = false)
    @Builder.Default
    private Boolean onboardingCompleted = false;
}
