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

## What You'll Master

Memory safety bugs are responsible for approximately **70% of high-severity security vulnerabilities** in systems software. In this comprehensive learning path, you'll discover how to write C++ code that's both powerful and secure.

## Why This Matters

Every day, critical software systems face threats from:

- **Buffer overflows** - Writing beyond allocated memory boundaries
- **Use-after-free** - Accessing memory that's been deallocated
- **Dangling pointers** - References to invalid memory locations  
- **Memory leaks** - Failing to release allocated resources

These aren't just academic concerns—they're real-world vulnerabilities that cost companies millions and put user data at risk.

## Your Learning Journey

Throughout this path, you'll explore four essential modules that build upon each other to create a comprehensive understanding of safe C++ programming.

### Module 1: Safe Fundamentals

Learn the core principles of safe memory handling, including pointer safety, initialization, understanding memory addresses, null pointer handling, and basic memory management techniques.

### Module 2: Array and String Operations

Master bounds checking techniques, safe string handling, modern C++ containers, and buffer overflow prevention strategies that protect your code from common vulnerabilities.

### Module 3: Smart Pointers

Discover RAII principles and learn how to use unique_ptr for exclusive ownership, shared_ptr for shared ownership, and weak_ptr to break circular dependencies.

### Module 4: Value Semantics

Understand the difference between copy and move semantics, learn the Rule of Zero/Three/Five, master perfect forwarding, and apply const correctness throughout your code.

## How You'll Learn

Each module combines three types of learning experiences:

**Theory Lessons** - Clear, detailed explanations with practical examples that demonstrate concepts in action.

**Code Challenges** - Hands-on practice writing real code that applies what you've learned in practical scenarios.

**Quizzes** - Test your understanding and reinforce key concepts through carefully designed questions.

Let's begin your journey to writing safer, more reliable C++ code.`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Understanding Memory and Pointers",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# Understanding Memory and Pointers

## What is Memory?

Think of computer memory as a massive array of numbered boxes. Each box has a unique address (like a street address), can store a specific amount of data, and can be read from or written to.

## What is a Pointer?

A **pointer** is simply a variable that stores a memory address. Instead of holding data directly, it "points to" where the data lives in memory.

