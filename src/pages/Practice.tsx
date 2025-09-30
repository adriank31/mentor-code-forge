import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Clock, Code } from "lucide-react";

const exercises = [
  {
    slug: "buffer-overflow-strcpy",
    title: "Buffer Overflow in strcpy",
    description: "Fix an off-by-one error in a bounded string copy operation.",
    difficulty: "beginner" as const,
    language: "C/C++",
    bugType: "Memory",
    topics: ["Memory", "Strings"],
    completions: 2340,
    estimatedTime: "20 min",
    success_rate: 78
  },
  {
    slug: "use-after-free",
    title: "Use-After-Free Vulnerability",
    description: "Detect and fix a dangling pointer bug after memory deallocation.",
    difficulty: "intermediate" as const,
    language: "C/C++",
    bugType: "Memory",
    topics: ["Memory", "Pointers"],
    completions: 1120,
    estimatedTime: "30 min",
    success_rate: 65
  },
  {
    slug: "race-condition-counter",
    title: "Race Condition on Shared Counter",
    description: "Fix non-atomic increment operations causing race conditions.",
    difficulty: "advanced" as const,
    language: "C/C++",
    bugType: "Concurrency",
    topics: ["Concurrency", "Threading"],
    completions: 654,
    estimatedTime: "40 min",
    success_rate: 59
  },
  {
    slug: "format-string-vuln",
    title: "Format String Vulnerability",
    description: "Identify and fix dangerous printf(user_input) patterns.",
    difficulty: "intermediate" as const,
    language: "C/C++",
    bugType: "I/O",
    topics: ["I/O", "Security"],
    completions: 890,
    estimatedTime: "25 min",
    success_rate: 72
  },
  {
    slug: "json-parser-crash",
    title: "JSON Parser Buffer Overflow",
    description: "Fix missing bounds checks in a token parser.",
    difficulty: "advanced" as const,
    language: "C/C++",
    bugType: "Parsing",
    topics: ["Parsing", "Memory"],
    completions: 423,
    estimatedTime: "40 min",
    success_rate: 55
  },
  {
    slug: "integer-overflow-alloc",
    title: "Integer Overflow in Allocation",
    description: "Prevent size calculation wrap-around leading to heap corruption.",
    difficulty: "intermediate" as const,
    language: "C/C++",
    bugType: "Hardening",
    topics: ["Hardening", "Memory"],
    completions: 756,
    estimatedTime: "25 min",
    success_rate: 68
  },
];

const bugTypes = ["Memory", "Concurrency", "I/O", "Parsing", "Hardening"];

export default function Practice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedBugTypes, setSelectedBugTypes] = useState<string[]>([]);

  const toggleBugType = (bugType: string) => {
    setSelectedBugTypes(prev =>
      prev.includes(bugType) ? prev.filter(t => t !== bugType) : [...prev, bugType]
    );
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    const matchesBugType = selectedBugTypes.length === 0 || selectedBugTypes.includes(exercise.bugType);
    
    return matchesSearch && matchesDifficulty && matchesBugType;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Practice Exercises</h1>
        <p className="text-muted-foreground">
          Sharpen your coding skills with our comprehensive collection of programming challenges.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search exercises, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Bug Type</div>
              <div className="flex flex-wrap gap-2">
                {bugTypes.map((bugType) => (
                  <Badge
                    key={bugType}
                    variant={selectedBugTypes.includes(bugType) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleBugType(bugType)}
                  >
                    {bugType}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExercises.map((exercise, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {exercise.title}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {exercise.description}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <DifficultyBadge difficulty={exercise.difficulty} />
                <Badge variant="outline" className="text-xs">
                  <Code className="w-3 h-3 mr-1" />
                  {exercise.language}
                </Badge>
                {exercise.topics.map((topic, topicIndex) => (
                  <Badge key={topicIndex} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {exercise.completions}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {exercise.estimatedTime}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-medium ${
                    exercise.success_rate >= 80 ? 'text-success' :
                    exercise.success_rate >= 60 ? 'text-warning' : 'text-destructive'
                  }`}>
                    {exercise.success_rate}% success
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.location.href = `/labs/${exercise.slug}`}
              >
                Start Exercise
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No exercises found matching your criteria.
          </div>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setSelectedDifficulty("all");
            setSelectedBugTypes([]);
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}