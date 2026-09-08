-- ─────────────────────────────────────────────────────────────────────────────
-- NBFC Intelligence Platform - Database Initialization
-- PostgreSQL 16 - Enterprise Schema with Security Extensions
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Audit Logging Function ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ─── Tables ────────────────────────────────────────────────────────────────

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'Subscriber',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    sso_provider VARCHAR(50),
    sso_external_id VARCHAR(255),
    consent_given_at TIMESTAMP,
    consent_version VARCHAR(20),
    data_erasure_requested_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    amount_monthly DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    active_seats INTEGER DEFAULT 1,
    max_seats INTEGER DEFAULT 5,
    api_calls_mtd INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nbfc_layers TEXT[] DEFAULT '{}',
    enabled_categories TEXT[] DEFAULT '{}',
    min_relevance_score INTEGER DEFAULT 5,
    email_digest_frequency VARCHAR(20) DEFAULT 'daily',
    slack_webhook_url TEXT,
    teams_webhook_url TEXT,
    webhook_secret_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_preferences_user ON user_preferences(user_id);

-- Intelligence items table
CREATE TABLE IF NOT EXISTS intelligence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    headline VARCHAR(500) NOT NULL,
    source_authority VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    technical_summary TEXT NOT NULL,
    cio_actionable_directive TEXT NOT NULL,
    applicable_nbfc_layers TEXT[] NOT NULL,
    severity_or_relevance_score INTEGER NOT NULL CHECK (severity_or_relevance_score BETWEEN 1 AND 10),
    tags TEXT[] DEFAULT '{}',
    content_hash VARCHAR(64) UNIQUE NOT NULL,
    source_content_id VARCHAR(255),
    published_at TIMESTAMP NOT NULL,
    ingested_at TIMESTAMP DEFAULT NOW(),
    llm_model_used VARCHAR(100)
);

CREATE INDEX idx_intel_category ON intelligence_items(category);
CREATE INDEX idx_intel_score ON intelligence_items(severity_or_relevance_score DESC);
CREATE INDEX idx_intel_published ON intelligence_items(published_at DESC);
CREATE INDEX idx_intel_hash ON intelligence_items(content_hash);
CREATE INDEX idx_intel_layers ON intelligence_items USING GIN(applicable_nbfc_layers);
CREATE INDEX idx_intel_tags ON intelligence_items USING GIN(tags);

-- Content deduplication table
CREATE TABLE IF NOT EXISTS content_deduplication (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_hash VARCHAR(64) UNIQUE NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(255),
    first_seen_at TIMESTAMP DEFAULT NOW(),
    last_seen_at TIMESTAMP DEFAULT NOW(),
    occurrence_count INTEGER DEFAULT 1
);

CREATE INDEX idx_dedup_hash ON content_deduplication(content_hash);
CREATE INDEX idx_dedup_source ON content_deduplication(source_type, source_id);

-- Consent audit log (DPDP compliance)
CREATE TABLE IF NOT EXISTS consent_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    consent_version VARCHAR(20),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata_json JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_user ON consent_audit_log(user_id);
CREATE INDEX idx_consent_action ON consent_audit_log(action);
CREATE INDEX idx_consent_created ON consent_audit_log(created_at DESC);

-- ─── Triggers ──────────────────────────────────────────────────────────────

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_isolation ON users
    FOR ALL USING (id = current_setting('app.current_user_id')::UUID);

CREATE POLICY subscription_isolation ON subscriptions
    FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY preferences_isolation ON user_preferences
    FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY consent_log_isolation ON consent_audit_log
    FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

-- ─── Initial Data ──────────────────────────────────────────────────────────

-- Insert default admin user (password must be changed on first login)
-- Password: 'Admin@2026!Secure' (Argon2id hash - change in production)
INSERT INTO users (email, hashed_password, full_name, organization, role, is_active, is_verified, consent_given_at, consent_version)
VALUES (
    'admin@nbfcintel.in',
    '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHRzYWx0$hash_placeholder',
    'Platform Administrator',
    'NBFC Intelligence Platform',
    'SuperAdmin',
    true,
    true,
    NOW(),
    '2.0'
) ON CONFLICT (email) DO NOTHING;
