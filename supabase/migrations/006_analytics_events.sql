-- Migration: Analytics Events Table
-- Purpose: Store all user interaction events for data analysis

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_data JSONB NOT NULL,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for common queries
    CONSTRAINT analytics_events_event_name_check CHECK (event_name <> '')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_data ON analytics_events USING GIN(event_data);

-- Create view for common analytics queries
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    event_name,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    DATE_TRUNC('day', created_at) as event_date,
    event_data->>'device_type' as device_type,
    event_data->>'utm_source' as utm_source
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY event_name, event_date, device_type, utm_source
ORDER BY event_date DESC, event_count DESC;

-- Create view for conversion funnel
CREATE OR REPLACE VIEW conversion_funnel AS
WITH funnel_steps AS (
    SELECT 
        session_id,
        MAX(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) as visited,
        MAX(CASE WHEN event_name IN ('calculator_started', 'chatbot_opened', 'product_viewed') THEN 1 ELSE 0 END) as engaged,
        MAX(CASE WHEN event_name = 'lead_form_started' THEN 1 ELSE 0 END) as form_started,
        MAX(CASE WHEN event_name = 'lead_form_submitted' THEN 1 ELSE 0 END) as converted
    FROM analytics_events
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY session_id
)
SELECT 
    SUM(visited) as total_visitors,
    SUM(engaged) as engaged_users,
    SUM(form_started) as form_starts,
    SUM(converted) as conversions,
    ROUND(100.0 * SUM(engaged) / NULLIF(SUM(visited), 0), 2) as engagement_rate,
    ROUND(100.0 * SUM(form_started) / NULLIF(SUM(engaged), 0), 2) as form_start_rate,
    ROUND(100.0 * SUM(converted) / NULLIF(SUM(form_started), 0), 2) as conversion_rate
FROM funnel_steps;

-- Comments
COMMENT ON TABLE analytics_events IS 'Stores all user interaction events for analytics and ML';
COMMENT ON VIEW analytics_summary IS 'Daily aggregated analytics metrics';
COMMENT ON VIEW conversion_funnel IS 'Conversion funnel analysis for last 30 days';
