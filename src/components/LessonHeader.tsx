import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface LessonHeaderProps {
  title: string;
  type: "lesson" | "quiz" | "challenge";
  completed?: boolean;
  score?: number;
}

export function LessonHeader({ title, type, completed, score }: LessonHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {completed && (
          <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge 
          variant={
            type === "quiz" ? "secondary" :
            type === "challenge" ? "default" : "outline"
          } 
          className="text-sm px-3 py-1"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        {score !== undefined && (
          <Badge variant="outline" className="text-sm px-3 py-1">
            Score: {score}%
          </Badge>
        )}
      </div>
    </div>
  );
}
