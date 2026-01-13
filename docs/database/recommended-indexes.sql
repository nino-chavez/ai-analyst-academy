-- Recommended Database Indexes for AI Analyst Academy
-- Apply these via Supabase Dashboard SQL Editor or Supabase CLI
--
-- Purpose: Improve query performance for common access patterns
-- Created: 2026-01-13 as part of application hardening

-- ============================================
-- USER PROGRESS TABLES
-- ============================================

-- module_progress: Most queries filter by user_id
-- Used in: progress page, module page, review queue calculations
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id
ON module_progress(user_id);

-- module_progress: Some queries also filter by module_id
-- Used in: checking if user has started a specific module
CREATE INDEX IF NOT EXISTS idx_module_progress_module_id
ON module_progress(module_id);

-- Composite index for the common (user_id, module_id) lookup pattern
CREATE INDEX IF NOT EXISTS idx_module_progress_user_module
ON module_progress(user_id, module_id);

-- lab_progress: Most queries filter by user_id
-- Used in: progress page, lab page, portfolio
CREATE INDEX IF NOT EXISTS idx_lab_progress_user_id
ON lab_progress(user_id);

-- Composite index for user + lab lookups
CREATE INDEX IF NOT EXISTS idx_lab_progress_user_lab
ON lab_progress(user_id, lab_id);

-- ============================================
-- USER API KEYS
-- ============================================

-- user_api_keys: Queries always filter by user_id
-- Used in: settings page, chat API for key retrieval
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id
ON user_api_keys(user_id);

-- Composite index for user + provider lookups (most common pattern)
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_provider
ON user_api_keys(user_id, provider);

-- ============================================
-- REVIEW QUEUE (Spaced Repetition)
-- ============================================

-- review_queue: Filter by user_id and next_review_at for due items
-- Used in: progress page to show due reviews
CREATE INDEX IF NOT EXISTS idx_review_queue_user_id
ON review_queue(user_id);

-- Index for finding due reviews efficiently
CREATE INDEX IF NOT EXISTS idx_review_queue_user_next_review
ON review_queue(user_id, next_review_at);

-- ============================================
-- PORTFOLIO & DELIVERABLES
-- ============================================

-- phase_deliverables: Most queries filter by user_id
-- Used in: portfolio page
CREATE INDEX IF NOT EXISTS idx_phase_deliverables_user_id
ON phase_deliverables(user_id);

-- capstone_projects: Most queries filter by user_id
-- Used in: portfolio page
CREATE INDEX IF NOT EXISTS idx_capstone_projects_user_id
ON capstone_projects(user_id);

-- ============================================
-- SANDBOX & PROMPTS
-- ============================================

-- sandbox_sessions: Filter by user_id
-- Used in: sandbox history, session retrieval
CREATE INDEX IF NOT EXISTS idx_sandbox_sessions_user_id
ON sandbox_sessions(user_id);

-- saved_prompts: Filter by user_id
-- Used in: prompt library
CREATE INDEX IF NOT EXISTS idx_saved_prompts_user_id
ON saved_prompts(user_id);

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Run this after applying indexes to verify they were created:
--
-- SELECT
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- AND indexname LIKE 'idx_%'
-- ORDER BY tablename, indexname;
