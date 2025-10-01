import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Terminal } from "lucide-react";

interface RunResultProps {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut?: boolean;
}

export function RunResult({ stdout, stderr, exitCode, timedOut }: RunResultProps) {
  const hasError = exitCode !== 0 || stderr.length > 0;
  const success = exitCode === 0 && !timedOut;

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs defaultValue="output" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="output" className="gap-2">
              <Terminal className="w-4 h-4" />
              Output
            </TabsTrigger>
            <TabsTrigger value="errors" className="gap-2">
              {hasError ? (
                <AlertCircle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              Errors
            </TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="output" className="p-4 m-0">
            <pre className="text-sm font-mono whitespace-pre-wrap bg-muted p-3 rounded min-h-[100px]">
              {stdout || "(no output)"}
            </pre>
          </TabsContent>

          <TabsContent value="errors" className="p-4 m-0">
            <pre className="text-sm font-mono whitespace-pre-wrap bg-muted p-3 rounded min-h-[100px] text-destructive">
              {stderr || (success ? "No errors" : "(no error output)")}
            </pre>
          </TabsContent>

          <TabsContent value="details" className="p-4 m-0 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Exit Code:</span>
              <span className={exitCode === 0 ? "text-green-500" : "text-destructive"}>
                {exitCode}
              </span>
            </div>
            {timedOut && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span>Execution timed out</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {success ? "Program executed successfully" : "Program encountered errors"}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
