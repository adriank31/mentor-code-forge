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

## Opening Files Safely

File I/O is a common source of security vulnerabilities. Using modern C++ file streams with proper error checking prevents many issues.

### Using fstream (Recommended)

The fstream library provides safe, RAII-based file operations:

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

Different modes control how files are accessed:

\`\`\`cpp
std::ios::in      // Read mode
std::ios::out     // Write mode
std::ios::app     // Append mode
std::ios::binary  // Binary mode
std::ios::trunc   // Truncate existing file

// Combine modes with bitwise OR
std::fstream file("data.txt", std::ios::in | std::ios::out);
\`\`\`

## Reading Files Safely

### Line-by-Line Reading

The safest way to read text files:

\`\`\`cpp
std::ifstream file("data.txt");
std::string line;

while (std::getline(file, line)) {
    // Process line safely
    // No buffer overflow possible!
}
\`\`\`

**Benefits:**
- std::string grows automatically
- No buffer size limits
- No buffer overflow risk
- Simple and clear code

### Reading Entire File

Load entire file contents into a string:

\`\`\`cpp
std::ifstream file("data.txt");
std::string content((std::istreambuf_iterator<char>(file)),
                     std::istreambuf_iterator<char>());
\`\`\`

### Reading with Error Checking

Always check for errors during file operations:

\`\`\`cpp
std::ifstream file("data.txt");

if (!file) {
    std::cerr << "Cannot open file" << std::endl;
    return;
}

int value;
while (file >> value) {
    // Process value
}

if (file.eof()) {
    std::cout << "End of file reached" << std::endl;
} else if (file.fail()) {
    std::cerr << "Format error" << std::endl;
}
\`\`\`

## Writing Files Safely

### Basic Writing

Write data safely with automatic buffering:

\`\`\`cpp
std::ofstream file("output.txt");

if (!file) {
    std::cerr << "Cannot create file" << std::endl;
    return;
}

file << "Hello World" << std::endl;
file << 42 << " " << 3.14 << std::endl;
\`\`\`

### Appending to Files

Add data to existing files:

\`\`\`cpp
std::ofstream file("log.txt", std::ios::app);
file << "New log entry" << std::endl;
\`\`\`

### Formatted Output

Control number formatting:

\`\`\`cpp
#include <iomanip>

std::ofstream file("data.txt");
file << std::fixed << std::setprecision(2);
file << 3.14159 << std::endl;  // Writes: 3.14
\`\`\`

## Binary File Operations

### Writing Binary Data

Write raw binary data:

\`\`\`cpp
std::ofstream file("data.bin", std::ios::binary);

int values[] = {1, 2, 3, 4, 5};
file.write(reinterpret_cast<char*>(values), sizeof(values));
\`\`\`

### Reading Binary Data

Read raw binary data:

\`\`\`cpp
std::ifstream file("data.bin", std::ios::binary);

int values[5];
file.read(reinterpret_cast<char*>(values), sizeof(values));
\`\`\`

## Common Pitfalls

### Not Checking if File Opened

\`\`\`cpp
// WRONG - No error checking
std::ifstream file("data.txt");
std::string line;
std::getline(file, line);  // Might fail silently!

// RIGHT - Check status
std::ifstream file("data.txt");
if (!file.is_open()) {
    std::cerr << "Error opening file" << std::endl;
    return;
}
\`\`\`

### Forgetting to Close

C-style file handles require manual closing:

\`\`\`cpp
// WRONG - C-style, easy to forget
FILE* f = fopen("data.txt", "r");
// ... use file ...
// Forgot to fclose(f)!

// RIGHT - Use RAII
std::ifstream file("data.txt");
// Automatically closed
\`\`\`

### Buffer Overflow with C Functions

C-style file functions are dangerous:

\`\`\`cpp
// DANGEROUS - Buffer overflow risk
char buffer[10];
FILE* f = fopen("data.txt", "r");
fgets(buffer, 100, f);  // Buffer overflow!

// SAFE - std::string grows automatically
std::ifstream file("data.txt");
std::string line;
std::getline(file, line);  // No overflow possible
\`\`\`

## Exception Safety

File operations should be exception-safe:

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

## Best Practices

**Always check if file opened successfully** before attempting operations.

**Use fstream instead of C-style FILE*** for automatic resource management and type safety.

**Use RAII** to ensure files are closed even when exceptions occur.

**Check errors after I/O operations** using fail(), eof(), and other state functions.

**Use std::string** to avoid buffer overflows when reading text data.

**Handle exceptions appropriately** to ensure cleanup and proper error reporting.

**Use binary mode** when working with binary data to avoid newline translation.

Next, we'll explore parsing untrusted input safely.`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Safe File I/O Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Safe File I/O Challenge

## Your Mission

Implement safe file reading and writing with proper error handling and resource management.

