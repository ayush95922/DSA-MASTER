-- V2__create_roadmap_tables.sql
-- Create roadmap, nodes, dependencies, and user enrollment/progress tables

-- 1. Roadmaps table
CREATE TABLE roadmaps (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'DSA',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roadmap Nodes table
CREATE TABLE roadmap_nodes (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    topic_slug VARCHAR(100),
    x_coordinate INT NOT NULL DEFAULT 0,
    y_coordinate INT NOT NULL DEFAULT 0,
    node_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_nodes_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

-- 3. Roadmap Node Dependencies table (DAG dependencies)
CREATE TABLE roadmap_node_dependencies (
    id BIGSERIAL PRIMARY KEY,
    node_id BIGINT NOT NULL,
    dependency_node_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dependencies_node FOREIGN KEY (node_id) REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_dependencies_dep FOREIGN KEY (dependency_node_id) REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    CONSTRAINT uq_dependencies UNIQUE (node_id, dependency_node_id)
);

-- 4. User Roadmap Enrollments table
CREATE TABLE user_roadmap_enrollments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    roadmap_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED',
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_roadmap UNIQUE (user_id, roadmap_id)
);

-- 5. User Roadmap Node Progress table
CREATE TABLE user_roadmap_node_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    node_id BIGINT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_node_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_node_progress_node FOREIGN KEY (node_id) REFERENCES roadmap_nodes(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_node_progress UNIQUE (user_id, node_id)
);

-- Indexing for lookup speed
CREATE INDEX idx_roadmaps_slug ON roadmaps(slug);
CREATE INDEX idx_roadmap_nodes_roadmap ON roadmap_nodes(roadmap_id);
CREATE INDEX idx_enrollments_user ON user_roadmap_enrollments(user_id);
CREATE INDEX idx_node_progress_user ON user_roadmap_node_progress(user_id);
