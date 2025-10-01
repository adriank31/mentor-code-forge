import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Search, Clock, Lock } from "lucide-react";
import { projects } from "@/data/projects";
import { useNavigate } from "react-router-dom";

const roles = ["Embedded", "Systems", "Firmware", "Security", "Toolchain"];

export default function Projects() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(project.role);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">C/C++ Projects</h1>
        <p className="text-muted-foreground">
          Build complete systems with real-world constraints and acceptance criteria.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Role</div>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge
                  key={role}
                  variant={selectedRoles.includes(role) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.slug} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {project.title}
                    {project.proOnly && <Lock className="w-4 h-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription className="mt-2">{project.summary}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <DifficultyBadge difficulty={project.difficulty} />
                <Badge variant="secondary">{project.role}</Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {project.estMinutes} min
                </Badge>
                {project.proOnly && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="w-3 h-3" />
                    Pro
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate(`/projects/${project.slug}`)}
              >
                Start Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
