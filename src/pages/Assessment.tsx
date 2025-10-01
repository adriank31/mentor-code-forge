import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronRight, Award, Target, Code, Wrench, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/data/paths";
import { projects } from "@/data/projects";
import { labs } from "@/data/labs";
import { puzzles } from "@/data/puzzles";
import { DifficultyBadge } from "@/components/DifficultyBadge";

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: "experience",
    question: "What's your overall experience with C/C++ programming?",
    options: [
      { value: "beginner", label: "Beginner - New to C/C++, learning syntax and basics", score: 1 },
      { value: "intermediate", label: "Intermediate - Comfortable with basics, built some programs", score: 5 },
      { value: "advanced", label: "Advanced - Professional experience with complex systems", score: 10 }
    ]
  },
  {
    id: "memory",
    question: "How comfortable are you with manual memory management?",
    options: [
      { value: "novice", label: "Novice - Still learning malloc/free and pointers", score: 1 },
      { value: "familiar", label: "Familiar - Can manage memory but occasionally make mistakes", score: 4 },
      { value: "expert", label: "Expert - Deeply understand ownership, lifetimes, and edge cases", score: 9 }
    ]
  },
  {
    id: "debugging",
    question: "What's your experience with debugging and security tools?",
    options: [
      { value: "basic", label: "Basic - Mainly use print statements for debugging", score: 1 },
      { value: "tools", label: "Intermediate - Used gdb, valgrind, or similar tools", score: 5 },
      { value: "advanced", label: "Advanced - Proficient with sanitizers, fuzzers, and security analysis", score: 10 }
    ]
  },
  {
    id: "concurrency",
    question: "What's your experience with multithreading and concurrency?",
    options: [
      { value: "none", label: "None - Haven't worked with threads or parallel programming", score: 0 },
      { value: "basic", label: "Basic - Created threads but unsure about synchronization", score: 4 },
      { value: "experienced", label: "Experienced - Understand race conditions, atomics, and locks", score: 10 }
    ]
  },
  {
    id: "security",
    question: "How familiar are you with security vulnerabilities in C/C++?",
    options: [
      { value: "aware", label: "Aware - Heard about buffer overflows and basic issues", score: 1 },
      { value: "knowledgeable", label: "Knowledgeable - Know common vulnerabilities and some mitigations", score: 5 },
      { value: "expert", label: "Expert - Experience finding, exploiting, and fixing security bugs", score: 10 }
    ]
  },
  {
    id: "goals",
    question: "What's your primary learning goal?",
    options: [
      { value: "fundamentals", label: "Master the fundamentals and write safe code", score: 0 },
      { value: "realworld", label: "Build real-world systems and tackle practical problems", score: 5 },
      { value: "advanced", label: "Master advanced topics like concurrency and security", score: 10 }
    ]
  }
];

