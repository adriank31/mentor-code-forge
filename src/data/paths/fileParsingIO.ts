import { Module } from "../pathModules";

export const fileParsingIOModules: Module[] = [
  {
    id: "module-1",
    title: "Safe File Operations",
    description: "Master secure file handling and I/O operations",
    lessons: [
      {
        id: "lesson-1-1",
        title: "File I/O Fundamentals",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# File I/O Fundamentals

## 📁 Opening Files Safely

### Using fstream (Recommended)

\`\`\`cpp
#include <fstream>
#include <iostream>

void safeReadFile(const std::string& filename) {
    std::ifstream file(filename);
    
    // Always check if file opened successfully
    if (!file.is_open()) {
        std::cerr << "Failed to open: " << filename << std::endl;
        return;
    }
    
    std::string line;
    while (std::getline(file, line)) {
        std::cout << line << std::endl;
    }
    
    // File automatically closed when 'file' goes out of scope
}
\`\`\`

### File Open Modes

\`\`\`cpp
std::ios::in      // Read mode
std::ios::out     // Write mode
std::ios::app     // Append mode
std::ios::binary  // Binary mode
std::ios::trunc   // Truncate existing file

// Combine modes with |
std::fstream file("data.txt", std::ios::in | std::ios::out);
\`\`\`

## 📖 Reading Files Safely

### Line-by-Line Reading

\`\`\`cpp
std::ifstream file("data.txt");
std::string line;

while (std::getline(file, line)) {
    // Process line safely
    // No buffer overflow possible!
}
\`\`\`

### Reading Entire File

\`\`\`cpp
std::ifstream file("data.txt");
std::string content((std::istreambuf_iterator<char>(file)),
                     std::istreambuf_iterator<char>());
\`\`\`

### Reading with Error Checking

\`\`\`cpp
std::ifstream file("data.txt");

if (!file) {
    std::cerr << "Cannot open file\\n";
    return;
}

int value;
while (file >> value) {
    // Process value
}

if (file.eof()) {
    std::cout << "End of file reached\\n";
} else if (file.fail()) {
    std::cerr << "Format error\\n";
}
\`\`\`

## ✍️ Writing Files Safely

### Basic Writing

\`\`\`cpp
std::ofstream file("output.txt");

if (!file) {
    std::cerr << "Cannot create file\\n";
    return;
}

file << "Hello World\\n";
file << 42 << " " << 3.14 << "\\n";
\`\`\`

### Appending to Files

\`\`\`cpp
std::ofstream file("log.txt", std::ios::app);
file << "New log entry\\n";
\`\`\`

### Formatted Output

\`\`\`cpp
#include <iomanip>

std::ofstream file("data.txt");
file << std::fixed << std::setprecision(2);
file << 3.14159 << "\\n";  // Writes: 3.14
\`\`\`

## 🔒 Binary File Operations

### Writing Binary

\`\`\`cpp
std::ofstream file("data.bin", std::ios::binary);

int values[] = {1, 2, 3, 4, 5};
file.write(reinterpret_cast<char*>(values), sizeof(values));
\`\`\`

### Reading Binary

\`\`\`cpp
std::ifstream file("data.bin", std::ios::binary);

int values[5];
file.read(reinterpret_cast<char*>(values), sizeof(values));
\`\`\`

## ⚠️ Common Pitfalls

### Not Checking if File Opened

\`\`\`cpp
// WRONG
std::ifstream file("data.txt");
std::string line;
std::getline(file, line);  // Might fail silently!

// RIGHT
std::ifstream file("data.txt");
if (!file.is_open()) {
    std::cerr << "Error opening file\\n";
    return;
}
\`\`\`

### Forgetting to Close

\`\`\`cpp
// WRONG
FILE* f = fopen("data.txt", "r");
// ... use file ...
// Forgot to fclose(f)!

// RIGHT - Use RAII
std::ifstream file("data.txt");
// Automatically closed
\`\`\`

### Buffer Overflow with C Functions

\`\`\`cpp
// DANGEROUS
char buffer[10];
FILE* f = fopen("data.txt", "r");
fgets(buffer, 100, f);  // Buffer overflow!

// SAFE
std::ifstream file("data.txt");
std::string line;
std::getline(file, line);  // No overflow possible
\`\`\`

## 🛡️ Exception Safety

\`\`\`cpp
void processFile(const std::string& filename) {
    std::ifstream file(filename);
    
    if (!file) {
        throw std::runtime_error("Cannot open file");
    }
    
    try {
        // Process file
        std::string line;
        while (std::getline(file, line)) {
            processLine(line);
        }
    } catch (const std::exception& e) {
        // File automatically closed even if exception thrown!
        std::cerr << "Error: " << e.what() << std::endl;
        throw;
    }
    // File automatically closed here too
}
\`\`\`

## 🎯 Best Practices

1. **Always check** if file opened successfully
2. **Use fstream** instead of C-style FILE*
3. **Use RAII** - let destructors close files
4. **Check errors** after I/O operations
5. **Use std::string** to avoid buffer overflows
6. **Handle exceptions** appropriately
7. **Use binary mode** for binary data

## 🎯 Key Takeaways

1. **fstream provides** safe, RAII file I/O
2. **Always check** file open status
3. **std::getline** prevents buffer overflows
4. **Files auto-close** with RAII
5. **Check errors** with fail(), eof(), etc.

Next: Parsing untrusted input safely!`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Safe File I/O Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Safe File I/O Challenge

## 🎯 Your Mission

Implement safe file reading and writing with proper error handling.

## 📋 Requirements

1. Write data to a file safely
2. Read the file back with error checking
3. Handle file open failures gracefully
4. Use RAII for automatic cleanup

## 💡 Hints

- Use std::ofstream for writing
- Use std::ifstream for reading  
- Check is_open() after opening
- Use std::getline for reading lines
- Files automatically close with RAII`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <fstream>
#include <string>

bool writeToFile(const std::string& filename, const std::string& content) {
    // TODO: Open file for writing
    
    
    // TODO: Check if opened successfully
    
    
    // TODO: Write content
    
    
    // TODO: Return success status
    
}

bool readFromFile(const std::string& filename) {
    // TODO: Open file for reading
    
    
    // TODO: Check if opened successfully
    
    
    // TODO: Read and print each line
    
    
    // TODO: Return success status
    
}

int main() {
    const std::string filename = "test.txt";
    const std::string content = "Line 1\\nLine 2\\nLine 3";
    
    std::cout << "Writing to file...\\n";
    // TODO: Call writeToFile
    
    
    std::cout << "Reading from file...\\n";
    // TODO: Call readFromFile
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <fstream>
#include <string>

bool writeToFile(const std::string& filename, const std::string& content) {
    // Open file for writing
    std::ofstream file(filename);
    
    // Check if opened successfully
    if (!file.is_open()) {
        std::cerr << "Error: Cannot create file " << filename << std::endl;
        return false;
    }
    
    // Write content
    file << content;
    
    std::cout << "Successfully wrote to " << filename << std::endl;
    return true;
    // File automatically closed here
}

bool readFromFile(const std::string& filename) {
    // Open file for reading
    std::ifstream file(filename);
    
    // Check if opened successfully
    if (!file.is_open()) {
        std::cerr << "Error: Cannot open file " << filename << std::endl;
        return false;
    }
    
    // Read and print each line
    std::string line;
    int lineNum = 1;
    while (std::getline(file, line)) {
        std::cout << "Line " << lineNum++ << ": " << line << std::endl;
    }
    
    // Check if we reached EOF (normal) or had an error
    if (file.eof()) {
        std::cout << "Successfully read entire file\\n";
    } else if (file.fail()) {
        std::cerr << "Error reading file\\n";
        return false;
    }
    
    return true;
    // File automatically closed here
}

int main() {
    const std::string filename = "test.txt";
    const std::string content = "Line 1\\nLine 2\\nLine 3";
    
    std::cout << "=== Writing to file ===\\n";
    if (!writeToFile(filename, content)) {
        return 1;
    }
    
    std::cout << "\\n=== Reading from file ===\\n";
    if (!readFromFile(filename)) {
        return 1;
    }
    
    std::cout << "\\n=== Success ===\\n";
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: File created successfully
// Test: Content written correctly
// Test: File read successfully
// Test: Error handling works
// Test: Files automatically closed (RAII)`,
          },
        },
      },
      {
        id: "lesson-1-3",
        title: "Quiz: File I/O Safety",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What's the safest way to handle files in C++?",
              options: [
                "Using fopen/fclose",
                "Using std::fstream with RAII",
                "Using system() calls",
                "Using raw file descriptors"
              ],
              correctAnswer: "b",
              explanation: "std::fstream with RAII is safest because files are automatically closed even if exceptions occur, preventing resource leaks."
            },
            {
              question: "What should you always do after opening a file?",
              options: [
                "Start reading immediately",
                "Check if it opened successfully",
                "Flush the buffer",
                "Seek to end"
              ],
              correctAnswer: "b",
              explanation: "Always check if the file opened successfully using is_open() or the file stream's boolean conversion before performing I/O operations."
            },
            {
              question: "Which function prevents buffer overflow when reading lines?",
              options: [
                "fgets()",
                "gets()",
                "std::getline()",
                "scanf()"
              ],
              correctAnswer: "c",
              explanation: "std::getline() with std::string is safe because std::string grows dynamically as needed, preventing buffer overflows."
            },
            {
              question: "When is a file automatically closed with fstream?",
              options: [
                "Never, you must call close()",
                "When the program ends",
                "When the stream object goes out of scope",
                "Only if you use a destructor"
              ],
              correctAnswer: "c",
              explanation: "fstream uses RAII - the file is automatically closed when the stream object goes out of scope, ensuring proper cleanup."
            },
            {
              question: "How do you check if you've reached end of file?",
              options: [
                "file.end()",
                "file.eof()",
                "file.finished()",
                "file.closed()"
              ],
              correctAnswer: "b",
              explanation: "The eof() member function returns true when end-of-file has been reached during reading operations."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "Parsing Untrusted Input",
    description: "Safely parse and validate external data",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Input Validation Techniques",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Validating Untrusted Input

Always validate and sanitize external data.

## Validation Strategies
- Whitelist validation
- Length checking
- Type checking
- Format validation`,
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Robust Error Handling",
    description: "Handle I/O errors gracefully",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Exception-Safe I/O",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# Exception-Safe I/O

Ensure resources are cleaned up even when errors occur.`,
        },
      },
    ],
  },
];
