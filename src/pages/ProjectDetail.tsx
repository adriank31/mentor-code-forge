import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lock, Play, CheckCircle } from "lucide-react";
import { projects } from "@/data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start justify-between">
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
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <DifficultyBadge difficulty={project.difficulty} />
            <Badge variant="secondary">{project.role}</Badge>
            <Badge variant="outline">{project.estMinutes} minutes</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{project.summary}</p>
          
          <div>
            <h3 className="font-semibold mb-2">Learning Outcomes</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {project.outcomes.map((outcome, idx) => (
                <li key={idx}>{outcome}</li>
              ))}
            </ul>
          </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Acceptance Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {project.acceptanceCriteria.map((criterion, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <CheckCircle className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {project.starterFiles && project.starterFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Starter Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.starterFiles.map((file) => (
                <Badge key={file} variant="secondary" className="font-mono text-xs">
                  {file}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button size="lg" className="flex-1">
          <Play className="w-4 h-4 mr-2" />
          Open Starter
        </Button>
        <Button size="lg" variant="outline" className="flex-1">
          Mark In Progress
        </Button>
        <Button size="lg" variant="outline" className="flex-1">
          Mark Complete
        </Button>
      </div>
    </div>
  );
}
