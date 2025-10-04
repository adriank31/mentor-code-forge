import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { 
  Lock, 
  CheckCircle, 
  Circle, 
  Download, 
  Upload,
  FileCode,
  Target,
  ListChecks,
  Clock,
  Users,
  MessageSquare,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { projects } from "@/data/projects";
import { ProGate } from "@/components/ProGate";
import { AuthGate } from "@/components/AuthGate";
import { LimitReachedDialog } from "@/components/LimitReachedDialog";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const project = projects.find(p => p.slug === slug);

  const [milestoneProgress, setMilestoneProgress] = useState<Record<string, boolean>>({});
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Submission form state
  const [submissionTitle, setSubmissionTitle] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [makePublic, setMakePublic] = useState(false);
  const { checkLimit, incrementUsage, limitReached, limitType, dismissLimitDialog, usage, limits, isPro } = useUsageLimits();
  const [canAccess, setCanAccess] = useState(true);

  // Check limit on mount for free users
  useEffect(() => {
    if (user && !isPro && !project?.proOnly) {
      const hasAccess = checkLimit('projects');
      setCanAccess(hasAccess);
    }
  }, [user, isPro, project?.proOnly]);

  useEffect(() => {
    if (user && slug && project?.milestones) {
      loadMilestoneProgress();
      loadSubmissions();
      // Increment project usage when user starts a project
      if (!isPro) {
        incrementUsage('projects');
      }
    }
  }, [user, slug, project]);

  const loadMilestoneProgress = async () => {
    if (!user || !project?.milestones) return;

    const { data } = await supabase
      .from('project_milestone_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_slug', slug);

    if (data) {
      const progress: Record<string, boolean> = {};
      data.forEach(item => {
        progress[item.milestone_id] = item.completed;
      });
      setMilestoneProgress(progress);
    }
  };

  const loadSubmissions = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('project_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_slug', slug)
      .order('created_at', { ascending: false });

    if (data) {
      setSubmissions(data);
    }
  };

  const toggleMilestone = async (milestoneId: string) => {
    if (!user) return;

    const newStatus = !milestoneProgress[milestoneId];

    const { error } = await supabase
      .from('project_milestone_progress')
      .upsert({
        user_id: user.id,
        project_slug: slug!,
        milestone_id: milestoneId,
        completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Could not update milestone',
        variant: 'destructive',
      });
      return;
    }

    setMilestoneProgress(prev => ({ ...prev, [milestoneId]: newStatus }));
    toast({
      title: newStatus ? 'Milestone completed!' : 'Milestone marked incomplete',
      description: newStatus ? 'Great progress!' : '',
    });
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !user) return;

    setUploading(true);
    const uploadedPaths: string[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${slug}/${Date.now()}_${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('project-submissions')
          .upload(fileName, file);

        if (error) throw error;
        uploadedPaths.push(data.path);
      }

      return uploadedPaths;
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload files. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !session || !submissionTitle.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please provide a title for your submission',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select files to submit',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const filePaths = await handleFileUpload();
      if (!filePaths) throw new Error('File upload failed');

      const { data, error } = await supabase.functions.invoke('submit-project', {
        body: {
          projectSlug: slug,
          submissionTitle: submissionTitle.trim(),
          submissionDescription: submissionDescription.trim(),
          filePaths,
          isPublic: makePublic,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: 'Submission successful!',
        description: makePublic 
          ? 'Your project has been submitted and will be reviewed before appearing in the community showcase.'
          : 'Your project has been submitted for review.',
      });

      // Reset form
      setSubmissionTitle("");
      setSubmissionDescription("");
      setSelectedFiles(null);
      setMakePublic(false);

      // Reload submissions
      loadSubmissions();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: 'Submission failed',
        description: 'Could not submit your project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  const completedMilestones = project.milestones 
    ? project.milestones.filter(m => milestoneProgress[m.id]).length 
    : 0;
  const totalMilestones = project.milestones?.length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Show limit dialog if limit is reached
  if (!canAccess && !isPro && !project.proOnly) {
    return (
      <AuthGate>
        <LimitReachedDialog
          open={limitReached}
          onClose={dismissLimitDialog}
          limitType={limitType}
          currentUsage={usage.projects}
          limit={limits.projects}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Weekly Limit Reached</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You've started {usage.projects} out of {limits.projects} free projects this week.
              </p>
              <Button onClick={() => window.location.href = '/pricing'}>
                Upgrade to Pro for Unlimited Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGate>
    );
  }

  const content = (
    <>
      <LimitReachedDialog
        open={limitReached}
        onClose={dismissLimitDialog}
        limitType={limitType}
        currentUsage={usage.projects}
        limit={limits.projects}
      />
      <div className="h-[calc(100vh-4rem)] overflow-y-auto">
      <Tabs defaultValue="overview" className="h-full">
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  {project.title}
                  {project.proOnly && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Pro
                    </Badge>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyBadge difficulty={project.difficulty} />
                  <Badge variant="secondary">{project.role}</Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.estMinutes} minutes
                  </Badge>
                </div>
              </div>
            </div>

            {project.milestones && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{completedMilestones} / {totalMilestones} milestones</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </div>

          <TabsList className="w-full rounded-none grid grid-cols-5 h-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="starter">Starter Code</TabsTrigger>
            <TabsTrigger value="submit">Submit</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <TabsContent value="overview" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.summary}</p>
                
                {project.detailedRequirements && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Detailed Requirements</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.detailedRequirements}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {project.technicalSpecifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.technicalSpecifications.map((spec, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Learning Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary shrink-0">{idx + 1}.</span>
                      <span className="text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Acceptance Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.acceptanceCriteria.map((criterion, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="mt-0 space-y-4">
            {project.milestones ? (
              project.milestones.map((milestone, idx) => (
                <Card key={milestone.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => toggleMilestone(milestone.id)}
                        >
                          {milestoneProgress[milestone.id] ? (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              Step {idx + 1}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {milestone.estimatedHours}h
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Deliverables:</h4>
                      <ul className="space-y-1">
                        {milestone.deliverables.map((deliverable, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No milestones defined for this project.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="starter" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  Starter Files & Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.starterFiles && project.starterFiles.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Download the starter files to begin your project. These files include the basic structure and boilerplate code to get you started.
                    </p>
                    <div className="space-y-2">
                      {project.starterFiles.map((file) => (
                        <div key={file} className="flex items-center justify-between p-3 border rounded">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {file}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <Button size="lg" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download All Starter Files
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No starter files available for this project.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submit" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Submit Your Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submission-title">Submission Title *</Label>
                  <Input
                    id="submission-title"
                    placeholder="e.g., My Lock-Free Waker Implementation"
                    value={submissionTitle}
                    onChange={(e) => setSubmissionTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submission-description">Description (Optional)</Label>
                  <Textarea
                    id="submission-description"
                    placeholder="Describe your approach, challenges, and key learnings..."
                    rows={4}
                    value={submissionDescription}
                    onChange={(e) => setSubmissionDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Project Files *</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept=".zip,.tar,.gz,.c,.cpp,.h,.hpp,.txt"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your source code, documentation, or a compressed archive (max 50MB)
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <Label htmlFor="make-public">Share with Community</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your submission will be reviewed and may appear in the community showcase
                    </p>
                  </div>
                  <Switch
                    id="make-public"
                    checked={makePublic}
                    onCheckedChange={setMakePublic}
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={submitting || uploading || !submissionTitle.trim() || !selectedFiles}
                >
                  {submitting || uploading ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Project
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="mt-0 space-y-4">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{submission.submission_title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Submitted {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          submission.status === 'approved' ? 'default' :
                          submission.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submission.submission_description && (
                      <p className="text-sm text-muted-foreground">
                        {submission.submission_description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileCode className="w-4 h-4" />
                        {submission.file_paths?.length || 0} files
                      </span>
                      {submission.is_public && (
                        <>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Public
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {submission.community_votes || 0} votes
                          </span>
                        </>
                      )}
                    </div>

                    {submission.admin_feedback && (
                      <div className="p-3 bg-muted rounded space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MessageSquare className="w-4 h-4" />
                          Admin Feedback
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.admin_feedback}
                        </p>
                        {submission.reviewed_at && (
                          <p className="text-xs text-muted-foreground">
                            Reviewed on {new Date(submission.reviewed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">No submissions yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete the project and submit your work to get feedback
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </div>
      </Tabs>
      </div>
    </>
  );

  const gatedContent = project?.proOnly ? <ProGate>{content}</ProGate> : content;
  return <AuthGate>{gatedContent}</AuthGate>;
}
