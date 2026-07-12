-- Add winner_status column to participation table for Weekly Reward verification
-- This supports the Phase 23 admin verification workflow

ALTER TABLE participation 
ADD COLUMN IF NOT EXISTS winner_status text DEFAULT 'pending'
CONSTRAINT winner_status_check CHECK (
  winner_status = ANY (ARRAY['pending', 'approved', 'rejected', 'disbursed'])
);

-- Add winner_amount column for storing the reward amount
ALTER TABLE participation 
ADD COLUMN IF NOT EXISTS winner_amount numeric DEFAULT 0;

-- Add weekly_period column for tracking which week the participation belongs to
ALTER TABLE participation 
ADD COLUMN IF NOT EXISTS weekly_period text;

-- Create index for efficient winner queries
CREATE INDEX IF NOT EXISTS idx_participation_winner_status 
ON participation(winner_status) 
WHERE winner_status IN ('pending', 'approved');

-- Create index for weekly period
CREATE INDEX IF NOT EXISTS idx_participation_weekly_period 
ON participation(weekly_period);