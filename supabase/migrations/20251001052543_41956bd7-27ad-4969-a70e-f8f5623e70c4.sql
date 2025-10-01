-- Create storage bucket for project submissions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-submissions',
  'project-submissions',
  false,
  52428800, -- 50MB limit
  ARRAY['application/zip', 'application/x-zip-compressed', 'application/x-tar', 'application/gzip', 'text/plain', 'text/x-c', 'text/x-c++', 'application/octet-stream']
);

-- Create project_submissions table
CREATE TABLE public.project_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_slug TEXT NOT NULL,
  submission_title TEXT NOT NULL,
  submission_description TEXT,
  file_paths TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'revision_requested')),
  admin_feedback TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  community_votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_milestone_progress table
CREATE TABLE public.project_milestone_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_slug TEXT NOT NULL,
  milestone_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_slug, milestone_id)
);

-- Enable Row Level Security
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestone_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_submissions
CREATE POLICY "Users can view their own submissions"
  ON public.project_submissions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public submissions"
  ON public.project_submissions
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create their own submissions"
  ON public.project_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.project_submissions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for project_milestone_progress
CREATE POLICY "Users can view their own milestone progress"
  ON public.project_milestone_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestone progress"
  ON public.project_milestone_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestone progress"
  ON public.project_milestone_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Storage policies for project-submissions bucket
CREATE POLICY "Users can upload their own project files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own project files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public project files are viewable"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'project-submissions' AND
    EXISTS (
      SELECT 1 FROM public.project_submissions
      WHERE is_public = true
      AND auth.uid()::text = ANY(file_paths)
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_project_submissions_updated_at
  BEFORE UPDATE ON public.project_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_project_milestone_progress_updated_at
  BEFORE UPDATE ON public.project_milestone_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_project_submissions_user_id ON public.project_submissions(user_id);
CREATE INDEX idx_project_submissions_project_slug ON public.project_submissions(project_slug);
CREATE INDEX idx_project_submissions_status ON public.project_submissions(status);
CREATE INDEX idx_project_submissions_is_public ON public.project_submissions(is_public);
CREATE INDEX idx_project_milestone_progress_user_project ON public.project_milestone_progress(user_id, project_slug);