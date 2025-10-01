import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Play, Clock, XCircle, AlertCircle } from "lucide-react";
import { pathModules, type QuizQuestion } from "@/data/pathModules";
import { paths } from "@/data/paths";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PathLesson() {
  const { slug, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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

  const handleQuizSubmit = () => {
    if (!lesson.content?.quiz) return;

    let correct = 0;
    lesson.content.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    setQuizScore(correct);
    setShowQuizResults(true);

    const percentage = (correct / lesson.content.quiz.length) * 100;
    if (percentage >= 70) {
      toast({
        title: "Great job! 🎉",
        description: `You scored ${correct}/${lesson.content.quiz.length}. Moving to next lesson.`,
      });
      setTimeout(() => {
        handleComplete();
      }, 3000);
    } else {
      toast({
        title: "Keep trying!",
        description: `You scored ${correct}/${lesson.content.quiz.length}. Review the material and try again.`,
        variant: "destructive",
      });
    }
  };

  const renderLessonContent = () => {
    if (lesson.type === "quiz" && lesson.content?.quiz) {
      return (
        <div className="space-y-8 animate-fade-in">
          {/* Quiz Introduction */}
          <div className="bg-gradient-surface border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Test Your Knowledge</h3>
            <p className="text-muted-foreground leading-relaxed">
              Answer the questions below to check your understanding of the material. 
              You need at least 70% to pass and continue.
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {lesson.content.quiz.map((question, qIndex) => {
              const isAnswered = quizAnswers[qIndex] !== undefined;
              const isCorrect = showQuizResults && quizAnswers[qIndex] === question.correctAnswer;
              const isWrong = showQuizResults && quizAnswers[qIndex] !== question.correctAnswer;

              return (
                <Card 
                  key={qIndex} 
                  className={cn(
                    "transition-all duration-300",
                    isCorrect && "border-green-500/50 bg-green-500/5",
                    isWrong && "border-red-500/50 bg-red-500/5"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-semibold text-primary">{qIndex + 1}</span>
                      </div>
                      <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const optionKey = String.fromCharCode(97 + oIndex); // a, b, c, d
                      const isSelected = quizAnswers[qIndex] === optionKey;
                      const isCorrectOption = showQuizResults && optionKey === question.correctAnswer;
                      const isWrongSelected = showQuizResults && isSelected && optionKey !== question.correctAnswer;

                      return (
                        <button
                          key={oIndex}
                          onClick={() => !showQuizResults && setQuizAnswers({ ...quizAnswers, [qIndex]: optionKey })}
                          disabled={showQuizResults}
                          className={cn(
                            "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                            "hover:border-primary/50 hover:bg-accent/50",
                            isSelected && !showQuizResults && "border-primary bg-primary/10",
                            isCorrectOption && "border-green-500 bg-green-500/10",
                            isWrongSelected && "border-red-500 bg-red-500/10",
                            !isSelected && !showQuizResults && "border-border bg-card"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                              isSelected && !showQuizResults && "border-primary bg-primary text-primary-foreground",
                              isCorrectOption && "border-green-500 bg-green-500 text-white",
                              isWrongSelected && "border-red-500 bg-red-500 text-white",
                              !isSelected && !showQuizResults && "border-muted-foreground/30"
                            )}>
                              {isCorrectOption && <CheckCircle2 className="w-4 h-4" />}
                              {isWrongSelected && <XCircle className="w-4 h-4" />}
                              {!showQuizResults && isSelected && <CheckCircle2 className="w-4 h-4" />}
                              {!showQuizResults && !isSelected && <span className="text-xs font-medium">{optionKey}</span>}
                            </div>
                            <span className="text-base leading-relaxed">{option}</span>
                          </div>
                        </button>
                      );
                    })}

                    {/* Show explanation after submission */}
                    {showQuizResults && question.explanation && (
                      <Alert className="mt-4 border-primary/50 bg-primary/5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm leading-relaxed">
                          <strong>Explanation:</strong> {question.explanation}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Submit/Results */}
          {!showQuizResults ? (
            <Button 
              onClick={handleQuizSubmit} 
              size="lg" 
              className="w-full"
              disabled={Object.keys(quizAnswers).length !== lesson.content.quiz.length}
            >
              Submit Quiz
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Card className="border-primary/50 bg-gradient-surface">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-2">
                  Quiz Complete!
                </h3>
                <p className="text-3xl font-bold text-primary mb-4">
                  {quizScore} / {lesson.content.quiz.length}
                </p>
                <p className="text-muted-foreground mb-6">
                  {((quizScore / lesson.content.quiz.length) * 100).toFixed(0)}% Score
                </p>
                {((quizScore / lesson.content.quiz.length) * 100) >= 70 ? (
                  <p className="text-green-500 font-medium">
                    Excellent! Moving to the next lesson...
                  </p>
                ) : (
                  <Button onClick={() => {
                    setShowQuizResults(false);
                    setQuizAnswers({});
                  }}>
                    Try Again
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (lesson.content?.code) {
      return (
        <div className="space-y-8 animate-fade-in">
          {/* Lesson Content with Better Typography */}
          <div className="prose prose-lg prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:leading-tight
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:leading-snug
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-p:text-foreground/90
            prose-li:text-base prose-li:leading-relaxed prose-li:mb-2
            prose-ul:my-6 prose-ol:my-6
            prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-lg
            prose-strong:text-foreground prose-strong:font-semibold">
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
      <div className="animate-fade-in prose prose-lg prose-invert max-w-none 
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:leading-tight
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:leading-snug
        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-base prose-p:leading-relaxed prose-p:mb-6 prose-p:text-foreground/90
        prose-li:text-base prose-li:leading-relaxed prose-li:mb-2
        prose-ul:my-6 prose-ol:my-6
        prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-lg
        prose-strong:text-foreground prose-strong:font-semibold">
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
