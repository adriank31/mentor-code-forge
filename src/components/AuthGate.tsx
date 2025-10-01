import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (fallback) return <>{fallback}</>;

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Sign In Required
          </CardTitle>
          <CardDescription>
            You need to be signed in to solve puzzles and track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/auth")} className="w-full">
            Sign In to Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
