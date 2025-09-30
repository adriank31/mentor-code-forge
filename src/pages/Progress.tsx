import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Target, TrendingUp, Award, Clock, Code, CheckCircle, Star, Shield, Loader2, FlaskConical, Puzzle, FolderKanban } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { puzzles } from "@/data/puzzles";
import { labs } from "@/data/labs";
import { projects } from "@/data/projects";

interface ActivityItem {
  type: "puzzle" | "lab" | "project";
  slug: string;
  title: string;
  completed_at: string;
}


export default function Progress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [puzzleCount, setPuzzleCount] = useState(0);
  const [labCount, setLabCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch puzzle completions
        const { data: puzzleData, error: puzzleError } = await supabase
          .from("puzzle_completions")
          .select("puzzle_slug, completed_at")
          .eq("user_id", user.id);

        if (puzzleError) throw puzzleError;

        // Fetch lab completions (successful only)
        const { data: labData, error: labError } = await supabase
          .from("lab_completions")
          .select("lab_slug, completed_at")
          .eq("user_id", user.id)
          .eq("success", true);

        if (labError) throw labError;

        // Fetch project completions
        const { data: projectData, error: projectError } = await supabase
          .from("project_completions")
          .select("project_slug, completed_at")
          .eq("user_id", user.id)
          .eq("status", "completed");

        if (projectError) throw projectError;

        setPuzzleCount(puzzleData?.length || 0);
        setLabCount(labData?.length || 0);
        setProjectCount(projectData?.length || 0);

        // Combine all activities for recent feed
        const activities: ActivityItem[] = [
          ...(puzzleData?.map(p => ({
            type: "puzzle" as const,
            slug: p.puzzle_slug,
            title: puzzles.find(pz => pz.slug === p.puzzle_slug)?.title || p.puzzle_slug,
            completed_at: p.completed_at
          })) || []),
          ...(labData?.map(l => ({
            type: "lab" as const,
            slug: l.lab_slug,
            title: labs.find(lb => lb.slug === l.lab_slug)?.title || l.lab_slug,
            completed_at: l.completed_at
          })) || []),
          ...(projectData?.map(pr => ({
            type: "project" as const,
            slug: pr.project_slug,
            title: projects.find(p => p.slug === pr.project_slug)?.title || pr.project_slug,
            completed_at: pr.completed_at
          })) || [])
        ];

        // Sort by date and take last 20
        activities.sort((a, b) => 
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        );
        setRecentActivity(activities.slice(0, 20));

      } catch (error: any) {
        console.error("Error fetching progress:", error);
        toast({
          title: "Error loading progress",
          description: "Could not load your progress data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, toast]);

  const totalCompleted = puzzleCount + labCount + projectCount;
  const puzzleTotal = puzzles.length;
  const labTotal = labs.length;
  const projectTotal = projects.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "puzzle": return Puzzle;
      case "lab": return FlaskConical;
      case "project": return FolderKanban;
      default: return CheckCircle;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Puzzles Completed</p>
                  <p className="text-2xl font-bold">{puzzleCount}</p>
                  <p className="text-xs text-muted-foreground">of {puzzleTotal}</p>
                </div>
                <Puzzle className="h-8 w-8 text-primary" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Labs Completed</p>
                  <p className="text-2xl font-bold">{labCount}</p>
                  <p className="text-xs text-muted-foreground">of {labTotal}</p>
                </div>
                <FlaskConical className="h-8 w-8 text-success" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects Completed</p>
                  <p className="text-2xl font-bold">{projectCount}</p>
                  <p className="text-xs text-muted-foreground">of {projectTotal}</p>
                </div>
                <FolderKanban className="h-8 w-8 text-warning" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Completion Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Completion Progress
              </CardTitle>
              <CardDescription>
                Your progress across all content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Puzzles</span>
                      <span className="text-sm text-muted-foreground">
                        {puzzleCount}/{puzzleTotal}
                      </span>
                    </div>
                    <ProgressBar value={(puzzleCount / puzzleTotal) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Labs</span>
                      <span className="text-sm text-muted-foreground">
                        {labCount}/{labTotal}
                      </span>
                    </div>
                    <ProgressBar value={(labCount / labTotal) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Projects</span>
                      <span className="text-sm text-muted-foreground">
                        {projectCount}/{projectTotal}
                      </span>
                    </div>
                    <ProgressBar value={(projectCount / projectTotal) * 100} className="h-2" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent completions (last 20 items)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activity yet. Start completing puzzles, labs, and projects!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = getIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-surface">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{activity.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                            <span>{formatDate(activity.completed_at)}</span>
                          </div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certificates
              </CardTitle>
              <CardDescription>
                Earn certificates by completing learning paths and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Certificates coming soon! Keep completing content to unlock achievements.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}