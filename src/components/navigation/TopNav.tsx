import { Bell, Menu, User, Settings, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TopNavProps {
  onMenuClick: () => void;
}

const navItems = [
  { name: "Practice", href: "/practice" },
  { name: "Paths", href: "/paths" },
  { name: "Pricing", href: "/pricing" },
];

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error('Portal error:', error);
        toast({
          title: "Couldn't open portal",
          description: "Try again or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (err: unknown) {
      console.error('Error opening customer portal:', err);
      toast({
        title: "Couldn't open portal",
        description: "Try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">CureCee</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              {profile?.is_pro && (
                <Badge variant="default" className="hidden sm:flex">PRO</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/progress')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Progress
                  </DropdownMenuItem>
                  {profile?.is_pro && (
                    <DropdownMenuItem onClick={handleManageSubscription} disabled={loading}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {loading ? "Loading..." : "Manage Subscription"}
                    </DropdownMenuItem>
                  )}
                  {!profile?.is_pro && (
                    <DropdownMenuItem onClick={() => navigate('/pricing')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button variant="hero" size="sm" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
