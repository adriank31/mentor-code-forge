import { Module } from "../pathModules";

// This module defines a learning path for safe file parsing and I/O in C++.
// It retains the same UI/UX structure used across the application while greatly
// expanding the instructional content. Each lesson now provides a deeper
// explanation of concepts, clearer organization, and concrete examples to
// reinforce best practices for handling files and untrusted data in C++.

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
          markdown: `# Safe File Operations

## Why Safe File I/O Matters

File input/output appears simple, but it is a major source of bugs and security vulnerabilities. Improper handling can lead to buffer overflows, data corruption, resource leaks, and even code execution. Modern C++ provides safer abstractions that make it easy to open, read, write, and close files without resorting to fragile C APIs.

## Opening Files Safely

Always use RAII-based file streams (\`std::ifstream\`, \`std::ofstream\`, \`std::fstream\`) instead of C functions like \`fopen\`/\`fclose\`. These classes open the file in their constructor and automatically close it in their destructor, even if exceptions are thrown. Always check whether the file opened successfully before reading or writing.

// ...
#include <fstream>
#include <iostream>
#include <string>

void safeRead(const std::string& filename) {
    std::ifstream in(filename, std::ios::in);
    if (!in.is_open()) {
        std::cerr << "Error: Cannot open " << filename << std::endl;
        return;
    }
    // RAII ensures in.close() is called automatically
}
```

**File open modes** control how the file is accessed. You can combine them using the bitwise OR operator:

// ...
std::ios::in      // open for reading
std::ios::out     // open for writing (truncate by default)
std::ios::app     // append to the end of the file
std::ios::binary  // open in binary mode
std::ios::trunc   // truncate existing file on open

// Example: open a file for both reading and writing without truncating
std::fstream file("data.txt", std::ios::in | std::ios::out);
```

## Reading Files

### Line-by-Line Reading

The safest way to process text files is to read one line at a time into a \`std::string\`. The string automatically grows as needed, so there is no risk of overflowing a fixed-size buffer.

// ...
std::ifstream in("data.txt");
std::string line;
while (std::getline(in, line)) {
    // process line
}
```

**Advantages:**

- \`std::string\` manages its own memory and grows automatically.
- No predetermined buffer size, so there is no overflow.
- The loop terminates cleanly at end of file.

### Reading Entire File

Sometimes it is convenient to load the entire contents of a file into a single string. You can use input iterators to do this concisely:

// ...
std::ifstream in("data.txt");
std::string content((std::istreambuf_iterator<char>(in)),
                    std::istreambuf_iterator<char>());
```

### Reading with Error Checking

Always check the state of the stream after reading. The \`eof()\` flag tells you if you have reached end-of-file, while \`fail()\` indicates an input error (such as a format mismatch).

// ...
std::ifstream in("values.txt");
if (!in) {
    std::cerr << "Cannot open values.txt\n";
    return;
}

int value;
while (in >> value) {
    // use value
}

if (in.eof()) {
    std::cout << "End of file reached\n";
} else if (in.fail()) {
    std::cerr << "Format error while reading values\n";
}
```

## Writing Files

### Basic Writing

Use \`std::ofstream\` to write text to a file. Always check that the file opened successfully before writing.

// ...
std::ofstream out("output.txt");
if (!out) {
    std::cerr << "Error: cannot create output.txt\n";
    return;
}
out << "Hello, world!" << std::endl;
out << 42 << " " << 3.14 << std::endl;
```

### Appending to Files

To add data to an existing file without truncating it, open the file in append mode:

// ...
std::ofstream log("log.txt", std::ios::app);
log << "New entry\n";
```

### Formatted Output

The \`<iomanip>\` header provides manipulators like \`std::fixed\`, \`std::scientific\`, and \`std::setprecision\` to control the formatting of floating-point numbers.

// ...
#include <iomanip>

std::ofstream out("data.txt");
out << std::fixed << std::setprecision(2);
out << 3.14159 << std::endl; // outputs 3.14
```

## Binary File Operations

When dealing with binary data, you must open files in binary mode to prevent unwanted newline translation. Use \`write()\` to write raw bytes and \`read()\` to read them back.

// ...
// Writing binary data
std::ofstream out("data.bin", std::ios::binary);
int values[] = {1, 2, 3, 4, 5};
out.write(reinterpret_cast<const char*>(values), sizeof(values));

// Reading binary data
std::ifstream in("data.bin", std::ios::binary);
int buffer[5];
in.read(reinterpret_cast<char*>(buffer), sizeof(buffer));
```

## Common Pitfalls and How to Avoid Them

### Failing to Check if a File Opened

Never assume a file opened correctly. Use \`is_open()\` or the stream’s boolean conversion before attempting any operations.

// ...
std::ifstream in("missing.txt");
if (!in) {
    std::cerr << "Unable to open file\n";
    return;
}
```

### Forgetting to Close Files

