-- DSAverse PostgreSQL Initialization
-- This runs on first container creation only

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Ensure the dsaverse database exists (already created by POSTGRES_DB env)
-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dsaverse TO dsaverse;
