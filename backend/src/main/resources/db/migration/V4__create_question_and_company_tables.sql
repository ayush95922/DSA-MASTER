-- V4__create_question_and_company_tables.sql
-- Create companies, questions, and all related tag/solution/editorial tables

-- 1. Companies table
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo VARCHAR(255),
    description TEXT,
    tier VARCHAR(20) NOT NULL DEFAULT 'TIER_3',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Questions table
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY',
    description TEXT,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    points INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Question Topic Tags
CREATE TABLE question_topic_tags (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qtopic_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_qtopic_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT uq_question_topic UNIQUE (question_id, topic_id)
);

-- 4. Question Company Tags
CREATE TABLE question_company_tags (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    frequency VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qcompany_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_qcompany_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT uq_question_company UNIQUE (question_id, company_id)
);

-- 5. Question Pattern Tags
CREATE TABLE question_pattern_tags (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    pattern_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qpattern_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_qpattern_pattern FOREIGN KEY (pattern_id) REFERENCES topic_patterns(id) ON DELETE CASCADE,
    CONSTRAINT uq_question_pattern UNIQUE (question_id, pattern_id)
);

-- 6. Hints table
CREATE TABLE hints (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    hint_number INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hints_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT uq_question_hint_number UNIQUE (question_id, hint_number)
);

-- 7. Editorials table
CREATE TABLE editorials (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT UNIQUE NOT NULL,
    solution_overview TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_editorials_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 8. Approaches table
CREATE TABLE approaches (
    id BIGSERIAL PRIMARY KEY,
    editorial_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'OPTIMAL',
    description TEXT,
    complexity_time VARCHAR(100),
    complexity_space VARCHAR(100),
    java_code TEXT,
    python_code TEXT,
    cpp_code TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_approaches_editorial FOREIGN KEY (editorial_id) REFERENCES editorials(id) ON DELETE CASCADE
);

-- 9. External Links table (e.g. LeetCode, GFG link)
CREATE TABLE external_links (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    platform_name VARCHAR(50) NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_links_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- 10. Related Questions table (linked questions)
CREATE TABLE related_questions (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    related_question_id BIGINT NOT NULL,
    relation_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_related_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT fk_related_dest_question FOREIGN KEY (related_question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT uq_related_questions UNIQUE (question_id, related_question_id)
);

-- Indexes
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_questions_slug ON questions(slug);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_qtopic_question ON question_topic_tags(question_id);
CREATE INDEX idx_qcompany_question ON question_company_tags(question_id);
CREATE INDEX idx_qpattern_question ON question_pattern_tags(question_id);
CREATE INDEX idx_hints_question ON hints(question_id);
CREATE INDEX idx_approaches_editorial ON approaches(editorial_id);
