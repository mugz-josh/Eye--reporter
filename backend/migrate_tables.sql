-- Add missing columns to red_flags table
ALTER TABLE red_flags ADD COLUMN IF NOT EXISTS images TEXT;
ALTER TABLE red_flags ADD COLUMN IF NOT EXISTS videos TEXT;
ALTER TABLE red_flags ADD COLUMN IF NOT EXISTS audio TEXT;

-- Add missing columns to interventions table
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS images TEXT;
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS videos TEXT;
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS audio TEXT;

-- Add missing columns to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_entity_type VARCHAR(50);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_entity_id INTEGER;
