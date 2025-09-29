import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Zap, FileText, Target, ArrowRight } from "lucide-react";

const paths = [
  {
    title: "Foundations: Safe Basics",
    icon: Shield,
    description: "Learn the fundamentals of secure C/C++ programming—safe pointers, arrays, strings, and basic memory management.",
    progress: 0,
    modules: 8,
    labs: 12,
    duration: "4-6 weeks",
    topics: ["Pointers", "Arrays", "Strings", "Stack vs Heap", "Bounds Checking"],
    difficulty: "Beginner",
    color: "text-accent"
  },
  {
    title: "Memory & Lifetimes",
    icon: Lock,
    description: "Master RAII, smart pointers, ownership models, and how to prevent use-after-free, double-free, and memory leaks.",
    progress: 0,
    modules: 10,
    labs: 15,
    duration: "6-8 weeks",
    topics: ["RAII", "Smart Pointers", "Ownership", "Lifetime Rules", "ASan"],
    difficulty: "Intermediate",
    color: "text-primary"
  },
  {
    title: "Concurrency & Race Freedom",
    icon: Zap,
    description: "Understand threads, atomics, mutexes, and how to detect and fix data races using TSan and modern C++ concurrency tools.",
    progress: 0,
    modules: 9,
    labs: 14,
    duration: "5-7 weeks",
    topics: ["Threads", "Atomics", "Mutexes", "Race Conditions", "TSan"],
    difficulty: "Advanced",
    color: "text-warning"
  },
  {
    title: "Files, Parsing & Robust I/O",
    icon: FileText,
    description: "Handle partial reads/writes, parse untrusted input safely, and prevent buffer overflows in I/O operations.",
    progress: 0,
    modules: 7,
    labs: 11,
    duration: "4-5 weeks",
    topics: ["Partial I/O", "Buffer Management", "Parsing", "Input Validation", "Format Strings"],
    difficulty: "Intermediate",
    color: "text-chart-2"
  },
  {
    title: "Hardening & Fuzzing",
    icon: Target,
    description: "Advanced track: exploit prevention, fuzzing techniques, sanitizer mastery, and building security into your development workflow.",
    progress: 0,
    modules: 12,
    labs: 18,
    duration: "8-10 weeks",
    topics: ["Fuzzing", "Exploit Mitigation", "UBSan", "MSan", "Security Hardening"],
    difficulty: "Expert",
    color: "text-destructive"
  },
];

export default function Paths() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Paths</h1>
        <p className="text-muted-foreground">
          Structured tracks to master secure C/C++ systems development from foundations to advanced hardening.
        </p>
      </div>

      {/* Paths Grid */}
      <div className="grid grid-cols-1 gap-6">
        {paths.map((path, index) => {
          const Icon = path.icon;
          return (
            <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${path.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl">{path.title}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {path.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-base leading-relaxed mb-4">
                      {path.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {path.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Modules</div>
                      <div className="font-semibold text-lg">{path.modules}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Labs</div>
                      <div className="font-semibold text-lg">{path.labs}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Duration</div>
                      <div className="font-semibold text-lg">{path.duration}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" variant={path.progress > 0 ? "default" : "hero"}>
                    {path.progress > 0 ? "Continue Learning" : "Start Path"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-surface border-border/50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Not sure where to start?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take our quick assessment to find the best learning path for your current skill level and goals.
          </p>
          <Button variant="hero" size="lg">
            Take Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
