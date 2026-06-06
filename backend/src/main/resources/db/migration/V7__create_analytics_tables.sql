-- V7__create_analytics_tables.sql
-- Create analytics snapshots, company readiness, and platform analytics tables

-- 1. User Analytics Snapshots table (For progress graphs over time)
CREATE TABLE user_analytics_snapshots (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    snapshot_date DATE NOT NULL,
    total_solved INT NOT NULL DEFAULT 0,
    easy_solved INT NOT NULL DEFAULT 0,
    medium_solved INT NOT NULL DEFAULT 0,
    hard_solved INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_snapshots_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_snapshot_date UNIQUE (user_id, snapshot_date)
);

-- 2. User Company Readiness table
CREATE TABLE user_company_readiness (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    readiness_percentage INT NOT NULL DEFAULT 0, -- 0 to 100
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_readiness_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_readiness_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_company_readiness UNIQUE (user_id, company_id)
);

-- 3. Platform Analytics table
CREATE TABLE platform_analytics (
    id BIGSERIAL PRIMARY KEY,
    total_users BIGINT NOT NULL DEFAULT 0,
    total_submissions BIGINT NOT NULL DEFAULT 0,
    total_active_users BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_snapshots_user_date ON user_analytics_snapshots(user_id, snapshot_date);
CREATE INDEX idx_readiness_user ON user_company_readiness(user_id);
