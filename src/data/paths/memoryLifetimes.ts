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

## What is Object Lifetime?

An object's **lifetime** is the period from when it's created until it's destroyed. Understanding lifetimes is crucial for preventing several categories of bugs that can lead to security vulnerabilities and program crashes.

## Critical Lifetime Issues

Understanding object lifetimes helps prevent:

- **Use-after-free bugs** - Accessing memory after it's been deallocated
- **Dangling references** - Pointers or references to destroyed objects
- **Memory leaks** - Failing to destroy objects that are no longer needed
- **Data races** - Multiple threads accessing objects without proper synchronization

## Storage Duration Types

C++ defines four types of storage duration that determine when objects are created and destroyed.

### Automatic Storage Duration (Stack)

Objects with automatic storage duration are created when execution reaches their declaration and destroyed when leaving their scope:

\`\`\`cpp
void function() {
    int x = 42;           // Created when execution reaches here
    std::string name;     // Created here
    
    // Objects can be used here
    
}  // x and name destroyed automatically here
\`\`\`

**Key Characteristics:**

- Fast allocation and deallocation (just moving the stack pointer)
- Limited size (typically 1-8 MB depending on system)
- Automatic cleanup when leaving scope
- Lifetime tied directly to scope
- Memory is contiguous and cache-friendly

### Dynamic Storage Duration (Heap)

Objects with dynamic storage duration are created with \`new\` and exist until explicitly destroyed with \`delete\`:

\`\`\`cpp
int* ptr = new int(42);      // Created on heap
// Object exists until deleted
delete ptr;                   // Explicitly destroyed
\`\`\`

**Key Characteristics:**

- Flexible size limited only by available RAM
- Manual management required (or use smart pointers)
- Slower than stack allocation
- Lifetime controlled by programmer
- Can outlive the scope where created

### Static Storage Duration

Objects with static storage duration are created before \`main()\` starts and destroyed after \`main()\` exits:

\`\`\`cpp
static int count = 0;         // Created before main()
// Exists for entire program duration
// Destroyed after main() exits
\`\`\`

**Key Characteristics:**

- Exists for the entire program lifetime
- Initialized before main() begins
- Only one instance exists
- Zero-initialized by default for built-in types
- Destroyed in reverse order of construction

### Thread Storage Duration

Objects with thread storage duration exist for the lifetime of the thread:

\`\`\`cpp
thread_local int value = 0;   // One instance per thread
\`\`\`

**Key Characteristics:**

- Each thread gets its own instance
- Created when thread starts
- Destroyed when thread ends
- Useful for thread-specific state

## Scope vs Lifetime

These are fundamentally different concepts that are often confused:

**Scope** defines where a name can be used in code.

**Lifetime** defines when an object exists in memory.

\`\`\`cpp
int* createValue() {
    int x = 42;           // Automatic lifetime, function scope
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

## Object Construction and Destruction

### Construction Order

When an object is created, its members are constructed in a specific order:

\`\`\`cpp
class Widget {
    int a;
    std::string b;
    std::vector<int> c;
    
public:
    Widget() : a(1), b("hello"), c{1,2,3} {
        // Members constructed in declaration order (a, b, c)
        // Then constructor body executes
        std::cout << "Widget constructed" << std::endl;
    }
};
\`\`\`

**Important**: Members are always constructed in the order they're declared in the class, not the order in the initializer list.

### Destruction Order

Objects are destroyed in reverse order of construction:

\`\`\`cpp
{
    int x = 1;
    std::string y = "hello";
    Widget z;
    
    // At end of scope, destroyed in reverse order: z, y, x
}
\`\`\`

This reverse destruction order is crucial for maintaining invariants and preventing use-after-free bugs.

## Lifetime Extension with References

Const references can extend the lifetime of temporaries:

\`\`\`cpp
const std::string& getLongString() {
    return "This is a temporary";  // Returns temporary
}

// Temporary lifetime extended to end of statement
const std::string& ref = getLongString();  
// ref is valid within this scope

// But this is dangerous:
void useString(const std::string& str) {
    // str might be a temporary that expires soon!
}
\`\`\`

## Common Lifetime Errors

### Dangling Pointer

A pointer that references memory that has been freed:

\`\`\`cpp
int* ptr = nullptr;
{
    int value = 42;
    ptr = &value;
}  // value destroyed
// ptr now dangles - undefined behavior to use it!
\`\`\`

### Dangling Reference

A reference to an object that no longer exists:

\`\`\`cpp
const std::string& getRef() {
    std::string temp = "hello";
    return temp;  // Returns reference to local!
}  // temp destroyed, reference dangles
\`\`\`

### Use After Free

Accessing memory after it's been deallocated:

\`\`\`cpp
int* ptr = new int(42);
delete ptr;
*ptr = 100;  // Use after free - undefined behavior!
\`\`\`

## Safe Lifetime Patterns

### Return by Value

The compiler can optimize away unnecessary copies:

\`\`\`cpp
std::string createString() {
    std::string result = "hello";
    return result;  // Move or copy elision, but always safe!
}
\`\`\`

### Use Smart Pointers

Smart pointers manage lifetime automatically:

\`\`\`cpp
std::unique_ptr<Widget> createWidget() {
    return std::make_unique<Widget>();
    // Lifetime managed automatically
}
\`\`\`

### Member Variables

Member variables have the same lifetime as their containing object:

\`\`\`cpp
class Container {
    std::string data;  // Lifetime tied to Container
    
public:
    const std::string& getData() const {
        return data;  // Safe: data lives as long as Container
    }
};
\`\`\`

## Key Takeaways

**Understand the four storage durations** and when each is appropriate for your objects.

**Scope and lifetime are different** - an object can exist beyond its scope but cannot be accessed there.

**Never return references** to local variables as they're destroyed when the function ends.

**Use smart pointers** for dynamic allocation to ensure proper cleanup and prevent leaks.

**Objects are destroyed in reverse construction order** which maintains invariants and dependencies.

**Prefer value semantics** when possible as they have clear, predictable lifetimes.

Next, we'll explore the critical differences between stack and heap memory allocation.`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Stack vs Heap Memory",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Stack vs Heap Memory

