package com.dsaverse.roadmap.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roadmap_nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapNode extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private Roadmap roadmap;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "topic_slug", length = 100)
    private String topicSlug;

    @Column(name = "x_coordinate", nullable = false)
    @Builder.Default
    private Integer xCoordinate = 0;

    @Column(name = "y_coordinate", nullable = false)
    @Builder.Default
    private Integer yCoordinate = 0;

    @Column(name = "node_order", nullable = false)
    @Builder.Default
    private Integer nodeOrder = 0;

    @Column(name = "theory_page", columnDefinition = "TEXT")
    private String theoryPage;

    @Column(name = "revision_notes", columnDefinition = "TEXT")
    private String revisionNotes;

    @Column(name = "cheat_sheet", columnDefinition = "TEXT")
    private String cheatSheet;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "flashcards", columnDefinition = "jsonb")
    private List<FlashcardInfo> flashcards;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "youtube_resources", columnDefinition = "jsonb")
    private List<ResourceLink> youtubeResources;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "leetcode_problems", columnDefinition = "jsonb")
    private List<ResourceLink> leetcodeProblems;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "geeksforgeeks_links", columnDefinition = "jsonb")
    private List<ResourceLink> geeksforgeeksLinks;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "practice_questions", columnDefinition = "jsonb")
    private List<PracticeQuestionInfo> practiceQuestions;

    @ManyToMany
    @JoinTable(
        name = "roadmap_node_dependencies",
        joinColumns = @JoinColumn(name = "node_id"),
        inverseJoinColumns = @JoinColumn(name = "dependency_node_id")
    )
    @Builder.Default
    private List<RoadmapNode> dependencies = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FlashcardInfo {
        private String front;
        private String back;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResourceLink {
        private String title;
        private String url;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PracticeQuestionInfo {
        private String title;
        private String slug;
        private String difficulty;
        private String topic;
        private String leetcodeUrl;
        private String gfgUrl;
        private String hackerrankUrl;
        private String youtubeUrl;
    }
}
