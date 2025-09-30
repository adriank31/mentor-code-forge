import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Target, TrendingUp, Award, Clock, Code, CheckCircle, Star, Shield } from "lucide-react";

const stats = [
  {
    title: "Exercises Completed",
    value: "127",
    change: "+12 this week",
    icon: CheckCircle,
    color: "text-success"
  },
  {
    title: "Current Streak",
    value: "23 days",
    change: "Personal best!",
    icon: Target,
    color: "text-primary"
  },
  {
    title: "Time Coding",
    value: "48.5h",
    change: "+6.2h this week",
    icon: Clock,
    color: "text-info"
  },
  {
    title: "Skill Level",
    value: "Advanced",
    change: "Level up soon",
    icon: TrendingUp,
    color: "text-warning"
  }
];

const securitySkills = [
  { name: "Memory Safety", completed: 45, total: 78, progress: 58, level: "Intermediate" },
  { name: "Concurrency", completed: 23, total: 65, progress: 35, level: "Beginner" },
  { name: "Parsing/I-O", completed: 34, total: 52, progress: 65, level: "Intermediate" },
  { name: "Modern C++ Practices", completed: 28, total: 48, progress: 58, level: "Intermediate" },
  { name: "Hardening", completed: 12, total: 56, progress: 21, level: "Beginner" }
];

const recentActivity = [
  {
    date: "Today",
    activities: [
      { type: "exercise", title: "Buffer Overflow in String Copy", language: "C/C++", completed: true, time: "18 min" },
      { type: "exercise", title: "Use-After-Free Detection", language: "C/C++", completed: true, time: "32 min" }
    ]
  },
  {
    date: "Yesterday", 
    activities: [
      { type: "exercise", title: "Race Condition on Shared Counter", language: "C/C++", completed: true, time: "45 min" },
      { type: "exercise", title: "Format String Vulnerability", language: "C/C++", completed: false, time: "28 min" },
      { type: "achievement", title: "Unlocked: Memory Master", description: "Fixed 10 memory bugs" }
    ]
  },
  {
    date: "2 days ago",
    activities: [
      { type: "exercise", title: "Double Free Bug", language: "C/C++", completed: true, time: "35 min" },
      { type: "exercise", title: "Integer Overflow in Allocation", language: "C/C++", completed: true, time: "29 min" }
    ]
  }
];

const achievements = [
  { title: "First Steps", description: "Completed first exercise", earned: true, date: "Nov 15, 2024" },
  { title: "Consistency King", description: "7 day coding streak", earned: true, date: "Nov 20, 2024" },
  { title: "Speed Demon", description: "Solve 10 exercises under 5 minutes", earned: true, date: "Nov 22, 2024" },
  { title: "Language Explorer", description: "Try all 4 programming languages", earned: false, progress: 75 },
  { title: "Problem Solver", description: "Complete 100 exercises", earned: false, progress: 78 },
  { title: "Perfectionist", description: "Get 100% on 50 exercises", earned: false, progress: 42 }
];

export default function Progress() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and celebrate your achievements.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Skill Progress
              </CardTitle>
              <CardDescription>
                Your progress across C/C++ security skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {securitySkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.level}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {skill.completed}/{skill.total} exercises
                      </span>
                    </div>
                    <ProgressBar value={skill.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weekly Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Complete 15 exercises</span>
                    <span className="text-sm text-muted-foreground">12/15</span>
                  </div>
                  <ProgressBar value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Practice for 8 hours</span>
                    <span className="text-sm text-muted-foreground">6.2/8h</span>
                  </div>
                  <ProgressBar value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Try new language (C++)</span>
                    <span className="text-sm text-muted-foreground">Started!</span>
                  </div>
                  <ProgressBar value={25} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your coding activity over the past few days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">{day.date}</h3>
                    <div className="space-y-3">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-surface">
                          {activity.type === 'exercise' ? (
                            <>
                              <div className={`w-2 h-2 rounded-full ${activity.completed ? 'bg-success' : 'bg-muted'}`} />
                              <div className="flex-1">
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {activity.language} • {activity.time}
                                </div>
                              </div>
                              {activity.completed && <CheckCircle className="w-4 h-4 text-success" />}
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4 text-warning" />
                              <div className="flex-1">
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-sm text-muted-foreground">{activity.description}</div>
                              </div>
                              <Star className="w-4 h-4 text-warning" />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
              <CardDescription>
                Unlock badges by completing challenges and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-lg border transition-all duration-200 ${
                    achievement.earned 
                      ? 'bg-gradient-surface border-primary/20 shadow-sm' 
                      : 'bg-muted/30 border-muted'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{achievement.title}</span>
                          {achievement.earned && <CheckCircle className="w-4 h-4 text-success" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        {achievement.earned ? (
                          <span className="text-xs text-success">Earned {achievement.date}</span>
                        ) : (
                          <div className="space-y-1">
                            <ProgressBar value={achievement.progress} className="h-1" />
                            <span className="text-xs text-muted-foreground">
                              {achievement.progress}% complete
                            </span>
                          </div>
                        )}
                      </div>
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