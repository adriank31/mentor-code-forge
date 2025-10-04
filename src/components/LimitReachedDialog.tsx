import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Crown, XCircle } from 'lucide-react';

interface LimitReachedDialogProps {
  open: boolean;
  onClose: () => void;
  limitType: 'puzzles' | 'labs' | 'projects' | null;
  currentUsage: number;
  limit: number;
}

export function LimitReachedDialog({ 
  open, 
  onClose, 
  limitType,
  currentUsage,
  limit
}: LimitReachedDialogProps) {
  const navigate = useNavigate();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Only show if user hasn't seen the dialog before
    // Check localStorage instead of profile to avoid database dependency
    if (open) {
      const hasSeenDialog = localStorage.getItem('curecee:limit-dialog-seen');
      if (!hasSeenDialog) {
        setShouldShow(true);
        localStorage.setItem('curecee:limit-dialog-seen', 'true');
      }
    }
  }, [open]);

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  const getLimitText = () => {
    switch (limitType) {
      case 'puzzles':
        return {
          title: 'Weekly Practice Puzzle Limit Reached',
          description: `You've completed ${currentUsage} out of ${limit} free practice puzzles this week.`,
          feature: 'practice puzzles'
        };
      case 'labs':
        return {
          title: 'Weekly Lab Exercise Limit Reached',
          description: `You've completed ${currentUsage} out of ${limit} free lab exercises this week.`,
          feature: 'lab exercises'
        };
      case 'projects':
        return {
          title: 'Weekly Project Limit Reached',
          description: `You've started ${currentUsage} out of ${limit} free projects this week.`,
          feature: 'projects'
        };
      default:
        return {
          title: 'Weekly Limit Reached',
          description: 'You\'ve reached your weekly limit for free users.',
          feature: 'content'
        };
    }
  };

  const text = getLimitText();

  return (
    <AlertDialog open={open && shouldShow} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <XCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {text.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <p>{text.description}</p>
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-semibold text-foreground mb-2">Upgrade to Pro for unlimited access:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Unlimited {text.feature}</li>
                <li>✓ Access to all advanced features</li>
                <li>✓ Priority support</li>
                <li>✓ Badge of Completion</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="w-full sm:w-auto">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
