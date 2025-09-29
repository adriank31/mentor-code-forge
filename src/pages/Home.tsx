import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ArrowRight, Code, Shield, Share, Zap, TrendingUp, BookOpen, Users, Sparkles, Clock, Target } from "lucide-react";

const stats = [
  { label: "Bugs Fixed", value: "127K+" },
  { label: "Labs Completed", value: "89K+" },
  { label: "Secure Projects Built", value: "12K+" },
];

const features = [
  {
    icon: Shield,
    title: "Sanitizer-Powered Labs",
    description: "Detect memory bugs, race conditions, and undefined behavior with ASan, TSan, and UBSan."
  },
  {
    icon: Code,
    title: "Secure Coding Lessons",
    description: "Learn RAII, smart pointers, safe I/O, and exploit prevention techniques step-by-step."
  },
  {
    icon: Zap,
    title: "Fuzz Testing Playground",
    description: "Discover edge cases and vulnerabilities using integrated fuzzing tools."
  },
  {
    icon: Target,
    title: "Modern C++ Safety",
    description: "Master modern C++ patterns for memory safety and resource management."
  },
  {
    icon: Sparkles,
    title: "AI Explanations",
    description: "Get plain-English explanations of bugs, sanitizer output, and security concepts."
  },
  {
    icon: Users,
    title: "Capstone Bug Bashes",
    description: "Join community events to hunt and patch vulnerabilities in realistic codebases."
  },
];

const latestPractice = [
  {
    title: "Buffer Overflow in String Copy",
    difficulty: "beginner" as const,
    language: "C/C++",
    completions: 3420,
    estimatedTime: "20 min"
  },
  {
    title: "Use-After-Free Detection",
    difficulty: "intermediate" as const,
    language: "C/C++",
    completions: 1856,
    estimatedTime: "30 min"
  },
  {
    title: "Race Condition on Shared Counter",
    difficulty: "advanced" as const,
    language: "C/C++",
    completions: 892,
    estimatedTime: "40 min"
  },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-24 md:px-6 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-surface opacity-50"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <Shield className="w-4 h-4 mr-2" />
            Secure Systems Engineering
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            C/C++ You Can Trust
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Build Secure Systems
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn to write secure C/C++ and practice fixing real bugs through hands-on labs with sanitizers and fuzzers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="group">
              Start Learning Secure C/C++
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Browse Curriculum
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and resources you need to become a skilled developer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-gradient-surface hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Practice */}
      <section className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Labs</h2>
              <p className="text-muted-foreground">Try these popular secure C/C++ labs from our community</p>
            </div>
            <Button variant="outline">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPractice.map((exercise, index) => (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {exercise.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <DifficultyBadge difficulty={exercise.difficulty} />
                        <Badge variant="outline" className="text-xs">
                          {exercise.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {exercise.completions} completed
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {exercise.estimatedTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-6 pt-16 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Paths</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Practice</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Labs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Playground</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About CureCee</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GDPR</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-border">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl">CureCee</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2025 CureCee. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}