## The Two Memory Regions

Understanding the difference between stack and heap memory is fundamental to writing efficient and safe C++ code. Each has distinct characteristics, advantages, and use cases.

## Stack Memory

Think of the stack as a stack of plates where you can only add or remove from the top. This Last-In-First-Out (LIFO) structure is extremely efficient.

**Key Characteristics:**

**Extremely Fast Allocation** - Allocating stack memory is typically just a single instruction that moves the stack pointer. Deallocation is equally fast.

**Limited Size** - The stack is typically 1-8 MB depending on the system. This is relatively small compared to available RAM.

**Automatic Cleanup** - Objects are automatically destroyed when they go out of scope. No manual management needed.

**Cache-Friendly** - Stack memory is contiguous and accessed sequentially, making it very cache-efficient.

**Thread-Local** - Each thread has its own stack, preventing many concurrency issues.

### Stack Allocation Example

\`\`\`cpp
void stackExample() {
    int x = 42;                    // On stack
    double y = 3.14;               // On stack
    std::array<int, 100> arr;      // All 100 ints on stack
    Widget widget;                 // Object on stack
    
    // All automatically cleaned up when function returns
}
\`\`\`

### Stack Frame Structure

Each function call creates a stack frame containing:

\`\`\`cpp
void function3() {
    int c = 3;
    // Stack frame for function3
}

void function2() {
    int b = 2;
    function3();  // Adds new frame on top
    // function3's frame removed when it returns
}

void function1() {
    int a = 1;
    function2();  // Adds new frame on top
    // function2's frame removed when it returns
}
\`\`\`

**Stack Growth:**
\`\`\`
function1 calls function2 calls function3

Stack (grows downward):
|-------------------|  ← High addresses
| function1 locals  |  (a = 1)
|-------------------|
| function2 locals  |  (b = 2)
|-------------------|
| function3 locals  |  (c = 3)
|-------------------|  ← Stack pointer
| free space        |
|                   |
|-------------------|  ← Low addresses
\`\`\`

## Heap Memory

Think of the heap as a large warehouse with spaces that can be allocated and freed in any order. This flexibility comes with performance costs.

**Key Characteristics:**

**Slower Allocation** - The allocator must find a suitable free block, track it, and possibly split or merge blocks. Much more complex than stack allocation.

**Flexible Size** - Limited only by available system RAM, which can be gigabytes.

**Manual Management** - Memory must be explicitly freed (or managed by smart pointers). Forgetting causes memory leaks.

**Fragmentation** - Repeated allocation and deallocation can fragment memory, reducing efficiency.

**Thread-Shared** - All threads share the heap, requiring synchronization for thread-safe allocation.

### Heap Allocation Example

\`\`\`cpp
void heapExample() {
    int* ptr = new int(42);              // On heap
    Widget* widget = new Widget();       // On heap
    int* arr = new int[1000];            // Array on heap
    
    // Must manually delete!
    delete ptr;
    delete widget;
    delete[] arr;  // Note: delete[] for arrays
}

void smartExample() {
    auto ptr = std::make_unique<int>(42);
    auto widget = std::make_unique<Widget>();
    auto arr = std::make_unique<int[]>(1000);
    // Automatically cleaned up!
}
\`\`\`

### Heap Memory Layout

\`\`\`
Heap (grows upward):
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

## When to Use Each

### Use Stack When:

**Size is known at compile time** and relatively small (typically under a few KB).

\`\`\`cpp
void processData() {
    int count = 0;
    std::string name = "example";
    std::array<double, 10> values;
    // Fast, automatic cleanup
}
\`\`\`

**Objects are short-lived** and don't need to outlive the function.

**You want maximum performance** and the size constraints aren't an issue.

**You need automatic cleanup** with guaranteed RAII semantics.

### Use Heap When:

**Size is determined at runtime** or too large for the stack.

\`\`\`cpp
std::unique_ptr<Widget> createWidget(int size) {
    // Size determined at runtime
    auto widget = std::make_unique<Widget>(size);
    return widget;  // Can outlive function
}
\`\`\`

**Objects need to outlive** the function scope where they're created.

**Working with large objects** that would overflow the stack (typically > 1MB).

**Using polymorphic objects** that require virtual dispatch.

## Common Mistakes

### Stack Overflow

Allocating too much data on the stack causes crashes:

\`\`\`cpp
void stackOverflow() {
    int huge[10000000];  // Too big for stack!
    // Likely causes stack overflow
}

void betterApproach() {
    auto huge = std::make_unique<int[]>(10000000);
    // On heap, no problem
}
\`\`\`

### Returning Stack Addresses

Never return pointers or references to local variables:

\`\`\`cpp
// DANGEROUS
int* dangerous() {
    int x = 42;
    return &x;  // x destroyed, pointer dangles!
}

// SAFE
std::unique_ptr<int> safe() {
    return std::make_unique<int>(42);  // Heap allocation
}

// ALSO SAFE
int safest() {
    return 42;  // Copy returned
}
\`\`\`

### Memory Leaks

Forgetting to free heap memory causes leaks:

\`\`\`cpp
void leak() {
    int* ptr = new int(42);
    // Forgot to delete!
}  // Memory leaked forever

void noLeak() {
    auto ptr = std::make_unique<int>(42);
    // Automatically deleted
}
\`\`\`

### Double Delete

Deleting the same pointer twice causes undefined behavior:

\`\`\`cpp
int* ptr = new int(42);
delete ptr;
delete ptr;  // Undefined behavior!

// Prevent with smart pointers or nullptr
delete ptr;
ptr = nullptr;
delete ptr;  // Safe - deleting nullptr is a no-op
\`\`\`

## Performance Considerations

### Stack Advantages

**Allocation**: Approximately 1 CPU instruction (move stack pointer)

**Deallocation**: Approximately 1 CPU instruction (restore stack pointer)

**Cache Performance**: Excellent due to contiguous memory and sequential access patterns

**Fragmentation**: None - memory is always contiguous

### Heap Advantages

**Flexibility**: Can allocate any size at runtime

**Lifetime**: Objects can outlive their creation scope

**Sharing**: Multiple pointers can reference the same object

**Polymorphism**: Enables virtual dispatch and runtime polymorphism

## Memory Layout Example

\`\`\`cpp
class Example {
    int stackVar = 1;                           // In object's memory
    int* heapVar = new int(2);                  // Pointer on stack/in object,
                                                // data on heap
public:
    void method() {
        int localVar = 3;                       // On stack
        static int staticVar = 4;               // Static storage
        
        auto smart = std::make_unique<int>(5);  // Pointer on stack,
                                                // data on heap
    }
};
\`\`\`

## Decision Tree for Stack vs Heap

\`\`\`
Need dynamic size?
    ├─ Yes → Use heap
    └─ No
        ├─ Size > few KB?
        │   ├─ Yes → Use heap
        │   └─ No
        │       ├─ Need to return from function?
        │       │   ├─ Yes → Use heap or return by value
        │       │   └─ No → Use stack (default choice)
\`\`\`

## Key Takeaways

**Stack is the default** for local variables due to its speed and automatic cleanup.

**Heap is for large or dynamic-sized** data that needs flexible lifetimes.

**Stack is significantly faster** but has strict size limitations.

**Use smart pointers** for heap management to prevent leaks and simplify cleanup.

**Never return stack addresses** as they become invalid when the function ends.

**Measure performance** if you're unsure - don't guess which is better for your use case.

Next, we'll explore memory management challenges and how to handle them safely.`,
        },
      },
      {
        id: "lesson-1-3",
        title: "Memory Management Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Memory Management Challenge

## Your Mission

Demonstrate understanding of stack vs heap allocation and proper lifetime management by creating a program that correctly uses both types of memory.

## Requirements

1. Create both stack and heap-allocated objects
2. Show proper cleanup of heap resources
3. Demonstrate why returning stack addresses fails
4. Use smart pointers for automatic management
5. Print lifecycle messages to show object creation and destruction

## Learning Objectives

- Understand the difference between stack and heap allocation
- Practice safe memory management techniques
- See object lifetimes in action
- Learn to avoid common memory management pitfalls

## Hints

- Stack variables are created when declared and destroyed at scope end
- Use \`new\`/\`delete\` or smart pointers for heap allocation
- Never return addresses of stack variables
- Smart pointers automatically handle cleanup
- Destructor messages help visualize object lifetimes`,
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

// TODO: Implement function that returns a smart pointer
// to a heap-allocated Resource


int main() {
    std::cout << "=== Stack Allocation ===\\n";
    // TODO: Create a Resource on the stack with value 1
    
    
    std::cout << "\\n=== Heap Allocation (Smart Pointer) ===\\n";
    // TODO: Create a Resource on the heap using smart pointer with value 2
    
    
    std::cout << "\\n=== Returning Heap Resource ===\\n";
    // TODO: Call your function and store result
    
    
    std::cout << "\\n=== End of main ===\\n";
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

// Function that returns heap-allocated Resource via smart pointer
std::unique_ptr<Resource> createHeapResource(int value) {
    return std::make_unique<Resource>(value);
}

int main() {
    std::cout << "=== Stack Allocation ===\\n";
    {
        Resource stackResource(1);
        std::cout << "Stack resource value: " << stackResource.value << "\\n";
        // Automatically destroyed at end of scope
    }
    std::cout << "Stack resource scope ended\\n";
    
    std::cout << "\\n=== Heap Allocation (Smart Pointer) ===\\n";
    {
        auto heapResource = std::make_unique<Resource>(2);
        std::cout << "Heap resource value: " << heapResource->value << "\\n";
        // Automatically destroyed at end of scope
    }
    std::cout << "Smart pointer scope ended\\n";
    
    std::cout << "\\n=== Returning Heap Resource ===\\n";
    {
        auto returned = createHeapResource(3);
        std::cout << "Returned resource value: " << returned->value << "\\n";
        // Can outlive the function that created it
        // Still automatically destroyed at end of scope
    }
    std::cout << "Returned resource scope ended\\n";
    
    std::cout << "\\n=== End of main ===\\n";
    return 0;
}

// Expected output shows clear creation and destruction order:
// 1. Stack resource created and immediately destroyed
// 2. Heap resource created, used, then destroyed
// 3. Resource created in function, returned, then destroyed`,
            tests: `// Test: Stack resource created and destroyed in correct order
// Test: Heap resource properly managed by smart pointer
// Test: Returned resource outlives creating function
// Test: All resources properly destroyed
// Test: No memory leaks
// Test: Clear lifecycle demonstrated`,
          },
        },
      },
      {
        id: "lesson-1-4",
        title: "Quiz: Object Lifetimes",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What is the difference between scope and lifetime?",
              options: [
                "They are the same thing",
                "Scope is where a name can be used; lifetime is when an object exists",
                "Scope is for classes; lifetime is for functions",
                "Lifetime is always longer than scope"
              ],
              correctAnswer: "b",
              explanation: "Scope defines where a name can be used in code, while lifetime defines when an object actually exists in memory. An object's lifetime can extend beyond its scope (e.g., heap objects)."
            },
            {
              question: "In what order are objects destroyed?",
              options: [
                "Random order",
                "Order of declaration",
                "Reverse order of construction",
                "Alphabetical order"
              ],
              correctAnswer: "c",
              explanation: "Objects are destroyed in reverse order of construction. This ensures that dependencies are maintained and objects that were created later (which might depend on earlier objects) are destroyed first."
            },
            {
              question: "What happens when you return a reference to a local variable?",
              options: [
                "It works fine",
                "The variable is copied",
                "It creates a dangling reference (undefined behavior)",
                "It extends the variable's lifetime"
              ],
              correctAnswer: "c",
              explanation: "Returning a reference to a local variable creates a dangling reference because the local variable is destroyed when the function ends, leaving the reference pointing to invalid memory."
            },
            {
              question: "Which storage duration is fastest for allocation?",
              options: [
                "Dynamic (heap)",
                "Static",
                "Thread-local",
                "Automatic (stack)"
              ],
              correctAnswer: "d",
              explanation: "Automatic (stack) storage duration is fastest because allocation is typically just a single instruction to move the stack pointer, while heap allocation requires finding and tracking free memory blocks."
            },
            {
              question: "What is the typical stack size limit?",
              options: [
                "1-8 MB",
                "100 MB",
                "1 GB",
                "Unlimited"
              ],
              correctAnswer: "a",
              explanation: "The stack is typically limited to 1-8 MB depending on the system. This is relatively small compared to available RAM, which is why large data structures should be allocated on the heap."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "Smart Pointers and RAII",
    description: "Automatic memory management with modern C++",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Introduction to Smart Pointers",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Smart Pointers in C++

## What Are Smart Pointers?

Smart pointers are objects that act like pointers but automatically manage the lifetime of the object they point to through RAII (Resource Acquisition Is Initialization). They prevent memory leaks and dangling pointers by ensuring resources are properly cleaned up.

## Why Smart Pointers Matter

Manual memory management with raw pointers is error-prone and leads to common bugs:

**Memory leaks** - Forgetting to delete allocated memory

**Double deletion** - Deleting the same pointer twice

**Dangling pointers** - Using pointers after the object is deleted

**Exception safety** - Leaks when exceptions are thrown before delete

Smart pointers solve all of these problems automatically.

## Types of Smart Pointers

### unique_ptr - Exclusive Ownership

\`unique_ptr\` represents exclusive ownership of a resource. Only one \`unique_ptr\` can own a resource at a time.

\`\`\`cpp
#include <memory>

auto ptr = std::make_unique<Widget>();
// ptr exclusively owns the Widget
// Automatically deleted when ptr goes out of scope
\`\`\`

**Key Features:**

- Zero overhead compared to raw pointers
- Move-only (cannot be copied)
- Perfect for factory functions
- Can be transferred with std::move

**Creating unique_ptr:**

\`\`\`cpp
// Preferred way (exception-safe)
auto ptr1 = std::make_unique<int>(42);

// Also valid but less safe
std::unique_ptr<int> ptr2(new int(42));

// For arrays
auto arr = std::make_unique<int[]>(100);
\`\`\`

**Transferring Ownership:**

\`\`\`cpp
auto ptr1 = std::make_unique<Widget>();
auto ptr2 = std::move(ptr1);  // Transfer ownership
// ptr1 is now nullptr
// ptr2 owns the Widget
\`\`\`

### shared_ptr - Shared Ownership

\`shared_ptr\` allows multiple pointers to share ownership of a resource using reference counting. The resource is deleted when the last \`shared_ptr\` is destroyed.

\`\`\`cpp
auto ptr1 = std::make_shared<Widget>();
auto ptr2 = ptr1;  // Both share ownership
// Widget deleted when last shared_ptr is destroyed
\`\`\`

**Key Features:**

- Reference counting (small overhead)
- Can be copied and assigned
- Thread-safe reference counting
- Useful for shared resources

**Reference Counting:**

\`\`\`cpp
auto ptr1 = std::make_shared<int>(42);
std::cout << ptr1.use_count() << std::endl;  // 1

{
    auto ptr2 = ptr1;
    std::cout << ptr1.use_count() << std::endl;  // 2
}

std::cout << ptr1.use_count() << std::endl;  // 1 again
\`\`\`

### weak_ptr - Non-owning Reference

\`weak_ptr\` provides a non-owning reference to an object managed by \`shared_ptr\`. It breaks circular dependencies and doesn't affect the reference count.

\`\`\`cpp
auto shared = std::make_shared<Widget>();
std::weak_ptr<Widget> weak = shared;

// weak doesn't affect reference count
std::cout << shared.use_count() << std::endl;  // 1

// Must lock to access
if (auto locked = weak.lock()) {
    // Use locked like shared_ptr
}
\`\`\`

**Key Features:**

- Doesn't affect reference count
- Can detect if object still exists
- Prevents circular references
- Must be converted to shared_ptr to use

## RAII Principle

Resource Acquisition Is Initialization means that resource lifetime is tied to object lifetime:

\`\`\`cpp
{
    auto file = std::make_unique<File>("data.txt");
    // File automatically opened
    
    // Use file...
    
}  // File automatically closed and memory freed
\`\`\`

**Benefits of RAII:**

- Automatic cleanup even with exceptions
- No chance of forgetting to free resources
- Clear ownership semantics
- Composable resource management

## When to Use Each

### Use unique_ptr When:

- You need exclusive ownership
- You want zero overhead
- Returning from factory functions
- Storing in containers (with move semantics)

\`\`\`cpp
std::unique_ptr<Widget> createWidget() {
    return std::make_unique<Widget>();
}

std::vector<std::unique_ptr<Widget>> widgets;
widgets.push_back(createWidget());
\`\`\`

### Use shared_ptr When:

- Multiple owners need the same resource
- Ownership is unclear or dynamic
- Implementing caches or shared resources
- Working with callbacks that might outlive the caller

\`\`\`cpp
class Cache {
    std::map<std::string, std::shared_ptr<Data>> cache;
    
public:
    std::shared_ptr<Data> get(const std::string& key) {
        return cache[key];  // Shared ownership
    }
};
\`\`\`

### Use weak_ptr When:

- Breaking circular references
- Implementing observer patterns
- Caching without preventing deletion
- Detecting if an object still exists

\`\`\`cpp
class Node {
    std::shared_ptr<Node> child;
    std::weak_ptr<Node> parent;  // Breaks cycle
};
\`\`\`

## Common Patterns

### Factory Functions

\`\`\`cpp
std::unique_ptr<Shape> createShape(ShapeType type) {
    switch (type) {
        case ShapeType::Circle:
            return std::make_unique<Circle>();
        case ShapeType::Square:
            return std::make_unique<Square>();
    }
}
\`\`\`

### Pimpl Idiom

\`\`\`cpp
class Widget {
    struct Impl;
    std::unique_ptr<Impl> pImpl;
    
public:
    Widget();
    ~Widget();
    // Implementation hidden in .cpp file
};
\`\`\`

### Observer Pattern

\`\`\`cpp
class Subject {
    std::vector<std::weak_ptr<Observer>> observers;
    
    void notify() {
        for (auto& weak : observers) {
            if (auto observer = weak.lock()) {
                observer->update();
            }
        }
    }
};
\`\`\`

## Key Takeaways

**Use smart pointers instead of raw pointers** for ownership to prevent leaks and simplify code.

**unique_ptr is the default** for single ownership with zero overhead.

**shared_ptr enables shared ownership** with automatic cleanup when the last reference is gone.

**weak_ptr breaks circular dependencies** and allows checking if an object still exists.

**RAII ensures automatic cleanup** even when exceptions are thrown.

**Smart pointers make ownership explicit** making code easier to understand and maintain.

Next, we'll explore move semantics and how to efficiently transfer resources.`,
        },
      },
      {
        id: "lesson-2-2",
        title: "Smart Pointer Challenge",
        type: "challenge",
        duration: 25,
        content: {
          markdown: `# Smart Pointer Challenge

## Your Mission

Implement resource management using smart pointers to demonstrate automatic cleanup, ownership transfer, and shared ownership patterns.

## Requirements

1. Create resources with unique_ptr for exclusive ownership
2. Share ownership with shared_ptr and demonstrate reference counting
3. Transfer ownership between unique_ptrs
4. Show automatic cleanup in all cases
5. Print lifecycle messages to visualize object lifetimes

## Learning Objectives

- Practice using unique_ptr for exclusive ownership
- Understand shared_ptr reference counting
- Learn ownership transfer with move semantics
- See automatic resource cleanup in action

## Hints

- Use std::make_unique for creating unique_ptrs
- Use std::make_shared for creating shared_ptrs
- Transfer unique_ptr with std::move
- Check reference count with use_count()
- Destructor messages show when cleanup happens`,
          code: {
            language: "cpp",
            starter: `#include <memory>
#include <iostream>

class Resource {
public:
    int value;
    
    Resource(int v) : value(v) {
        std::cout << "Resource created: " << value << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource destroyed: " << value << std::endl;
    }
};

// TODO: Implement using smart pointers

int main() {
    // TODO: Create unique_ptr
    
    
    // TODO: Create shared_ptr and show reference counting
    
    
    // TODO: Demonstrate ownership transfer
    
    
    return 0;
}`,
            solution: `#include <memory>
#include <iostream>

class Resource {
public:
    int value;
    
    Resource(int v) : value(v) {
        std::cout << "Resource created: " << value << std::endl;
    }
    
    ~Resource() {
        std::cout << "Resource destroyed: " << value << std::endl;
    }
};

int main() {
    std::cout << "=== Unique Pointer ===\\n";
    {
        auto unique = std::make_unique<Resource>(1);
        std::cout << "Value: " << unique->value << std::endl;
        // Automatically destroyed at end of scope
    }
    std::cout << "Unique pointer scope ended\\n";
    
    std::cout << "\\n=== Shared Pointers ===\\n";
    {
        auto shared1 = std::make_shared<Resource>(2);
        std::cout << "Reference count: " << shared1.use_count() << std::endl;
        
        {
            auto shared2 = shared1;  // Share ownership
            std::cout << "Reference count: " << shared1.use_count() << std::endl;
            std::cout << "Both pointers point to: " << shared2->value << std::endl;
        }
        
        std::cout << "Reference count after inner scope: " 
                  << shared1.use_count() << std::endl;
    }
    std::cout << "Shared pointer scope ended\\n";
    
    std::cout << "\\n=== Ownership Transfer ===\\n";
    {
        auto ptr1 = std::make_unique<Resource>(3);
        std::cout << "ptr1 owns resource\\n";
        
        auto ptr2 = std::move(ptr1);  // Transfer ownership
        std::cout << "Ownership transferred to ptr2\\n";
        std::cout << "ptr1 is now: " << (ptr1 ? "valid" : "null") << std::endl;
        std::cout << "ptr2 value: " << ptr2->value << std::endl;
    }
    std::cout << "Transfer scope ended\\n";
    
    std::cout << "\\n=== End of main ===\\n";
    return 0;
}`,
            tests: `// Test: Unique pointer properly manages resource
// Test: Shared pointer reference counting works correctly
// Test: Ownership transfer leaves source pointer null
// Test: All resources properly destroyed
// Test: No memory leaks
// Test: Clear lifecycle visualization`,
          },
        },
      },
      {
        id: "lesson-2-3",
        title: "Quiz: Smart Pointers",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "Which smart pointer allows shared ownership?",
              options: [
                "unique_ptr",
                "shared_ptr",
                "weak_ptr",
                "auto_ptr"
              ],
              correctAnswer: "b",
              explanation: "shared_ptr uses reference counting to allow multiple pointers to share ownership of the same object. The object is deleted when the last shared_ptr is destroyed."
            },
            {
              question: "What happens when a unique_ptr goes out of scope?",
              options: [
                "Nothing, memory leaks",
                "The object is automatically deleted",
                "You must manually delete",
                "The object is copied"
              ],
              correctAnswer: "b",
              explanation: "unique_ptr automatically deletes the managed object when it goes out of scope, preventing memory leaks through RAII."
            },
            {
              question: "What is the purpose of weak_ptr?",
              options: [
                "To make pointers slower",
                "To break circular references",
                "To add reference counting",
                "To replace unique_ptr"
              ],
              correctAnswer: "b",
              explanation: "weak_ptr provides a non-owning reference that doesn't affect the reference count, making it perfect for breaking circular dependencies between shared_ptrs."
            },
            {
              question: "How do you transfer ownership of a unique_ptr?",
              options: [
                "By copying it",
                "By using std::move",
                "By dereferencing it",
                "You cannot transfer ownership"
              ],
              correctAnswer: "b",
              explanation: "unique_ptr is move-only and cannot be copied. You must use std::move to transfer ownership, which leaves the source pointer null."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Move Semantics",
    description: "Efficient resource transfer with move semantics",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Understanding Move Semantics",
        type: "lesson",
        duration: 35,
        content: {
          markdown: `# Move Semantics

## What Are Move Semantics?

Move semantics enable efficient transfer of resources from one object to another without expensive copying. Instead of duplicating data, move operations transfer ownership of resources.

## The Problem Move Semantics Solve

Before C++11, returning large objects from functions was expensive:

\`\`\`cpp
std::vector<int> createLargeVector() {
    std::vector<int> result(1000000);
    // Fill vector...
    return result;  // Expensive copy!
}
\`\`\`

The vector's data would be copied, then the original destroyed—wasteful for temporary objects.

## Rvalue References

Move semantics are enabled by rvalue references, declared with \`&&\`:

\`\`\`cpp
void process(std::string&& str) {
    // str is an rvalue reference
    // Can "steal" its resources
}
\`\`\`

**Lvalues vs Rvalues:**

- **Lvalue**: Has a name, has an address, persists beyond single expression
- **Rvalue**: Temporary, no name, about to be destroyed

\`\`\`cpp
int x = 5;           // x is an lvalue
int y = x + 3;       // x+3 is an rvalue (temporary)
std::string s = "Hi"; // s is an lvalue
process(s + "!");    // s+"!" is an rvalue
\`\`\`

## Move Constructor

A move constructor transfers resources instead of copying:

\`\`\`cpp
class Widget {
    int* data;
    size_t size;
    
public:
    // Copy constructor - expensive
    Widget(const Widget& other) 
        : size(other.size) {
        data = new int[size];
        std::copy(other.data, other.data + size, data);
    }
    
    // Move constructor - efficient
    Widget(Widget&& other) noexcept 
        : data(other.data), size(other.size) {
        other.data = nullptr;  // Leave source valid but empty
        other.size = 0;
    }
    
    ~Widget() {
        delete[] data;
    }
};
\`\`\`

**Key Points:**

- Mark move constructors \`noexcept\` for optimization
- Leave the moved-from object in a valid but unspecified state
- Transfer resources, don't copy them
- Usually much faster than copying

## Move Assignment

Move assignment is similar but assigns to existing objects:

\`\`\`cpp
class Widget {
    int* data;
    size_t size;
    
public:
    // Move assignment operator
    Widget& operator=(Widget&& other) noexcept {
        if (this != &other) {
            // Clean up our resources
            delete[] data;
            
            // Transfer other's resources
            data = other.data;
            size = other.size;
            
            // Leave other valid but empty
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};
\`\`\`

## std::move

\`std::move\` casts an lvalue to an rvalue reference, enabling move semantics:

\`\`\`cpp
std::string str1 = "Hello";
std::string str2 = std::move(str1);  // Move, don't copy
// str1 is now in moved-from state (valid but unspecified)
\`\`\`

**Important**: \`std::move\` doesn't actually move anything—it just casts. The move constructor or move assignment does the actual work.

## Perfect Forwarding

Forwarding references (also called universal references) preserve value category:

\`\`\`cpp
template<typename T>
void wrapper(T&& arg) {
    // Forward arg to another function
    realFunction(std::forward<T>(arg));
}
\`\`\`

\`std::forward\` preserves whether the argument was an lvalue or rvalue.

## Return Value Optimization (RVO)

Modern compilers can eliminate copies entirely:

\`\`\`cpp
std::vector<int> createVector() {
    std::vector<int> result;
    // Fill vector...
    return result;  // No copy, no move - constructed in place!
}
\`\`\`

**Copy Elision** happens automatically when:
- Returning a local object
- The returned object has the same type as the return type
- The object is constructed in the return statement

## Rule of Five

If you define any of the following, consider defining all five:

1. Destructor
2. Copy constructor
3. Copy assignment operator
4. Move constructor
5. Move assignment operator

\`\`\`cpp
class Resource {
public:
    ~Resource();                              // Destructor
    Resource(const Resource&);                // Copy constructor
    Resource& operator=(const Resource&);     // Copy assignment
    Resource(Resource&&) noexcept;            // Move constructor
    Resource& operator=(Resource&&) noexcept; // Move assignment
};
\`\`\`

## Rule of Zero

Better yet, don't manage resources manually:

\`\`\`cpp
class Widget {
    std::vector<int> data;      // Manages its own memory
    std::string name;           // Manages its own memory
    std::unique_ptr<Impl> impl; // Manages its own memory
    
    // Compiler-generated special members work perfectly!
};
\`\`\`

## When to Use Move Semantics

### Returning Large Objects

\`\`\`cpp
std::vector<int> createLargeVector() {
    std::vector<int> result(1000000);
    return result;  // Moved, not copied
}
\`\`\`

### Transferring Unique Resources

\`\`\`cpp
std::unique_ptr<Widget> createWidget() {
    auto ptr = std::make_unique<Widget>();
    return ptr;  // Moved, not copied
}
\`\`\`

### Optimizing Container Operations

\`\`\`cpp
std::vector<std::string> strings;
std::string temp = "Long string...";
strings.push_back(std::move(temp));  // Move instead of copy
\`\`\`

## Common Mistakes

### Using Moved-From Objects

\`\`\`cpp
std::string str1 = "Hello";
std::string str2 = std::move(str1);
std::cout << str1 << std::endl;  // WRONG! str1 in unspecified state
\`\`\`

### Moving in Wrong Contexts

\`\`\`cpp
void process(const std::string& str) {
    auto copy = std::move(str);  // Doesn't move! str is const
}
\`\`\`

### Pessimizing Moves

\`\`\`cpp
std::string getString() {
    std::string result = "Hello";
    return std::move(result);  // BAD! Prevents RVO
}
\`\`\`

## Key Takeaways

**Move semantics enable efficient resource transfer** without expensive copying.

**Use std::move to enable moves** from lvalues that you're done with.

**Mark move operations noexcept** to enable optimizations.

**Don't use moved-from objects** except to assign or destroy them.

**Prefer Rule of Zero** over Rule of Five by using standard library types.

**Let RVO happen naturally** - don't pessimize with unnecessary moves.

Next, we'll explore advanced lifetime management and best practices.`,
        },
      },
      {
        id: "lesson-3-2",
        title: "Quiz: Move Semantics",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What does std::move actually do?",
              options: [
                "Moves the object in memory",
                "Casts to rvalue reference",
                "Copies the object",
                "Deletes the object"
              ],
              correctAnswer: "b",
              explanation: "std::move casts its argument to an rvalue reference, enabling move semantics. It doesn't actually move anything by itself - the move constructor or move assignment does the actual work."
            },
            {
              question: "When should you mark move operations noexcept?",
              options: [
                "Never",
                "Only for small objects",
                "Whenever possible for optimization",
                "Only for POD types"
              ],
              correctAnswer: "c",
              explanation: "Move operations should be marked noexcept whenever possible because many standard library containers use move operations only if they're noexcept, falling back to copy otherwise."
            },
            {
              question: "What is Return Value Optimization (RVO)?",
              options: [
                "A way to optimize return statements",
                "Compiler optimization that eliminates copies/moves when returning",
                "A coding pattern for efficient returns",
                "A runtime optimization"
              ],
              correctAnswer: "b",
              explanation: "RVO is a compiler optimization that constructs the return value directly in the caller's memory, eliminating both copies and moves entirely."
            }
          ],
        },
      },
    ],
  },
];