C-style file handles returned by \`fopen()\` must be closed manually, and forgetting to call \`fclose()\` leads to resource leaks. Prefer RAII-based streams that close themselves automatically.

### Buffer Overflows with C APIs

Functions like \`fgets()\` and \`scanf()\` require you to provide a buffer and specify its size. Using an incorrect size can lead to buffer overflows. Instead, use \`std::string\` and \`std::getline()\`, which manage memory for you.

### Handling Partial Reads and Writes

On some systems, especially when working with pipes or sockets, a call to \`read()\` or \`write()\` may transfer fewer bytes than requested. Loop until the full amount is transferred. The standard library stream functions hide these details for file I/O.

## Exception Safety

File operations should be exception safe. Use RAII to ensure that resources are cleaned up when exceptions occur, and wrap operations in \`try\`/\`catch\` blocks where recovery is possible.

// ...
void processFile(const std::string& filename) {
    std::ifstream in(filename);
    if (!in) {
        throw std::runtime_error("Cannot open " + filename);
    }

    try {
        std::string line;
        while (std::getline(in, line)) {
            handleLine(line);
        }
    } catch (const std::exception& ex) {
        // the ifstream 'in' is still closed automatically
        std::cerr << "Error processing file: " << ex.what() << std::endl;
        throw; // rethrow to caller if needed
    }
}
```

## Best Practices

- **Always check** that the file was opened successfully.
- **Prefer fstream classes** over C APIs for automatic resource management.
- **Read using std::getline()** and \`std::string\` to avoid fixed-size buffers.
- **Use binary mode** when reading or writing binary data.
- **Handle errors** immediately after reading or writing using \`eof()\` and \`fail()\`.
- **Use RAII** to ensure resources are released even in the presence of exceptions.
- **Format output intentionally** with \`<iomanip>\` for consistency.

This lesson provided a foundation for safe, secure file I/O. Next, you will learn how to handle untrusted data and parse inputs defensively.
`,
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

- Practice using \`std::ofstream\` for writing
- Learn to use \`std::ifstream\` for reading
- Master error checking with \`is_open()\`
- Understand RAII for file handling
- See automatic resource cleanup in action

## Hints

- Use \`std::ofstream\` for writing
- Use \`std::ifstream\` for reading
- Check \`is_open()\` after opening files
- Use \`std::getline\` for reading lines safely
- Files automatically close with RAII
- Return false on errors for proper error handling
`,
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
    const std::string content = "Line 1\nLine 2\nLine 3";
    
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
    const std::string content = "Line 1\nLine 2\nLine 3";
    
    std::cout << "=== Writing to file ===" << std::endl;
    if (!writeToFile(filename, content)) {
        return 1;
    }
    
    std::cout << "\n=== Reading from file ===" << std::endl;
    if (!readFromFile(filename)) {
        return 1;
    }
    
    std::cout << "\n=== Success ===" << std::endl;
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: File created successfully
// Test: Content written correctly
// Test: File read successfully
// Test: Error handling works properly
// Test: Files automatically closed (RAII)`
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

## Why Input Validation Matters

Every external input to your program—data from users, files, network sockets, environment variables—must be treated as untrusted. Failing to validate and sanitize it can lead to buffer overflows, injection attacks (SQL, command, format string), path traversal, and data corruption. Attackers often craft malicious inputs precisely to exploit these weaknesses. Proper validation is your first line of defense.

## Principles of Input Validation

- **Accept known good, reject everything else (whitelisting)**. It is much easier to define a set of valid inputs (alphanumeric user names, specific command keywords, allowed file types) than it is to enumerate all possible malicious patterns.
- **Validate length** before copying or parsing to prevent buffer overflows.
- **Validate type** by converting strings to numeric types using functions like \`std::stoi()\`, \`std::stol()\`, or \`std::from_chars()\` inside a try/catch to detect invalid formats.
- **Validate format** using regular expressions for complex patterns like email addresses, IPv4 addresses, or dates.
- **Sanitize and escape** by removing or replacing characters that have special meaning in commands, file names, or queries (e.g., \`;\`, \`&\`, \`|\`, backticks).
- **Canonicalize** input (normalize file paths with \`std::filesystem::canonical\`) before validating to avoid bypasses using relative paths like \`../\`.

Validate as early as possible—ideally right at the boundary of your application—before the data is ever used.

## Whitelisting Example: User Name

Allow only alphanumeric characters and enforce a reasonable length.

// ...
bool isValidUsername(const std::string& username) {
    if (username.length() < 3 || username.length() > 20) {
        return false;
    }
    for (char c : username) {
        if (!std::isalnum(static_cast<unsigned char>(c))) {
            return false;
        }
    }
    return true;
}
```

## Length and Type Checking

If you expect a numeric value, enforce length and convert it safely:

// ...
const size_t MAX_LENGTH = 10;
std::string input = getInputFromUser();
if (input.length() > MAX_LENGTH) {
    std::cerr << "Input too long\n";
    // reject or truncate input
}

try {
    int value = std::stoi(input);
    // use value
} catch (const std::exception&) {
    std::cerr << "Invalid number\n";
    // reject input
}
```

## Format Validation with Regular Expressions

For complex formats like email addresses or IPv4 addresses, use \`std::regex\`:

// ...
#include <regex>

bool isValidEmail(const std::string& email) {
    static const std::regex pattern(
        R"(^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$)"
    );
    return std::regex_match(email, pattern);
}
```