## Requirements

1. Write data to a file safely with error checking
2. Read the file back with bounds checking
3. Handle file open failures gracefully
4. Use RAII for automatic cleanup
5. Demonstrate exception safety

## Learning Objectives

- Practice using std::ofstream for writing
- Learn to use std::ifstream for reading
- Master error checking with is_open()
- Understand RAII for file handling
- See automatic resource cleanup in action

## Hints

- Use std::ofstream for writing
- Use std::ifstream for reading  
- Check is_open() after opening files
- Use std::getline for reading lines safely
- Files automatically close with RAII
- Return false on errors for proper error handling`,
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
    
    std::cout << "Writing to file..." << std::endl;
    // TODO: Call writeToFile
    
    
    std::cout << "Reading from file..." << std::endl;
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
        std::cout << "Successfully read entire file" << std::endl;
    } else if (file.fail()) {
        std::cerr << "Error reading file" << std::endl;
        return false;
    }
    
    return true;
    // File automatically closed here
}

int main() {
    const std::string filename = "test.txt";
    const std::string content = "Line 1\\nLine 2\\nLine 3";
    
    std::cout << "=== Writing to file ===" << std::endl;
    if (!writeToFile(filename, content)) {
        return 1;
    }
    
    std::cout << "\\n=== Reading from file ===" << std::endl;
    if (!readFromFile(filename)) {
        return 1;
    }
    
    std::cout << "\\n=== Success ===" << std::endl;
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: File created successfully
// Test: Content written correctly
// Test: File read successfully
// Test: Error handling works properly
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

## The Input Validation Problem

Never trust data from external sources. Unvalidated input is a leading cause of security vulnerabilities including buffer overflows, injection attacks, and data corruption.

## Validation Strategies

### Whitelist Validation (Preferred)

Only allow known good inputs:

\`\`\`cpp
bool isValidUsername(const std::string& username) {
    if (username.length() < 3 || username.length() > 20) {
        return false;
    }
    
    // Only allow alphanumeric characters
    for (char c : username) {
        if (!std::isalnum(c)) {
            return false;
        }
    }
    
    return true;
}
\`\`\`

### Length Checking

Always enforce maximum lengths:

\`\`\`cpp
if (input.length() > MAX_LENGTH) {
    // Reject or truncate
    input = input.substr(0, MAX_LENGTH);
}
\`\`\`

### Type Checking

Verify data types before processing:

\`\`\`cpp
try {
    int value = std::stoi(input);
    // Use value
} catch (const std::exception& e) {
    std::cerr << "Invalid integer" << std::endl;
}
\`\`\`

### Format Validation

Use regular expressions for complex patterns:

\`\`\`cpp
#include <regex>

bool isValidEmail(const std::string& email) {
    static const std::regex pattern(
        R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$)"
    );
    return std::regex_match(email, pattern);
}
\`\`\`

## Key Principles

**Always validate length** to prevent buffer overflows.

**Use whitelist validation** instead of blacklist when possible.

**Sanitize input** by removing dangerous characters.

**Validate early** before processing or storing data.

**Fail securely** by rejecting invalid input rather than trying to fix it.

Next, we'll explore robust error handling for I/O operations.`,
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

## Why Exception Safety Matters

I/O operations can fail in many ways: file not found, permission denied, disk full, network errors. Exception-safe code handles these failures gracefully without leaking resources.

## RAII for I/O

File streams automatically clean up even when exceptions are thrown:

\`\`\`cpp
void processFile(const std::string& filename) {
    std::ifstream file(filename);
    // File automatically closed even if exception thrown below
    
    if (!file) {
        throw std::runtime_error("Cannot open file");
    }
    
    // Process file...
}
\`\`\`

## Error Handling Patterns

### Check and Throw

\`\`\`cpp
if (!file.is_open()) {
    throw std::runtime_error("Failed to open file");
}
\`\`\`

### Try-Catch for Recovery

\`\`\`cpp
try {
    processFile("data.txt");
} catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << std::endl;
    // Attempt recovery or use default
}
\`\`\`

### Error Codes for Critical Paths

When exceptions aren't appropriate:

\`\`\`cpp
enum class FileError {
    Success,
    NotFound,
    PermissionDenied,
    Unknown
};

FileError readFile(const std::string& filename, std::string& content) {
    std::ifstream file(filename);
    if (!file) {
        return FileError::NotFound;
    }
    // Read file...
    return FileError::Success;
}
\`\`\`

## Key Takeaways

**Use RAII** for automatic resource cleanup even with exceptions.

**Throw exceptions for unexpected errors** that can't be handled locally.

**Use error codes** for expected failures in performance-critical code.

**Always clean up resources** regardless of success or failure.

This completes the File Parsing and I/O module.`,
        },
      },
    ],
  },
];
