export interface Lesson {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "challenge";
  duration: number; // minutes
  content?: {
    markdown?: string;
    code?: {
      language: string;
      starter: string;
      solution: string;
      tests?: string;
    };
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface PathModules {
  [pathSlug: string]: Module[];
}

export const pathModules: PathModules = {
  "foundations-safe-basics": [
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

In this path, you'll learn how to write C++ code that's both powerful and secure. 

## Why Safe C++ Matters

Memory safety bugs are responsible for approximately 70% of high-severity security vulnerabilities in systems software. By learning safe C++ practices, you'll:

- Prevent buffer overflows and use-after-free bugs
- Write more robust and maintainable code
- Understand modern C++ safety features
- Build secure systems from the ground up

## What You'll Learn

Throughout this module, we'll cover:
- Safe pointer usage
- Array bounds checking
- String handling best practices
- Stack vs heap memory

Let's get started!`,
          },
        },
        {
          id: "lesson-1-2",
          title: "Pointer Basics and Safety",
          type: "lesson",
          duration: 15,
          content: {
            markdown: `# Pointer Basics and Safety

Pointers are fundamental to C++, but they can be dangerous if misused.

## Safe Pointer Practices

1. **Always initialize pointers**
2. **Check for nullptr before dereferencing**
3. **Avoid dangling pointers**

## Common Pointer Mistakes

\`\`\`cpp
int* ptr;  // Uninitialized - DANGEROUS!
*ptr = 42; // Undefined behavior
\`\`\`

## Safe Alternative

\`\`\`cpp
int* ptr = nullptr;  // Always initialize
if (ptr != nullptr) {
    *ptr = 42;  // Safe - but still crashes here
}
\`\`\`

Now let's practice with a hands-on example!`,
            code: {
              language: "cpp",
              starter: `#include <iostream>

int main() {
    // TODO: Create a safe pointer to an integer
    // Initialize it with nullptr
    // Allocate memory for it
    // Set the value to 42
    // Print the value
    // Don't forget to clean up!
    
    return 0;
}`,
              solution: `#include <iostream>

int main() {
    // Create and initialize pointer
    int* ptr = nullptr;
    
    // Allocate memory
    ptr = new int;
    
    // Set value
    *ptr = 42;
    
    // Print value
    std::cout << "Value: " << *ptr << std::endl;
    
    // Clean up
    delete ptr;
    ptr = nullptr;
    
    return 0;
}`,
              tests: `// Test: Program compiles without errors
// Test: No memory leaks detected
// Test: Output contains "Value: 42"`,
            },
          },
        },
        {
          id: "lesson-1-3",
          title: "Quiz: Pointer Safety",
          type: "quiz",
          duration: 5,
          content: {
            markdown: `# Quiz: Pointer Safety

Test your understanding of safe pointer usage.

1. **What should you always do before using a pointer?**
   - a) Delete it
   - b) Initialize it
   - c) Increment it
   - d) Ignore it

2. **What is a dangling pointer?**
   - a) A pointer that points to valid memory
   - b) A pointer that points to freed or invalid memory
   - c) A null pointer
   - d) A pointer to a function

3. **What's the safe value to initialize a pointer with?**
   - a) 0
   - b) nullptr
   - c) -1
   - d) Any random value

**Answers:** 1-b, 2-b, 3-b`,
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
          title: "Array Bounds and Buffer Overflows",
          type: "lesson",
          duration: 20,
          content: {
            markdown: `# Array Bounds and Buffer Overflows

Buffer overflows are one of the most common security vulnerabilities.

## The Problem

\`\`\`cpp
int arr[5];
arr[10] = 42;  // Buffer overflow! Undefined behavior
\`\`\`

## Safe Solutions

Use bounds checking and modern containers:

\`\`\`cpp
#include <vector>
#include <stdexcept>

std::vector<int> arr(5);
if (index < arr.size()) {
    arr[index] = 42;  // Safe
}
// Or use at() which throws on bounds violation
arr.at(index) = 42;
\`\`\`

Let's practice safe array access!`,
            code: {
              language: "cpp",
              starter: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    
    // TODO: Safely access and print all elements
    // TODO: Try to access an out-of-bounds index safely
    
    return 0;
}`,
              solution: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    
    // Safely access and print all elements
    for (size_t i = 0; i < numbers.size(); ++i) {
        std::cout << "numbers[" << i << "] = " << numbers[i] << std::endl;
    }
    
    // Safely try to access out-of-bounds index
    try {
        int value = numbers.at(10);  // Will throw
    } catch (const std::out_of_range& e) {
        std::cout << "Caught bounds error: " << e.what() << std::endl;
    }
    
    return 0;
}`,
            },
          },
        },
      ],
    },
  ],
};
