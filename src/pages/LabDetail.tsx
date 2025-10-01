import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lock, Play, TestTube, Send } from "lucide-react";
import { labs } from "@/data/labs";
import { ProGate } from "@/components/ProGate";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function LabDetail() {
  const { slug } = useParams();
  const lab = labs.find(l => l.slug === slug);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

      toast({
        title: 'Lab completed!',
        description: 'Excellent work! Your patch has been submitted.',
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

  const labContent = (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{lab.title}</h1>
          <DifficultyBadge difficulty={lab.difficulty} />
          <Badge variant="secondary">{lab.bugType}</Badge>
          {lab.proOnly && (
            <Badge variant="outline" className="gap-1">
              <Lock className="w-3 h-3" />
              Pro
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button size="sm" variant="outline">
            <TestTube className="w-4 h-4 mr-2" />
            Test
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Patch'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r overflow-auto">
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{lab.starterCode || "// Code editor placeholder"}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-96 overflow-auto">
          <Tabs defaultValue="task" className="p-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="task">Task</TabsTrigger>
              <TabsTrigger value="sanitizer">Sanitizer</TabsTrigger>
              <TabsTrigger value="fuzzing" disabled={lab.proOnly}>
                Fuzzing {lab.proOnly && <Lock className="w-3 h-3 ml-1" />}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="task" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Lab Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>{lab.summary}</p>
                  <p className="text-muted-foreground">
                    Estimated time: {lab.estMinutes} minutes
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sanitizer">
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  Sanitizer output will appear here after running tests.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="fuzzing">
              <Card>
                <CardContent className="pt-6 text-sm text-muted-foreground">
                  {lab.proOnly ? (
                    <p>Upgrade to Pro to access fuzzing features.</p>
                  ) : (
                    <p>Fuzzing results will appear here.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  const gatedContent = lab.proOnly ? <ProGate>{labContent}</ProGate> : labContent;
  return <AuthGate>{gatedContent}</AuthGate>;
}
