import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { 
  Lightbulb, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Save, 
  Lock,
  TestTube,
  Target,
  Code2,
  Eye
} from "lucide-react";
import { labs } from "@/data/labs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthGate } from "@/components/AuthGate";
import { ProGate } from "@/components/ProGate";
import { RunResult } from "@/components/RunResult";
import { LimitReachedDialog } from "@/components/LimitReachedDialog";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Editor from "@monaco-editor/react";

export default function LabDetail() {
  const { slug } = useParams();
  const lab = labs.find(l => l.slug === slug);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [testing, setTesting] = useState(false);
  const [code, setCode] = useState('');
  const [runResult, setRunResult] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [saved, setSaved] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkLimit, incrementUsage, limitReached, limitType, dismissLimitDialog, usage, limits, isPro } = useUsageLimits();
  const [canAccess, setCanAccess] = useState(true);

  // Check limit on mount for free users
  useEffect(() => {
    if (user && !isPro && !lab?.proOnly) {
      const hasAccess = checkLimit('labs');
      setCanAccess(hasAccess);
    }
  }, [user, isPro, lab?.proOnly]);

  // Load code from localStorage on mount
  useEffect(() => {
    if (!slug) return;
    const storageKey = `curecee:lab:${slug}:${user?.id || 'anon'}`;
    const savedCode = localStorage.getItem(storageKey);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(lab?.starterCode || '');
    }
  }, [slug, user?.id, lab?.starterCode]);

  // Save code to localStorage when it changes
  useEffect(() => {
    if (!slug || !code) return;
    setSaved(false);
    const storageKey = `curecee:lab:${slug}:${user?.id || 'anon'}`;
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, code);
      setSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, slug, user?.id]);

  const handleReset = () => {
    if (!lab?.starterCode) return;
    setCode(lab.starterCode);
    const storageKey = `curecee:lab:${slug}:${user?.id || 'anon'}`;
    localStorage.setItem(storageKey, lab.starterCode);
    toast({ title: 'Code reset', description: 'Editor restored to starter code' });
  };

  const handleRun = async () => {
    if (!user || !slug) return;
    
    setRunning(true);
    setRunResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('run-code', {
        body: { language: 'c', source: code, puzzleSlug: slug }
      });

      if (error) throw error;

      setRunResult(data);
      
      if (data.exitCode === 0) {
        toast({
          title: 'Code executed successfully',
          description: 'Check the output below',
        });
      }
    } catch (error) {
      console.error('Error running code:', error);
      toast({
        title: 'Execution failed',
        description: 'Could not run your code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRunning(false);
    }
  };

  const handleTest = async () => {
    if (!user || !slug) return;
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('run-code', {
        body: { language: 'c', source: code, puzzleSlug: slug }
      });

      if (error) throw error;

      setTestResult(data);
      
      // Simple auto-grading based on exit code and output
      const passed = data.exitCode === 0 && !data.stderr;
      
      toast({
        title: passed ? 'Tests passed!' : 'Tests failed',
        description: passed 
          ? 'Your solution looks good. Review the checklist and submit when ready.' 
          : 'Check the errors and try again.',
        variant: passed ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error testing code:', error);
      toast({
        title: 'Test failed',
        description: 'Could not test your code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit your work',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke('record-lab-completion', {
        body: { labSlug: slug, success: true },
        headers: {
          Authorization: `Bearer ${session.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Increment usage for free users
      if (!isPro) {
        await incrementUsage('labs');
      }

      toast({
        title: 'Lab completed!',
        description: 'Excellent work! Your solution has been submitted.',
      });
    } catch (error) {
      console.error('Error submitting lab:', error);
      toast({
        title: 'Submission failed',
        description: 'Could not submit your work. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!lab) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Lab Not Found</h1>
        <p className="text-muted-foreground">The lab you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Show limit dialog if limit is reached
  if (!canAccess && !isPro && !lab.proOnly) {
    return (
      <AuthGate>
        <LimitReachedDialog
          open={limitReached}
          onClose={dismissLimitDialog}
          limitType={limitType}
          currentUsage={usage.labs}
          limit={limits.labs}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Weekly Limit Reached</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You've used {usage.labs} out of {limits.labs} free lab exercises this week.
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

  const editorContent = (
    <>
      <LimitReachedDialog
        open={limitReached}
        onClose={dismissLimitDialog}
        limitType={limitType}
        currentUsage={usage.labs}
        limit={limits.labs}
      />
      <div className="h-[calc(100vh-4rem)] flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Instructions & Guides */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full overflow-y-auto">
            <Tabs defaultValue="instructions" className="h-full">
              <div className="border-b px-4 pt-4">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="hints">Hints</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 md:p-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{lab.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <DifficultyBadge difficulty={lab.difficulty} />
                    <Badge variant="secondary">{lab.bugType}</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {lab.estMinutes} min
                    </Badge>
                    {lab.proOnly && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="w-3 h-3" />
                        Pro
                      </Badge>
                    )}
                  </div>
                </div>

                <TabsContent value="instructions" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lab Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{lab.summary}</p>
                      
                      {lab.detailedInstructions && (
                        <>
                          <Separator />
                          <div className="space-y-3 text-sm">
                            {lab.detailedInstructions.split('\n\n').map((para, idx) => (
                              <p key={idx} className="text-muted-foreground leading-relaxed">{para}</p>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {lab.expectedBehavior && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Expected Behavior
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{lab.expectedBehavior}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="objectives" className="space-y-4 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Learning Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lab.objectives && lab.objectives.length > 0 ? (
                        <ul className="space-y-3">
                          {lab.objectives.map((objective, idx) => (
                            <li key={idx} className="flex gap-3 text-sm">
                              <span className="font-semibold text-primary shrink-0">{idx + 1}.</span>
                              <span className="text-muted-foreground">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Complete this lab to understand and fix the {lab.bugType.toLowerCase()} vulnerability.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {lab.testCriteria && lab.testCriteria.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="w-4 h-4" />
                          Completion Criteria
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {lab.testCriteria.map((criteria, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-sm">
                              <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="hints" className="mt-0">
                  <Collapsible open={hintsOpen} onOpenChange={setHintsOpen}>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Lightbulb className="w-5 h-5" />
                              Hints (Click to reveal)
                            </CardTitle>
                            {lab.hints && (
                              <Badge variant="secondary">{lab.hints.length} hints</Badge>
                            )}
                          </div>
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent>
                          {lab.hints && lab.hints.length > 0 ? (
                            <ul className="space-y-3">
                              {lab.hints.map((hint, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                  <span className="font-semibold text-foreground shrink-0">{idx + 1}.</span>
                                  <span className="text-muted-foreground">{hint}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No hints available for this lab. Try experimenting with different approaches!
                            </p>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </TabsContent>

                <TabsContent value="solution" className="mt-0">
                  <Collapsible open={solutionOpen} onOpenChange={setSolutionOpen}>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Eye className="w-5 h-5" />
                              Sample Solution (Spoiler!)
                            </CardTitle>
                            <Badge variant="outline">Click to reveal</Badge>
                          </div>
                        </CollapsibleTrigger>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent>
                          {lab.solutionCode ? (
                            <>
                              <p className="text-sm text-muted-foreground mb-4">
                                This is one possible solution. Your implementation may vary.
                              </p>
                              <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
                                <code>{lab.solutionCode}</code>
                              </pre>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Solution not available yet. Try working through the hints first!
                            </p>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </TabsContent>
              </div>
            </Tabs>
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
                  <Badge variant="outline" className="gap-1">
                    <Code2 className="w-3 h-3" />
                    C/C++ Editor
                  </Badge>
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
                  <Button size="sm" variant="outline" onClick={handleRun} disabled={running}>
                    {running ? (
                      <>Running...</>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleTest} disabled={testing}>
                    {testing ? (
                      <>Testing...</>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-1" />
                        Test
                      </>
                    )}
                  </Button>
                  <Button size="sm" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language="c"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                  }}
                  loading={<Skeleton className="w-full h-full" />}
                />
              </div>

              {/* Results Panel */}
              {(runResult || testResult) && (
                <div className="border-t">
                  <Tabs defaultValue={testResult ? "test" : "run"} className="w-full">
                    <TabsList className="w-full rounded-none h-10 px-3">
                      {runResult && <TabsTrigger value="run">Run Output</TabsTrigger>}
                      {testResult && <TabsTrigger value="test">Test Results</TabsTrigger>}
                    </TabsList>
                    {runResult && (
                      <TabsContent value="run" className="mt-0 max-h-[250px] overflow-y-auto">
                        <RunResult
                          stdout={runResult.stdout}
                          stderr={runResult.stderr}
                          exitCode={runResult.exitCode}
                          timedOut={runResult.timedOut}
                        />
                      </TabsContent>
                    )}
                    {testResult && (
                      <TabsContent value="test" className="mt-0 max-h-[250px] overflow-y-auto">
                        <RunResult
                          stdout={testResult.stdout}
                          stderr={testResult.stderr}
                          exitCode={testResult.exitCode}
                          timedOut={testResult.timedOut}
                        />
                      </TabsContent>
                    )}
                  </Tabs>
                </div>
              )}
            </div>
          </AuthGate>
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </>
  );

  const gatedContent = lab.proOnly ? <ProGate>{editorContent}</ProGate> : editorContent;
  return <AuthGate>{gatedContent}</AuthGate>;
}
