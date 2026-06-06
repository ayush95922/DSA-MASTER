package com.dsaverse.admin.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "content_imports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentImport extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imported_by")
    private User importedBy;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, IN_PROGRESS, SUCCESS, FAILED

    @Column(name = "records_processed", nullable = false)
    @Builder.Default
    private Integer recordsProcessed = 0;

    @Column(columnDefinition = "TEXT")
    private String errors;
}
