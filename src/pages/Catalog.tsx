import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Code, Database, Cpu, Coffee, Star, Clock, Users } from "lucide-react";

const categories = [
  {
    id: "courses",
    name: "Courses",
    icon: BookOpen,
    items: [
      {
        title: "Python for Data Science",
        description: "Learn Python programming with focus on data analysis, visualization, and machine learning.",
        type: "Course",
        duration: "6 weeks",
        level: "Intermediate",
        rating: 4.8,
        students: 15400,
        topics: ["Python", "Data Analysis", "Pandas", "NumPy"]
      },
      {
        title: "Advanced SQL Techniques",
        description: "Master complex queries, window functions, and database optimization strategies.",
        type: "Course", 
        duration: "4 weeks",
        level: "Advanced",
        rating: 4.9,
        students: 8750,
        topics: ["SQL", "Database", "Performance", "Analytics"]
      },
      {
        title: "Java Spring Boot Masterclass",
        description: "Build modern web applications with Spring Boot, REST APIs, and microservices.",
        type: "Course",
        duration: "8 weeks", 
        level: "Intermediate",
        rating: 4.7,
        students: 12300,
        topics: ["Java", "Spring Boot", "REST API", "Microservices"]
      }
    ]
  },
  {
    id: "tutorials",
    name: "Tutorials",
    icon: Code,
    items: [
      {
        title: "Git Version Control Essentials",
        description: "Essential Git commands and workflows for collaborative development.",
        type: "Tutorial",
        duration: "2 hours",
        level: "Beginner",
        rating: 4.6,
        students: 25600,
        topics: ["Git", "Version Control", "GitHub", "Collaboration"]
      },
      {
        title: "Docker Containerization Guide",
        description: "Learn to containerize applications and manage deployments with Docker.",
        type: "Tutorial",
        duration: "3 hours",
        level: "Intermediate", 
        rating: 4.8,
        students: 18900,
        topics: ["Docker", "Containers", "DevOps", "Deployment"]
      },
      {
        title: "API Design Best Practices",
        description: "Design robust, scalable APIs following industry standards and best practices.",
        type: "Tutorial",
        duration: "1.5 hours",
        level: "Advanced",
        rating: 4.9,
        students: 9800,
        topics: ["API", "REST", "GraphQL", "Design Patterns"]
      }
    ]
  },
  {
    id: "projects",
    name: "Projects", 
    icon: Coffee,
    items: [
      {
        title: "E-commerce Website",
        description: "Build a full-stack e-commerce platform with payment integration and admin panel.",
        type: "Project",
        duration: "4-6 weeks",
        level: "Advanced",
        rating: 4.7,
        students: 5400,
        topics: ["Full-Stack", "React", "Node.js", "Database"]
      },
      {
        title: "Data Visualization Dashboard",
        description: "Create interactive dashboards and charts using Python and modern visualization libraries.",
        type: "Project",
        duration: "2-3 weeks",
        level: "Intermediate",
        rating: 4.8,
        students: 7200,
        topics: ["Python", "Data Viz", "Dashboard", "Analytics"]
      },
      {
        title: "Machine Learning Classifier",
        description: "Implement and deploy a machine learning model for image or text classification.",
        type: "Project",
        duration: "3-4 weeks", 
        level: "Advanced",
        rating: 4.6,
        students: 4100,
        topics: ["Machine Learning", "Python", "AI", "Classification"]
      }
    ]
  }
];

const languages = [
  { name: "Python", icon: "🐍", count: 180 },
  { name: "Java", icon: "☕", count: 145 },
  { name: "SQL", icon: "🗃️", count: 89 },
  { name: "C/C++", icon: "⚡", count: 76 },
  { name: "JavaScript", icon: "🟨", count: 156 },
  { name: "Go", icon: "🔷", count: 34 },
];

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("courses");

  const filteredItems = categories.find(cat => cat.id === activeTab)?.items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Learning Catalog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive collection of courses, tutorials, and hands-on projects.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search courses, tutorials, projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Languages Quick Access */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Browse by Language</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((lang, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{lang.icon}</div>
                <div className="font-medium text-sm">{lang.name}</div>
                <div className="text-xs text-muted-foreground">{lang.count} items</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="w-4 h-4" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.level}
                          </Badge>
                        </div>
                        
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {item.students.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.topics.slice(0, 3).map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {item.topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  No {category.name.toLowerCase()} found matching your search.
                </div>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}