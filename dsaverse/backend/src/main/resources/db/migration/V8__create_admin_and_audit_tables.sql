-- V8__create_admin_and_audit_tables.sql
-- Create audit logs, content imports, and system settings tables

-- 1. Audit Logs table (For tracking security and critical admin actions)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50),
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. Content Imports table (For bulk uploads of questions/topics by admins)
CREATE TABLE content_imports (
    id BIGSERIAL PRIMARY KEY,
    imported_by BIGINT,
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, SUCCESS, FAILED
    records_processed INT NOT NULL DEFAULT 0,
    errors TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_imports_user FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. System Settings table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_settings_key ON system_settings(setting_key);

-- Seed default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('maintenance_mode', 'false', 'Enable/disable global maintenance mode'),
('allow_registration', 'true', 'Enable/disable user sign-ups'),
('max_daily_attempts', '500', 'Maximum submissions a user can make in 24 hours');
