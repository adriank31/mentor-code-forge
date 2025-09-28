import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Copy, Share, Save, FileText, Terminal, Zap } from "lucide-react";

const sampleCode = `// Welcome to C/C++ Playground
// Try running this code or write your own!

#include <iostream>
#include <vector>
#include <memory>
#include <chrono>

class Timer {
private:
    std::chrono::high_resolution_clock::time_point start;
    
public:
    Timer() : start(std::chrono::high_resolution_clock::now()) {}
    
    ~Timer() {
        auto end = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
        std::cout << "Execution time: " << duration.count() << " microseconds\\n";
    }
};

// Example: Smart pointer usage and RAII
void demonstrateSmartPointers() {
    Timer timer; // RAII - destructor will print timing
    
    // Using smart pointers for automatic memory management
    auto numbers = std::make_unique<std::vector<int>>();
    
    // Fill vector with some data
    for(int i = 0; i < 10; ++i) {
        numbers->push_back(i * i);
    }
    
    std::cout << "Squares of first 10 numbers:\\n";
    for(const auto& num : *numbers) {
        std::cout << num << " ";
    }
    std::cout << "\\n";
    
    // Memory automatically freed when unique_ptr goes out of scope
}

int main() {
    std::cout << "C++ Smart Pointer and RAII Demo\\n";
    std::cout << "================================\\n";
    
    demonstrateSmartPointers();
    
    return 0;
}`;

export default function CppPlayground() {
  const [code, setCode] = useState(sampleCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Simulate code compilation and execution
    setTimeout(() => {
      setOutput(`Compiling with g++ -std=c++17 -O2...
Compilation successful!

Running executable...
C++ Smart Pointer and RAII Demo
================================
Squares of first 10 numbers:
0 1 4 9 16 25 36 49 64 81 
Execution time: 42 microseconds

Process finished with exit code 0

Memory usage: 2.1 MB
Peak memory: 2.3 MB`);
      setIsRunning(false);
    }, 2000);
  };

  const handleExplain = () => {
    setOutput(`Code Analysis:

1. Headers & Includes:
   - <iostream>: Standard I/O operations
   - <vector>: Dynamic array container
   - <memory>: Smart pointer utilities
   - <chrono>: High-resolution timing

2. RAII Pattern (Resource Acquisition Is Initialization):
   - Timer class acquires resource in constructor
   - Automatically releases in destructor
   - Guarantees cleanup even with exceptions

3. Smart Pointers:
   - std::unique_ptr: Exclusive ownership
   - Automatic memory management
   - Exception-safe resource handling
   - No manual delete required

4. Modern C++ Features:
   - Auto type deduction
   - Range-based for loops
   - Make functions for smart pointers
   - RAII for deterministic cleanup

5. Memory Safety:
   - No raw pointers used
   - Automatic cleanup
   - Exception-safe code
   - Zero memory leaks`);
  };

  const handleClear = () => {
    setCode("");
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleSave = () => {
    alert("Code saved to your workspace!");
  };

  const handleShare = () => {
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            C/C++ Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Write, compile, and run C/C++ code with modern standards and optimization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            GCC 13.2
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            C++17
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
              placeholder="Write your C/C++ code here..."
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
                Compilation & Output
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
                  Compilation output and program results will appear here...
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
              Compiling...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Compile & Run
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
          Analyze Code
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-surface">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">⚡ C/C++ Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Memory Management:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Use smart pointers: <code className="bg-muted px-1 rounded">std::unique_ptr</code></li>
                <li>• RAII pattern for resource management</li>
                <li>• Avoid raw <code className="bg-muted px-1 rounded">new</code> and <code className="bg-muted px-1 rounded">delete</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Modern C++ Features:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Auto type deduction: <code className="bg-muted px-1 rounded">auto var = value;</code></li>
                <li>• Range-based loops: <code className="bg-muted px-1 rounded">for(auto& item : container)</code></li>
                <li>• Lambda functions: <code className="bg-muted px-1 rounded">[](int x) {'{'} return x*2; {'}'}</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}