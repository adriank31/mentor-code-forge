import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

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
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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
              <Button variant="hero" size="sm" onClick={signOut}>
                Sign Out
              </Button>
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
