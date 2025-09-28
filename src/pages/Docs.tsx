import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Code, Database, Cpu, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";

const quickStart = [
  {
    title: "Getting Started with Python",
    description: "Learn Python basics, syntax, and fundamental concepts.",
    icon: "🐍",
    duration: "15 min read",
    level: "Beginner"
  },
  {
    title: "Java Fundamentals",
    description: "Object-oriented programming concepts and Java best practices.",
    icon: "☕",
    duration: "20 min read", 
    level: "Beginner"
  },
  {
    title: "SQL Query Guide",
    description: "Master database queries from basic SELECT to complex JOINs.",
    icon: "🗃️",
    duration: "25 min read",
    level: "Intermediate"
  },
  {
    title: "C++ Memory Management",
    description: "Understand pointers, references, and dynamic memory allocation.",
    icon: "⚡",
    duration: "30 min read",
    level: "Advanced"
  }
];

const apiDocs = [
  {
    title: "Authentication",
    description: "Learn how to authenticate with our API using tokens and OAuth.",
    endpoint: "/api/auth",
    methods: ["POST", "GET"]
  },
  {
    title: "Exercise Submission",
    description: "Submit code solutions and receive automated feedback.",
    endpoint: "/api/exercises",
    methods: ["POST", "GET", "PUT"]
  },
  {
    title: "Progress Tracking",
    description: "Track learning progress and retrieve completion statistics.",
    endpoint: "/api/progress",
    methods: ["GET"]
  },
  {
    title: "Community Features",
    description: "Access discussions, leaderboards, and community content.",
    endpoint: "/api/community",
    methods: ["GET", "POST"]
  }
];

const tutorials = [
  {
    category: "Python",
    title: "Building a Web Scraper",
    description: "Create a web scraper using Beautiful Soup and requests.",
    difficulty: "Intermediate",
    duration: "45 min",
    tags: ["Web Scraping", "APIs", "Data Processing"]
  },
  {
    category: "Java",
    title: "Spring Boot REST API",
    description: "Build a complete REST API with Spring Boot and JPA.",
    difficulty: "Advanced", 
    duration: "1.5 hours",
    tags: ["Spring Boot", "REST", "Database"]
  },
  {
    category: "SQL",
    title: "Database Performance Optimization",
    description: "Optimize slow queries and improve database performance.",
    difficulty: "Advanced",
    duration: "1 hour",
    tags: ["Performance", "Indexing", "Query Optimization"]
  },
  {
    category: "C++",
    title: "Multithreading Fundamentals",
    description: "Learn thread management and synchronization in C++.",
    difficulty: "Expert",
    duration: "2 hours",
    tags: ["Concurrency", "Threading", "Synchronization"]
  }
];

const references = [
  {
    language: "Python", 
    sections: ["Syntax Reference", "Built-in Functions", "Standard Library", "PEP Guidelines"],
    icon: "🐍"
  },
  {
    language: "Java",
    sections: ["Language Specification", "API Documentation", "Design Patterns", "Best Practices"],
    icon: "☕"
  },
  {
    language: "SQL",
    sections: ["SQL Standards", "Function Reference", "Query Optimization", "Database Design"],
    icon: "🗃️"
  },
  {
    language: "C++",
    sections: ["Language Reference", "STL Documentation", "Memory Management", "Performance Tips"],
    icon: "⚡"
  }
];

export default function Docs() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive guides, tutorials, and references to help you master programming.
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

      {/* Quick Start Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Start Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStart.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{guide.icon}</div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="secondary">{guide.level}</Badge>
                  <span className="text-muted-foreground">{guide.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tutorials" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="api">API Docs</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{tutorial.category}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {tutorial.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {tutorial.duration}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tutorial.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full group">
                    Read Tutorial
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">API Documentation</h2>
            <p className="text-muted-foreground">
              Integrate CodeCoach functionality into your applications with our RESTful API.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apiDocs.map((api, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {api.title}
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>{api.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Endpoint:</span>
                      <code className="ml-2 px-2 py-1 bg-muted rounded text-sm font-mono">
                        {api.endpoint}
                      </code>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Methods:</span>
                      <div className="flex gap-1 ml-2 mt-1">
                        {api.methods.map((method, methodIndex) => (
                          <Badge key={methodIndex} variant="outline" className="text-xs font-mono">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reference" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Language References</h2>
            <p className="text-muted-foreground">
              Comprehensive references for all supported programming languages.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {references.map((ref, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{ref.icon}</span>
                    {ref.language} Reference
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {ref.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer transition-colors">
                        <span className="text-sm">{section}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}