import { Module } from "../pathModules";

// This learning path introduces the core principles of safe C++ programming.
// The modules and lessons below have been carefully written to provide
// thorough explanations, practical examples and professional formatting.
// Each lesson combines narrative paragraphs with concise bullet lists to
// guide learners through the material in a clear and engaging way.

export const foundationsSafeBasicsModules: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Safe C++ Fundamentals",
    description:
      "Learn the basics of safe memory handling and why these concepts are critical to modern systems programming.",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Welcome to Safe C++",
        type: "lesson",
        duration: 10,
        content: {
          // Provide a welcoming overview of the path. The text is written as
          // plain paragraphs and lists to render well in the current UI.
          markdown: `Welcome to Safe C++

What You'll Master

Memory safety bugs are responsible for approximately 70% of high‑severity security vulnerabilities in systems software. In this comprehensive learning path you'll discover how to write C++ code that's both powerful and secure.

Why This Matters

Every day, critical software systems face threats such as:
• Buffer overflows — writing beyond allocated memory boundaries
• Use‑after‑free — accessing memory that's been deallocated
• Dangling pointers — references to invalid memory locations
• Memory leaks — failing to release allocated resources

These aren't just academic concerns — they are real‑world vulnerabilities that cost companies millions and put user data at risk.

Your Learning Journey

Throughout this path you'll explore four essential modules that build upon each other to create a comprehensive understanding of safe C++ programming.

Module 1: Safe Fundamentals
Learn the core principles of safe memory handling, including pointer safety, initialization, understanding memory addresses, null pointer handling and basic memory management techniques.

Module 2: Array and String Operations
Master bounds checking techniques, safe string handling, modern C++ containers and buffer overflow prevention strategies that protect your code from common vulnerabilities.

Module 3: Smart Pointers
Discover RAII principles and learn how to use unique_ptr for exclusive ownership, shared_ptr for shared ownership and weak_ptr to break circular dependencies.

Module 4: Value Semantics
Understand the difference between copy and move semantics, learn the Rule of Zero/Three/Five, master perfect forwarding and apply const correctness throughout your code.

How You'll Learn

Each module combines three types of learning experiences:
• Theory lessons — clear, detailed explanations with practical examples that demonstrate concepts in action.
• Code challenges — hands‑on practice writing real code that applies what you've learned in practical scenarios.
• Quizzes — test your understanding and reinforce key concepts through carefully designed questions.

Let's begin your journey to writing safer, more reliable C++ code.`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Understanding Memory and Pointers",
        type: "lesson",
        duration: 20,
        content: {
          // Explain pointers in plain language with examples and cautionary notes.
          markdown: `Understanding Memory and Pointers

Computer memory can be thought of as a vast array of numbered slots. Each slot has a unique address and stores a small amount of data. A **pointer** is a variable that stores one of these addresses instead of a direct value. By storing an address, pointers let you indirectly access and modify data stored elsewhere in memory.

Declaring and Using Pointers

To declare a pointer, use the * symbol with the type. You can place the asterisk next to the type or variable name; both styles are valid. The address‑of operator (&) returns a variable's memory address, and the dereference operator (*) accesses the value at that address. For example:

```cpp
int value = 42;    // regular variable storing 42
int* ptr = &value; // pointer storing the address of value
std::cout << *ptr; // prints 42 (the value at that address)
```

Pointer Declaration Styles

```cpp
int* ptr1;   // common style
int *ptr2;   // alternative style
int * ptr3;  // also valid

// Declaring multiple pointers on one line can be confusing
int *a, *b;   // both a and b are pointers
int* c, d;    // c is a pointer, d is an int (be careful!)
```

Best practice: declare one pointer per line to avoid confusion.

Null and Uninitialized Pointers

A null pointer doesn't point to any valid memory location. Always initialize your pointers to either a valid address or to `nullptr`:

```cpp
int* ptr = nullptr; // pointer intentionally points nowhere
if (ptr == nullptr) {
    std::cout << "Pointer is null" << std::endl;
}
```

Uninitialized pointers contain random garbage values and can cause crashes or security vulnerabilities if dereferenced.

Common Pitfalls

• **Dereferencing null pointers** will crash your program. Always check before dereferencing.
• **Dangling pointers** refer to memory that has been freed or gone out of scope. Avoid returning addresses of local variables.
• **Memory leaks** occur when dynamically allocated memory isn't freed. Every `new` must have a corresponding `delete`.

Key Takeaways

• Pointers store addresses, not values.
• Always initialize pointers and check before dereferencing.
• Free dynamically allocated memory and set pointers to `nullptr` after deleting.
• Never return pointers to local variables.`,
        },
      },
      {
        id: "lesson-1-3",
        title: "Pointer Safety Challenge",
        type: "challenge",
        duration: 15,
        content: {
          // Updated challenge description for clarity.
          markdown: `Pointer Safety Challenge

Your mission is to demonstrate safe pointer usage by creating, using and properly managing pointers without causing undefined behavior or memory leaks.

Requirements:
1. Declare and initialize pointers correctly.
2. Safely dereference pointers with null checks.
3. Allocate and deallocate memory properly.
4. Avoid common pointer mistakes.

Hints:
• Always initialize pointers to nullptr.
• Check for null before dereferencing.
• Use new/delete correctly.
• Set pointers to nullptr after deleting.`,
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
                "Deletes a pointer",
              ],
              correctAnswer: "b",
              explanation:
                "The & operator (address-of) returns the memory address of a variable, allowing you to create pointers to that variable.",
            },
            {
              question:
                "What value should you initialize pointers to if you don't have a valid address yet?",
              options: ["0", "nullptr", "void", "Don't initialize them"],
              correctAnswer: "b",
              explanation:
                "In modern C++, use nullptr to initialize pointers that don't point to a valid address yet. This makes it clear the pointer is intentionally null.",
            },
            {
              question: "What happens if you dereference a null pointer?",
              options: ["Returns 0", "Returns nullptr", "Undefined behavior (usually crash)", "Creates a new value"],
              correctAnswer: "c",
              explanation:
                "Dereferencing a null pointer causes undefined behavior, which typically results in a program crash or segmentation fault.",
            },
            {
              question: "What is a dangling pointer?",
              options: [
                "A pointer that is null",
                "A pointer to deallocated or invalid memory",
                "A pointer with no name",
                "A pointer that points to itself",
              ],
              correctAnswer: "b",
              explanation:
                "A dangling pointer points to memory that has been freed or is no longer valid. Using it causes undefined behavior.",
            },
            {
              question: "What should you do after calling delete on a pointer?",
              options: [
                "Nothing, you're done",
                "Call delete again",
                "Set the pointer to nullptr",
                "Dereference it to confirm",
              ],
              correctAnswer: "c",
              explanation:
                "After deleting a pointer, set it to nullptr to prevent it from becoming a dangling pointer that could be accidentally used.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "References and Safe Alternatives",
    description: "Learn safer alternatives to raw pointers and how to use references effectively.",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Understanding References",
        type: "lesson",
        duration: 25,
        content: {
          // Explain references, how they differ from pointers and when to use them.
          markdown: `Understanding References

A reference is an alias for an existing variable. Unlike pointers, references must be initialized when declared and cannot be changed to refer to something else. They can never be null, making them inherently safer.

References vs. Pointers

• Initialization: references must be initialized when declared; pointers may be left uninitialized (though this is unsafe).
• Nullability: references cannot be null; pointers can be null.
• Reassignment: a reference cannot be reassigned to refer to a different object; a pointer can be reassigned.
• Syntax: references use a cleaner syntax without dereferencing, while pointers require the * operator.

Example:

```cpp
int value = 42;
int& ref = value;  // ref refers to value
ref = 100;         // changes value to 100

int* ptr = &value; // ptr points to value
*ptr = 200;        // changes value to 200
ptr = nullptr;     // ptr can be reassigned
```

When to Use References

• **Function parameters**: pass large objects by const reference to avoid copying while preventing modification.
• **Modifying arguments**: pass by non‑const reference to allow a function to modify the caller's variable.
• **Range‑based loops**: use references in range‑based for loops to avoid copying elements.

Const References

Const references provide read‑only access and can bind to temporaries:

```cpp
void print(const std::string& str) {
    std::cout << str << std::endl;
}
print("Hello");      // bind temporary to const reference
std::string msg = "World";
print(msg);          // bind variable to const reference
```

Common Mistakes

• **Dangling references**: never return a reference to a local variable — the reference becomes invalid when the function ends.
• **Uninitialized references**: references must be initialized when declared; you cannot have an uninitialized reference.

Key Takeaways

• References are aliases for existing variables and provide a safer alternative to pointers in many situations.
• Use const references to efficiently pass large objects to functions without copying.
• Never return references to local variables.
• References cannot be null and cannot be reassigned after initialization.`,
        },
      },
      {
        id: "lesson-2-2",
        title: "References Challenge",
        type: "challenge",
        duration: 20,
        content: {
          // Clarify the challenge description and hints using plain text.
          markdown: `References Challenge

Your mission is to practice using references for efficient function parameters and safe variable aliasing.

Requirements:
1. Create functions that use references as parameters.
2. Use const references for read‑only access.
3. Modify variables through references.
4. Demonstrate the efficiency of references versus copies.

Hints:
• Use const references for parameters that shouldn't change.
• Use non‑const references to modify caller's variables.
• References must be initialized when declared.
• References provide direct access without dereferencing.`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <string>

// TODO: Implement function that takes a const reference
// and returns the length of a string


// TODO: Implement function that takes a non‑const reference
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

// Function with const reference — doesn't modify the argument
size_t getLength(const std::string& str) {
    return str.length();
}

// Function with non‑const reference — modifies the argument
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
    std::cout << "\nBefore double: " << number << std::endl;
    doubleValue(number);
    std::cout << "After double: " << number << std::endl;
    
    // Test swap
    int x = 10, y = 20;
    std::cout << "\nBefore swap: x=" << x << ", y=" << y << std::endl;
    swap(x, y);
    std::cout << "After swap: x=" << x << ", y=" << y << std::endl;
    
    return 0;
}`,
            tests: `// Test: getLength returns correct length
// Test: original string unchanged after calling getLength
// Test: doubleValue modifies the original value
// Test: swap exchanges values correctly
// Test: No unnecessary copies of large objects`,
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
              question:
                "What is the main difference between a reference and a pointer?",
              options: [
                "References are faster",
                "References must be initialized and cannot be null",
                "Pointers cannot be reassigned",
                "References require dereferencing",
              ],
              correctAnswer: "b",
              explanation:
                "References must be initialized when declared and cannot be null, making them inherently safer than pointers.",
            },
            {
              question:
                "When passing large objects to functions, what should you use?",
              options: [
                "Pass by value",
                "Pass by const reference",
                "Pass by pointer",
                "Use global variables",
              ],
              correctAnswer: "b",
              explanation:
                "Const references avoid copying large objects while preventing modifications, providing both efficiency and safety.",
            },
            {
              question: "Can you return a reference to a local variable?",
              options: [
                "Yes, always",
                "Yes, if it's const",
                "No, it causes undefined behavior",
                "Yes, but only for primitives",
              ],
              correctAnswer: "c",
              explanation:
                "Returning a reference to a local variable causes undefined behavior because the local variable is destroyed when the function ends.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Array and String Safety",
    description: "Prevent buffer overflows and handle arrays and strings safely.",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Safe Array Operations",
        type: "lesson",
        duration: 30,
        content: {
          // Provide practical guidance on using arrays safely and avoiding common errors.
          markdown: `Safe Array Operations

Arrays are contiguous blocks of memory that store multiple elements of the same type. They are powerful but can be a common source of security vulnerabilities if used incorrectly.

Buffer Overflows

A buffer overflow occurs when you write beyond the bounds of an array, overwriting adjacent memory and causing undefined behavior. For example:

```cpp
int arr[5];
arr[10] = 42;  // Out‑of‑bounds write!
```

Buffer overflows can crash programs, corrupt data, allow attackers to execute arbitrary code or bypass security checks.

Bounds Checking

Always verify that an index is within the valid range before accessing an array element:

```cpp
int arr[5] = {1, 2, 3, 4, 5};
int index = getUserInput();
if (index >= 0 && index < 5) {
    int value = arr[index];
} else {
    std::cerr << "Index out of bounds!" << std::endl;
}
```

Modern C++ Containers

Instead of raw arrays, prefer safer containers:
• **std::array** – a fixed‑size container that knows its size and provides bounds‑checked access via `at()`.
• **std::vector** – a dynamic container that grows as needed and also provides `at()` for safe access.

Using these containers eliminates many manual bounds checks and prevents array decay to pointers.

Iterating Safely

Use range‑based for loops to iterate without managing indices:

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};
for (const int& num : numbers) {
    std::cout << num << std::endl;
}
```

If you need indices, use `size()` in the loop condition.

Common Pitfalls

• **Off‑by‑one errors**: using `<=` instead of `<` in loop conditions can result in out‑of‑bounds access.
• **Array decay to pointers**: arrays passed to functions decay to pointers and lose size information. Always pass the size along or use a container that tracks its size.

Key Takeaways

• Always perform bounds checks when accessing arrays.
• Prefer `std::array` and `std::vector` for safer and more flexible array handling.
• Use safe access methods like `at()` and range‑based loops to avoid common mistakes.
• Pass size information explicitly when working with raw arrays.`,
        },
      },
      {
        id: "lesson-3-2",
        title: "String Safety",
        type: "lesson",
        duration: 25,
        content: {
          // Discuss safe string handling and how to avoid C‑string pitfalls.
          markdown: `String Safety

Working with strings in C++ can be challenging. C‑style strings are arrays of characters terminated by a null byte. They are dangerous because they require manual memory management and are prone to buffer overflows.

C‑Style Strings vs. std::string

• **C‑style strings**: fixed‑size character arrays (e.g. \`char name[10] = "Alice";\`). They waste space or overflow if the content is too large.
• **std::string**: a modern C++ class that manages its own memory, grows dynamically and knows its length. Prefer `std::string` for safety and convenience:

```cpp
std::string name = "Alice";
name += " Smith";           // Safe concatenation
std::cout << name.length(); // Retrieve length safely
```

Common Vulnerabilities

• **Buffer overflow**: functions like `strcpy()` do not check buffer sizes and can overflow destination arrays.
• **Missing null terminator**: forgetting to include `\0` at the end of a C‑string causes undefined behavior.

Use `std::string` to avoid these issues.

Safe String Operations

• **Concatenation**: use `+=` or `append()` on `std::string`. Avoid `strcat()` on character arrays.
• **Comparison**: use `==` with `std::string` instead of `strcmp()`.
• **Substring**: use `substr()` and catch `std::out_of_range` exceptions for invalid indices.
• **Finding**: use `find()`; it returns `std::string::npos` if the substring is not found.

Input Validation

Always validate and sanitize user input:

```cpp
std::string input;
std::getline(std::cin, input);
if (input.length() > MAX_LENGTH) {
    input = input.substr(0, MAX_LENGTH);
}
// Remove dangerous characters
input.erase(
    std::remove_if(input.begin(), input.end(),
        [](char c) { return c == ';' || c == '\0'; }),
    input.end()
);
```

Format String Safety

Never use user‑supplied input as a format string. Instead, use a fixed format:

```cpp
printf("%s", userInput.c_str());    // Safe
std::cout << userInput << std::endl; // Better
```

Key Takeaways

• Use `std::string` instead of C‑strings for automatic memory management.
• Avoid unsafe C library functions that don't check buffer sizes.
• Always validate and sanitize input to prevent buffer overflows and injection attacks.
• Never use user input as a format string.`,
        },
      },
      {
        id: "lesson-3-3",
        title: "String Safety Challenge",
        type: "challenge",
        duration: 20,
        content: {
          // Clarify the challenge objectives and hints for safe string handling.
          markdown: `String Safety Challenge

Your mission is to implement safe string operations using modern C++ features, avoiding buffer overflows and other string‑related vulnerabilities.

Requirements:
1. Use `std::string` for all string operations.
2. Validate input lengths.
3. Perform safe concatenation with a length limit.
4. Implement safe substring extraction.
5. Handle edge cases gracefully.

Hints:
• `std::string` grows automatically as needed.
• Use `.at()` for bounds‑checked access.
• `.substr()` can throw `std::out_of_range`; catch the exception and handle it.
• `.find()` returns `std::string::npos` if the substring is not found.
• Always validate user input.`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <string>

// TODO: Implement a function that safely concatenates two strings
// with a maximum length limit


// TODO: Implement a function that extracts a substring safely


// TODO: Implement a function that validates and cleans user input


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
    std::string result = input;
    // Trim to max length
    if (result.length() > MAX_LENGTH) {
        result = result.substr(0, MAX_LENGTH);
    }
    // Remove dangerous characters
    result.erase(
        std::remove_if(result.begin(), result.end(),
            [](char c) { return c == ';' || c == '\0' || c == '\n'; }),
        result.end());
    return result;
}

int main() {
    std::cout << "=== Safe Concatenation ===" << std::endl;
    std::string result = safeConcatenate("Hello ", "World", 10);
    std::cout << "Result: " << result << std::endl;
    
    std::cout << "\n=== Safe Substring ===" << std::endl;
    std::string text = "Hello World";
    std::string sub = safeSubstring(text, 0, 5);
    std::cout << "Substring: " << sub << std::endl;
    // Try invalid substring
    std::string invalid = safeSubstring(text, 100, 5);
    
    std::cout << "\n=== Input Validation ===" << std::endl;
    std::string dangerous = "User;Input;With;Bad;Chars";
    std::string clean = validateInput(dangerous);
    std::cout << "Cleaned: " << clean << std::endl;
    
    return 0;
}`,
            tests: `// Test: concatenation respects length limit
// Test: substring handles out‑of‑range gracefully
// Test: input validation removes dangerous characters
// Test: no buffer overflows occur
// Test: all string operations are safe`,
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
              question: "What is the main advantage of std::string over C‑style strings?",
              options: [
                "It's faster",
                "It automatically manages memory and size",
                "It uses less memory",
                "It's easier to type",
              ],
              correctAnswer: "b",
              explanation:
                "std::string automatically manages memory allocation and tracks its size, preventing buffer overflows and simplifying string handling.",
            },
            {
              question: "What does std::string::npos represent?",
              options: [
                "The null terminator",
                "The end position",
                "A value returned when a substring is not found",
                "The maximum string length",
              ],
              correctAnswer: "c",
              explanation:
                "std::string::npos is a special value returned by find() and similar functions when the searched substring is not found.",
            },
            {
              question:
                "Why should you never use user input directly as a format string?",
              options: [
                "It's slower",
                "It uses more memory",
                "It can lead to format string vulnerabilities",
                "It doesn't work in C++",
              ],
              correctAnswer: "c",
              explanation:
                "Using user input as a format string allows attackers to inject format specifiers that can read or write arbitrary memory locations.",
            },
          ],
        },
      },
    ],
  },
];