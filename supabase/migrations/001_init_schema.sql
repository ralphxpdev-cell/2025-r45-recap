-- 2025 R45 Recap: Auto-Tagging System Database Schema
--
-- Data Strategy:
-- - User never selects categories
-- - Every task text is automatically analyzed
-- - System assigns hidden tags: Action Domain, Energy Type, Time Weight
-- - No category UI on daily screen
-- - Categories used for background analysis only
-- - Insights shown as natural language summaries, not charts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
-- Stores user's daily tasks without any manual categorization
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Index for fast user queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- ============================================================================
-- AUTO_TAGS TABLE
-- ============================================================================
-- Stores automatically analyzed hidden tags for each task
-- These tags are NEVER shown in the daily UI, only used for background analysis
CREATE TABLE auto_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

    -- Action Domain: What area of life/work this task belongs to
    -- Examples: "work", "personal", "health", "learning", "social", "creative"
    action_domain TEXT,

    -- Energy Type: What kind of energy this task requires
    -- Examples: "deep_focus", "light_activity", "social_energy", "creative_flow", "routine"
    energy_type TEXT,

    -- Time Weight: How significant this task is in terms of time/effort
    -- Examples: "quick_win", "moderate_effort", "deep_work", "ongoing"
    time_weight TEXT,

    -- Confidence score for the auto-tagging (0.0 to 1.0)
    confidence_score DECIMAL(3,2) DEFAULT 0.5,

    -- Raw analysis data from AI (stored as JSONB for flexibility)
    analysis_data JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast task lookups
CREATE INDEX idx_auto_tags_task_id ON auto_tags(task_id);
CREATE INDEX idx_auto_tags_action_domain ON auto_tags(action_domain);
CREATE INDEX idx_auto_tags_energy_type ON auto_tags(energy_type);
CREATE INDEX idx_auto_tags_time_weight ON auto_tags(time_weight);

-- ============================================================================
-- INSIGHTS TABLE
-- ============================================================================
-- Stores natural language summaries of patterns, NOT charts
-- These insights are what the user sees - reflections, not analysis
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,

    -- Time period this insight covers
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Natural language insight text
    -- Examples:
    -- "This week, you've been focusing heavily on deep work tasks in the morning"
    -- "You tend to do creative tasks when you have high energy"
    -- "Your quick wins are usually clustered around Friday afternoons"
    insight_text TEXT NOT NULL,

    -- Insight category (for internal organization only, NOT shown to user)
    -- Examples: "pattern", "reflection", "suggestion", "observation"
    insight_type TEXT,

    -- Supporting data (JSONB for flexibility)
    -- Stores the underlying pattern data that generated this insight
    supporting_data JSONB,

    -- Has user seen this insight?
    viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_insights_period ON insights(period_start DESC, period_end DESC);
CREATE INDEX idx_insights_viewed ON insights(viewed);

-- ============================================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================================
-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auto_tags_updated_at
    BEFORE UPDATE ON auto_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Tasks: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Auto Tags: Users can view tags for their own tasks
CREATE POLICY "Users can view auto tags for their own tasks"
    ON auto_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            WHERE tasks.id = auto_tags.task_id
            AND tasks.user_id = auth.uid()
        )
    );

-- System can insert/update auto tags (via service role)
CREATE POLICY "Service role can manage auto tags"
    ON auto_tags FOR ALL
    USING (auth.role() = 'service_role');

-- Insights: Users can only see their own insights
CREATE POLICY "Users can view their own insights"
    ON insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage insights"
    ON insights FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================================
-- SAMPLE TAG ENUM VALUES (for reference)
-- ============================================================================
-- These are not enforced at DB level to allow flexibility
-- The AI can suggest new categories as it learns

-- Action Domain examples:
--   - work_project
--   - personal_admin
--   - health_wellness
--   - learning_growth
--   - social_connection
--   - creative_expression
--   - home_maintenance
--   - financial_planning

-- Energy Type examples:
--   - deep_focus (requires sustained concentration)
--   - light_activity (low cognitive load)
--   - social_energy (interaction with others)
--   - creative_flow (generative thinking)
--   - routine_execution (familiar patterns)
--   - physical_activity (body movement)

-- Time Weight examples:
--   - quick_win (< 15 minutes)
--   - moderate_effort (15-60 minutes)
--   - deep_work (1-3 hours)
--   - ongoing_commitment (multi-day/week)
--   - waiting_on_others (blocked time)
