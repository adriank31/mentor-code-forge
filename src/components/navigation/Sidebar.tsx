import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Code, 
  BookOpen, 
  TrendingUp, 
  Users, 
  FileText,
  X,
  Home,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Practice", href: "/practice", icon: Code },
  { name: "Paths", href: "/paths", icon: BookOpen },
  { name: "Catalog", href: "/catalog", icon: Library },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Community", href: "/community", icon: Users },
  { name: "Docs", href: "/docs", icon: FileText },
];

const playgroundItems = [
  { name: "Python", href: "/playground/python" },
  { name: "SQL", href: "/playground/sql" },
  { name: "C/C++", href: "/playground/cpp" },
  { name: "Java", href: "/playground/java" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform border-r border-border bg-sidebar transition-transform duration-200 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex h-16 items-center justify-between px-4 md:hidden">
            <span className="font-semibold">Navigation</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Playgrounds Section */}
            <div className="pt-6">
              <div className="px-3 pb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Playgrounds
                </h3>
              </div>
              <div className="space-y-1">
                {playgroundItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => window.innerWidth < 768 && onClose()}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )
                    }
                  >
                    <Code className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}