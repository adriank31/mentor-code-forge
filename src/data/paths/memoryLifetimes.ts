import { Module } from "../pathModules";

export const memoryLifetimesModules: Module[] = [
  {
    id: "module-1",
    title: "Understanding Object Lifetimes",
    description: "Master the lifecycle of objects in C++",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Object Lifetime Basics",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# Object Lifetime Basics

## ⏰ What is Object Lifetime?

An object's **lifetime** is the period from when it's created until it's destroyed. Understanding lifetimes is crucial for preventing:
- Use-after-free bugs
- Dangling references
- Memory leaks
- Data races

## 📍 Storage Duration Types

C++ has four types of storage duration:

### 1. Automatic Storage (Stack)
\`\`\`cpp
void function() {
    int x = 42;           // Created when execution reaches here
    std::string name;     // Created here
    // Objects destroyed when leaving scope
}  // x and name destroyed here
\`\`\`

**Characteristics:**
- Fast allocation/deallocation
- Limited size (typically 1-8 MB)
- Automatic cleanup
- Lifetime tied to scope

### 2. Dynamic Storage (Heap)
\`\`\`cpp
int* ptr = new int(42);      // Created on heap
delete ptr;                   // Must manually delete
\`\`\`

**Characteristics:**
- Flexible size
- Manual management (or smart pointers)
- Slower than stack
- Lifetime controlled by programmer

### 3. Static Storage
\`\`\`cpp
static int count = 0;         // Created before main()
// Destroyed after main() exits
\`\`\`

**Characteristics:**
- Exists for entire program
- Initialized before main()
- One instance only
- Zero-initialized by default

### 4. Thread Storage
\`\`\`cpp
thread_local int value = 0;   // One per thread
\`\`\`

## 🎯 Scope vs Lifetime

These are different concepts!

\`\`\`cpp
int* createValue() {
    int x = 42;           // Automatic lifetime
    return &x;            // DANGER! x destroyed here
}                         // Returning dangling pointer!

int* safeCreate() {
    int* ptr = new int(42);  // Dynamic lifetime
    return ptr;               // OK, but caller must delete
}

std::unique_ptr<int> bestCreate() {
    return std::make_unique<int>(42);  // Automatic cleanup
}
\`\`\`

## 🏗️ Object Construction and Destruction

### Construction Order
\`\`\`cpp
class Widget {
    int a;
    std::string b;
    std::vector<int> c;
public:
    Widget() : a(1), b("hello"), c{1,2,3} {
        // Members constructed in declaration order
        // Then constructor body executes
    }
};
\`\`\`

### Destruction Order
\`\`\`cpp
{
    int x = 1;
    std::string y = "hello";
    Widget z;
    // Destroyed in reverse order: z, y, x
}
\`\`\`

## 🎯 Lifetime Extension with References

\`\`\`cpp
const std::string& getLongString() {
    return "This is a temporary";  // Returns temporary
}

// Temporary lifetime extended to end of statement
const std::string& ref = getLongString();  // Extended
// ref is valid here

// But this is dangerous:
void useString(const std::string& str) {
    // str might be a temporary that expires!
}
\`\`\`

## ⚠️ Common Lifetime Errors

### Dangling Pointer
\`\`\`cpp
int* ptr = nullptr;
{
    int value = 42;
    ptr = &value;
}  // value destroyed
// ptr now dangles!
\`\`\`

### Dangling Reference
\`\`\`cpp
const std::string& getRef() {
    std::string temp = "hello";
    return temp;  // Returns reference to local!
}  // temp destroyed, reference dangles
\`\`\`

### Use After Free
\`\`\`cpp
int* ptr = new int(42);
delete ptr;
*ptr = 100;  // Use after free!
\`\`\`

## ✅ Safe Patterns

### Return by Value
\`\`\`cpp
std::string createString() {
    std::string result = "hello";
    return result;  // Move or copy, but safe!
}
\`\`\`

### Use Smart Pointers
\`\`\`cpp
std::unique_ptr<Widget> createWidget() {
    return std::make_unique<Widget>();
    // Lifetime managed automatically
}
\`\`\`

### Member Variables
\`\`\`cpp
class Container {
    std::string data;  // Lifetime tied to Container
public:
    const std::string& getData() const {
        return data;  // Safe: data lives as long as Container
    }
};
\`\`\`

## 🎯 Key Takeaways

1. **Understand storage duration** types
2. **Scope ≠ Lifetime** (but often related)
3. **Never return references** to local variables
4. **Use smart pointers** for dynamic allocation
5. **Objects destroyed in reverse** construction order
6. **Prefer value semantics** when possible

Next: We'll dive deep into stack vs heap memory!`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Stack vs Heap Memory",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Stack vs Heap Memory

## 🏗️ The Two Memory Regions

### Stack Memory
Think of the stack as a stack of plates—you can only add or remove from the top.

**Characteristics:**
- ⚡ **Super fast** allocation (just move stack pointer)
- 📏 **Limited size** (1-8 MB typically)
- 🔄 **Automatic cleanup** (LIFO - Last In, First Out)
- 🎯 **Cache-friendly** (contiguous memory)

### Heap Memory
Think of the heap as a large warehouse with available spaces.

**Characteristics:**
- 🐌 **Slower** allocation (find free space, track it)
- 📦 **Flexible size** (limited by system RAM)
- 🔧 **Manual management** (or smart pointers)
- 💫 **Fragmentation** possible

## 📊 Visual Comparison

\`\`\`
Stack (grows down):
|-------------------|  ← High addresses
| function1 locals  |
|-------------------|
| function2 locals  |
|-------------------|  ← Stack pointer
| free space        |
|                   |
|-------------------|  ← Low addresses

Heap (grows up):
|-------------------|  ← Low addresses
| allocated block 1 |
|-------------------|
| free space        |
|-------------------|
| allocated block 2 |
|-------------------|
| free space        |
|                   |
|-------------------|  ← High addresses
\`\`\`

## 🔍 Stack Allocation

\`\`\`cpp
void stackExample() {
    int x = 42;                    // On stack
    double y = 3.14;               // On stack
    std::array<int, 100> arr;      // All 100 ints on stack
    Widget widget;                 // Object on stack
    
    // All automatically cleaned up when function returns
}
\`\`\`

### Stack Frame
Each function call creates a **stack frame**:

\`\`\`cpp
void function3() {
    int c = 3;
}

void function2() {
    int b = 2;
    function3();  // Adds frame on top
    // function3's frame removed
}

void function1() {
    int a = 1;
    function2();  // Adds frame on top
    // function2's frame removed
}
\`\`\`

## 🔍 Heap Allocation

\`\`\`cpp
void heapExample() {
    int* ptr = new int(42);              // On heap
    Widget* widget = new Widget();       // On heap
    int* arr = new int[1000];            // Array on heap
    
    // Must manually delete!
    delete ptr;
    delete widget;
    delete[] arr;
}

void smartExample() {
    auto ptr = std::make_unique<int>(42);
    auto widget = std::make_unique<Widget>();
    auto arr = std::make_unique<int[]>(1000);
    // Automatically cleaned up!
}
\`\`\`

## ⚖️ When to Use Each

### Use Stack When:
✅ Size is known at compile time
✅ Objects are small (<= few KB)
✅ Short-lived objects
✅ Want maximum performance

\`\`\`cpp
void processData() {
    int count = 0;
    std::string name = "example";
    std::array<double, 10> values;
    // Fast, automatic cleanup
}
\`\`\`

### Use Heap When:
✅ Size determined at runtime
✅ Large objects
✅ Need to outlive function scope
✅ Polymorphic objects

\`\`\`cpp
std::unique_ptr<Widget> createWidget(int size) {
    // Size determined at runtime
    auto widget = std::make_unique<Widget>(size);
    return widget;  // Can outlive function
}
\`\`\`

## 🚫 Common Mistakes

### Stack Overflow
\`\`\`cpp
void stackOverflow() {
    int huge[10000000];  // Too big for stack!
    // Might crash the program
}

void betterApproach() {
    auto huge = std::make_unique<int[]>(10000000);
    // On heap, no problem
}
\`\`\`

### Returning Stack References
\`\`\`cpp
int* dangerous() {
    int x = 42;
    return &x;  // DANGER! x destroyed!
}

std::unique_ptr<int> safe() {
    return std::make_unique<int>(42);  // Heap, safe
}
\`\`\`

### Memory Leaks
\`\`\`cpp
void leak() {
    int* ptr = new int(42);
    // Forgot to delete!
}  // Memory leaked!

void noLeak() {
    auto ptr = std::make_unique<int>(42);
    // Automatically deleted
}
\`\`\`

## 🎓 Performance Considerations

### Stack Advantages
- **Allocation**: ~1 instruction (move stack pointer)
- **Deallocation**: ~1 instruction (restore stack pointer)
- **Cache-friendly**: Contiguous, accessed sequentially

### Heap Advantages
- **Flexibility**: Any size, any lifetime
- **Sharing**: Multiple pointers can reference
- **Polymorphism**: Virtual dispatch requires heap

## 🧪 Memory Layout Example

\`\`\`cpp
class Example {
    int stackVar = 1;                           // In object's memory
    int* heapVar = new int(2);                  // Pointer on stack/object,
                                                // data on heap
public:
    void method() {
        int localVar = 3;                       // On stack
        static int staticVar = 4;               // Static storage
        
        auto smart = std::make_unique<int>(5);  // Ptr on stack,
                                                // data on heap
    }
};
\`\`\`

## 🎯 Decision Tree

\`\`\`
Need dynamic size? ──Yes──→ Use heap
      │
      No
      ↓
Size > few KB? ──Yes──→ Use heap
      │
      No
      ↓
Need to return? ──Yes──→ Use heap or return by value
      │
      No
      ↓
Use stack (default choice)
\`\`\`

## 🎯 Key Takeaways

1. **Stack is default** for local variables
2. **Heap for large** or dynamic-sized data
3. **Stack is faster** but limited
4. **Smart pointers** for heap management
5. **Never return** stack addresses
6. **Measure if unsure** about performance

Next: Move semantics and perfect ownership!`,
        },
      },
      {
        id: "lesson-1-3",
        title: "Memory Management Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Memory Management Challenge

## 🎯 Your Mission

Demonstrate understanding of stack vs heap allocation and proper lifetime management.

## 📋 Requirements

1. Create both stack and heap-allocated objects
2. Show proper cleanup of heap resources
3. Demonstrate why returning stack addresses fails
4. Use smart pointers for automatic management

## 💡 Hints

- Stack variables are automatic
- Use new/delete or smart pointers for heap
- Never return addresses of stack variables
- Smart pointers handle cleanup automatically`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <memory>

class Resource {
public:
    int value;
    Resource(int v) : value(v) {
        std::cout << "Resource(" << value << ") created\\n";
    }
    ~Resource() {
        std::cout << "Resource(" << value << ") destroyed\\n";
    }
};

// TODO: Implement safeCreateResource that returns a smart pointer
// to a heap-allocated Resource


int main() {
    std::cout << "=== Stack Allocation ===\\n";
    // TODO: Create a Resource on the stack with value 1
    
    
    std::cout << "\\n=== Heap Allocation (Smart Pointer) ===\\n";
    // TODO: Create a Resource on the heap using smart pointer with value 2
    
    
    std::cout << "\\n=== Returning Heap Resource ===\\n";
    // TODO: Call safeCreateResource and store result
    
    
    std::cout << "\\n=== Cleanup ===\\n";
    return 0;
}`,
            solution: `#include <iostream>
#include <memory>

class Resource {
public:
    int value;
    Resource(int v) : value(v) {
        std::cout << "Resource(" << value << ") created\\n";
    }
    ~Resource() {
        std::cout << "Resource(" << value << ") destroyed\\n";
    }
};

// Safe function that returns a heap-allocated resource
std::unique_ptr<Resource> safeCreateResource(int value) {
    return std::make_unique<Resource>(value);
}

int main() {
    std::cout << "=== Stack Allocation ===\\n";
    {
        Resource stackRes(1);  // Created on stack
        std::cout << "Using stack resource: " << stackRes.value << "\\n";
    }  // Automatically destroyed here
    std::cout << "Stack resource destroyed\\n";
    
    std::cout << "\\n=== Heap Allocation (Smart Pointer) ===\\n";
    {
        auto heapRes = std::make_unique<Resource>(2);
        std::cout << "Using heap resource: " << heapRes->value << "\\n";
    }  // Smart pointer automatically deletes
    std::cout << "Heap resource destroyed\\n";
    
    std::cout << "\\n=== Returning Heap Resource ===\\n";
    {
        auto returnedRes = safeCreateResource(3);
        std::cout << "Using returned resource: " << returnedRes->value << "\\n";
    }  // Destroyed when going out of scope
    std::cout << "Returned resource destroyed\\n";
    
    std::cout << "\\n=== Cleanup Complete ===\\n";
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: Stack resource created and destroyed
// Test: Heap resource properly managed with smart pointer
// Test: Function returns heap resource safely
// Test: All resources destroyed in correct order
// Test: No memory leaks`,
          },
        },
      },
      {
        id: "lesson-1-4",
        title: "Quiz: Memory and Lifetimes",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "Where are local variables typically allocated?",
              options: [
                "On the heap",
                "On the stack",
                "In static storage",
                "In the data segment"
              ],
              correctAnswer: "b",
              explanation: "Local variables are allocated on the stack by default. Stack allocation is fast and automatic—objects are destroyed when leaving scope."
            },
            {
              question: "What happens when you return a pointer to a local variable?",
              options: [
                "It works perfectly fine",
                "The compiler prevents it",
                "You get a dangling pointer (undefined behavior)",
                "The variable automatically moves to heap"
              ],
              correctAnswer: "c",
              explanation: "Returning a pointer to a local variable creates a dangling pointer. The local variable is destroyed when the function returns, making the pointer invalid."
            },
            {
              question: "Which memory region is typically faster?",
              options: [
                "Heap",
                "Stack",
                "Both are the same speed",
                "It depends on the OS"
              ],
              correctAnswer: "b",
              explanation: "Stack allocation is much faster—it's just moving a pointer. Heap allocation requires finding free space, updating bookkeeping structures, and is more complex."
            },
            {
              question: "What's the maximum practical size for stack allocation?",
              options: [
                "Unlimited",
                "A few KB to 1-8 MB depending on system",
                "Same as heap",
                "1 GB"
              ],
              correctAnswer: "b",
              explanation: "Stack size is limited (typically 1-8 MB). Large allocations should use the heap. Exceeding stack size causes stack overflow crashes."
            },
            {
              question: "In what order are objects destroyed?",
              options: [
                "Random order",
                "Order of creation",
                "Reverse order of creation",
                "Alphabetical order"
              ],
              correctAnswer: "c",
              explanation: "Objects are destroyed in reverse order of construction (LIFO - Last In, First Out). This ensures dependencies are handled correctly."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "Move Semantics and Perfect Forwarding",
    description: "Optimize performance with move semantics",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Understanding Move Semantics",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Understanding Move Semantics

## 🚀 What is Move Semantics?

**Move semantics** (C++11) allows resources to be "moved" rather than copied, drastically improving performance for many operations.

### The Problem: Expensive Copies

\`\`\`cpp
std::vector<int> createLargeVector() {
    std::vector<int> v(1000000);  // 1 million elements
    // ... fill vector ...
    return v;  // Copy? That's expensive!
}

std::vector<int> data = createLargeVector();  // Copy?
\`\`\`

Without move semantics, returning large objects meant expensive copies.

## 💡 The Solution: Move Instead of Copy

\`\`\`cpp
std::vector<int> createLargeVector() {
    std::vector<int> v(1000000);
    return v;  // Actually moves, not copies!
}

std::vector<int> data = createLargeVector();  // Move, very fast!
\`\`\`

## 🎯 Lvalues vs Rvalues

### Lvalue (Left value)
- Has a name and address
- Can appear on left side of assignment
- Persists beyond expression

\`\`\`cpp
int x = 42;              // x is lvalue
int& ref = x;            // OK: lvalue reference to lvalue
\`\`\`

### Rvalue (Right value)
- Temporary or unnamed
- Can only appear on right side
- Expires at end of statement

\`\`\`cpp
int x = 42;              // 42 is rvalue (temporary)
int y = x + 1;           // x + 1 is rvalue (temporary result)
\`\`\`

## 🔧 Rvalue References

Rvalue references (&&) bind to temporaries:

\`\`\`cpp
void processValue(int& lref) {
    std::cout << "Lvalue reference\\n";
}

void processValue(int&& rref) {
    std::cout << "Rvalue reference\\n";
}

int x = 42;
processValue(x);         // Calls lvalue version
processValue(42);        // Calls rvalue version
processValue(x + 1);     // Calls rvalue version
\`\`\`

## 🏗️ Move Constructor

\`\`\`cpp
class String {
    char* data;
    size_t size;
public:
    // Move constructor
    String(String&& other) noexcept
        : data(other.data), size(other.size) {
        // Steal resources
        other.data = nullptr;
        other.size = 0;
    }
    
    // Copy constructor (for comparison)
    String(const String& other)
        : size(other.size) {
        data = new char[size];
        std::copy(other.data, other.data + size, data);
    }
};
\`\`\`

### What Happened?
- **Copy**: Allocate new memory, copy all data
- **Move**: Just copy pointer, set source to null

## 🔄 std::move

\`std::move\` casts an lvalue to an rvalue reference:

\`\`\`cpp
std::string str1 = "Hello";
std::string str2 = std::move(str1);  // Move, not copy
// str1 is now in "valid but unspecified" state
// str2 owns the data
\`\`\`

### Critical Understanding
\`\`\`cpp
std::vector<std::string> vec;
std::string text = "Important data";

vec.push_back(text);            // Copy: text still valid after
vec.push_back(std::move(text)); // Move: text now empty/moved-from
\`\`\`

## ⚡ Performance Impact

### Before Move Semantics (C++03)
\`\`\`cpp
std::vector<BigObject> createVector() {
    std::vector<BigObject> result;
    result.push_back(BigObject(...));  // Copy
    return result;                      // Copy entire vector!
}
\`\`\`

### With Move Semantics (C++11+)
\`\`\`cpp
std::vector<BigObject> createVector() {
    std::vector<BigObject> result;
    result.push_back(BigObject(...));  // Move temporary
    return result;                      // Move vector!
}
\`\`\`

## 📜 The Rule of Five

If you define any of these, define all five:

1. **Destructor**: \`~T()\`
2. **Copy constructor**: \`T(const T&)\`
3. **Copy assignment**: \`T& operator=(const T&)\`
4. **Move constructor**: \`T(T&&) noexcept\`
5. **Move assignment**: \`T& operator=(T&&) noexcept\`

\`\`\`cpp
class Resource {
    int* data;
public:
    // Destructor
    ~Resource() { delete data; }
    
    // Copy constructor
    Resource(const Resource& other)
        : data(new int(*other.data)) {}
    
    // Copy assignment
    Resource& operator=(const Resource& other) {
        if (this != &other) {
            delete data;
            data = new int(*other.data);
        }
        return *this;
    }
    
    // Move constructor
    Resource(Resource&& other) noexcept
        : data(other.data) {
        other.data = nullptr;
    }
    
    // Move assignment
    Resource& operator=(Resource&& other) noexcept {
        if (this != &other) {
            delete data;
            data = other.data;
            other.data = nullptr;
        }
        return *this;
    }
};
\`\`\`

## 🎯 When Does Move Happen?

### Automatically:
- Returning local objects
- Temporary objects
- RVO/NRVO (Return Value Optimization)

### With std::move:
- Explicit transfer of ownership
- Putting values into containers
- Resource transfers

\`\`\`cpp
std::vector<std::string> vec;
std::string s = "hello";

vec.push_back(s);            // Copy: s still usable
vec.push_back(std::move(s)); // Move: s now moved-from
\`\`\`

## ⚠️ Common Pitfalls

### Don't Move Twice
\`\`\`cpp
std::string s = "data";
auto s1 = std::move(s);   // s is moved-from
auto s2 = std::move(s);   // Undefined! s already moved
\`\`\`

### Don't Use After Move
\`\`\`cpp
std::string s = "data";
auto s2 = std::move(s);
std::cout << s;  // Undefined! s is moved-from
                 // (technically valid but unspecified state)
\`\`\`

### Mark noexcept
\`\`\`cpp
String(String&& other) noexcept {  // Important!
    // Move operations should not throw
}
\`\`\`

## 🎯 Key Takeaways

1. **Move semantics** transfer resources instead of copying
2. **Rvalue references** (&&) enable moves
3. **std::move** casts to rvalue reference
4. **After move**, source is valid but unspecified
5. **noexcept** is critical for move operations
6. **Huge performance** improvements for large objects

Next: Perfect forwarding and advanced move patterns!`,
        },
      },
    ],
  },
];
