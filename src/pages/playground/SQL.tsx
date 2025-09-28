import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Square, Copy, Share, Save, Database, BarChart3, FileText } from "lucide-react";

const sampleQuery = `-- Welcome to SQL Playground
-- Try running this query or write your own!

SELECT 
    emp.name,
    emp.department,
    emp.salary,
    dept.location
FROM employees emp
JOIN departments dept ON emp.department_id = dept.id
WHERE emp.salary > 50000
ORDER BY emp.salary DESC
LIMIT 10;

-- Sample data structure:
-- employees: id, name, department_id, salary, hire_date
-- departments: id, name, location, budget`;

const sampleResults = [
  { name: "Alice Johnson", department: "Engineering", salary: 95000, location: "San Francisco" },
  { name: "Bob Smith", department: "Engineering", salary: 87000, location: "San Francisco" },
  { name: "Carol Davis", department: "Marketing", salary: 72000, location: "New York" },
  { name: "David Wilson", department: "Sales", salary: 68000, location: "Chicago" },
  { name: "Emma Brown", department: "Engineering", salary: 65000, location: "San Francisco" },
];

export default function SQLPlayground() {
  const [query, setQuery] = useState(sampleQuery);
  const [results, setResults] = useState<typeof sampleResults>([]);
  const [limit, setLimit] = useState("100");
  const [isRunning, setIsRunning] = useState(false);
  const [queryStats, setQueryStats] = useState("");

  const handleRun = () => {
    setIsRunning(true);
    // Simulate query execution
    setTimeout(() => {
      setResults(sampleResults);
      setQueryStats(`Query executed successfully
Execution time: 0.042s
Rows returned: ${sampleResults.length}
Rows examined: 1,247`);
      setIsRunning(false);
    }, 1200);
  };

  const handleExplain = () => {
    setResults([]);
    setQueryStats(`Query Execution Plan:

1. Table Scan: employees (1,000 rows)
   - Filter: salary > 50000 (estimated 400 rows)
   - Cost: 2.1

2. Index Lookup: departments 
   - Join condition: emp.department_id = dept.id
   - Cost: 0.8

3. Hash Join: employees + departments
   - Join type: INNER JOIN
   - Estimated rows: 400
   - Cost: 1.5

4. Sort: ORDER BY salary DESC
   - Algorithm: QuickSort
   - Cost: 0.3

5. Limit: TOP 10 rows
   - Cost: 0.1

Total estimated cost: 4.8
Expected execution time: ~0.05s`);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setQueryStats("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
  };

  const handleSave = () => {
    alert("Query saved to your workspace!");
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
            <span className="text-3xl">🗃️</span>
            SQL Playground
          </h1>
          <p className="text-muted-foreground mt-1">
            Write, execute, and analyze SQL queries with our interactive database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            PostgreSQL 15
          </Badge>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Query Editor Panel */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                SQL Editor
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Write your SQL query here..."
              className="h-full resize-none border-0 rounded-none font-mono text-sm p-4"
            />
          </CardContent>
          
          {/* Query Controls */}
          <CardContent className="pt-0">
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Limit:</label>
                <Input
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-20 h-8"
                  placeholder="100"
                />
              </div>
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
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Query Results
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {results.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Salary</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell className="text-right">${row.salary.toLocaleString()}</TableCell>
                        <TableCell>{row.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">
                Results will appear here when you run your query...
              </div>
            )}
          </CardContent>
          
          {/* Query Stats */}
          {queryStats && (
            <CardContent className="pt-0">
              <div className="pt-4 border-t">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/30 p-3 rounded">
                  {queryStats}
                </pre>
              </div>
            </CardContent>
          )}
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
              Run Query
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
          Explain Plan
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-surface">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">💡 SQL Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Query Optimization:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Use indexes on frequently queried columns</li>
                <li>• Limit results with <code className="bg-muted px-1 rounded">LIMIT</code> clause</li>
                <li>• Use <code className="bg-muted px-1 rounded">WHERE</code> before <code className="bg-muted px-1 rounded">ORDER BY</code></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Join Types:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• <code className="bg-muted px-1 rounded">INNER JOIN</code>: Only matching rows</li>
                <li>• <code className="bg-muted px-1 rounded">LEFT JOIN</code>: All left table rows</li>
                <li>• <code className="bg-muted px-1 rounded">RIGHT JOIN</code>: All right table rows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}