package com.dsaverse.company.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_company_readiness",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "company_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCompanyReadiness extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "readiness_percentage", nullable = false)
    @Builder.Default
    private Integer readinessPercentage = 0; // 0 to 100%
}
