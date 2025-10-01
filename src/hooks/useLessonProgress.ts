import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LessonProgressData {
  completed: boolean;
  score?: number;
}

export function useLessonProgress(pathSlug: string, moduleId: string, lessonId: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgressData>({ completed: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      const { data } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("path_slug", pathSlug)
        .eq("module_id", moduleId)
        .eq("lesson_id", lessonId)
        .single();

      if (data) {
        setProgress({ completed: data.completed, score: data.score });
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user, pathSlug, moduleId, lessonId]);

  const markComplete = async (score?: number) => {
    if (!user) return;

    await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      path_slug: pathSlug,
      module_id: moduleId,
      lesson_id: lessonId,
      completed: true,
      score,
      completed_at: new Date().toISOString(),
    });

    setProgress({ completed: true, score });
  };

  return { progress, loading, markComplete };
}
