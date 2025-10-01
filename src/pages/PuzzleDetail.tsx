import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lightbulb, Clock, CheckCircle2, RotateCcw, Play, Save } from "lucide-react";
import { puzzles } from "@/data/puzzles";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthGate } from "@/components/AuthGate";
import { RunResult } from "@/components/RunResult";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { getDefaultSource, storageKey, debouncedSave, type Language } from "@/lib/editor";
import Editor from "@monaco-editor/react";

export default function PuzzleDetail() {
  const { slug } = useParams();
  const puzzle = puzzles.find(p => p.slug === slug);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState<Language>('cpp');
  const [code, setCode] = useState('');
  const [runResult, setRunResult] = useState<any>(null);
  const [saved, setSaved] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load code from localStorage on mount
  useEffect(() => {
    if (!slug) return;
    const key = storageKey({ slug, userId: user?.id || null, lang: language });
    const savedCode = localStorage.getItem(key);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(getDefaultSource(language, slug));
    }
  }, [slug, user?.id, language]);

  // Save code to localStorage when it changes
  useEffect(() => {
    if (!slug || !code) return;
    setSaved(false);
    const key = storageKey({ slug, userId: user?.id || null, lang: language });
    debouncedSave(key, code);
    const timer = setTimeout(() => setSaved(true), 500);
    return () => clearTimeout(timer);
  }, [code, slug, user?.id, language]);

  const handleReset = () => {
    if (!slug) return;
    const defaultCode = getDefaultSource(language, slug);
    setCode(defaultCode);
    const key = storageKey({ slug, userId: user?.id || null, lang: language });
    localStorage.setItem(key, defaultCode);
    toast({ title: 'Code reset', description: 'Editor restored to template' });
  };

  const handleRun = async () => {
    if (!user || !slug) return;
    
    setRunning(true);
    setRunResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('run-code', {
        body: { language, source: code, puzzleSlug: slug }
      });

      if (error) throw error;

      setRunResult(data);
    } catch (error) {
      console.error('Error running code:', error);
      toast({
        title: 'Runner unavailable',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setRunning(false);
    }
  };

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
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
            <div>
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
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Code Editor */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <AuthGate>
            <div className="h-full flex flex-col bg-background">
              {/* Toolbar */}
              <div className="border-b p-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={language === 'c' ? 'default' : 'outline'}
                    onClick={() => setLanguage('c')}
                  >
                    C
                  </Button>
                  <Button
                    size="sm"
                    variant={language === 'cpp' ? 'default' : 'outline'}
                    onClick={() => setLanguage('cpp')}
                  >
                    C++
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                  <Button size="sm" onClick={handleRun} disabled={running}>
                    {running ? (
                      <>Running...</>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleMarkComplete} disabled={loading}>
                    {loading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language={language === 'c' ? 'c' : 'cpp'}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  loading={<Skeleton className="w-full h-full" />}
                />
              </div>

              {/* Results Panel */}
              {runResult && (
                <div className="border-t max-h-[300px] overflow-y-auto">
                  <RunResult
                    stdout={runResult.stdout}
                    stderr={runResult.stderr}
                    exitCode={runResult.exitCode}
                    timedOut={runResult.timedOut}
                  />
                </div>
              )}
            </div>
          </AuthGate>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
