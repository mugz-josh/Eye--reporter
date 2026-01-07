-- Migration to add audio column to red_flags and interventions tables
-- Run this if your tables already exist but don't have the audio column

USE ireporter;

-- Add audio column to red_flags table if it doesn't exist
ALTER TABLE red_flags ADD COLUMN IF NOT EXISTS audio JSON;

-- Add audio column to interventions table if it doesn't exist
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS audio JSON;

-- Verify the columns were added
DESCRIBE red_flags;
DESCRIBE interventions;
