import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Target, ChevronRight } from "lucide-react";
import { puzzles } from "@/data/puzzles";

interface Question {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    categories: string[];
  }[];
}

const questions: Question[] = [
  {
    id: "interest",
    question: "What area of C/C++ development interests you most?",
    options: [
      { value: "embedded", label: "Low-level hardware programming and embedded systems", categories: ["Embedded Systems"] },
      { value: "systems", label: "Operating systems, memory management, and core infrastructure", categories: ["Systems Programming"] },
      { value: "firmware", label: "Device drivers, bootloaders, and hardware interfaces", categories: ["Firmware Engineering"] },
      { value: "security", label: "Vulnerability analysis, exploit mitigation, and security hardening", categories: ["Cybersecurity Engineering"] },
      { value: "toolchain", label: "Compilers, linkers, and development tools", categories: ["Toolchain Developer"] }
    ]
  },
  {
    id: "focus",
    question: "What type of problems do you want to practice?",
    options: [
      { value: "bit", label: "Bit manipulation, hardware registers, and low-level operations", categories: ["Embedded Systems", "Firmware Engineering"] },
      { value: "memory", label: "Pointers, memory management, and data structures", categories: ["Systems Programming", "Cybersecurity Engineering"] },
      { value: "algorithms", label: "Algorithms, optimization, and performance", categories: ["Systems Programming", "Toolchain Developer"] },
      { value: "security", label: "Vulnerabilities, exploits, and defensive programming", categories: ["Cybersecurity Engineering"] },
      { value: "parsing", label: "Binary formats, protocols, and data parsing", categories: ["Toolchain Developer", "Firmware Engineering"] }
    ]
  },
  {
    id: "constraints",
    question: "Which constraints are you most interested in working with?",
    options: [
      { value: "resource", label: "Limited memory, CPU, and power constraints", categories: ["Embedded Systems", "Firmware Engineering"] },
      { value: "performance", label: "Speed optimization and efficiency", categories: ["Systems Programming", "Toolchain Developer"] },
      { value: "reliability", label: "Correctness, safety, and fault tolerance", categories: ["Firmware Engineering", "Cybersecurity Engineering"] },
      { value: "portability", label: "Cross-platform compatibility and standards", categories: ["Systems Programming", "Toolchain Developer"] }
    ]
  }
];

export function PracticeAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getRecommendations = () => {
    const categoryScores: Record<string, number> = {
      "Embedded Systems": 0,
      "Systems Programming": 0,
      "Firmware Engineering": 0,
      "Cybersecurity Engineering": 0,
      "Toolchain Developer": 0
    };

    // Calculate scores based on answers
    questions.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(opt => opt.value === answer);
      if (option) {
        option.categories.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + 1;
        });
      }
    });

    // Find top 2 categories
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([cat]) => cat);

    // Get recommended puzzles
    const recommendedPuzzles = puzzles.filter(p => 
      sortedCategories.includes(p.category as string)
    ).slice(0, 5);

    return {
      primaryCategory: sortedCategories[0],
      secondaryCategory: sortedCategories[1],
      puzzles: recommendedPuzzles,
      allCategories: sortedCategories
    };
  };

  const currentQ = questions[currentQuestion];
  const canProceed = answers[currentQ?.id];

  if (showResults) {
    const results = getRecommendations();
    
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Your Personalized Practice Path</CardTitle>
          </div>
          <CardDescription>
            Based on your interests, focus on these problem categories and exercises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg py-1 px-3">
                {results.primaryCategory}
              </Badge>
              <span className="text-sm text-muted-foreground">Primary Focus</span>
            </div>
            {results.secondaryCategory && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg py-1 px-3">
                  {results.secondaryCategory}
                </Badge>
                <span className="text-sm text-muted-foreground">Secondary Focus</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3">Recommended Puzzles to Start With:</h3>
            <div className="space-y-3">
              {results.puzzles.map((puzzle, idx) => (
                <div key={puzzle.slug} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{puzzle.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{puzzle.summary}</div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{puzzle.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{puzzle.category}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Filter by these categories above to see all relevant puzzles, or explore other categories to broaden your skills.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
            >
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Find Your Focus</CardTitle>
        <CardDescription>
          Answer {questions.length} quick questions to discover which practice problems match your interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQ.question}</h3>
          
          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={(value) => handleAnswer(currentQ.id, value)}
          >
            <div className="space-y-2">
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

        <div className="flex justify-between pt-4">
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
  );
}
