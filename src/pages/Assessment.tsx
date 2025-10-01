import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Award, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/data/paths";
import { projects } from "@/data/projects";

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
    question: "What's your experience level with C/C++ programming?",
    options: [
      { value: "beginner", label: "Beginner - Just starting with C/C++", score: 0 },
      { value: "intermediate", label: "Intermediate - Comfortable with basics, some projects", score: 5 },
      { value: "advanced", label: "Advanced - Professional experience, complex projects", score: 10 }
    ]
  },
  {
    id: "memory",
    question: "How comfortable are you with manual memory management?",
    options: [
      { value: "unfamiliar", label: "Unfamiliar - Haven't used malloc/free much", score: 0 },
      { value: "basic", label: "Basic - Can allocate/free but unsure about edge cases", score: 3 },
      { value: "confident", label: "Confident - Understand ownership and lifetimes well", score: 8 }
    ]
  },
  {
    id: "pointers",
    question: "How well do you understand pointers and references?",
    options: [
      { value: "learning", label: "Still learning - Often confused by pointer syntax", score: 0 },
      { value: "comfortable", label: "Comfortable - Can work with pointers and references", score: 4 },
      { value: "expert", label: "Expert - Deep understanding including function pointers", score: 9 }
    ]
  },
  {
    id: "concurrency",
    question: "What's your experience with multithreading and concurrency?",
    options: [
      { value: "none", label: "None - Haven't worked with threads", score: 0 },
      { value: "some", label: "Some - Basic thread creation and joining", score: 2 },
      { value: "experienced", label: "Experienced - Understand race conditions and synchronization", score: 10 }
    ]
  },
  {
    id: "security",
    question: "How familiar are you with security vulnerabilities in C/C++?",
    options: [
      { value: "minimal", label: "Minimal - Heard of buffer overflows but never tested", score: 0 },
      { value: "moderate", label: "Moderate - Know common vulnerabilities and some mitigations", score: 5 },
      { value: "strong", label: "Strong - Experience with fuzzing and security testing", score: 10 }
    ]
  },
  {
    id: "debugging",
    question: "How comfortable are you with debugging tools (gdb, valgrind, sanitizers)?",
    options: [
      { value: "novice", label: "Novice - Mostly use printf debugging", score: 0 },
      { value: "familiar", label: "Familiar - Used gdb and valgrind a few times", score: 4 },
      { value: "proficient", label: "Proficient - Regularly use sanitizers and debugging tools", score: 8 }
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

    // Recommend path based on score
    let recommendedPath;
    let recommendedProject;

    if (percentage < 30) {
      // Beginner level
      recommendedPath = paths.find(p => p.slug === "foundations-safe-basics");
      recommendedProject = projects.find(p => p.difficulty === "beginner");
    } else if (percentage < 60) {
      // Intermediate level
      const intermediateOptions = ["file-parsing-and-robust-io", "memory-and-lifetimes"];
      const securityScore = questions.find(q => q.id === "security")?.options.find(o => o.value === answers.security)?.score || 0;
      const slug = securityScore > 3 ? "memory-and-lifetimes" : "file-parsing-and-robust-io";
      recommendedPath = paths.find(p => p.slug === slug);
      recommendedProject = projects.find(p => p.difficulty === "intermediate");
    } else {
      // Advanced level
      const concurrencyScore = questions.find(q => q.id === "concurrency")?.options.find(o => o.value === answers.concurrency)?.score || 0;
      const securityScore = questions.find(q => q.id === "security")?.options.find(o => o.value === answers.security)?.score || 0;
      
      let slug = "hardening-and-fuzzing";
      if (concurrencyScore >= 8) {
        slug = "concurrency-and-race-freedom";
      } else if (securityScore < 8) {
        slug = "memory-and-lifetimes";
      }
      
      recommendedPath = paths.find(p => p.slug === slug);
      recommendedProject = projects.find(p => p.difficulty === "advanced");
    }

    return {
      score,
      maxScore,
      percentage,
      path: recommendedPath,
      project: recommendedProject,
      level: percentage < 30 ? "Beginner" : percentage < 60 ? "Intermediate" : "Advanced"
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const canProceed = answers[currentQ?.id];

  if (showResults) {
    const results = getRecommendations();
    
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
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
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.score} / {results.maxScore}
              </div>
              <p className="text-muted-foreground">Total Score</p>
            </div>

            <div className="space-y-6 pt-6 border-t">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Recommended Learning Path</h3>
                </div>
                {results.path && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{results.path.title}</CardTitle>
                        <Badge variant="outline">{results.path.difficulty}</Badge>
                      </div>
                      <CardDescription>{results.path.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Modules:</span>
                          <span className="font-semibold ml-2">{results.path.modules}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Est. Time:</span>
                          <span className="font-semibold ml-2">{results.path.estMinutes} min</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => navigate(`/paths/${results.path.slug}`)}
                      >
                        Start This Path
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Recommended Project</h3>
                </div>
                {results.project && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{results.project.title}</CardTitle>
                        <Badge variant="outline">{results.project.difficulty}</Badge>
                      </div>
                      <CardDescription>{results.project.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Role:</span>
                          <span className="font-semibold ml-2">{results.project.role}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Est. Time:</span>
                          <span className="font-semibold ml-2">{results.project.estMinutes} min</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate(`/projects/${results.project.slug}`)}
                      >
                        View Project
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="pt-6 border-t text-center">
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
            Answer {questions.length} questions to find the best learning path for your skill level
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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
            >
              {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
