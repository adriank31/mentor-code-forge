import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Clock, Users, Shield, Star } from "lucide-react";

const courses = [
  {
    title: "Secure Memory Management",
    description: "Comprehensive guide to preventing memory bugs in C/C++: buffer overflows, UAF, double-free, and more.",
    category: "Secure Systems Track",
    difficulty: "Intermediate",
    duration: "6 hours",
    lessons: 24,
    labs: 12,
    price: "Free",
    rating: 4.8,
    students: 3420
  },
  {
    title: "Race Condition Masterclass",
    description: "Deep dive into concurrency bugs, atomics, mutexes, and thread safety with hands-on TSan labs.",
    category: "Secure Systems Track",
    difficulty: "Advanced",
    duration: "8 hours",
    lessons: 30,
    labs: 15,
    price: "Pro",
    rating: 4.9,
    students: 1856
  },
  {
    title: "Fuzzing for Security",
    description: "Learn to find edge cases and vulnerabilities using LibFuzzer, AFL++, and custom fuzz harnesses.",
    category: "Secure Systems Track",
    difficulty: "Advanced",
    duration: "10 hours",
    lessons: 35,
    labs: 18,
    price: "Pro",
    rating: 4.7,
    students: 892
  },
  {
    title: "Modern C++ Safety Patterns",
    description: "Master RAII, smart pointers, move semantics, and C++17/20 features for memory-safe code.",
    category: "Secure Systems Track",
    difficulty: "Intermediate",
    duration: "7 hours",
    lessons: 28,
    labs: 14,
    price: "Free",
    rating: 4.8,
    students: 2340
  },
  {
    title: "Secure I/O & Parsing",
    description: "Prevent buffer overflows, format string bugs, and injection attacks in input handling.",
    category: "Secure Systems Track",
    difficulty: "Beginner",
    duration: "5 hours",
    lessons: 20,
    labs: 10,
    price: "Free",
    rating: 4.6,
    students: 4120
  },
  {
    title: "Exploit Prevention Techniques",
    description: "Learn stack canaries, ASLR, DEP, and modern exploit mitigation strategies.",
    category: "Secure Systems Track",
    difficulty: "Expert",
    duration: "12 hours",
    lessons: 40,
    labs: 20,
    price: "Pro",
    rating: 4.9,
    students: 543
  },
  {
    title: "Sanitizer Deep Dive",
    description: "Master ASan, TSan, UBSan, MSan—detect and fix undefined behavior and memory bugs.",
    category: "Secure Systems Track",
    difficulty: "Intermediate",
    duration: "6 hours",
    lessons: 25,
    labs: 13,
    price: "Free",
    rating: 4.7,
    students: 1890
  },
  {
    title: "Secure Coding Foundations",
    description: "Start your journey: safe pointers, arrays, strings, and basic memory management in C/C++.",
    category: "Secure Systems Track",
    difficulty: "Beginner",
    duration: "4 hours",
    lessons: 18,
    labs: 9,
    price: "Free",
    rating: 4.8,
    students: 5240
  },
];

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty;
    const matchesPrice = selectedPrice === "all" || course.price === selectedPrice;
    
    return matchesSearch && matchesDifficulty && matchesPrice;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
        <p className="text-muted-foreground">
          Browse our collection of secure C/C++ systems courses and learning modules.
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
                  placeholder="Search courses..."
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
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Pro">Pro Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <Card key={index} className="border-border/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {course.category}
                </Badge>
                <Badge variant={course.price === "Free" ? "secondary" : "default"} className="text-xs">
                  {course.price}
                </Badge>
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {course.students}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {course.lessons} lessons · {course.labs} labs
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>

                <Badge variant="outline" className="w-full justify-center">
                  {course.difficulty}
                </Badge>

                <Button className="w-full" variant="outline">
                  View Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No courses found matching your criteria.
          </div>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setSelectedDifficulty("all");
            setSelectedPrice("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
