import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Trophy, Clock, ThumbsUp, Code, Users } from "lucide-react";

const discussions = [
  {
    title: "Best practices for preventing buffer overflows",
    author: { name: "sec_engineer", initials: "SE" },
    category: "Buffer Overflow",
    replies: 52,
    views: 1843,
    timeAgo: "2 hours ago",
    likes: 38,
    tags: ["Buffer Overflow", "Prevention", "Memory Safety"]
  },
  {
    title: "TSan vs manual race condition detection",
    author: { name: "thread_safe", initials: "TS" },
    category: "Concurrency",
    replies: 38,
    views: 1124,
    timeAgo: "4 hours ago",
    likes: 29,
    tags: ["TSan", "Concurrency", "Race Conditions"]
  },
  {
    title: "Smart pointer patterns for safe C++",
    author: { name: "modern_cpp", initials: "MC" },
    category: "Memory Safety",
    replies: 45,
    views: 1567,
    timeAgo: "6 hours ago",
    likes: 41,
    tags: ["Smart Pointers", "RAII", "Modern C++"]
  },
  {
    title: "Fuzzing strategies for input parsers",
    author: { name: "fuzz_master", initials: "FM" },
    category: "Fuzzing",
    replies: 29,
    views: 892,
    timeAgo: "8 hours ago",
    likes: 24,
    tags: ["Fuzzing", "Parsing", "Security"]
  },
];

const solutions = [
  { problem: "Buffer Overflow Fix", language: "C/C++", author: "safe_coder", likes: 234, efficiency: "Safe bounds" },
  { problem: "Use-After-Free Patch", language: "C/C++", author: "memory_sage", likes: 189, efficiency: "Smart pointers" },
  { problem: "Race Condition Fix", language: "C/C++", author: "thread_guardian", likes: 267, efficiency: "Atomics + mutex" },
  { problem: "Format String Hardening", language: "C/C++", author: "secure_io", likes: 156, efficiency: "Input validation" },
];

const leaderboard = [
  { rank: 1, name: "sec_guardian", points: 9847, solved: 428, streak: 112 },
  { rank: 2, name: "bug_slayer", points: 8934, solved: 389, streak: 94 },
  { rank: 3, name: "memory_sentinel", points: 8245, solved: 356, streak: 87 },
  { rank: 4, name: "race_fighter", points: 7892, solved: 334, streak: 76 },
  { rank: 5, name: "fuzz_wizard", points: 7543, solved: 312, streak: 68 },
];

export default function Community() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">
          Connect with security engineers, share patched code, and discuss secure C/C++ techniques.
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="solutions" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Solutions
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Top Bug Fixers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Discussions</h2>
            <Button variant="hero">Start Discussion</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {discussions.map((discussion, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{discussion.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {discussion.timeAgo}
                        </span>
                      </div>
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        {discussion.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{discussion.author.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{discussion.author.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {discussion.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {discussion.likes}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {discussion.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="solutions" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Community Solutions</h2>
            <p className="text-muted-foreground">Explore patched code and secure implementations</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {solutions.map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{solution.problem}</CardTitle>
                      <CardDescription className="mt-2">
                        by {solution.author}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      {solution.likes}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{solution.language}</Badge>
                    <span className="text-sm text-muted-foreground">{solution.efficiency}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Top Bug Fixers</h2>
            <p className="text-muted-foreground">Recognizing our most skilled security engineers</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {leaderboard.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-surface hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        member.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                        member.rank === 2 ? 'bg-gray-400 text-gray-900' :
                        member.rank === 3 ? 'bg-amber-600 text-amber-900' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {member.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.solved} bugs fixed · {member.streak} day streak
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{member.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
