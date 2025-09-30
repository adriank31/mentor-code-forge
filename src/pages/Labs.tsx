import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Search, Clock, Lock } from "lucide-react";
import { labs } from "@/data/labs";
import { useNavigate } from "react-router-dom";

const bugTypes = ["Memory", "Concurrency", "I/O", "Parsing", "Hardening"];

export default function Labs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBugTypes, setSelectedBugTypes] = useState<string[]>([]);

  const toggleBugType = (bugType: string) => {
    setSelectedBugTypes(prev =>
      prev.includes(bugType) ? prev.filter(t => t !== bugType) : [...prev, bugType]
    );
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBugType = selectedBugTypes.length === 0 || selectedBugTypes.includes(lab.bugType);
    return matchesSearch && matchesBugType;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Secure C/C++ Labs</h1>
        <p className="text-muted-foreground">
          Practice fixing real security bugs in hands-on coding labs.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search labs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Bug Type</div>
            <div className="flex flex-wrap gap-2">
              {bugTypes.map((bugType) => (
                <Badge
                  key={bugType}
                  variant={selectedBugTypes.includes(bugType) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleBugType(bugType)}
                >
                  {bugType}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLabs.map((lab) => (
          <Card key={lab.slug} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {lab.title}
                    {lab.proOnly && <Lock className="w-4 h-4 text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription className="mt-2">{lab.summary}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <DifficultyBadge difficulty={lab.difficulty} />
                <Badge variant="secondary">{lab.bugType}</Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {lab.estMinutes} min
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate(`/labs/${lab.slug}`)}
              >
                Start Lab
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
