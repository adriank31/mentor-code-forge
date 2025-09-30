-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create puzzle completions table
CREATE TABLE public.puzzle_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puzzle_slug TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, puzzle_slug)
);

-- Enable RLS on puzzle_completions
ALTER TABLE public.puzzle_completions ENABLE ROW LEVEL SECURITY;

-- Puzzle completions policies
CREATE POLICY "Users can view their own puzzle completions"
  ON public.puzzle_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own puzzle completions"
  ON public.puzzle_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create lab completions table
CREATE TABLE public.lab_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_slug TEXT NOT NULL,
  success BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lab_slug)
);

-- Enable RLS on lab_completions
ALTER TABLE public.lab_completions ENABLE ROW LEVEL SECURITY;

-- Lab completions policies
CREATE POLICY "Users can view their own lab completions"
  ON public.lab_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lab completions"
  ON public.lab_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create project completions table
CREATE TYPE project_status AS ENUM ('started', 'in_progress', 'completed');

CREATE TABLE public.project_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_slug TEXT NOT NULL,
  status project_status DEFAULT 'started',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, project_slug)
);

-- Enable RLS on project_completions
ALTER TABLE public.project_completions ENABLE ROW LEVEL SECURITY;

-- Project completions policies
CREATE POLICY "Users can view their own project completions"
  ON public.project_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own project completions"
  ON public.project_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project completions"
  ON public.project_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();