export default function Assessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => prev - 1);
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(opt => opt.value === answer);
      if (option) totalScore += option.score;
    });
    return totalScore;
  };

  const getRecommendations = () => {
    const score = calculateScore();
    const maxScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0);
    const percentage = (score / maxScore) * 100;

    // Determine skill level
    const level = percentage < 35 ? "Beginner" : percentage < 65 ? "Intermediate" : "Advanced";

    // Recommend one path
    let recommendedPath;
    if (percentage < 35) {
      recommendedPath = paths.find(p => p.slug === "foundations-safe-basics");
    } else if (percentage < 65) {
      const securityAnswer = answers.security || "";
      const securityScore = questions.find(q => q.id === "security")?.options.find(o => o.value === securityAnswer)?.score || 0;
      const targetSlug = securityScore > 5 ? "memory-and-lifetimes" : "file-parsing-and-robust-io";
      recommendedPath = paths.find(p => p.slug === targetSlug);
    } else {
      const concurrencyAnswer = answers.concurrency || "";
      const securityAnswer = answers.security || "";
      const concurrencyScore = questions.find(q => q.id === "concurrency")?.options.find(o => o.value === concurrencyAnswer)?.score || 0;
      const securityScore = questions.find(q => q.id === "security")?.options.find(o => o.value === securityAnswer)?.score || 0;
      
      if (concurrencyScore >= 8) {
        recommendedPath = paths.find(p => p.slug === "concurrency-and-race-freedom");
      } else if (securityScore >= 8) {
        recommendedPath = paths.find(p => p.slug === "hardening-and-fuzzing");
      } else {
        recommendedPath = paths.find(p => p.slug === "memory-and-lifetimes");
      }
    }

    // Recommend one lab based on level
    let recommendedLab;
    if (percentage < 35) {
      recommendedLab = labs.find(l => l.slug === "buffer-overflow-strcpy");
    } else if (percentage < 65) {
      const securityAnswer = answers.security || "";
      const securityInterest = questions.find(q => q.id === "security")?.options.find(o => o.value === securityAnswer)?.score || 0;
      const targetLabSlug = securityInterest > 5 ? "use-after-free" : "null-pointer-deref";
      recommendedLab = labs.find(l => l.slug === targetLabSlug);
    } else {
      const concurrencyAnswer = answers.concurrency || "";
      const concurrencyInterest = questions.find(q => q.id === "concurrency")?.options.find(o => o.value === concurrencyAnswer)?.score || 0;
      const advancedLabSlug = concurrencyInterest >= 8 ? "race-condition-counter" : "integer-overflow-allocation";
      recommendedLab = labs.find(l => l.slug === advancedLabSlug);
    }

    // Recommend one project based on level and interests
    let recommendedProject;
    if (percentage < 35) {
      recommendedProject = projects.find(p => p.difficulty === "intermediate" && !p.proOnly);
    } else if (percentage < 65) {
      const goalsAnswer = answers.goals || "";
      recommendedProject = projects.find(p => 
        p.difficulty === "intermediate" && 
        (goalsAnswer === "realworld" ? p.role === "Embedded" : p.role === "Firmware")
      ) || projects.find(p => p.difficulty === "intermediate");
    } else {
      const concurrencyAnswer = answers.concurrency || "";
      const securityAnswer = answers.security || "";
      const concurrencyInterest = questions.find(q => q.id === "concurrency")?.options.find(o => o.value === concurrencyAnswer)?.score || 0;
      const securityInterest = questions.find(q => q.id === "security")?.options.find(o => o.value === securityAnswer)?.score || 0;
      
      if (concurrencyInterest >= 8) {
        recommendedProject = projects.find(p => p.slug === "atomic-waker");
      } else if (securityInterest >= 8) {
        recommendedProject = projects.find(p => p.slug === "privilege-escalation-sim");
      } else {
        recommendedProject = projects.find(p => p.difficulty === "advanced" && p.proOnly);
      }
    }

    // Recommend one puzzle based on category preference
    let recommendedPuzzle;
    const securityAnswerPuzzle = answers.security || "";
    const memoryAnswerPuzzle = answers.memory || "";
    const securityInterest = questions.find(q => q.id === "security")?.options.find(o => o.value === securityAnswerPuzzle)?.score || 0;
    const memoryInterest = questions.find(q => q.id === "memory")?.options.find(o => o.value === memoryAnswerPuzzle)?.score || 0;
    
    if (percentage < 35) {
      recommendedPuzzle = puzzles.find(p => p.difficulty === "beginner");
    } else if (securityInterest > 7) {
      recommendedPuzzle = puzzles.find(p => p.category === "Cybersecurity Engineering" && p.difficulty !== "advanced");
    } else if (memoryInterest > 7) {
      recommendedPuzzle = puzzles.find(p => p.category === "Systems Programming" && p.difficulty === "intermediate");
    } else {
      recommendedPuzzle = puzzles.find(p => p.difficulty === "intermediate" && p.category === "Embedded Systems");
    }

    return {
      score,
      maxScore,
      percentage,
      level,
      path: recommendedPath,
      lab: recommendedLab,
      project: recommendedProject,
      puzzle: recommendedPuzzle
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const canProceed = answers[currentQ?.id];

  if (showResults) {
    const results = getRecommendations();
    
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/paths")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Paths
        </Button>

        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-10 h-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Assessment Complete!</CardTitle>
            <CardDescription className="text-lg">
              Your skill level: <Badge variant="default" className="ml-2">{results.level}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center pb-6 border-b">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.score} / {results.maxScore}
              </div>
              <p className="text-muted-foreground">Total Score</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Learning Path */}
              {results.path && (
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Recommended Learning Path</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{results.path.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{results.path.summary}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <DifficultyBadge difficulty={results.path.difficulty} />
                        <Badge variant="outline" className="text-xs">{results.path.modules} modules</Badge>
                        <Badge variant="outline" className="text-xs">{results.path.estMinutes} min</Badge>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => navigate(`/paths/${results.path.slug}`)}>
                      <Target className="w-4 h-4 mr-2" />
                      Start This Path
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Lab */}
              {results.lab && (
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Recommended Lab</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{results.lab.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{results.lab.summary}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <DifficultyBadge difficulty={results.lab.difficulty} />
                        <Badge variant="secondary" className="text-xs">{results.lab.bugType}</Badge>
                        <Badge variant="outline" className="text-xs">{results.lab.estMinutes} min</Badge>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => navigate(`/labs/${results.lab.slug}`)}>
                      Start Lab
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Project */}
              {results.project && (
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Recommended Project</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{results.project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{results.project.summary}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <DifficultyBadge difficulty={results.project.difficulty} />
                        <Badge variant="secondary" className="text-xs">{results.project.role}</Badge>
                        <Badge variant="outline" className="text-xs">{results.project.estMinutes} min</Badge>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => navigate(`/projects/${results.project.slug}`)}>
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Practice Puzzle */}
              {results.puzzle && (
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Recommended Practice</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{results.puzzle.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{results.puzzle.summary}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <DifficultyBadge difficulty={results.puzzle.difficulty} />
                        <Badge variant="secondary" className="text-xs">{results.puzzle.category}</Badge>
                        <Badge variant="outline" className="text-xs">{results.puzzle.estMinutes} min</Badge>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => navigate(`/practice/puzzles/${results.puzzle.slug}`)}>
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-4">
                These recommendations are tailored to your current skill level and interests. Start with any of these to begin your learning journey!
              </p>
              <Button variant="ghost" onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}>
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate("/paths")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Paths
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Skill Assessment</CardTitle>
          <CardDescription>
            Answer {questions.length} questions to get personalized recommendations for your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-6 py-6">
            <h3 className="text-xl font-semibold">{currentQ.question}</h3>
            
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      answers[currentQ.id] === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
            >
              {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