## Sanitizing Dangerous Characters

When accepting free-form input (e.g., chat messages), remove or escape characters that could be interpreted by downstream components (shells, SQL engines):

// ...
std::string sanitize(const std::string& input) {
    std::string result;
    for (char c : input) {
        switch (c) {
            case ';':
            case '&':
            case '|':
            case '`':
            case '$':
            case '>':
                // skip dangerous characters or encode them
                continue;
            default:
                result += c;
        }
    }
    return result;
}
```

## Path Validation and Canonicalization

When working with file names provided by users, ensure they do not escape the intended directory. Use \`std::filesystem\` (C++17) to canonicalize and check the path:

// ...
#include <filesystem>
bool isValidPath(const std::filesystem::path& base, const std::filesystem::path& userPath) {
    auto canon = std::filesystem::weakly_canonical(base / userPath);
    return canon.string().rfind(base.string(), 0) == 0; // path starts with base
}
```

## Key Takeaways

- Validate every piece of external data before using it.
- Use whitelisting and length checks to constrain inputs to expected formats.
- Use \`std::regex\` for complex pattern validation.
- Sanitize or escape characters that may have special meaning in other contexts.
- Canonicalize file paths before validation to avoid directory traversal.
- Fail securely: when input is invalid, reject it and log the error rather than trying to guess what the user intended.

Next, you'll learn how to handle errors and exceptions robustly during I/O and parsing.
`,
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

## Why Robust Error Handling Matters

Real programs run in unpredictable environments: files may not exist, network connections may drop, disks may fill up, or input may be malformed. Without robust error handling, such failures lead to crashes, resource leaks, corrupted data, or security vulnerabilities. Your code should gracefully detect and handle errors, cleaning up resources and communicating problems to the caller.

## RAII and Resource Safety

Resource Acquisition Is Initialization (RAII) is a core C++ idiom: acquire a resource (file handle, mutex, network socket) in an object's constructor and release it in the destructor. This ensures that resources are always freed when the object goes out of scope, even if exceptions are thrown.

// ...
void readFile(const std::string& filename) {
    std::ifstream in(filename);  // acquires file handle
    if (!in) {
        throw std::runtime_error("Cannot open " + filename);
    }
    // file handle released automatically when 'in' goes out of scope
}
```

In addition to file streams, use RAII wrappers like \`std::unique_ptr\` for dynamic memory, \`std::lock_guard\` for mutexes, and \`std::vector\` for arrays.

## Exception Handling Patterns

### Check and Throw

Check preconditions and throw an exception when an operation cannot proceed. Use descriptive exception types to communicate the problem.

// ...
if (!file.is_open()) {
    throw std::ios_base::failure("Failed to open file");
}
```

### Try-Catch for Recovery

Wrap operations in a \`try\` block and catch exceptions to handle them, log the error, and recover or propagate to the caller.

// ...
try {
    readFile("data.txt");
    parseInput();
} catch (const std::ios_base::failure& ex) {
    std::cerr << "I/O error: " << ex.what() << std::endl;
    // maybe ask user for a different file
} catch (const std::exception& ex) {
    std::cerr << "Unexpected error: " << ex.what() << std::endl;
    // terminate or rethrow
}
```

### Error Codes for Expected Failures

In performance-critical code or APIs that cannot use exceptions, return error codes or use types like \`std::optional\` or \`std::variant\` to communicate failure without throwing.

// ...
enum class FileStatus {
    Success,
    NotFound,
    PermissionDenied,
    FormatError
};

FileStatus loadFile(const std::string& filename, std::string& out) {
    std::ifstream in(filename);
    if (!in) {
        return FileStatus::NotFound;
    }
    // read file...
    return FileStatus::Success;
}
```

Clients must check the returned status and handle each case appropriately.

## Error Logging and Diagnostics

Log errors with enough context to diagnose the problem: include filenames, operation names, and the reason for failure. Avoid leaking sensitive information to users. Use logging frameworks or standard error output.

## Clean-Up Strategies

Regardless of how errors are signaled, always release resources and restore invariants. RAII is the easiest way to achieve this, but when working with APIs that do not follow RAII, use \`try\`/\`catch\` and \`finally\`-like patterns (in C++ use destructors of local objects) to ensure clean-up.

// ...
std::FILE* f = std::fopen("data.txt", "r");
if (!f) {
    // handle error
    return;
}
try {
    // use f
    // possible throw
} catch (...) {
    std::fclose(f);
    throw; // rethrow after cleanup
}
std::fclose(f);
```

## Key Takeaways

- Use RAII everywhere to guarantee resource release.
- Use exceptions for unexpected, unrecoverable errors; use error codes for anticipated conditions.
- Surround operations that may throw with \`try\`/\`catch\` to log and recover.
- Always clean up resources, even when errors occur.
- Provide meaningful error messages and log relevant details without exposing sensitive data.

You have now built a solid foundation in safe file I/O, input validation, and robust error handling—critical skills for building secure C++ applications.
`,
        },
      },
    ],
  },
];