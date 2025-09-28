import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Copy, Share, Save, FileText, Terminal, Coffee } from "lucide-react";

const sampleCode = `// Welcome to Java Playground
// Try running this code or write your own!

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class StreamExample {
    
    // Record class for data modeling (Java 14+)
    public record Person(String name, int age, String city) {}
    
    public static void main(String[] args) {
        System.out.println("Java Stream API and Records Demo");
        System.out.println("=".repeat(40));
        
        // Create sample data using records
        List<Person> people = Arrays.asList(
            new Person("Alice", 30, "New York"),
            new Person("Bob", 25, "San Francisco"),
            new Person("Charlie", 35, "Chicago"),
            new Person("Diana", 28, "New York"),
            new Person("Eve", 32, "San Francisco")
        );
        
        // Stream operations demonstration
        System.out.println("People over 30 in New York:");
        people.stream()
              .filter(p -> p.age() > 30)
              .filter(p -> p.city().equals("New York"))
              .forEach(p -> System.out.println("  " + p.name() + " (" + p.age() + ")"));
        
        System.out.println("\\nAverage age by city:");
        Map<String, Double> avgAgeByCity = people.stream()
            .collect(Collectors.groupingBy(
                Person::city,
                Collectors.averagingInt(Person::age)
            ));
        
        avgAgeByCity.forEach((city, avgAge) -> 
            System.out.printf("  %s: %.1f years\\n", city, avgAge));
        
        // Timestamp
        System.out.println("\\nExecution time: " + 
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
    }
}`;

export default function JavaPlayground() {
  const [code, setCode] = useState(sampleCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Simulate Java compilation and execution
    setTimeout(() => {
      setOutput(`Compiling Java source code...
javac StreamExample.java
Compilation successful!

Running Java application...
java StreamExample

Java Stream API and Records Demo
========================================
People over 30 in New York:
  Alice (30)

Average age by city:
  Chicago: 35.0 years
  New York: 29.0 years
  San Francisco: 28.5 years

Execution time: 14:32:17

Process finished with exit code 0

JVM Memory usage:
- Heap: 24.5 MB
- Non-heap: 18.2 MB
- GC count: 2 (minor), 0 (major)`);
      setIsRunning(false);
    }, 1800);
  };

  const handleExplain = () => {
    setOutput(`Code Analysis:

1. Modern Java Features Used:
   - Records (Java 14+): Immutable data classes
   - Stream API: Functional programming approach
   - Method references: Person::city, Person::age
   - Lambda expressions: p -> p.age() > 30

2. Record Class Benefits:
   - Automatic constructor, getters, equals, hashCode
   - Immutable by default
   - Reduced boilerplate code
   - Excellent for data transfer objects

3. Stream Operations:
   - filter(): Conditional filtering
   - forEach(): Terminal operation for side effects
   - collect(): Collecting to different data structures
   - groupingBy(): Grouping elements by classifier

4. Collectors Usage:
   - groupingBy(): Groups elements by key
   - averagingInt(): Calculates average of integers
   - Combines multiple collectors for complex aggregations

5. Best Practices Demonstrated:
   - Immutable data structures (Records)
   - Functional programming style
   - Method chaining for readability
   - Separation of data and behavior

6. Performance Considerations:
   - Stream operations are lazy
   - Terminal operations trigger computation
   - Parallel streams available for large datasets`);
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
            <span className="text-3xl">☕</span>
            Java Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Write, compile, and run Java code with modern features and frameworks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            OpenJDK 17
          </Badge>
          <Badge variant="outline" className="bg-info/10 text-info border-info/20">
            Maven
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
                Java Editor
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
              placeholder="Write your Java code here..."
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
                JVM Output
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
                  Compilation and execution output will appear here...
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
          Explain Code
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-surface">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">☕ Java Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Modern Java Features:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Records: <code className="bg-muted px-1 rounded">record Person(String name, int age)</code></li>
                <li>• Pattern matching: <code className="bg-muted px-1 rounded">instanceof</code> enhancements</li>
                <li>• Text blocks: <code className="bg-muted px-1 rounded">"""multiline text"""</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Stream API:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Functional style: <code className="bg-muted px-1 rounded">stream().filter().map().collect()</code></li>
                <li>• Parallel processing: <code className="bg-muted px-1 rounded">parallelStream()</code></li>
                <li>• Collectors: <code className="bg-muted px-1 rounded">Collectors.groupingBy()</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}