package com.dsaverse.company.entity;

import com.dsaverse.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(length = 255)
    private String logo;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String tier = "TIER_3"; // TIER_1 (FAANG), TIER_2 (MAANG/Top Startups), TIER_3 (Enterprise)

    @Column(name = "preparation_timeline", columnDefinition = "TEXT")
    private String preparationTimeline;

    @Column(name = "interview_process", columnDefinition = "TEXT")
    private String interviewProcess;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "most_asked_topics", columnDefinition = "jsonb")
    private List<String> mostAskedTopics;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "most_asked_questions", columnDefinition = "jsonb")
    private List<String> mostAskedQuestions;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "difficulty_breakdown", columnDefinition = "jsonb")
    private DifficultyBreakdown difficultyBreakdown;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "faqs", columnDefinition = "jsonb")
    private List<FaqInfo> faqs;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "interview_experiences", columnDefinition = "jsonb")
    private List<InterviewExperienceInfo> interviewExperiences;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "topic_weightages", columnDefinition = "jsonb")
    private Map<String, Integer> topicWeightages;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "company_roadmap", columnDefinition = "jsonb")
    private List<CompanyRoadmapWeek> companyRoadmap;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DifficultyBreakdown {
        private int easy;
        private int medium;
        private int hard;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FaqInfo {
        private String question;
        private String answer;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewExperienceInfo {
        private String title;
        private String rounds;
        private List<String> questionsAsked;
        private String difficulty;
        private String tips;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompanyRoadmapWeek {
        private Integer weekNumber;
        private String topics;
        private String focus;
    }
}

