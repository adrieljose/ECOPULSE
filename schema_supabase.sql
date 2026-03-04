-- ============================================================
-- EcoPulse — Supabase (PostgreSQL) Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Extensions (Supabase includes these by default)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(150) NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'user',
    status        VARCHAR(20)  NOT NULL DEFAULT 'active',
    barangay      VARCHAR(255),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Admins ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(150) NOT NULL UNIQUE,
    email         VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status        VARCHAR(20)  NOT NULL DEFAULT 'active',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Master Admins ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS master_admins (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Devices ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS devices (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255),
    device_code VARCHAR(100) UNIQUE,
    lat         DOUBLE PRECISION,
    lng         DOUBLE PRECISION,
    barangay    VARCHAR(255),
    status      VARCHAR(50)  NOT NULL DEFAULT 'active',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Readings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS readings (
    id          BIGSERIAL PRIMARY KEY,
    device_id   INTEGER      NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    aqi         NUMERIC(8,2),
    pm1         NUMERIC(8,2),
    pm25        NUMERIC(8,2),
    pm10        NUMERIC(8,2),
    o3          NUMERIC(8,2),
    co          NUMERIC(8,2),
    co2         NUMERIC(8,2),
    temperature NUMERIC(6,2),
    humidity    NUMERIC(6,2),
    lat         DOUBLE PRECISION,
    lng         DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_readings_device_recorded
    ON readings (device_id, recorded_at DESC);

-- ── Incident Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incident_logs (
    id         BIGSERIAL PRIMARY KEY,
    device_id  INTEGER     REFERENCES devices(id) ON DELETE SET NULL,
    severity   VARCHAR(50) NOT NULL DEFAULT 'info',
    message    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incident_logs_created
    ON incident_logs (created_at DESC);

-- ── System Settings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key   VARCHAR(50)  PRIMARY KEY,
    setting_value VARCHAR(255)
);

INSERT INTO system_settings (setting_key, setting_value) VALUES ('active_device_id', '0') ON CONFLICT DO NOTHING;
INSERT INTO system_settings (setting_key, setting_value) VALUES ('recording_active', '0') ON CONFLICT DO NOTHING;

-- ── Web Sessions (DB-backed PHP sessions for Vercel) ──────────
CREATE TABLE IF NOT EXISTS web_sessions (
    session_id   VARCHAR(128) PRIMARY KEY,
    session_data BYTEA        NOT NULL,
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Optional: auto-cleanup old sessions (requires pg_cron extension in Supabase)
-- SELECT cron.schedule('cleanup-sessions', '0 * * * *',
--   $$DELETE FROM web_sessions WHERE updated_at < NOW() - INTERVAL '2 hours'$$);

-- ── Barangays ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS barangays (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- ── OTP / Password Reset ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ  NOT NULL,
    used       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Activity Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
    id         BIGSERIAL PRIMARY KEY,
    user_id    INTEGER     REFERENCES users(id) ON DELETE SET NULL,
    action     TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Email Alerts Config ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_alerts (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER     REFERENCES users(id) ON DELETE CASCADE,
    threshold  NUMERIC(8,2),
    enabled    BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Support Tickets ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER     REFERENCES users(id) ON DELETE SET NULL,
    subject     VARCHAR(255),
    message     TEXT,
    status      VARCHAR(50) NOT NULL DEFAULT 'open',
    resolved_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
