import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Terminal, Trophy, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  hidden?: boolean;
}

interface RunResultProps {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut?: boolean;
  testResults?: TestResult[];
  allTestsPassed?: boolean;
}

export function RunResult({ stdout, stderr, exitCode, timedOut, testResults, allTestsPassed }: RunResultProps) {
  const hasError = exitCode !== 0 || stderr.length > 0;
  const success = exitCode === 0 && !timedOut;

  // If test results are available, show test-based UI
  if (testResults && testResults.length > 0) {
    const passedCount = testResults.filter(t => t.passed).length;
    const totalCount = testResults.length;
    const percentage = (passedCount / totalCount) * 100;

    return (
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {allTestsPassed ? (
                <>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  All Tests Passed!
                </>
              ) : (
                <>
                  <Terminal className="w-5 h-5" />
                  Test Results
                </>
              )}
            </CardTitle>
            <Badge variant={allTestsPassed ? "default" : "secondary"} className="text-sm">
              {passedCount}/{totalCount} Passed
            </Badge>
          </div>
          <Progress value={percentage} className="h-2 mt-3" />
        </CardHeader>
        <CardContent className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
          {testResults.map((test, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg border ${
                test.passed 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {test.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      Test Case {idx + 1}
                    </span>
                    {test.hidden && (
                      <Badge variant="outline" className="text-xs">Hidden</Badge>
                    )}
                  </div>
                  
                  {!test.hidden && (
                    <>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Input:</span>
                          <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-x-auto">
                            {test.input}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span>
                          <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-x-auto">
                            {test.expectedOutput}
                          </pre>
                        </div>
                        {!test.passed && (
                          <div>
                            <span className="font-medium text-destructive">Got:</span>
                            <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-x-auto text-destructive">
                              {test.actualOutput || '(no output)'}
                            </pre>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Fallback to basic output UI if no test results
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
