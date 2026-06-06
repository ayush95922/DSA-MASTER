package com.dsaverse.progress.entity;

import com.dsaverse.auth.entity.User;
import com.dsaverse.common.audit.AuditableEntity;
import com.dsaverse.question.entity.Question;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_bookmarks",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "question_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBookmark extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
}
