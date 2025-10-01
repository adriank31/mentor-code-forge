import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Play, Clock } from "lucide-react";
import { pathModules } from "@/data/pathModules";
import { paths } from "@/data/paths";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PathLesson() {
  const { slug, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const path = paths.find(p => p.slug === slug);
  const modules = pathModules[slug || ""];
  const module = modules?.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);

  if (!path || !module || !lesson) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Content Not Found</h1>
        <Button onClick={() => navigate(`/paths/${slug}`)}>Back to Path</Button>
      </div>
    );
  }

  // Initialize code with starter if available
  if (code === "" && lesson.content?.code?.starter) {
    setCode(lesson.content.code.starter);
  }

  // Find current lesson index and navigation
  const allLessons = modules.flatMap(m => m.lessons.map(l => ({ moduleId: m.id, lesson: l })));
  const currentIndex = allLessons.findIndex(
    item => item.moduleId === moduleId && item.lesson.id === lessonId
  );
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");

    try {
      // Simulate code execution for now
      // In production, this would call the run-code edge function
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput("Compilation successful!\nProgram output:\nValue: 42\n");
      toast({
        title: "Code executed successfully!",
        description: "Check the output panel for results.",
      });
    } catch (error) {
      setOutput(`Error: ${error}`);
      toast({
        title: "Execution failed",
        description: "Check the output panel for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Lesson completed!",
      description: "Great job! Moving to next lesson.",
    });
    if (nextLesson) {
      navigate(`/paths/${slug}/${nextLesson.moduleId}/${nextLesson.lesson.id}`);
    } else {
      navigate(`/paths/${slug}`);
    }
  };

  const renderLessonContent = () => {
    if (lesson.type === "quiz") {
      return (
        <div className="space-y-6">
          <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-li:text-base prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content?.markdown || ''}
            </ReactMarkdown>
          </div>
          <div className="mt-8">
            <Button onClick={handleComplete} size="lg" className="w-full">
              Complete Quiz
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    if (lesson.content?.code) {
      return (
        <div className="space-y-6">
          <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-li:text-base prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content.markdown || ''}
            </ReactMarkdown>
          </div>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Your Code</CardTitle>
                    <Button onClick={handleRunCode} disabled={isRunning}>
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language={lesson.content.code.language}
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      theme={theme === "dark" ? "vs-dark" : "light"}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-48">
                    {output || "Run your code to see output here..."}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="solution">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Solution Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language={lesson.content.code.language}
                      value={lesson.content.code.solution}
                      theme={theme === "dark" ? "vs-dark" : "light"}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tests">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm">
                    {lesson.content.code.tests || "No tests defined for this lesson."}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    return (
      <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-li:text-base prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.content?.markdown || ''}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(`/paths/${slug}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Path
        </Button>
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          {lesson.duration} min
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{module.title}</span>
              <span className="font-medium">
                Lesson {currentIndex + 1} of {allLessons.length}
              </span>
            </div>
            <Progress value={((currentIndex + 1) / allLessons.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
              <Badge variant={
                lesson.type === "quiz" ? "secondary" :
                lesson.type === "challenge" ? "default" : "outline"
              }>
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderLessonContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => prevLesson && navigate(`/paths/${slug}/${prevLesson.moduleId}/${prevLesson.lesson.id}`)}
          disabled={!prevLesson}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {lesson.type !== "quiz" && lesson.content?.code && (
          <Button onClick={handleComplete} size="lg">
            Complete Lesson
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}

        <Button
          onClick={() => nextLesson ? navigate(`/paths/${slug}/${nextLesson.moduleId}/${nextLesson.lesson.id}`) : navigate(`/paths/${slug}`)}
        >
          {nextLesson ? "Next" : "Finish Path"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
