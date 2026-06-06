-- V6__create_revision_tables.sql
-- Create revision schedule, flashcard decks, flashcards, flashcard progress, and session tables

-- 1. Revision Schedules table (Spaced Repetition for questions)
CREATE TABLE revision_schedules (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    interval_days INT NOT NULL DEFAULT 1,
    ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    repetitions INT NOT NULL DEFAULT 0,
    next_review_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_revision_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_revision_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_question_revision UNIQUE (user_id, question_id)
);

-- 2. Flashcard Decks table (Can be system default where user_id is NULL, or custom user decks)
CREATE TABLE flashcard_decks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_decks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Flashcards table
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    deck_id BIGINT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_flashcards_deck FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
);

-- 4. User Flashcard Progress table (Spaced Repetition for flashcards)
CREATE TABLE user_flashcard_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    flashcard_id BIGINT NOT NULL,
    interval_days INT NOT NULL DEFAULT 1,
    ease_factor DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    repetitions INT NOT NULL DEFAULT 0,
    next_review_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fc_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fc_progress_card FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_flashcard_progress UNIQUE (user_id, flashcard_id)
);

-- 5. Revision Sessions table
CREATE TABLE revision_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    cards_reviewed INT NOT NULL DEFAULT 0,
    questions_reviewed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_revision_user_date ON revision_schedules(user_id, next_review_date);
CREATE INDEX idx_flashcards_deck ON flashcards(deck_id);
CREATE INDEX idx_fc_progress_user_date ON user_flashcard_progress(user_id, next_review_date);
CREATE INDEX idx_sessions_user ON revision_sessions(user_id);
