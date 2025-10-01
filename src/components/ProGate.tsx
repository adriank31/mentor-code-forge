import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProGate({ children, fallback }: ProGateProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <Card className="max-w-2xl mx-auto my-12">
        <CardHeader className="text-center">
          <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to access this content
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!profile?.is_pro) {
    return fallback || (
      <Card className="max-w-2xl mx-auto my-12 border-primary/20">
        <CardHeader className="text-center">
          <Crown className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle>Pro Content</CardTitle>
          <CardDescription>
            Upgrade to Pro to access this exclusive content and features
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Pro members get access to:</p>
            <ul className="mt-2 space-y-1">
              <li>• Advanced labs with fuzzing tools</li>
              <li>• Exclusive security projects</li>
              <li>• Priority support</li>
              <li>• Badge of Completion</li>
            </ul>
          </div>
          <Button onClick={() => navigate('/pricing')} size="lg">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
