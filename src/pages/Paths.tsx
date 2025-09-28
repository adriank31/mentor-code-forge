import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, Users, ArrowRight } from "lucide-react";

const paths = [
  {
    title: "Python Mastery",
    description: "Complete Python programming from basics to advanced topics including data structures, algorithms, and web development.",
    language: "Python",
    duration: "8-12 weeks",
    difficulty: "Beginner to Advanced",
    modules: 12,
    exercises: 156,
    projects: 8,
    enrolled: 12840,
    progress: 0,
    topics: ["Syntax & Basics", "Data Structures", "OOP", "Web Development", "Data Science", "APIs"]
  },
  {
    title: "SQL Database Expert",
    description: "Master database design, complex queries, optimization, and advanced SQL concepts for real-world applications.",
    language: "SQL",
    duration: "6-8 weeks", 
    difficulty: "Beginner to Expert",
    modules: 9,
    exercises: 89,
    projects: 5,
    enrolled: 8950,
    progress: 0,
    topics: ["Database Design", "Joins & Subqueries", "Stored Procedures", "Performance Tuning", "NoSQL", "Analytics"]
  },
  {
    title: "C/C++ Systems Programming",
    description: "Learn low-level programming, memory management, and system-level development with C and C++.",
    language: "C/C++",
    duration: "10-14 weeks",
    difficulty: "Intermediate to Expert", 
    modules: 15,
    exercises: 132,
    projects: 6,
    enrolled: 5670,
    progress: 0,
    topics: ["Memory Management", "Pointers", "Data Structures", "Algorithms", "System Programming", "Performance"]
  },
  {
    title: "Java Enterprise Development",
    description: "Build enterprise applications with Java, Spring framework, and modern development practices.",
    language: "Java",
    duration: "12-16 weeks",
    difficulty: "Intermediate to Advanced",
    modules: 18,
    exercises: 201,
    projects: 10,
    enrolled: 9850,
    progress: 0,
    topics: ["OOP Fundamentals", "Collections", "Spring Framework", "Microservices", "Testing", "Design Patterns"]
  }
];

export default function Paths() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Learning Paths</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Structured learning journeys designed to take you from beginner to expert in your chosen programming language.
        </p>
      </div>

      {/* Path Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {paths.map((path, index) => (
          <Card key={index} className="border-border/50 bg-gradient-surface hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {path.language}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {path.difficulty}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl mb-2">{path.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {path.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{path.progress}%</span>
                </div>
                <Progress value={path.progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{path.modules} modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span>{path.exercises} exercises</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{path.enrolled.toLocaleString()} enrolled</span>
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h4 className="text-sm font-medium mb-3">What you'll learn:</h4>
                <div className="flex flex-wrap gap-2">
                  {path.topics.map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4">
                <Button className="w-full group" variant={path.progress > 0 ? "outline" : "default"}>
                  {path.progress > 0 ? "Continue Learning" : "Start Path"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-12">
        <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground mb-6">
              Choose a path that matches your goals and current skill level. You can always switch or combine paths as you progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero">
                Browse All Exercises
              </Button>
              <Button variant="outline">
                View Curriculum Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}