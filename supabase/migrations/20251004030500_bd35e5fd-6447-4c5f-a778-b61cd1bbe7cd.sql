-- Create table for tracking weekly usage limits
CREATE TABLE IF NOT EXISTS public.weekly_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  puzzles_completed INTEGER NOT NULL DEFAULT 0,
  labs_completed INTEGER NOT NULL DEFAULT 0,
  projects_started INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Enable RLS
ALTER TABLE public.weekly_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage"
ON public.weekly_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.weekly_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.weekly_usage
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_weekly_usage_updated_at
BEFORE UPDATE ON public.weekly_usage
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add table to track if user has seen the limit dialog
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_seen_limit_dialog BOOLEAN DEFAULT false;