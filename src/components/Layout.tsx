import { useState } from "react";
import { TopNav } from "@/components/navigation/TopNav";
import { Sidebar } from "@/components/navigation/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}