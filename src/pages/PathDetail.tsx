import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lock, BookOpen, Clock, CheckCircle2, Circle, PlayCircle, Award } from "lucide-react";
import { paths } from "@/data/paths";
import { pathModules } from "@/data/pathModules";
import { ProGate } from "@/components/ProGate";
import { AuthGate } from "@/components/AuthGate";
import { Separator } from "@/components/ui/separator";

export default function PathDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const path = paths.find(p => p.slug === slug);
  const modules = pathModules[slug || ""];

  if (!path) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Path Not Found</h1>
        <p className="text-muted-foreground">The learning path you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Calculate progress (mock for now - would come from Supabase in production)
  const completedLessons = 0;
  const totalLessons = modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleStartPath = () => {
    if (modules && modules.length > 0 && modules[0].lessons.length > 0) {
      navigate(`/paths/${slug}/${modules[0].id}/${modules[0].lessons[0].id}`);
    }
  };

  const content = (
    <div className="p-4 md:p-6 space-y-6">
      {/* Path Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                {path.title}
                {path.proOnly && <Lock className="w-6 h-6 text-primary" />}
              </CardTitle>
              <CardDescription className="text-base">{path.summary}</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <DifficultyBadge difficulty={path.difficulty} />
            <Badge variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              {path.modules} modules
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              ~{Math.floor(path.estMinutes / 60)}h
            </Badge>
            {path.proOnly && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="w-3 h-3" />
                Pro Only
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="font-medium">{completedLessons} / {totalLessons} lessons completed</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="flex gap-3">
            <Button size="lg" onClick={handleStartPath} disabled={!modules || modules.length === 0}>
              <PlayCircle className="w-4 h-4 mr-2" />
              {progressPercent > 0 ? "Continue Path" : "Start Learning"}
            </Button>
            <Button size="lg" variant="outline">
              <Award className="w-4 h-4 mr-2" />
              View Badge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Curriculum</CardTitle>
          <CardDescription>
            Interactive lessons, hands-on coding challenges, and quizzes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!modules || modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Content Coming Soon</p>
              <p className="text-sm">
                This learning path curriculum is being developed. Check back soon!
              </p>
            </div>
          ) : (
            modules.map((module, moduleIndex) => (
              <div key={module.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold text-primary">{moduleIndex + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{module.description}</p>

                    {/* Lessons */}
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = false; // Would check from Supabase
                        const isLocked = lessonIndex > 0 && !isCompleted; // Sequential unlock

                        return (
                          <Button
                            key={lesson.id}
                            variant="ghost"
                            className="w-full justify-start h-auto py-3 px-4 hover:bg-accent/50"
                            onClick={() => !isLocked && navigate(`/paths/${slug}/${module.id}/${lesson.id}`)}
                            disabled={isLocked}
                          >
                            <div className="flex items-center gap-3 w-full">
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 text-left">
                                <div className="font-medium">{lesson.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                  <Badge variant={
                                    lesson.type === "quiz" ? "secondary" :
                                    lesson.type === "challenge" ? "default" : "outline"
                                  } className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.duration} min
                                  </span>
                                </div>
                              </div>
                              {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {moduleIndex < modules.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Badge Preview */}
      <Card className="bg-gradient-surface">
        <CardContent className="p-6 text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-bold mb-2">Earn Your Badge</h3>
          <p className="text-muted-foreground mb-4">
            Complete all modules to earn the <strong>{path.title}</strong> badge and showcase your skills!
          </p>
          <Badge variant="secondary" className="text-sm">
            Badge of Completion
          </Badge>
        </CardContent>
      </Card>
    </div>
  );

  const gatedContent = path.proOnly ? <ProGate>{content}</ProGate> : content;
  return <AuthGate>{gatedContent}</AuthGate>;
}
