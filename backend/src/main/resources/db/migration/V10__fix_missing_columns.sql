-- V10__fix_missing_columns.sql
-- Add columns that exist in JPA entities but are missing from the original migrations.
-- This migration is safe to run multiple times conceptually (uses IF NOT EXISTS / DO blocks).

-- ==================== ROADMAPS TABLE: Add missing columns ====================

ALTER TABLE roadmaps
    ADD COLUMN IF NOT EXISTS difficulty          VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM',
    ADD COLUMN IF NOT EXISTS estimated_duration  VARCHAR(50),
    ADD COLUMN IF NOT EXISTS prerequisites       TEXT,
    ADD COLUMN IF NOT EXISTS learning_outcomes   JSONB,
    ADD COLUMN IF NOT EXISTS completion_criteria TEXT;

-- ==================== ROADMAP_NODES TABLE: Add missing JSONB and TEXT columns ====================

ALTER TABLE roadmap_nodes
    ADD COLUMN IF NOT EXISTS theory_page         TEXT,
    ADD COLUMN IF NOT EXISTS revision_notes      TEXT,
    ADD COLUMN IF NOT EXISTS cheat_sheet         TEXT,
    ADD COLUMN IF NOT EXISTS flashcards          JSONB,
    ADD COLUMN IF NOT EXISTS youtube_resources   JSONB,
    ADD COLUMN IF NOT EXISTS leetcode_problems   JSONB,
    ADD COLUMN IF NOT EXISTS geeksforgeeks_links JSONB,
    ADD COLUMN IF NOT EXISTS practice_questions  JSONB;

-- ==================== COMPANIES TABLE: Add missing columns ====================

ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS preparation_timeline   TEXT,
    ADD COLUMN IF NOT EXISTS interview_process      TEXT,
    ADD COLUMN IF NOT EXISTS most_asked_topics      JSONB,
    ADD COLUMN IF NOT EXISTS most_asked_questions   JSONB,
    ADD COLUMN IF NOT EXISTS difficulty_breakdown   JSONB,
    ADD COLUMN IF NOT EXISTS faqs                   JSONB,
    ADD COLUMN IF NOT EXISTS interview_experiences  JSONB,
    ADD COLUMN IF NOT EXISTS topic_weightages       JSONB,
    ADD COLUMN IF NOT EXISTS company_roadmap        JSONB;

-- ==================== QUESTIONS TABLE: Add missing company_tags column ====================

ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS company_tags TEXT;

