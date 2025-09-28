import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Trophy, TrendingUp, Clock, ThumbsUp, Share2, BookOpen } from "lucide-react";

const discussions = [
  {
    title: "Best practices for Python code optimization?",
    author: { name: "Alex Chen", avatar: "", initials: "AC" },
    category: "Python",
    replies: 23,
    views: 1240,
    timeAgo: "2 hours ago",
    likes: 15,
    tags: ["Performance", "Python", "Optimization"]
  },
  {
    title: "How to handle complex SQL joins efficiently?",
    author: { name: "Sarah Johnson", avatar: "", initials: "SJ" },
    category: "SQL",
    replies: 18,
    views: 856,
    timeAgo: "4 hours ago",
    likes: 12,
    tags: ["SQL", "Database", "Joins"]
  },
  {
    title: "Memory management strategies in C++",
    author: { name: "Michael Rodriguez", avatar: "", initials: "MR" },
    category: "C++",
    replies: 31,
    views: 1890,
    timeAgo: "6 hours ago",
    likes: 28,
    tags: ["C++", "Memory", "Best Practices"]
  }
];

const leaderboard = [
  { rank: 1, name: "Emma Thompson", points: 15680, badge: "Expert", exercises: 234 },
  { rank: 2, name: "David Kim", points: 14250, badge: "Expert", exercises: 198 },
  { rank: 3, name: "Lisa Wang", points: 13890, badge: "Advanced", exercises: 186 },
  { rank: 4, name: "James Wilson", points: 12340, badge: "Advanced", exercises: 165 },
  { rank: 5, name: "Ana García", points: 11980, badge: "Advanced", exercises: 158 }
];

const achievements = [
  {
    title: "First Steps",
    description: "Complete your first exercise",
    icon: "🎯",
    rarity: "Common",
    earned: 45670
  },
  {
    title: "Speed Demon",
    description: "Solve 10 exercises in under 5 minutes each",
    icon: "⚡",
    rarity: "Rare",
    earned: 3240
  },
  {
    title: "Helpful Hand",
    description: "Get 50 upvotes on your solutions",
    icon: "🤝",
    rarity: "Epic",
    earned: 890
  },
  {
    title: "Code Master",
    description: "Complete all exercises in a language track",
    icon: "👑",
    rarity: "Legendary",
    earned: 156
  }
];

export default function Community() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Community</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow developers, share knowledge, and grow together in our vibrant community.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">12K+</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">2M+</div>
            <div className="text-sm text-muted-foreground">Solutions Shared</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-muted-foreground">Help Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                        <AvatarImage src={discussion.author.avatar} />
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

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Top Contributors</h2>
            <p className="text-muted-foreground">Recognizing our most active community members</p>
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
                          {member.exercises} exercises completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{member.points.toLocaleString()}</div>
                      <Badge variant="outline" className="text-xs">
                        {member.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Achievements</h2>
            <p className="text-muted-foreground">Unlock badges and showcase your accomplishments</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <CardTitle className="text-lg mb-2">{achievement.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {achievement.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <Badge variant={
                      achievement.rarity === 'Common' ? 'secondary' :
                      achievement.rarity === 'Rare' ? 'outline' :
                      achievement.rarity === 'Epic' ? 'default' : 'destructive'
                    }>
                      {achievement.rarity}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {achievement.earned.toLocaleString()} earned
                    </div>
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