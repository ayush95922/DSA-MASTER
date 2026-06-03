-- V3__create_topic_tables.sql
-- Create category, topic, subtopic, theory_content, theory_sections, and topic_patterns tables

-- 1. Categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Topics table
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_topics_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. Subtopics table
CREATE TABLE subtopics (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subtopics_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 4. Theory Contents table
CREATE TABLE theory_contents (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT UNIQUE NOT NULL,
    overview TEXT,
    complexity_analysis TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theory_contents_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 5. Theory Sections table
CREATE TABLE theory_sections (
    id BIGSERIAL PRIMARY KEY,
    theory_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT,
    section_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_theory_sections_theory FOREIGN KEY (theory_id) REFERENCES theory_contents(id) ON DELETE CASCADE
);

-- 6. Topic Patterns table (e.g., Two Pointers, Sliding Window, Monotonic Stack)
CREATE TABLE topic_patterns (
    id BIGSERIAL PRIMARY KEY,
    topic_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patterns_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT uq_topic_pattern UNIQUE (topic_id, slug)
);

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_subtopics_slug ON subtopics(slug);
CREATE INDEX idx_theory_contents_topic ON theory_contents(topic_id);
CREATE INDEX idx_theory_sections_theory ON theory_sections(theory_id);
CREATE INDEX idx_patterns_topic_slug ON topic_patterns(topic_id, slug);
