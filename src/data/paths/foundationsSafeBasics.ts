import { Module } from "../pathModules";

export const foundationsSafeBasicsModules: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Safe C++ Fundamentals",
    description: "Learn the basics of safe memory handling and why it matters",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Welcome to Safe C++",
        type: "lesson",
        duration: 10,
        content: {
          markdown: `# Welcome to Safe C++

## 🎯 What You'll Master

Memory safety bugs are responsible for approximately **70% of high-severity security vulnerabilities** in systems software. In this comprehensive learning path, you'll discover how to write C++ code that's both powerful and secure.

## 🚨 Why This Matters

Every day, critical software systems face threats from:
- **Buffer overflows** - Writing beyond allocated memory boundaries
- **Use-after-free** - Accessing memory that's been deallocated
- **Dangling pointers** - References to invalid memory locations
- **Memory leaks** - Failing to release allocated resources

These aren't just academic concerns—they're real-world vulnerabilities that cost companies millions and put user data at risk.

## 📚 Your Learning Journey

Throughout this path, you'll explore:

### Module 1: Safe Fundamentals
- Pointer safety and initialization
- Understanding memory addresses
- Null pointer handling
- Basic memory management

### Module 2: Array & String Operations
- Bounds checking techniques
- Safe string handling
- Modern C++ containers
- Buffer overflow prevention

### Module 3: Smart Pointers
- RAII principles
- unique_ptr for exclusive ownership
- shared_ptr for shared ownership
- weak_ptr to break cycles

### Module 4: Value Semantics
- Copy vs move semantics
- Rule of Zero/Three/Five
- Perfect forwarding
- Const correctness

## 🎓 How You'll Learn

Each module combines:
- **📖 Theory lessons** - Clear explanations with examples
- **💻 Code challenges** - Hands-on practice with real code
- **📝 Quizzes** - Test your understanding
- **🏆 Projects** - Apply concepts to real scenarios

Let's begin your journey to writing safer, more reliable C++ code!`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Understanding Memory and Pointers",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# Understanding Memory and Pointers

## 🧠 What is Memory?

Think of computer memory as a massive array of numbered boxes. Each box:
- Has a unique address (like a street address)
- Can store a specific amount of data
- Can be read from or written to

## 📍 What is a Pointer?

A **pointer** is simply a variable that stores a memory address. Instead of holding data directly, it "points to" where the data lives.

\`\`\`cpp
int value = 42;        // Regular variable storing 42
int* ptr = &value;     // Pointer storing the address of value
\`\`\`

### The & Operator (Address-of)
The \`&\` operator gives you the memory address of a variable:

\`\`\`cpp
int num = 100;
int* address = &num;   // Get address of num
std::cout << "Value: " << num << std::endl;
std::cout << "Address: " << address << std::endl;
\`\`\`

### The * Operator (Dereference)
The \`*\` operator lets you access the value at the address:

\`\`\`cpp
int value = 42;
int* ptr = &value;
std::cout << *ptr << std::endl;  // Prints 42
*ptr = 100;                       // Changes value to 100
\`\`\`

## ⚠️ The Danger Zone

Pointers are powerful but dangerous:

### Problem #1: Uninitialized Pointers
\`\`\`cpp
int* ptr;              // Contains random memory address
*ptr = 42;             // CRASH! Writing to random memory
\`\`\`

### Problem #2: Null Pointer Dereferencing
\`\`\`cpp
int* ptr = nullptr;
*ptr = 42;             // CRASH! Can't write to address 0
\`\`\`

### Problem #3: Dangling Pointers
\`\`\`cpp
int* ptr = new int(42);
delete ptr;            // Memory is freed
*ptr = 100;            // CRASH! Memory no longer yours
\`\`\`

## ✅ Safe Pointer Practices

### Always Initialize
\`\`\`cpp
int* ptr = nullptr;    // Safe: explicit null
\`\`\`

### Check Before Dereferencing
\`\`\`cpp
if (ptr != nullptr) {
    *ptr = 42;         // Safe: we checked first
}
\`\`\`

### Set to nullptr After Deletion
\`\`\`cpp
delete ptr;
ptr = nullptr;         // Prevents accidental reuse
\`\`\`

## 🎯 Key Takeaways

1. Pointers store **memory addresses**, not values
2. **Always initialize** pointers (preferably to nullptr)
3. **Always check** before dereferencing
4. **Never use** pointers after they're freed
5. Modern C++ has **better alternatives** (we'll learn these!)

Ready to practice? Let's write some safe pointer code!`,
        },
      },
      {
        id: "lesson-1-3",
        title: "Safe Pointer Usage Challenge",
        type: "challenge",
        duration: 15,
        content: {
          markdown: `# Safe Pointer Usage Challenge

## 🎯 Your Mission

Create a program that safely manages dynamic memory using raw pointers. You'll practice:
- Proper pointer initialization
- Safe memory allocation
- Checking pointers before use
- Proper cleanup

## 📋 Requirements

1. Declare a pointer and initialize it safely
2. Allocate memory dynamically
3. Store a value
4. Print the value safely
5. Clean up memory properly
6. Prevent dangling pointers

## 💡 Hints

- Always initialize pointers to \`nullptr\`
- Check for \`nullptr\` before dereferencing
- Use \`delete\` to free memory
- Set pointer to \`nullptr\` after deletion`,
          code: {
            language: "cpp",
            starter: `#include <iostream>

int main() {
    // TODO: Declare a pointer to int and initialize it safely
    
    
    // TODO: Allocate memory for one integer
    
    
    // TODO: Check if allocation succeeded
    
    
    // TODO: Store the value 42
    
    
    // TODO: Print the value safely
    
    
    // TODO: Free the memory
    
    
    // TODO: Prevent dangling pointer
    
    
    return 0;
}`,
            solution: `#include <iostream>

int main() {
    // Declare a pointer and initialize it safely
    int* ptr = nullptr;
    
    // Allocate memory for one integer
    ptr = new int;
    
    // Check if allocation succeeded
    if (ptr == nullptr) {
        std::cerr << "Memory allocation failed!" << std::endl;
        return 1;
    }
    
    // Store the value 42
    *ptr = 42;
    
    // Print the value safely
    std::cout << "Value: " << *ptr << std::endl;
    
    // Free the memory
    delete ptr;
    
    // Prevent dangling pointer
    ptr = nullptr;
    
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: No memory leaks detected
// Test: Output contains "Value: 42"
// Test: Pointer is checked before use
// Test: Memory is properly freed`,
          },
        },
      },
      {
        id: "lesson-1-4",
        title: "Quiz: Pointer Safety Fundamentals",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What should you always do before using a pointer?",
              options: [
                "Delete it to free memory",
                "Initialize it to nullptr or a valid address",
                "Increment it by one",
                "Cast it to void*"
              ],
              correctAnswer: "b",
              explanation: "Always initialize pointers (preferably to nullptr) before use to avoid undefined behavior from accessing random memory locations."
            },
            {
              question: "What is a dangling pointer?",
              options: [
                "A pointer that hasn't been initialized",
                "A pointer that points to freed or invalid memory",
                "A pointer that is nullptr",
                "A pointer to a function"
              ],
              correctAnswer: "b",
              explanation: "A dangling pointer points to memory that has been freed or is no longer valid. Dereferencing it leads to undefined behavior and potential crashes."
            },
            {
              question: "What's the safe value to initialize a pointer with?",
              options: [
                "0",
                "nullptr",
                "-1",
                "Random value"
              ],
              correctAnswer: "b",
              explanation: "In modern C++, nullptr is the recommended way to initialize pointers. It's type-safe and makes your intentions clear."
            },
            {
              question: "When should you check if a pointer is nullptr?",
              options: [
                "Never, it's not necessary",
                "Only after allocation",
                "Before every dereference operation",
                "Only when deleting"
              ],
              correctAnswer: "c",
              explanation: "Always check if a pointer is nullptr before dereferencing it to prevent crashes. This defensive programming practice catches errors early."
            },
            {
              question: "What should you do after calling delete on a pointer?",
              options: [
                "Nothing, you're done",
                "Delete it again for safety",
                "Set it to nullptr",
                "Increment it"
              ],
              correctAnswer: "c",
              explanation: "After calling delete, set the pointer to nullptr. This prevents accidentally using the dangling pointer and makes bugs easier to detect."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "Safe Array and String Handling",
    description: "Master bounds checking and safe string operations",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Understanding Buffer Overflows",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# Understanding Buffer Overflows

## 🔥 What is a Buffer Overflow?

A **buffer overflow** occurs when you write data beyond the boundaries of allocated memory. It's one of the most dangerous and common security vulnerabilities.

## 💥 The Classic Mistake

\`\`\`cpp
int arr[5] = {1, 2, 3, 4, 5};  // Array of 5 elements
arr[10] = 42;                   // DANGER! Writing beyond bounds
\`\`\`

### What Actually Happens?

1. You allocate space for 5 integers
2. Valid indices are 0, 1, 2, 3, 4
3. Index 10 is **outside** your allocated memory
4. You're now writing to someone else's memory!

## 🎯 Real-World Consequences

### Crashes
Your program might crash immediately or later:
\`\`\`cpp
int arr[3];
arr[1000] = 42;  // Might crash here or later
\`\`\`

### Data Corruption
You might overwrite other variables:
\`\`\`cpp
int arr[3] = {1, 2, 3};
int important = 999;
arr[5] = 42;  // Might overwrite 'important'
\`\`\`

### Security Breaches
Attackers can exploit buffer overflows to:
- Execute malicious code
- Steal sensitive data
- Take control of your program

## 📊 C-Style Arrays: The Problem

\`\`\`cpp
int arr[5];
// No built-in bounds checking!
// No way to ask for the size at runtime
// Easy to make mistakes
\`\`\`

### Common Pitfalls

**Off-by-one errors:**
\`\`\`cpp
int arr[10];
for (int i = 0; i <= 10; i++) {  // BUG: should be i < 10
    arr[i] = i;                   // arr[10] is out of bounds!
}
\`\`\`

**Pointer arithmetic:**
\`\`\`cpp
int arr[5] = {1, 2, 3, 4, 5};
int* ptr = arr + 10;              // Points beyond array
*ptr = 42;                        // Buffer overflow!
\`\`\`

## ✅ Modern C++ Solutions

### std::vector - Dynamic Arrays
\`\`\`cpp
#include <vector>

std::vector<int> arr = {1, 2, 3, 4, 5};

// Safe access with bounds checking
try {
    arr.at(10) = 42;              // Throws exception
} catch (const std::out_of_range& e) {
    std::cout << "Index out of bounds!" << std::endl;
}
\`\`\`

### std::array - Fixed-Size Arrays
\`\`\`cpp
#include <array>

std::array<int, 5> arr = {1, 2, 3, 4, 5};

// Know the size at compile time
std::cout << "Size: " << arr.size() << std::endl;

// Safe access
try {
    arr.at(10) = 42;              // Throws exception
} catch (const std::out_of_range& e) {
    std::cout << "Index out of bounds!" << std::endl;
}
\`\`\`

## 🛡️ Best Practices

### 1. Use Modern Containers
\`\`\`cpp
std::vector<int> v;        // Instead of int arr[100]
std::array<int, 10> a;     // Instead of int arr[10]
\`\`\`

### 2. Check Bounds Explicitly
\`\`\`cpp
if (index < arr.size()) {
    arr[index] = value;    // Safe
}
\`\`\`

### 3. Use .at() for Automatic Checking
\`\`\`cpp
arr.at(index) = value;     // Throws if out of bounds
\`\`\`

### 4. Prefer Range-Based For Loops
\`\`\`cpp
for (auto& element : arr) {
    element *= 2;          // No index, no bounds errors!
}
\`\`\`

## 🎯 Key Takeaways

1. **Buffer overflows** are serious security vulnerabilities
2. **C-style arrays** have no bounds checking
3. **std::vector** and **std::array** are safer alternatives
4. **Always validate** array indices before use
5. Use **range-based loops** when you don't need indices

In the next lesson, we'll practice safe array operations!`,
        },
      },
      {
        id: "lesson-2-2",
        title: "Safe Array Operations Challenge",
        type: "challenge",
        duration: 15,
        content: {
          markdown: `# Safe Array Operations Challenge

## 🎯 Your Mission

Implement safe array operations using modern C++ containers. You'll practice:
- Using std::vector with bounds checking
- Safe element access with .at()
- Handling out-of-bounds exceptions
- Range-based iteration

## 📋 Requirements

1. Create a vector of integers
2. Add elements safely
3. Access elements with bounds checking
4. Handle invalid indices gracefully
5. Iterate safely without indices

## 💡 Hints

- Use \`std::vector<int>\` for dynamic arrays
- Use \`.push_back()\` to add elements
- Use \`.at()\` for bounds-checked access
- Use try-catch to handle exceptions
- Use range-based for loops for iteration`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <vector>

int main() {
    // TODO: Create a vector of integers
    
    
    // TODO: Add the numbers 10, 20, 30, 40, 50
    
    
    // TODO: Safely print all elements using range-based for loop
    
    
    // TODO: Try to access index 10 safely (should handle error)
    
    
    // TODO: Successfully access and print element at index 2
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <vector>
#include <stdexcept>

int main() {
    // Create a vector of integers
    std::vector<int> numbers;
    
    // Add the numbers 10, 20, 30, 40, 50
    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);
    numbers.push_back(40);
    numbers.push_back(50);
    
    // Safely print all elements using range-based for loop
    std::cout << "All elements:" << std::endl;
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Try to access index 10 safely (should handle error)
    try {
        int value = numbers.at(10);
        std::cout << "Value at index 10: " << value << std::endl;
    } catch (const std::out_of_range& e) {
        std::cout << "Error: Index 10 is out of bounds!" << std::endl;
    }
    
    // Successfully access and print element at index 2
    try {
        int value = numbers.at(2);
        std::cout << "Value at index 2: " << value << std::endl;
    } catch (const std::out_of_range& e) {
        std::cout << "Error: Invalid index!" << std::endl;
    }
    
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: All elements printed correctly
// Test: Out-of-bounds access handled gracefully
// Test: Valid index access succeeds
// Test: No undefined behavior`,
          },
        },
      },
      {
        id: "lesson-2-3",
        title: "String Safety in C++",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# String Safety in C++

## 📝 The Two Worlds of Strings

C++ inherited C-style strings but also provides modern, safe alternatives.

### C-Style Strings (Dangerous)
\`\`\`cpp
char str[10] = "Hello";        // Fixed size, no bounds checking
char* name = "World";           // Pointer to string literal
\`\`\`

### Modern C++ Strings (Safe)
\`\`\`cpp
std::string str = "Hello";     // Dynamic, bounds-checked
std::string name = "World";     // Easy to use, safe
\`\`\`

## ⚠️ C-String Dangers

### Buffer Overflow in Copying
\`\`\`cpp
char dest[5];
strcpy(dest, "This is too long");  // OVERFLOW! Disaster!
\`\`\`

### Reading Beyond Bounds
\`\`\`cpp
char str[5] = {'H', 'i'};       // Missing null terminator!
std::cout << str;                // Reads beyond array!
\`\`\`

### Concatenation Chaos
\`\`\`cpp
char str[10] = "Hello";
strcat(str, " World");           // Might overflow!
\`\`\`

## ✅ std::string: The Safe Choice

### Automatic Memory Management
\`\`\`cpp
std::string name = "Alice";
name += " Smith";                // Automatically resizes!
name = name + " Jr.";            // No overflow possible
\`\`\`

### Safe Operations
\`\`\`cpp
std::string str = "Hello";

// Safe access
char c = str.at(0);              // Bounds-checked
char c2 = str[0];                // Fast but not checked

// Safe substring
std::string sub = str.substr(0, 3);  // "Hel"

// Safe comparison
if (str == "Hello") {
    std::cout << "Match!" << std::endl;
}
\`\`\`

### Built-in Size Tracking
\`\`\`cpp
std::string str = "Hello";
std::cout << "Length: " << str.length() << std::endl;
std::cout << "Size: " << str.size() << std::endl;
std::cout << "Empty: " << str.empty() << std::endl;
\`\`\`

## 🔄 Converting Between String Types

### C-String to std::string
\`\`\`cpp
const char* cstr = "Hello";
std::string str(cstr);           // Safe conversion
std::string str2 = cstr;         // Also safe
\`\`\`

### std::string to C-String
\`\`\`cpp
std::string str = "Hello";
const char* cstr = str.c_str(); // Read-only access
// Don't modify cstr!
// Don't save it - it's only valid while str exists
\`\`\`

## 🛡️ Safe String Patterns

### Reading User Input
\`\`\`cpp
std::string input;
std::getline(std::cin, input);   // Safe, no buffer overflow
\`\`\`

### String Building
\`\`\`cpp
std::string message = "Hello";
message += ", ";
message += "World";
message += "!";
// or
std::string message = "Hello, " + std::string("World") + "!";
\`\`\`

### Searching
\`\`\`cpp
std::string str = "Hello World";
size_t pos = str.find("World");
if (pos != std::string::npos) {
    std::cout << "Found at: " << pos << std::endl;
}
\`\`\`

### Modification
\`\`\`cpp
std::string str = "Hello";
str.replace(0, 5, "Goodbye");    // Safe replacement
str.erase(3, 2);                 // Safe deletion
str.insert(5, "!");              // Safe insertion
\`\`\`

## 🎯 When to Use What

| Use std::string when... | Use C-strings when... |
|-------------------------|----------------------|
| You control the code    | Interfacing with C APIs |
| You need safety         | Extreme performance critical |
| You need easy operations| String literals only |
| You're learning C++     | Legacy code requires it |

## 🔑 Key Takeaways

1. **std::string** is almost always the right choice
2. **C-strings** are dangerous and error-prone
3. Use **std::string** for automatic memory management
4. Use **.at()** when you need bounds checking
5. **Never** assume C-string buffer sizes

Let's practice safe string operations!`,
        },
      },
      {
        id: "lesson-2-4",
        title: "Safe String Operations Challenge",
        type: "challenge",
        duration: 15,
        content: {
          markdown: `# Safe String Operations Challenge

## 🎯 Your Mission

Practice safe string operations using std::string. You'll:
- Create and manipulate strings safely
- Concatenate without buffer overflows
- Search and replace text
- Handle user input safely

## 📋 Requirements

1. Create a string and concatenate text to it
2. Search for a substring
3. Replace part of the string
4. Extract a substring
5. Convert to uppercase safely

## 💡 Hints

- Use \`std::string\` for all operations
- Use \`+\` or \`+=\` for concatenation
- Use \`.find()\` to search
- Use \`.replace()\` to modify
- Use \`.substr()\` to extract
- Remember: std::string has no buffer overflow issues!`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <string>
#include <algorithm>

int main() {
    // TODO: Create a string with "Hello"
    
    
    // TODO: Safely concatenate " World" to it
    
    
    // TODO: Print the result
    
    
    // TODO: Find the position of "World"
    
    
    // TODO: Replace "World" with "C++"
    
    
    // TODO: Print the modified string
    
    
    // TODO: Extract the first 5 characters
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <string>
#include <algorithm>

int main() {
    // Create a string with "Hello"
    std::string message = "Hello";
    
    // Safely concatenate " World" to it
    message += " World";
    
    // Print the result
    std::cout << "Original: " << message << std::endl;
    
    // Find the position of "World"
    size_t pos = message.find("World");
    if (pos != std::string::npos) {
        std::cout << "Found 'World' at position: " << pos << std::endl;
        
        // Replace "World" with "C++"
        message.replace(pos, 5, "C++");
    }
    
    // Print the modified string
    std::cout << "Modified: " << message << std::endl;
    
    // Extract the first 5 characters
    std::string greeting = message.substr(0, 5);
    std::cout << "Greeting: " << greeting << std::endl;
    
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: String concatenation works correctly
// Test: Find operation succeeds
// Test: Replace operation succeeds
// Test: Substring extraction works
// Test: No buffer overflows or memory issues`,
          },
        },
      },
      {
        id: "lesson-2-5",
        title: "Quiz: Array and String Safety",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "Which is the safest way to access a vector element?",
              options: [
                "vec[index]",
                "vec.at(index)",
                "*(vec.begin() + index)",
                "vec.data()[index]"
              ],
              correctAnswer: "b",
              explanation: "The .at() method provides bounds checking and throws an exception if the index is out of range, making it the safest option."
            },
            {
              question: "What happens when you write beyond an array's bounds?",
              options: [
                "The array automatically grows",
                "A warning is displayed",
                "Undefined behavior (crash, corruption, or security breach)",
                "The value is simply not stored"
              ],
              correctAnswer: "c",
              explanation: "Writing beyond array bounds causes undefined behavior, which can lead to crashes, data corruption, or security vulnerabilities. This is why bounds checking is critical."
            },
            {
              question: "Why is std::string safer than C-style strings?",
              options: [
                "It's faster to use",
                "It automatically manages memory and has bounds checking",
                "It uses less memory",
                "It's required by the C++ standard"
              ],
              correctAnswer: "b",
              explanation: "std::string automatically manages its memory, grows as needed, and provides bounds checking through methods like .at(), eliminating common C-string vulnerabilities."
            },
            {
              question: "What's the safest way to iterate over a vector?",
              options: [
                "for (int i = 0; i <= vec.size(); i++)",
                "for (int i = 0; i < vec.size(); i++)",
                "for (const auto& item : vec)",
                "while (!vec.empty()) vec.pop_back()"
              ],
              correctAnswer: "c",
              explanation: "Range-based for loops (option c) are the safest because they eliminate index management entirely, preventing off-by-one errors and bounds violations."
            },
            {
              question: "What should you use instead of strcpy() for safe string copying?",
              options: [
                "strncpy()",
                "std::string assignment (=)",
                "memcpy()",
                "sprintf()"
              ],
              correctAnswer: "b",
              explanation: "std::string assignment operator (=) is the safest choice. It automatically manages memory and can't cause buffer overflows unlike C-style string functions."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Smart Pointers and RAII",
    description: "Master automatic memory management with smart pointers",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Introduction to RAII",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# Introduction to RAII

## 🎯 What is RAII?

**RAII** stands for **Resource Acquisition Is Initialization**. It's a fundamental C++ idiom that ties resource management to object lifetime.

### The Core Principle

> When you create an object, it acquires resources.
> When the object is destroyed, it automatically releases resources.

## 🔑 Why RAII Matters

Traditional resource management is error-prone:

\`\`\`cpp
void processFile() {
    FILE* file = fopen("data.txt", "r");
    
    // What if this throws an exception?
    processData(file);
    
    // We might never reach this line!
    fclose(file);  // Resource leak!
}
\`\`\`

### The Problem
- Early returns skip cleanup
- Exceptions bypass cleanup code
- Easy to forget cleanup
- Multiple exit points = multiple cleanup locations

## ✅ RAII Solution

\`\`\`cpp
class FileHandle {
    FILE* file;
public:
    FileHandle(const char* filename) {
        file = fopen(filename, "r");
        if (!file) throw std::runtime_error("Cannot open file");
    }
    
    ~FileHandle() {
        if (file) fclose(file);  // Always called!
    }
    
    FILE* get() { return file; }
};

void processFile() {
    FileHandle file("data.txt");
    processData(file.get());
    // File automatically closed when file goes out of scope!
}
\`\`\`

## 🎓 RAII Benefits

### 1. Automatic Cleanup
Resources are released when the object is destroyed:
- End of scope
- Exception thrown
- Early return
- Any exit path

### 2. Exception Safety
\`\`\`cpp
void function() {
    std::vector<int> data;  // RAII managed
    
    data.push_back(1);
    throw std::runtime_error("Error!");
    // Vector's destructor still called!
    // Memory automatically freed!
}
\`\`\`

### 3. Clear Ownership
The object that owns the resource is responsible for cleanup.

### 4. Composability
RAII objects can contain other RAII objects:
\`\`\`cpp
class Database {
    FileHandle logFile;        // RAII
    std::vector<User> users;   // RAII
    std::string name;          // RAII
    // All automatically managed!
};
\`\`\`

## 🔍 RAII in the Standard Library

Many standard library types use RAII:

### Containers
\`\`\`cpp
std::vector<int> vec;        // Manages dynamic array
std::string str;             // Manages character buffer
std::map<int, string> map;   // Manages tree structure
\`\`\`

### Smart Pointers
\`\`\`cpp
std::unique_ptr<int> ptr;    // Manages single object
std::shared_ptr<int> ptr;    // Manages shared object
\`\`\`

### File Streams
\`\`\`cpp
std::ifstream file("data.txt");  // Manages file handle
// Automatically closed when file goes out of scope
\`\`\`

### Locks
\`\`\`cpp
std::mutex mtx;
{
    std::lock_guard<std::mutex> lock(mtx);  // Locks mutex
    // Critical section
}  // Automatically unlocks
\`\`\`

## 💡 Creating Your Own RAII Classes

### The Pattern
\`\`\`cpp
class Resource {
private:
    ResourceType* resource;
    
public:
    // Constructor: Acquire resource
    Resource() {
        resource = acquireResource();
        if (!resource) {
            throw std::runtime_error("Failed to acquire");
        }
    }
    
    // Destructor: Release resource
    ~Resource() {
        if (resource) {
            releaseResource(resource);
        }
    }
    
    // Prevent copying (usually)
    Resource(const Resource&) = delete;
    Resource& operator=(const Resource&) = delete;
    
    // Allow moving (optional)
    Resource(Resource&& other) noexcept {
        resource = other.resource;
        other.resource = nullptr;
    }
};
\`\`\`

## 🎯 Key Principles

### Rule of Zero
If you can use existing RAII types, you don't need to write destructor, copy constructor, or assignment operator:

\`\`\`cpp
class Person {
    std::string name;           // RAII
    std::vector<int> scores;    // RAII
    // No need for custom destructor!
};
\`\`\`

### Rule of Five
If you manage resources yourself, define all five:
1. Destructor
2. Copy constructor
3. Copy assignment operator
4. Move constructor
5. Move assignment operator

## 🎯 Key Takeaways

1. **RAII** ties resource lifetime to object lifetime
2. **Automatic cleanup** eliminates memory leaks
3. **Exception-safe** by design
4. **Use standard RAII types** when possible
5. **Follow Rule of Zero** for your classes

Next, we'll learn about smart pointers—the most important RAII types!`,
        },
      },
      {
        id: "lesson-3-2",
        title: "unique_ptr: Exclusive Ownership",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# unique_ptr: Exclusive Ownership

## 🎯 What is unique_ptr?

\`std::unique_ptr\` is a smart pointer that owns and manages a resource. It **guarantees**:
- Only one unique_ptr owns the resource at a time
- Automatic deletion when the unique_ptr is destroyed
- No memory leaks
- Move-only (can't be copied)

## 💡 Why unique_ptr?

### Old Way (Dangerous)
\`\`\`cpp
Widget* ptr = new Widget();
// ... use ptr ...
delete ptr;  // Easy to forget!
           // What if exception thrown?
           // What if early return?
\`\`\`

### New Way (Safe)
\`\`\`cpp
std::unique_ptr<Widget> ptr = std::make_unique<Widget>();
// ... use ptr ...
// Automatically deleted! No leak possible!
\`\`\`

## 🔨 Creating unique_ptr

### Best Practice: make_unique (C++14+)
\`\`\`cpp
#include <memory>

// Create single object
auto ptr = std::make_unique<int>(42);

// Create object with constructor arguments
auto widget = std::make_unique<Widget>("name", 100);

// Create array
auto arr = std::make_unique<int[]>(10);
\`\`\`

### Alternative: Direct Construction
\`\`\`cpp
std::unique_ptr<int> ptr(new int(42));
// But prefer make_unique!
\`\`\`

## 🎮 Using unique_ptr

### Dereferencing
\`\`\`cpp
auto ptr = std::make_unique<int>(42);

std::cout << *ptr << std::endl;        // 42
*ptr = 100;                             // Modify value
\`\`\`

### Member Access
\`\`\`cpp
auto widget = std::make_unique<Widget>();

widget->doSomething();                  // Arrow operator
(*widget).doSomething();                // Alternative
\`\`\`

### Getting Raw Pointer
\`\`\`cpp
auto ptr = std::make_unique<int>(42);

int* raw = ptr.get();                   // Get raw pointer
// Don't delete raw! ptr still owns it
\`\`\`

### Checking for nullptr
\`\`\`cpp
std::unique_ptr<int> ptr = std::make_unique<int>(42);

if (ptr) {                              // Check if owns object
    std::cout << *ptr << std::endl;
}

if (ptr != nullptr) {                   // Alternative
    std::cout << *ptr << std::endl;
}
\`\`\`

## 🔄 Transferring Ownership

### Move Semantics
\`\`\`cpp
auto ptr1 = std::make_unique<int>(42);
auto ptr2 = std::move(ptr1);            // Transfer ownership

// Now ptr1 is nullptr
// ptr2 owns the resource
\`\`\`

### Cannot Copy!
\`\`\`cpp
auto ptr1 = std::make_unique<int>(42);
auto ptr2 = ptr1;                       // ERROR! Can't copy!
\`\`\`

### Passing to Functions
\`\`\`cpp
// Take ownership
void takeOwnership(std::unique_ptr<Widget> ptr) {
    // Function now owns ptr
    // Deleted when function ends
}

// Borrow (read-only)
void borrow(const Widget* ptr) {
    // Just using, not owning
}

// Borrow (modifiable)
void borrowMutable(Widget* ptr) {
    // Can modify but doesn't own
}

// Usage
auto widget = std::make_unique<Widget>();
takeOwnership(std::move(widget));      // Transfer ownership
// widget is now nullptr

auto widget2 = std::make_unique<Widget>();
borrow(widget2.get());                 // Just borrow
// widget2 still owns the object
\`\`\`

## 🔄 Returning unique_ptr

\`\`\`cpp
std::unique_ptr<Widget> createWidget() {
    auto widget = std::make_unique<Widget>();
    widget->initialize();
    return widget;  // Ownership transferred to caller
}

// Usage
auto myWidget = createWidget();  // Now owns the widget
\`\`\`

## 🗑️ Manual Resource Release

### reset(): Delete and optionally assign new
\`\`\`cpp
auto ptr = std::make_unique<int>(42);
ptr.reset();                            // Delete, now nullptr
ptr.reset(new int(100));                // Delete old, assign new
\`\`\`

### release(): Give up ownership without deleting
\`\`\`cpp
auto ptr = std::make_unique<int>(42);
int* raw = ptr.release();               // ptr is nullptr
// YOU are now responsible for deleting raw!
delete raw;
\`\`\`

## 📦 unique_ptr with Custom Deleters

For resources that need special cleanup:

\`\`\`cpp
// Custom deleter for FILE*
auto fileDeleter = [](FILE* f) {
    if (f) fclose(f);
};

std::unique_ptr<FILE, decltype(fileDeleter)> file(
    fopen("data.txt", "r"),
    fileDeleter
);
// File automatically closed!
\`\`\`

## 🎯 When to Use unique_ptr

✅ **Use unique_ptr when:**
- You need exclusive ownership
- You want automatic cleanup
- You're replacing raw new/delete
- You're managing resources (files, connections, etc.)
- Default choice for ownership!

❌ **Don't use unique_ptr when:**
- You need shared ownership (use shared_ptr)
- The object isn't dynamically allocated
- You don't own the resource (just use raw pointer)

## 🏆 Best Practices

1. **Prefer make_unique** over new
2. **Pass by value** when transferring ownership
3. **Pass by raw pointer** when borrowing
4. **Never call delete** on managed pointer
5. **Default to unique_ptr** for resource management

## 🎯 Key Takeaways

1. **unique_ptr** provides exclusive ownership
2. **Automatic cleanup** prevents leaks
3. **Move-only** semantics prevent copying
4. **Zero overhead** compared to raw pointers
5. **Use make_unique** for creation

Let's practice with unique_ptr!`,
        },
      },
      {
        id: "lesson-3-3",
        title: "unique_ptr Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# unique_ptr Challenge

## 🎯 Your Mission

Practice using unique_ptr for safe memory management. You'll:
- Create objects with make_unique
- Transfer ownership between unique_ptrs
- Pass unique_ptrs to functions
- Use unique_ptr with custom types

## 📋 Requirements

1. Create a simple class to manage
2. Create instances using make_unique
3. Transfer ownership using std::move
4. Pass unique_ptr to a function
5. Demonstrate automatic cleanup

## 💡 Hints

- Use \`std::make_unique<T>()\` to create
- Use \`std::move()\` to transfer ownership
- Check for nullptr before dereferencing
- Remember: unique_ptr cannot be copied!`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <memory>
#include <string>

// Simple class to manage
class Resource {
public:
    std::string name;
    
    Resource(const std::string& n) : name(n) {
        std::cout << "Resource " << name << " created" << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource " << name << " destroyed" << std::endl;
    }
    
    void use() {
        std::cout << "Using resource " << name << std::endl;
    }
};

// TODO: Implement this function to take ownership
void processResource(/* add parameter */) {
    // TODO: Use the resource
    
}

int main() {
    // TODO: Create a unique_ptr to Resource with name "Resource1"
    
    
    // TODO: Use the resource
    
    
    // TODO: Create another unique_ptr "Resource2"
    
    
    // TODO: Transfer ownership from ptr2 to ptr1
    
    
    // TODO: Check if ptr2 is now nullptr
    
    
    // TODO: Create "Resource3" and pass it to processResource
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <memory>
#include <string>

// Simple class to manage
class Resource {
public:
    std::string name;
    
    Resource(const std::string& n) : name(n) {
        std::cout << "Resource " << name << " created" << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource " << name << " destroyed" << std::endl;
    }
    
    void use() {
        std::cout << "Using resource " << name << std::endl;
    }
};

// Function that takes ownership
void processResource(std::unique_ptr<Resource> res) {
    if (res) {
        res->use();
        std::cout << "Processing complete, resource will be destroyed" << std::endl;
    }
    // res automatically destroyed here
}

int main() {
    // Create a unique_ptr to Resource with name "Resource1"
    auto ptr1 = std::make_unique<Resource>("Resource1");
    
    // Use the resource
    ptr1->use();
    
    // Create another unique_ptr "Resource2"
    auto ptr2 = std::make_unique<Resource>("Resource2");
    ptr2->use();
    
    // Transfer ownership from ptr2 to ptr1
    ptr1 = std::move(ptr2);
    
    // Check if ptr2 is now nullptr
    if (!ptr2) {
        std::cout << "ptr2 is now nullptr (ownership transferred)" << std::endl;
    }
    
    // ptr1 now points to Resource2
    ptr1->use();
    
    // Create "Resource3" and pass it to processResource
    auto ptr3 = std::make_unique<Resource>("Resource3");
    processResource(std::move(ptr3));
    
    // ptr3 is now nullptr
    if (!ptr3) {
        std::cout << "ptr3 is now nullptr (ownership transferred to function)" << std::endl;
    }
    
    std::cout << "main() ending, remaining resources will be cleaned up" << std::endl;
    return 0;
    // ptr1 (Resource2) automatically destroyed here
}`,
            tests: `// Test: Program compiles without errors
// Test: No memory leaks
// Test: Resources created and destroyed in correct order
// Test: Ownership transfers work correctly
// Test: nullptr checks succeed`,
          },
        },
      },
      {
        id: "lesson-3-4",
        title: "Quiz: Smart Pointers and RAII",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What does RAII stand for?",
              options: [
                "Resource Allocation Is Important",
                "Resource Acquisition Is Initialization",
                "Resource Access Is Immediate",
                "Resource Assignment Is Instantaneous"
              ],
              correctAnswer: "b",
              explanation: "RAII stands for Resource Acquisition Is Initialization—a C++ idiom that ties resource management to object lifetime, ensuring automatic cleanup."
            },
            {
              question: "Can a unique_ptr be copied?",
              options: [
                "Yes, freely",
                "Yes, but only once",
                "No, it's move-only",
                "Yes, using std::copy()"
              ],
              correctAnswer: "c",
              explanation: "unique_ptr is move-only and cannot be copied. This enforces exclusive ownership—only one unique_ptr can own a resource at a time."
            },
            {
              question: "What's the preferred way to create a unique_ptr?",
              options: [
                "new keyword",
                "std::make_unique",
                "malloc",
                "std::allocate"
              ],
              correctAnswer: "b",
              explanation: "std::make_unique is the preferred way to create unique_ptr. It's exception-safe, cleaner, and prevents certain types of memory leaks."
            },
            {
              question: "When is the resource owned by a unique_ptr deleted?",
              options: [
                "When you call delete on it",
                "When the program ends",
                "When the unique_ptr goes out of scope",
                "It's never deleted automatically"
              ],
              correctAnswer: "c",
              explanation: "The resource is automatically deleted when the unique_ptr goes out of scope. This is the core benefit of RAII and smart pointers."
            },
            {
              question: "How do you transfer ownership of a unique_ptr?",
              options: [
                "Using assignment (=)",
                "Using std::move()",
                "Using std::transfer()",
                "Using the copy constructor"
              ],
              correctAnswer: "b",
              explanation: "Use std::move() to transfer ownership. This explicitly shows that ownership is being transferred and leaves the source unique_ptr as nullptr."
            }
          ],
        },
      },
    ],
  },
];
