import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lock, BookOpen, Clock } from "lucide-react";
import { paths } from "@/data/paths";

export default function PathDetail() {
  const { slug } = useParams();
  const path = paths.find(p => p.slug === slug);

  if (!path) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Path Not Found</h1>
        <p className="text-muted-foreground">The learning path you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                {path.title}
                {path.proOnly && <Lock className="w-6 h-6 text-muted-foreground" />}
              </CardTitle>
              <p className="text-muted-foreground">{path.summary}</p>
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
        <CardContent>
          <Button size="lg">Continue Path</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Modules</h2>
        {Array.from({ length: path.modules }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">Module {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Module content placeholder</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
