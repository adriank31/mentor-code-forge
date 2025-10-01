import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Lock, BookOpen, Clock } from "lucide-react";
import { courses } from "@/data/courses";
import { ProGate } from "@/components/ProGate";
import { AuthGate } from "@/components/AuthGate";

export default function CourseDetail() {
  const { slug } = useParams();
  const course = courses.find(c => c.slug === slug);

  if (!course) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
        <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  const content = (
    <div className="p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                {course.title}
                {course.proOnly && <Lock className="w-6 h-6 text-muted-foreground" />}
              </CardTitle>
              <p className="text-muted-foreground">{course.summary}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <DifficultyBadge difficulty={course.difficulty} />
            <Badge variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              {course.lessons} lessons
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              ~{Math.floor(course.estMinutes / 60)}h
            </Badge>
            {course.proOnly && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="w-3 h-3" />
                Pro Only
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Button size="lg">Start Course</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Syllabus</h2>
        {Array.from({ length: course.lessons }, (_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-lg">Lesson {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Lesson content placeholder</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const gatedContent = course.proOnly ? <ProGate>{content}</ProGate> : content;
  return <AuthGate>{gatedContent}</AuthGate>;
}
