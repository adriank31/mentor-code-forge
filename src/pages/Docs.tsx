import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Zap, Code, Database, Rocket, Coffee } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    title: "Getting Started with CureCee",
    icon: Rocket,
    description: "Learn the basics and set up your secure C/C++ environment.",
    articles: 15
  },
  {
    title: "Secure Coding Lessons",
    icon: Shield,
    description: "Memory safety, RAII, smart pointers, and exploit prevention.",
    articles: 52
  },
  {
    title: "Lab Guide (Sanitizers & Fuzzers)",
    icon: Zap,
    description: "Master ASan, TSan, UBSan, MSan, and fuzzing techniques.",
    articles: 38
  },
  {
    title: "Examples & Patterns",
    icon: Code,
    description: "Real-world secure C/C++ patterns and patched code examples.",
    articles: 44
  },
  {
    title: "Concurrency & Threading",
    icon: Database,
    description: "Thread safety, atomics, mutexes, and race condition prevention.",
    articles: 31
  },
  {
    title: "Advanced Topics",
    icon: Coffee,
    description: "Exploit mitigation, fuzzing at scale, and security hardening.",
    articles: 29
  },
];

const popularTopics = [
  "Buffer Overflow Prevention",
  "RAII and Smart Pointers",
  "TSan: Race Condition Detection",
  "Fuzzing with LibFuzzer",
  "Modern C++ Safety Patterns",
  "ASan: Memory Error Detection",
];

export default function Docs() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground">
          Comprehensive guides and references for secure C/C++ systems development.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.articles} articles
                  </span>
                  <Button variant="ghost" size="sm">Browse</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Topics</CardTitle>
          <CardDescription>Most viewed documentation pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-accent">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Need Help */}
      <Card className="bg-gradient-surface">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Join our community or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero">Join Discord</Button>
            <Button variant="outline">Contact Support</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
