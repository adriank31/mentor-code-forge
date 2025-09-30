import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUser, signInWithGithub, signOut } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

interface TopNavProps {
  onMenuClick: () => void;
}

const navItems = [
  { name: "Practice", href: "/practice" },
  { name: "Paths", href: "/paths" },
  { name: "Catalog", href: "/catalog" },
  { name: "Pricing", href: "/pricing" },
];

export function TopNav({ onMenuClick }: TopNavProps) {
  const user = useUser();

  const handleSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Sign in failed", description: message });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Error signing out", description: message });
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

          {/* Loading state shows Sign In; once user resolves, we switch */}
          {user ? (
            <Button variant="hero" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button variant="hero" size="sm" onClick={handleSignIn}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
