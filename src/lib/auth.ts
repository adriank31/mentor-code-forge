import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";

/** Returns: undefined (loading), null (logged out), or User (logged in) */
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.subscription?.unsubscribe?.();
    };
  }, []);

  return user;
}

/** GitHub OAuth sign-in */
export async function signInWithGithub() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "github" });
  if (error) throw error;
}

/** Email/password sign-in */
export async function signInWithEmail(params: { email: string; password: string }) {
  const { error } = await supabase.auth.signInWithPassword(params);
  if (error) throw error;
}

/** Sign out current user */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Redirects to "/" with a toast if unauthenticated */
export function useRequireAuth() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      toast({ title: "Authentication required", description: "Please sign in to continue" });
      navigate("/");
    }
  }, [user, navigate]);

  return user;
}
