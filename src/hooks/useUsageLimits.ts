import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const FREE_LIMITS = {
  puzzles: 7,
  labs: 3,
  projects: 2,
};

export function useUsageLimits() {
  const { user, profile } = useAuth();
  const [usage, setUsage] = useState({
    puzzles: 0,
    labs: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [limitType, setLimitType] = useState<'puzzles' | 'labs' | 'projects' | null>(null);

  // Get the start of the current week (Sunday)
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (user && !profile?.is_pro) {
      loadUsage();
    } else {
      setLoading(false);
    }
  }, [user, profile?.is_pro]);

  const loadUsage = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const weekStart = getWeekStart();
      
      const { data, error } = await supabase
        .from('weekly_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading usage:', error);
        return;
      }

      if (data) {
        setUsage({
          puzzles: data.puzzles_completed,
          labs: data.labs_completed,
          projects: data.projects_started,
        });
      } else {
        // Create initial record for this week
        const { error: insertError } = await supabase
          .from('weekly_usage')
          .insert({
            user_id: user.id,
            week_start: weekStart,
            puzzles_completed: 0,
            labs_completed: 0,
            projects_started: 0,
          });

        if (insertError) {
          console.error('Error creating usage record:', insertError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = (type: 'puzzles' | 'labs' | 'projects'): boolean => {
    // Pro users have unlimited access
    if (profile?.is_pro) return true;
    
    const currentUsage = usage[type];
    const limit = FREE_LIMITS[type];
    
    if (currentUsage >= limit) {
      setLimitReached(true);
      setLimitType(type);
      return false;
    }
    
    return true;
  };

  const incrementUsage = async (type: 'puzzles' | 'labs' | 'projects') => {
    if (!user || profile?.is_pro) return;

    const weekStart = getWeekStart();
    const column = type === 'puzzles' ? 'puzzles_completed' 
                 : type === 'labs' ? 'labs_completed' 
                 : 'projects_started';

    const { error } = await supabase
      .from('weekly_usage')
      .upsert({
        user_id: user.id,
        week_start: weekStart,
        [column]: usage[type] + 1,
      }, {
        onConflict: 'user_id,week_start'
      });

    if (!error) {
      setUsage(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const dismissLimitDialog = () => {
    setLimitReached(false);
    setLimitType(null);
  };

  return {
    usage,
    limits: FREE_LIMITS,
    loading,
    checkLimit,
    incrementUsage,
    limitReached,
    limitType,
    dismissLimitDialog,
    isPro: profile?.is_pro || false,
  };
}
