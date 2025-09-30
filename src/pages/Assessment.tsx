import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Assessment() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Skill Assessment</CardTitle>
          <CardDescription>
            Take our quick assessment to find the best learning path for your current skill level and goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Assessment coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