\`\`\`cpp
int value = 42;        // Regular variable storing 42
int* ptr = &value;     // Pointer storing the address of value
\`\`\`

### The Address-of Operator

The \`&\` operator gives you the memory address of a variable:

\`\`\`cpp
int num = 100;
int* address = &num;   // Get address of num
std::cout << "Value: " << num << std::endl;
std::cout << "Address: " << address << std::endl;
\`\`\`

### The Dereference Operator

The \`*\` operator lets you access the value at a pointer's address:

\`\`\`cpp
int value = 42;
int* ptr = &value;
std::cout << *ptr << std::endl;  // Prints: 42

*ptr = 100;  // Changes value to 100
std::cout << value << std::endl;  // Prints: 100
\`\`\`

## Pointer Declaration Syntax

When declaring pointers, the asterisk can be placed in different positions, but they all mean the same thing:

\`\`\`cpp
int* ptr1;    // Common style
int *ptr2;    // Alternative style
int * ptr3;   // Also valid

// Declaring multiple pointers
int *a, *b;   // Both are pointers
int* c, d;    // c is pointer, d is int (careful!)
\`\`\`

**Best Practice**: Declare one pointer per line to avoid confusion.

## Null Pointers

A null pointer doesn't point to any valid memory location. It's important to initialize pointers before use:

\`\`\`cpp
int* ptr = nullptr;  // Modern C++ way

if (ptr == nullptr) {
    std::cout << "Pointer is null" << std::endl;
}
\`\`\`

### Why Initialize Pointers?

Uninitialized pointers contain random garbage values and can cause crashes or security vulnerabilities:

\`\`\`cpp
// DANGEROUS - Uninitialized pointer
int* badPtr;
*badPtr = 42;  // CRASH! Unknown address

// SAFE - Initialized pointer
int* goodPtr = nullptr;
if (goodPtr != nullptr) {
    *goodPtr = 42;
}
\`\`\`

## Common Pointer Mistakes

### Dereferencing Null Pointers

\`\`\`cpp
int* ptr = nullptr;
*ptr = 42;  // CRASH! Cannot dereference null pointer
\`\`\`

**Always check before dereferencing**:

\`\`\`cpp
int* ptr = nullptr;
if (ptr != nullptr) {
    *ptr = 42;  // Safe
}
\`\`\`

### Dangling Pointers

A dangling pointer points to memory that has been freed or is no longer valid:

\`\`\`cpp
int* createDanglingPointer() {
    int localVar = 42;
    return &localVar;  // DANGER! localVar is destroyed
}

int main() {
    int* ptr = createDanglingPointer();
    // ptr is now dangling - undefined behavior
}
\`\`\`

### Memory Leaks

Forgetting to free dynamically allocated memory causes leaks:

\`\`\`cpp
void leak() {
    int* ptr = new int(42);
    // Forgot to delete!
}  // Memory leaked
\`\`\`

**Always pair new with delete**:

\`\`\`cpp
void noLeak() {
    int* ptr = new int(42);
    // Use ptr...
    delete ptr;  // Free memory
    ptr = nullptr;  // Prevent dangling pointer
}
\`\`\`

## Key Takeaways

**Pointers store memory addresses**, not values directly. They provide a way to indirectly access and modify data.

**Always initialize pointers** to nullptr or a valid address. Uninitialized pointers contain garbage values.

**Check before dereferencing** to avoid crashes. Null pointer dereference is a common source of bugs.

**Free allocated memory** when done. Every \`new\` must have a corresponding \`delete\`.

**Avoid returning addresses** of local variables. They become invalid when the function ends.

Next, we'll explore safer alternatives using references and modern C++ features.`,
        },
      },
      {
        id: "lesson-1-3",
        title: "Pointer Safety Challenge",
        type: "challenge",
        duration: 15,
        content: {
          markdown: `# Pointer Safety Challenge

## Your Mission

Demonstrate safe pointer usage by creating, using, and properly managing pointers without causing undefined behavior or memory leaks.

## Requirements

1. Declare and initialize pointers correctly
2. Safely dereference pointers with null checks
3. Allocate and deallocate memory properly
4. Avoid common pointer mistakes

## Hints

- Always initialize pointers to nullptr
- Check for null before dereferencing
- Use new/delete correctly
- Set pointers to nullptr after deleting`,
          code: {
            language: "cpp",
            starter: `#include <iostream>

int main() {
    // TODO: Declare a pointer and initialize it to nullptr
    
    
    // TODO: Allocate memory for an integer
    
    
    // TODO: Check if allocation succeeded
    
    
    // TODO: Assign a value through the pointer
    
    
    // TODO: Print the value
    
    
    // TODO: Free the memory
    
    
    // TODO: Set pointer to nullptr
    
    
    return 0;
}`,
            solution: `#include <iostream>

int main() {
    // Declare and initialize pointer
    int* ptr = nullptr;
    
    std::cout << "Allocating memory..." << std::endl;
    
    // Allocate memory
    ptr = new int;
    
    // Check if allocation succeeded
    if (ptr == nullptr) {
        std::cerr << "Memory allocation failed!" << std::endl;
        return 1;
    }
    
    // Assign value
    *ptr = 42;
    
    // Print value
    std::cout << "Value: " << *ptr << std::endl;
    
    // Free memory
    delete ptr;
    
    // Set to nullptr to avoid dangling pointer
    ptr = nullptr;
    
    std::cout << "Memory freed successfully" << std::endl;
    
    return 0;
}`,
            tests: `// Test: Pointer initialized correctly
// Test: Memory allocated successfully
// Test: Value assigned and read correctly
// Test: Memory freed properly
// Test: No memory leaks
// Test: No dangling pointers`,
          },
        },
      },
      {
        id: "lesson-1-4",
        title: "Quiz: Memory and Pointers",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What does the & operator do?",
              options: [
                "Dereferences a pointer",
                "Returns the address of a variable",
                "Allocates memory",
                "Deletes a pointer"
              ],
              correctAnswer: "b",
              explanation: "The & operator (address-of) returns the memory address of a variable, allowing you to create pointers to that variable."
            },
            {
              question: "What value should you initialize pointers to if you don't have a valid address yet?",
              options: [
                "0",
                "nullptr",
                "void",
                "Don't initialize them"
              ],
              correctAnswer: "b",
              explanation: "In modern C++, use nullptr to initialize pointers that don't point to a valid address yet. This makes it clear the pointer is intentionally null."
            },
            {
              question: "What happens if you dereference a null pointer?",
              options: [
                "Returns 0",
                "Returns nullptr",
                "Undefined behavior (usually crash)",
                "Creates a new value"
              ],
              correctAnswer: "c",
              explanation: "Dereferencing a null pointer causes undefined behavior, which typically results in a program crash or segmentation fault."
            },
            {
              question: "What is a dangling pointer?",
              options: [
                "A pointer that is null",
                "A pointer to deallocated or invalid memory",
                "A pointer with no name",
                "A pointer that points to itself"
              ],
              correctAnswer: "b",
              explanation: "A dangling pointer points to memory that has been freed or is no longer valid. Using it causes undefined behavior."
            },
            {
              question: "What should you do after calling delete on a pointer?",
              options: [
                "Nothing, you're done",
                "Call delete again",
                "Set the pointer to nullptr",
                "Dereference it to confirm"
              ],
              correctAnswer: "c",
              explanation: "After deleting a pointer, set it to nullptr to prevent it from becoming a dangling pointer that could be accidentally used."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "References and Safe Alternatives",
    description: "Learn safer alternatives to raw pointers",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Understanding References",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# Understanding References

## What is a Reference?

A reference is an alias for an existing variable. Unlike pointers, references must be initialized when declared and cannot be changed to refer to something else.

\`\`\`cpp
int value = 42;
int& ref = value;  // ref is an alias for value

ref = 100;  // Changes value to 100
std::cout << value << std::endl;  // Prints: 100
\`\`\`

## References vs Pointers

### References

- Must be initialized when declared
- Cannot be null
- Cannot be reassigned
- Cleaner syntax (no dereferencing needed)
- Cannot be stored in arrays or containers

\`\`\`cpp
int x = 10;
int& ref = x;  // Must initialize
ref = 20;      // Direct assignment
\`\`\`

### Pointers

- Can be uninitialized (though unsafe)
- Can be null
- Can be reassigned
- Require dereferencing
- Can be stored in arrays and containers

\`\`\`cpp
int x = 10;
int* ptr = &x;  // Can be nullptr
*ptr = 20;      // Need dereferencing
ptr = nullptr;  // Can reassign
\`\`\`

## When to Use References

### Function Parameters

References are perfect for passing large objects without copying:

\`\`\`cpp
void printVector(const std::vector<int>& vec) {
    // vec is a reference - no copy made
    for (int val : vec) {
        std::cout << val << " ";
    }
}
\`\`\`

### Modifying Function Arguments

References allow functions to modify caller's variables:

\`\`\`cpp
void increment(int& value) {
    value++;  // Modifies the original
}

int main() {
    int x = 5;
    increment(x);
    std::cout << x << std::endl;  // Prints: 6
}
\`\`\`

### Range-Based For Loops

References avoid copying when iterating:

\`\`\`cpp
std::vector<std::string> names = {"Alice", "Bob", "Charlie"};

// Copy each string (slow)
for (std::string name : names) {
    std::cout << name << std::endl;
}

// Reference each string (fast)
for (const std::string& name : names) {
    std::cout << name << std::endl;
}
\`\`\`

## Const References

Const references provide read-only access and can bind to temporaries:

\`\`\`cpp
void print(const std::string& str) {
    std::cout << str << std::endl;
    // str = "changed";  // ERROR: cannot modify const reference
}

int main() {
    print("Hello");  // Can pass temporary
    
    std::string message = "World";
    print(message);  // Can pass variable
}
\`\`\`

## Reference Member Variables

Classes can have reference members, but they must be initialized in the constructor:

\`\`\`cpp
class Wrapper {
    int& ref;  // Reference member
    
public:
    Wrapper(int& value) : ref(value) {
        // Must initialize in initializer list
    }
    
    void increment() {
        ref++;  // Modifies original value
    }
};
\`\`\`

## Common Reference Mistakes

### Dangling References

Never return references to local variables:

\`\`\`cpp
// DANGEROUS
int& createDanglingRef() {
    int local = 42;
    return local;  // local is destroyed!
}

// SAFE
int createValue() {
    int local = 42;
    return local;  // Copy is returned
}
\`\`\`

### Uninitialized References

References must be initialized:

\`\`\`cpp
// ERROR: Cannot compile
int& ref;  // Must be initialized

// CORRECT
int value = 42;
int& ref = value;
\`\`\`

## Key Takeaways

**References are aliases** for existing variables. They provide a safer alternative to pointers in many situations.

**References cannot be null** and must be initialized, making them inherently safer than pointers.

**Use const references** for function parameters to avoid copying while preventing modifications.

**Never return references** to local variables, as they'll be destroyed when the function ends.

**References cannot be reassigned** once initialized, providing stability and predictability in your code.

Next, we'll explore how to work safely with arrays and prevent buffer overflows.`,
        },
      },
      {
        id: "lesson-2-2",
        title: "References Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# References Challenge

## Your Mission

Practice using references for efficient function parameters and safe variable aliasing.

## Requirements

1. Create functions that use references as parameters
2. Use const references for read-only access
3. Modify variables through references
4. Demonstrate efficiency of references vs copies

## Hints

- Use const references for parameters that shouldn't change
- Use non-const references to modify caller's variables
- References must be initialized when declared
- References provide direct access without dereferencing`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <string>

// TODO: Implement function that takes const reference
// and returns the length of a string


// TODO: Implement function that takes non-const reference
// and doubles the value


// TODO: Implement function that swaps two values using references


int main() {
    // TODO: Test string length function
    
    
    // TODO: Test doubling function
    
    
    // TODO: Test swap function
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <string>

// Function with const reference - doesn't modify
size_t getLength(const std::string& str) {
    return str.length();
}

// Function with non-const reference - modifies
void doubleValue(int& value) {
    value *= 2;
}

// Function that swaps using references
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    // Test string length
    std::string message = "Hello, World!";
    std::cout << "Length: " << getLength(message) << std::endl;
    std::cout << "Original: " << message << std::endl;
    
    // Test doubling
    int number = 21;
    std::cout << "\\nBefore double: " << number << std::endl;
    doubleValue(number);
    std::cout << "After double: " << number << std::endl;
    
    // Test swap
    int x = 10, y = 20;
    std::cout << "\\nBefore swap: x=" << x << ", y=" << y << std::endl;
    swap(x, y);
    std::cout << "After swap: x=" << x << ", y=" << y << std::endl;
    
    return 0;
}`,
            tests: `// Test: getLength returns correct length
// Test: Original string unchanged
// Test: doubleValue modifies original
// Test: swap exchanges values correctly
// Test: No copying of large objects`,
          },
        },
      },
      {
        id: "lesson-2-3",
        title: "Quiz: References",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What is the main difference between a reference and a pointer?",
              options: [
                "References are faster",
                "References must be initialized and cannot be null",
                "Pointers cannot be reassigned",
                "References require dereferencing"
              ],
              correctAnswer: "b",
              explanation: "References must be initialized when declared and cannot be null, making them inherently safer than pointers."
            },
            {
              question: "When passing large objects to functions, what should you use?",
              options: [
                "Pass by value",
                "Pass by const reference",
                "Pass by pointer",
                "Use global variables"
              ],
              correctAnswer: "b",
              explanation: "Const references avoid copying large objects while preventing modifications, providing both efficiency and safety."
            },
            {
              question: "Can you return a reference to a local variable?",
              options: [
                "Yes, always",
                "Yes, if it's const",
                "No, it causes undefined behavior",
                "Yes, but only for primitives"
              ],
              correctAnswer: "c",
              explanation: "Returning a reference to a local variable causes undefined behavior because the local variable is destroyed when the function ends."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Array and String Safety",
    description: "Prevent buffer overflows and handle arrays safely",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Safe Array Operations",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Safe Array Operations

## Understanding Arrays

Arrays are contiguous blocks of memory that store multiple elements of the same type. While powerful, they're also a common source of security vulnerabilities.

\`\`\`cpp
int numbers[5] = {1, 2, 3, 4, 5};
// numbers[0] through numbers[4] are valid
// numbers[5] is OUT OF BOUNDS
\`\`\`

## Buffer Overflow Vulnerabilities

A buffer overflow occurs when you write beyond the bounds of an array, potentially overwriting adjacent memory:

\`\`\`cpp
int arr[5];
arr[10] = 42;  // BUFFER OVERFLOW - Undefined behavior
\`\`\`

### Real-World Impact

Buffer overflows are responsible for countless security breaches. They can:

- Crash programs
- Corrupt data
- Allow attackers to execute arbitrary code
- Bypass security checks

## Bounds Checking

Always verify array indices before access:

\`\`\`cpp
int arr[5] = {1, 2, 3, 4, 5};
int index = getUserInput();

// UNSAFE
int value = arr[index];  // Could be out of bounds

// SAFE
if (index >= 0 && index < 5) {
    int value = arr[index];
} else {
    std::cerr << "Index out of bounds!" << std::endl;
}
\`\`\`

## Modern C++ Containers

Instead of raw arrays, use std::array or std::vector for automatic bounds checking:

### std::array - Fixed Size

\`\`\`cpp
#include <array>

std::array<int, 5> numbers = {1, 2, 3, 4, 5};

// Safe access with bounds checking
try {
    int value = numbers.at(10);  // Throws exception
} catch (const std::out_of_range& e) {
    std::cerr << "Out of bounds!" << std::endl;
}

// Also provides size information
std::cout << "Size: " << numbers.size() << std::endl;
\`\`\`

### std::vector - Dynamic Size

\`\`\`cpp
#include <vector>

std::vector<int> numbers = {1, 2, 3, 4, 5};

// Safe access
try {
    int value = numbers.at(10);  // Throws exception
} catch (const std::out_of_range& e) {
    std::cerr << "Out of bounds!" << std::endl;
}

// Dynamic sizing
numbers.push_back(6);  // Grows automatically
numbers.resize(10);    // Change size
\`\`\`

## Iterating Safely

### Range-Based For Loops

The safest way to iterate over containers:

\`\`\`cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

for (const int& num : numbers) {
    std::cout << num << std::endl;
}
// No index management, no bounds errors
\`\`\`

### Index-Based Loops

If you need indices, use size() for bounds:

\`\`\`cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

for (size_t i = 0; i < numbers.size(); ++i) {
    std::cout << numbers[i] << std::endl;
}
\`\`\`

### Iterator-Based Loops

Most flexible and safe:

\`\`\`cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

for (auto it = numbers.begin(); it != numbers.end(); ++it) {
    std::cout << *it << std::endl;
}
\`\`\`

## Common Array Mistakes

### Off-by-One Errors

\`\`\`cpp
int arr[5];

// WRONG - Accesses arr[5] which is out of bounds
for (int i = 0; i <= 5; ++i) {
    arr[i] = 0;
}

// CORRECT
for (int i = 0; i < 5; ++i) {
    arr[i] = 0;
}
\`\`\`

### Array Decay to Pointers

When passed to functions, arrays decay to pointers and lose size information:

\`\`\`cpp
void printArray(int arr[], int size) {
    // sizeof(arr) gives pointer size, not array size!
    for (int i = 0; i < size; ++i) {
        std::cout << arr[i] << std::endl;
    }
}

int main() {
    int numbers[5] = {1, 2, 3, 4, 5};
    printArray(numbers, 5);  // Must pass size separately
}
\`\`\`

**Better approach** - Use std::array or std::span:

\`\`\`cpp
void printArray(const std::array<int, 5>& arr) {
    for (const int& num : arr) {
        std::cout << num << std::endl;
    }
}
\`\`\`

## Key Takeaways

**Always check array bounds** before accessing elements. Out-of-bounds access causes undefined behavior.

**Prefer std::array and std::vector** over raw arrays for automatic size tracking and bounds checking.

**Use range-based for loops** when possible to eliminate index management and bounds errors.

**The at() method provides safe access** with automatic bounds checking and exception throwing.

**Pass size information** when working with raw arrays, or use containers that track their own size.

Next, we'll explore string handling and how to prevent string-related vulnerabilities.`,
        },
      },
      {
        id: "lesson-3-2",
        title: "String Safety",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# String Safety

## C-Style Strings vs std::string

### C-Style Strings (Dangerous)

C-style strings are null-terminated character arrays. They're prone to buffer overflows and require manual memory management:

\`\`\`cpp
char name[10] = "Alice";  // Wastes space or causes overflow
char* message = "Hello";  // No modification allowed
\`\`\`

### std::string (Safe)

Modern C++ provides std::string which manages memory automatically:

\`\`\`cpp
std::string name = "Alice";  // Grows as needed
name += " Smith";  // Safe concatenation
std::cout << name.length() << std::endl;  // Know the length
\`\`\`

## Common String Vulnerabilities

### Buffer Overflow with strcpy

\`\`\`cpp
char buffer[5];
strcpy(buffer, "This is too long");  // BUFFER OVERFLOW!
\`\`\`

**Safe alternative**:

\`\`\`cpp
std::string buffer = "This is too long";  // Automatically sized
\`\`\`

### Null Terminator Problems

C-strings must end with '\\0', forgetting this causes issues:

\`\`\`cpp
char str[5] = {'H', 'e', 'l', 'l', 'o'};  // Missing \\0
std::cout << str << std::endl;  // Undefined behavior
\`\`\`

**Safe alternative**:

\`\`\`cpp
std::string str = "Hello";  // Automatically terminated
\`\`\`

## Safe String Operations

### Concatenation

\`\`\`cpp
// UNSAFE - C-style
char result[100];
strcpy(result, "Hello ");
strcat(result, "World");  // What if it doesn't fit?

// SAFE - std::string
std::string result = "Hello ";
result += "World";  // Grows automatically
\`\`\`

### Comparison

\`\`\`cpp
// UNSAFE - C-style
if (strcmp(str1, str2) == 0) {
    // Equal
}

// SAFE - std::string
if (str1 == str2) {
    // Equal
}
\`\`\`

### Substring

\`\`\`cpp
std::string text = "Hello World";

// Extract substring safely
std::string hello = text.substr(0, 5);  // "Hello"

// Check bounds automatically
try {
    std::string invalid = text.substr(100, 5);
} catch (const std::out_of_range& e) {
    std::cerr << "Substring out of range!" << std::endl;
}
\`\`\`

### Finding Substrings

\`\`\`cpp
std::string text = "Hello World";

// Find returns position or npos
size_t pos = text.find("World");
if (pos != std::string::npos) {
    std::cout << "Found at position: " << pos << std::endl;
}
\`\`\`

## Input Validation

Always validate and sanitize string input:

\`\`\`cpp
std::string getUserInput() {
    std::string input;
    std::getline(std::cin, input);
    
    // Validate length
    if (input.length() > MAX_LENGTH) {
        input = input.substr(0, MAX_LENGTH);
    }
    
    // Remove dangerous characters
    input.erase(
        std::remove_if(input.begin(), input.end(), 
            [](char c) { return c == ';' || c == '\\0'; }),
        input.end()
    );
    
    return input;
}
\`\`\`

## String View (C++17)

For read-only string access without copying:

\`\`\`cpp
#include <string_view>

void printString(std::string_view sv) {
    std::cout << sv << std::endl;
    // No copy made, very efficient
}

int main() {
    std::string str = "Hello World";
    printString(str);  // No copy
    printString("Literal");  // No copy
}
\`\`\`

## Format String Safety

Never use user input directly as format strings:

\`\`\`cpp
// DANGEROUS
printf(userInput);  // User could inject %x, %n, etc.

// SAFE
printf("%s", userInput.c_str());

// BETTER
std::cout << userInput << std::endl;
\`\`\`

## Key Takeaways

**Use std::string instead of C-strings** for automatic memory management and safety features.

**Avoid strcpy, strcat, and similar functions** that don't check buffer bounds.

**Validate and sanitize all user input** to prevent injection attacks and buffer overflows.

**Use std::string_view for read-only access** to avoid unnecessary copies while maintaining safety.

**Never use user input as format strings** as this can lead to serious security vulnerabilities.

Next, we'll explore smart pointers and modern resource management techniques.`,
        },
      },
      {
        id: "lesson-3-3",
        title: "String Safety Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# String Safety Challenge

## Your Mission

Implement safe string operations using modern C++ features, avoiding buffer overflows and other string-related vulnerabilities.

## Requirements

1. Use std::string for all string operations
2. Validate input lengths
3. Perform safe concatenation
4. Implement safe substring extraction
5. Handle edge cases gracefully

## Hints

- std::string grows automatically
- Use .at() for bounds-checked access
- .substr() can throw out_of_range
- .find() returns npos if not found
- Always validate user input`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <string>

// TODO: Implement function that safely concatenates two strings
// with a maximum length limit


// TODO: Implement function that extracts a substring safely


// TODO: Implement function that validates and cleans user input


int main() {
    // TODO: Test safe concatenation
    
    
    // TODO: Test safe substring extraction
    
    
    // TODO: Test input validation
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <string>
#include <algorithm>

// Safe concatenation with length limit
std::string safeConcatenate(const std::string& str1, 
                            const std::string& str2, 
                            size_t maxLength) {
    std::string result = str1 + str2;
    
    if (result.length() > maxLength) {
        result = result.substr(0, maxLength);
    }
    
    return result;
}

// Safe substring extraction
std::string safeSubstring(const std::string& str, 
                         size_t start, 
                         size_t length) {
    try {
        return str.substr(start, length);
    } catch (const std::out_of_range& e) {
        std::cerr << "Substring out of range: " << e.what() << std::endl;
        return "";
    }
}

// Input validation and cleaning
std::string validateInput(const std::string& input) {
    const size_t MAX_LENGTH = 100;
    
    // Trim to max length
    std::string result = input;
    if (result.length() > MAX_LENGTH) {
        result = result.substr(0, MAX_LENGTH);
    }
    
    // Remove dangerous characters
    result.erase(
        std::remove_if(result.begin(), result.end(),
            [](char c) { 
                return c == ';' || c == '\\0' || c == '\\n'; 
            }),
        result.end()
    );
    
    return result;
}

int main() {
    std::cout << "=== Safe Concatenation ===" << std::endl;
    std::string result = safeConcatenate("Hello ", "World", 10);
    std::cout << "Result: " << result << std::endl;
    
    std::cout << "\\n=== Safe Substring ===" << std::endl;
    std::string text = "Hello World";
    std::string sub = safeSubstring(text, 0, 5);
    std::cout << "Substring: " << sub << std::endl;
    
    // Try invalid substring
    std::string invalid = safeSubstring(text, 100, 5);
    
    std::cout << "\\n=== Input Validation ===" << std::endl;
    std::string dangerous = "User;Input;With;Bad;Chars";
    std::string clean = validateInput(dangerous);
    std::cout << "Cleaned: " << clean << std::endl;
    
    return 0;
}`,
            tests: `// Test: Concatenation respects length limit
// Test: Substring handles out-of-range gracefully
// Test: Input validation removes dangerous characters
// Test: No buffer overflows occur
// Test: All string operations are safe`,
          },
        },
      },
      {
        id: "lesson-3-4",
        title: "Quiz: String Safety",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What is the main advantage of std::string over C-style strings?",
              options: [
                "It's faster",
                "It automatically manages memory and size",
                "It uses less memory",
                "It's easier to type"
              ],
              correctAnswer: "b",
              explanation: "std::string automatically manages memory allocation and tracks its size, preventing buffer overflows and simplifying string handling."
            },
            {
              question: "What does std::string::npos represent?",
              options: [
                "The null terminator",
                "The end position",
                "A value returned when a substring is not found",
                "The maximum string length"
              ],
              correctAnswer: "c",
              explanation: "std::string::npos is a special value returned by find() and similar functions when the searched substring is not found."
            },
            {
              question: "Why should you never use user input directly as a format string?",
              options: [
                "It's slower",
                "It uses more memory",
                "It can lead to format string vulnerabilities",
                "It doesn't work in C++"
              ],
              correctAnswer: "c",
              explanation: "Using user input as a format string allows attackers to inject format specifiers that can read or write arbitrary memory locations."
            }
          ],
        },
      },
    ],
  },
];
