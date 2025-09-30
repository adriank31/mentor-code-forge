import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lightbulb, Play, Clock, CheckCircle2 } from "lucide-react";
import { puzzles } from "@/data/puzzles";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function PuzzleDetail() {
  const { slug } = useParams();
  const puzzle = puzzles.find(p => p.slug === slug);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleMarkComplete = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to track your progress',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('record-puzzle-completion', {
        body: { puzzleSlug: slug }
      });

      if (error) throw error;

      toast({
        title: 'Puzzle completed!',
        description: 'Great work! Your progress has been saved.',
      });
    } catch (error) {
      console.error('Error recording completion:', error);
      toast({
        title: 'Error',
        description: 'Could not save your progress. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!puzzle) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Puzzle Not Found</h1>
        <p className="text-muted-foreground">The puzzle you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{puzzle.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <DifficultyBadge difficulty={puzzle.difficulty} />
            <Badge variant="secondary">{puzzle.category}</Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {puzzle.estMinutes} min
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{puzzle.description}</p>
          
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {puzzle.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {puzzle.sampleInput && puzzle.sampleOutput && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Input/Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-1">Input:</h4>
              <pre className="bg-muted p-3 rounded text-sm font-mono">{puzzle.sampleInput}</pre>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Output:</h4>
              <pre className="bg-muted p-3 rounded text-sm font-mono">{puzzle.sampleOutput}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Collapsible open={hintsOpen} onOpenChange={setHintsOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Hints (Click to reveal)
                </CardTitle>
                <Badge variant="secondary">{puzzle.hints.length} hints</Badge>
              </div>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <ul className="space-y-2">
                {puzzle.hints.map((hint, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{idx + 1}.</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1" onClick={handleMarkComplete} disabled={loading}>
          {loading ? (
            <>Saving...</>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark Complete
            </>
          )}
        </Button>
        <Button size="lg" variant="outline">
          <Play className="w-4 h-4 mr-2" />
          Try in Playground
        </Button>
      </div>
    </div>
  );
}
