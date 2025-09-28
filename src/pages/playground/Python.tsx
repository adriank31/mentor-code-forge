import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Square, Copy, Share, Save, FileText, Terminal } from "lucide-react";

const sampleCode = `# Welcome to Python Playground
# Try running this code or write your own!

def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

# Example usage
n_terms = 10
result = fibonacci(n_terms)
print(f"First {n_terms} Fibonacci numbers:")
print(result)

# Try modifying the code above or write your own!
`;

export default function PythonPlayground() {
  const [code, setCode] = useState(sampleCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`First 10 Fibonacci numbers:
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

Process finished with exit code 0`);
      setIsRunning(false);
    }, 1500);
  };

  const handleExplain = () => {
    setOutput(`Code Analysis:

1. Function Definition: 'fibonacci(n)'
   - Calculates Fibonacci sequence up to n terms
   - Uses iterative approach for efficiency

2. Edge Cases Handled:
   - n <= 0: Returns empty list
   - n == 1: Returns [0]
   - n == 2: Returns [0, 1]

3. Algorithm:
   - Initializes with [0, 1]
   - Iteratively calculates next terms
   - Time complexity: O(n)
   - Space complexity: O(n)

4. Example Usage:
   - Calls function with n=10
   - Prints formatted result`);
  };

  const handleClear = () => {
    setCode("");
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleSave = () => {
    // Simulate save functionality
    alert("Code saved to your workspace!");
  };

  const handleShare = () => {
    // Simulate share functionality  
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🐍</span>
            Python Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Write, run, and experiment with Python code in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Python 3.11
          </Badge>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Code Editor Panel */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Code Editor
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <Square className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your Python code here..."
              className="h-full resize-none border-0 rounded-none font-mono text-sm p-4 min-h-96"
            />
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-auto min-h-96">
              {output ? (
                <pre className="whitespace-pre-wrap text-foreground">{output}</pre>
              ) : (
                <div className="text-muted-foreground italic">
                  Output will appear here when you run your code...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleRun} 
          disabled={isRunning}
          variant="hero"
          size="lg"
          className="min-w-32"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Run Code
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleExplain}
          variant="outline"
          size="lg"
          className="min-w-32"
        >
          <FileText className="w-5 h-5 mr-2" />
          Explain Code
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-surface">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">💡 Python Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Quick Start:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Use <code className="bg-muted px-1 rounded">print()</code> to see output</li>
                <li>• Try list comprehensions: <code className="bg-muted px-1 rounded">[x**2 for x in range(5)]</code></li>
                <li>• Import libraries: <code className="bg-muted px-1 rounded">import math</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Common Patterns:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Iterate: <code className="bg-muted px-1 rounded">for i, item in enumerate(list)</code></li>
                <li>• Conditional: <code className="bg-muted px-1 rounded">result if condition else default</code></li>
                <li>• Dictionary: <code className="bg-muted px-1 rounded">{'{'}'key': 'value'{'}'}</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}