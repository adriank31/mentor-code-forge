import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    className: "bg-difficulty-beginner/10 text-difficulty-beginner border-difficulty-beginner/20 hover:bg-difficulty-beginner/20",
  },
  intermediate: {
    label: "Intermediate", 
    className: "bg-difficulty-intermediate/10 text-difficulty-intermediate border-difficulty-intermediate/20 hover:bg-difficulty-intermediate/20",
  },
  advanced: {
    label: "Advanced",
    className: "bg-difficulty-advanced/10 text-difficulty-advanced border-difficulty-advanced/20 hover:bg-difficulty-advanced/20",
  },
  expert: {
    label: "Expert",
    className: "bg-difficulty-expert/10 text-difficulty-expert border-difficulty-expert/20 hover:bg-difficulty-expert/20",
  },
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full border transition-colors",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}