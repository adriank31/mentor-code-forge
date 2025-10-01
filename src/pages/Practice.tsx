import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Clock, Loader2, Lock } from "lucide-react";
import { puzzles } from "@/data/puzzles";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["Embedded Systems", "Systems Programming", "Firmware Engineering", "Cybersecurity Engineering", "Toolchain Developer"];

export default function Practice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [completionCounts, setCompletionCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("puzzle_completions")
          .select("puzzle_slug")
          .eq("user_id", user.id);

        if (error) throw error;

        // Count completions by category
        const counts: Record<string, number> = {};
        categories.forEach(cat => counts[cat] = 0);

        data?.forEach(completion => {
          const puzzle = puzzles.find(p => p.slug === completion.puzzle_slug);
          if (puzzle) {
            counts[puzzle.category] = (counts[puzzle.category] || 0) + 1;
          }
        });

        setCompletionCounts(counts);
      } catch (error: any) {
        console.error("Error fetching completions:", error);
        toast({
          title: "Error loading progress",
          description: "Could not load your completion progress",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompletions();
  }, [user, toast]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredPuzzles = puzzles.filter(puzzle => {
    const matchesSearch = puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         puzzle.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || puzzle.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(puzzle.category);
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getCategoryCount = (category: string) => {
    return puzzles.filter(p => p.category === category).length;
  };

  const getCompletedCount = (category: string) => {
    return completionCounts[category] || 0;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">C/C++ Practice Puzzles</h1>
        <p className="text-muted-foreground">
          Sharpen your skills with algorithmic and security puzzles focusing on C/C++ fundamentals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const total = getCategoryCount(category);
                const completed = getCompletedCount(category);
                const percentage = total > 0 ? (completed / total) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        {completed} / {total}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search puzzles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Category</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPuzzles.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No puzzles match your filters.</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedDifficulty("all");
              setSelectedCategories([]);
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPuzzles.map((puzzle) => (
            <Card key={puzzle.slug} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{puzzle.title}</CardTitle>
                    <CardDescription className="mt-2">{puzzle.summary}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <DifficultyBadge difficulty={puzzle.difficulty} />
                  <Badge variant="secondary">{puzzle.category}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {puzzle.estMinutes} min
                  </Badge>
                  {puzzle.proOnly && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Pro
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {puzzle.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/practice/puzzles/${puzzle.slug}`)}
                >
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
