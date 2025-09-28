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
    title: "Two Sum Problem",
    description: "Find two numbers in an array that add up to a target sum.",
    difficulty: "beginner" as const,
    language: "Python",
    topics: ["Arrays", "Hash Tables"],
    completions: 3420,
    estimatedTime: "15 min",
    success_rate: 85
  },
  {
    title: "Binary Tree Traversal",
    description: "Implement preorder, inorder, and postorder tree traversals.",
    difficulty: "intermediate" as const,
    language: "Java",
    topics: ["Trees", "Recursion"],
    completions: 1240,
    estimatedTime: "25 min",
    success_rate: 72
  },
  {
    title: "SQL Query Optimization",
    description: "Optimize complex database queries for better performance.",
    difficulty: "advanced" as const,
    language: "SQL",
    topics: ["Database", "Performance"],
    completions: 856,
    estimatedTime: "35 min",
    success_rate: 68
  },
  {
    title: "Memory Management",
    description: "Practice dynamic memory allocation and deallocation in C++.",
    difficulty: "advanced" as const,
    language: "C++",
    topics: ["Memory", "Pointers"],
    completions: 654,
    estimatedTime: "40 min",
    success_rate: 59
  },
  {
    title: "String Manipulation",
    description: "Solve various string processing challenges.",
    difficulty: "beginner" as const,
    language: "Python",
    topics: ["Strings", "Algorithms"],
    completions: 2100,
    estimatedTime: "20 min",
    success_rate: 91
  },
  {
    title: "Graph Algorithms",
    description: "Implement BFS, DFS, and shortest path algorithms.",
    difficulty: "expert" as const,
    language: "Java",
    topics: ["Graphs", "Algorithms"],
    completions: 423,
    estimatedTime: "50 min",
    success_rate: 42
  },
];

export default function Practice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    const matchesLanguage = selectedLanguage === "all" || exercise.language === selectedLanguage;
    
    return matchesSearch && matchesDifficulty && matchesLanguage;
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
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="C++">C++</SelectItem>
                <SelectItem value="SQL">SQL</SelectItem>
              </SelectContent>
            </Select>
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
              
              <Button className="w-full" variant="outline">
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
            setSelectedLanguage("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}