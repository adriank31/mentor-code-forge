import { Module } from "../pathModules";

export const concurrencyRaceFreedomModules: Module[] = [
  {
    id: "module-1",
    title: "Introduction to Concurrency",
    description: "Learn the fundamentals of parallel programming",
    lessons: [
      {
        id: "lesson-1-1",
        title: "What is Concurrency?",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# What is Concurrency?

## Concurrency vs Parallelism

These terms are often confused, but they represent different concepts in concurrent programming.

### Concurrency

Concurrency is about **dealing with** multiple things at once. It's a program structure that allows multiple tasks to make progress, not necessarily simultaneously.

**Key Characteristics:**

- Multiple tasks interleaved on single core
- Task switching creates illusion of simultaneity
- About composing independently executing processes
- Can exist without parallelism

\`\`\`cpp
// Concurrent but not parallel
// Tasks alternate on single core
while (true) {
    handleNetworkRequest();
    processUserInput();
    updateDisplay();
}
\`\`\`

### Parallelism

Parallelism is about **doing** multiple things at once. It's actual simultaneous execution on multiple cores.

**Key Characteristics:**

- True simultaneous execution
- Requires multiple CPU cores
- Actually doing multiple things at same time
- Subset of concurrency

\`\`\`cpp
// Parallel execution
// Tasks run truly simultaneously on different cores
std::thread t1(processChunk1);
std::thread t2(processChunk2);
t1.join();
t2.join();
\`\`\`

## Why Concurrency Matters

### Performance

**Utilize Multiple CPU Cores** - Modern CPUs have multiple cores sitting idle if you don't use concurrency.

**Reduce Idle Time** - While waiting for I/O, another thread can do useful work.

**Faster Program Execution** - Divide work across cores for dramatic speedups.

### Responsiveness

**Keep UI Responsive** - Long operations on background threads don't freeze the interface.

**Handle Multiple Users** - Servers can process many client requests simultaneously.

**Background Tasks** - Download files, process data without blocking user interaction.

### Resource Utilization

**Maximize Hardware Usage** - Get value from multi-core processors.

**Better Throughput** - Process more work per unit time.

**Efficient Servers** - Handle thousands of concurrent connections.

## Threads in C++

### Creating Threads

The std::thread class provides an easy way to create concurrent threads:

\`\`\`cpp
#include <thread>
#include <iostream>

void task() {
    std::cout << "Hello from thread!" << std::endl;
}

int main() {
    std::thread t(task);  // Create thread executing task
    t.join();             // Wait for completion
    return 0;
}
\`\`\`

### Threads with Parameters

Pass arguments to thread functions:

\`\`\`cpp
void printNumber(int n) {
    std::cout << "Number: " << n << std::endl;
}

std::thread t1(printNumber, 42);
std::thread t2(printNumber, 100);

t1.join();
t2.join();
\`\`\`

### Lambda Functions

Use lambdas for inline thread code:

\`\`\`cpp
std::thread t([]() {
    std::cout << "Lambda thread!" << std::endl;
});
t.join();
\`\`\`

### Capturing Variables

Lambdas can capture variables from their scope:

\`\`\`cpp
int value = 42;

// Capture by value
std::thread t1([value]() {
    std::cout << value << std::endl;
});

// Capture by reference (CAREFUL!)
std::thread t2([&value]() {
    value += 10;  // Modifies original
});

t1.join();
t2.join();
\`\`\`

## The Race Condition Problem

When multiple threads access shared data without synchronization, race conditions occur:

\`\`\`cpp
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; ++i) {
        counter++;  // NOT THREAD-SAFE!
    }
}

std::thread t1(increment);
std::thread t2(increment);
t1.join();
t2.join();

std::cout << counter << std::endl;  // Probably not 200000!
\`\`\`

### What Went Wrong?

The simple \`counter++\` actually involves multiple steps:

1. Read counter value from memory
2. Add 1 to the value
3. Write result back to memory

Two threads can interleave these steps, causing lost updates.

## Thread Safety with Mutex

A mutex (mutual exclusion) ensures only one thread accesses code at a time:

\`\`\`cpp
#include <mutex>

int counter = 0;
std::mutex mtx;

void increment() {
    for (int i = 0; i < 100000; ++i) {
        mtx.lock();
        counter++;
        mtx.unlock();
    }
}

std::thread t1(increment);
std::thread t2(increment);
t1.join();
t2.join();

std::cout << counter << std::endl;  // Always 200000!
\`\`\`

## RAII Lock Guards

Manual lock/unlock is error-prone. Lock guards provide automatic unlocking:

\`\`\`cpp
void increment() {
    for (int i = 0; i < 100000; ++i) {
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
        // Automatically unlocked when lock goes out of scope
    }
}
\`\`\`

**Benefits of lock_guard:**

- Automatic unlocking via RAII
- Exception-safe (unlocks even if exception thrown)
- Cannot forget to unlock
- Cannot accidentally unlock wrong mutex

## Common Threading Patterns

### Fire and Forget

Thread runs independently without waiting:

\`\`\`cpp
std::thread t(backgroundTask);
t.detach();  // Thread runs independently
\`\`\`

**Warning**: Detached threads must not access local variables from the parent scope!

### Wait for Completion

Most common pattern - wait for thread to finish:

\`\`\`cpp
std::thread t(task);
t.join();  // Wait for thread to finish
\`\`\`

### Multiple Threads

Launch and join multiple threads:

\`\`\`cpp
std::vector<std::thread> threads;
for (int i = 0; i < 10; ++i) {
    threads.emplace_back(task, i);
}

for (auto& t : threads) {
    t.join();
}
\`\`\`

## Common Mistakes

### Forgetting to Join/Detach

\`\`\`cpp
{
    std::thread t(task);
}  // CRASH! Thread destroyed without join/detach
\`\`\`

**Fix**: Always call join() or detach() before thread object is destroyed.

### Data Races

\`\`\`cpp
int shared = 0;
std::thread t1([&]{ shared++; });  // Race!
std::thread t2([&]{ shared++; });  // Race!
\`\`\`

**Fix**: Protect shared data with mutexes.

### Deadlock

\`\`\`cpp
std::mutex m1, m2;

// Thread 1
m1.lock();
m2.lock();  // Might deadlock with Thread 2

// Thread 2
m2.lock();
m1.lock();  // Might deadlock with Thread 1
\`\`\`

**Fix**: Always acquire locks in the same order, or use std::lock to lock multiple mutexes atomically.

### Race on Captured References

\`\`\`cpp
void createThread() {
    int value = 42;
    std::thread t([&]() {
        std::cout << value << std::endl;  // DANGER!
    });
    t.detach();
}  // value destroyed but thread might still be running!
\`\`\`

**Fix**: Capture by value or use shared_ptr for shared state.

## Key Takeaways

**Threads enable parallel execution** on multi-core systems for better performance.

**Race conditions occur** when multiple threads access shared data without synchronization.

**Mutexes protect shared data** by ensuring exclusive access.

**Lock guards provide RAII** for mutexes, preventing forgotten unlocks.

**Always join or detach threads** before the thread object is destroyed.

**Be careful with shared data** - prefer avoiding shared mutable state when possible.

Next, we'll dive deep into advanced synchronization primitives and patterns.`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Thread Safety Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Thread Safety Challenge

## Your Mission

Create a thread-safe counter that multiple threads can increment simultaneously without race conditions.

## Requirements

1. Create a counter that multiple threads will increment
2. Use a mutex to protect the counter from race conditions
3. Use lock_guard for automatic unlocking and exception safety
4. Launch multiple threads to test concurrent access
5. Verify the final count is correct

## Learning Objectives

- Practice using std::mutex for synchronization
- Learn to use std::lock_guard for RAII locking
- Understand how to prevent race conditions
- See the difference between synchronized and unsynchronized access

## Hints

- Use std::mutex for synchronization
- Use std::lock_guard for automatic locking/unlocking
- Use std::thread to create threads
- Use .join() to wait for threads to complete
- The final count should equal numThreads * iterations`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

// TODO: Declare shared counter


// TODO: Declare mutex for protection


void incrementCounter(int iterations) {
    // TODO: Implement thread-safe counter increment
    
}

int main() {
    const int numThreads = 4;
    const int iterations = 25000;
    
    // TODO: Create vector of threads
    
    
    // TODO: Launch threads
    
    
    // TODO: Wait for all threads
    
    
    // TODO: Print final counter value (should be 100000)
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

// Shared counter
int counter = 0;

// Mutex for protection
std::mutex mtx;

void incrementCounter(int iterations) {
    for (int i = 0; i < iterations; ++i) {
        // Thread-safe increment using lock_guard
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
        // lock automatically released here
    }
}

int main() {
    const int numThreads = 4;
    const int iterations = 25000;  // 4 * 25000 = 100000 total
    
    // Create vector of threads
    std::vector<std::thread> threads;
    
    // Launch threads
    std::cout << "Launching " << numThreads << " threads..." << std::endl;
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back(incrementCounter, iterations);
    }
    
    // Wait for all threads
    std::cout << "Waiting for threads to complete..." << std::endl;
    for (auto& t : threads) {
        t.join();
    }
    
    // Print final counter value
    std::cout << "Final counter value: " << counter << std::endl;
    std::cout << "Expected: " << (numThreads * iterations) << std::endl;
    
    if (counter == numThreads * iterations) {
        std::cout << "SUCCESS: Counter is correct!" << std::endl;
    } else {
        std::cout << "FAILURE: Counter is incorrect!" << std::endl;
    }
    
    return 0;
}`,
            tests: `// Test: Program compiles without errors
// Test: Final counter equals expected value
// Test: Threads properly synchronized
// Test: No data races
// Test: All threads complete successfully`,
          },
        },
      },
      {
        id: "lesson-1-3",
        title: "Quiz: Concurrency Basics",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What's the difference between concurrency and parallelism?",
              options: [
                "They're the same thing",
                "Concurrency is about dealing with multiple things, parallelism is about doing multiple things",
                "Parallelism is slower than concurrency",
                "Concurrency requires multiple cores"
              ],
              correctAnswer: "b",
              explanation: "Concurrency is about structure (dealing with multiple tasks), while parallelism is about execution (actually doing multiple things simultaneously on different cores)."
            },
            {
              question: "What happens if you don't join() or detach() a thread?",
              options: [
                "The thread runs forever",
                "Nothing, it's fine",
                "The program terminates/crashes",
                "The thread is automatically joined"
              ],
              correctAnswer: "c",
              explanation: "If a thread object is destroyed while still joinable (not joined or detached), std::terminate() is called and the program crashes."
            },
            {
              question: "What is a race condition?",
              options: [
                "When threads compete for CPU time",
                "When multiple threads access shared data without synchronization",
                "When one thread is faster than another",
                "A performance optimization technique"
              ],
              correctAnswer: "b",
              explanation: "A race condition occurs when multiple threads access shared data concurrently without proper synchronization, leading to undefined behavior."
            },
            {
              question: "Why use lock_guard instead of manual lock/unlock?",
              options: [
                "It's faster",
                "It uses less memory",
                "It provides automatic unlocking (RAII)",
                "It allows multiple locks"
              ],
              correctAnswer: "c",
              explanation: "lock_guard provides RAII-style locking - it automatically releases the lock when going out of scope, even if an exception is thrown."
            },
            {
              question: "What protects shared data from concurrent access?",
              options: [
                "std::thread",
                "std::mutex",
                "std::vector",
                "std::async"
              ],
              correctAnswer: "b",
              explanation: "A mutex (mutual exclusion) protects shared data by ensuring only one thread can access the protected section at a time."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "Advanced Synchronization",
    description: "Master condition variables and advanced threading patterns",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Condition Variables",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Condition Variables

## What Are Condition Variables?

Condition variables allow threads to wait for specific conditions to become true. They're essential for implementing efficient producer-consumer patterns and other coordination scenarios.

## Basic Usage

\`\`\`cpp
#include <condition_variable>
#include <mutex>
#include <queue>

std::mutex mtx;
std::condition_variable cv;
std::queue<int> buffer;

void producer() {
    std::unique_lock<std::mutex> lock(mtx);
    buffer.push(42);
    cv.notify_one();  // Wake one waiting thread
}

void consumer() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, []{ return !buffer.empty(); });
    int value = buffer.front();
    buffer.pop();
}
\`\`\`

## Producer-Consumer Pattern

A classic pattern for coordinating threads:

\`\`\`cpp
#include <iostream>
#include <thread>
#include <condition_variable>
#include <mutex>
#include <queue>

std::mutex mtx;
std::condition_variable cv;
std::queue<int> buffer;
bool done = false;

void producer(int id) {
    for (int i = 0; i < 5; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        
        std::unique_lock<std::mutex> lock(mtx);
        buffer.push(i * 10 + id);
        std::cout << "Producer " << id << " produced: " 
                  << (i * 10 + id) << std::endl;
        cv.notify_one();
    }
}

void consumer(int id) {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, []{ return !buffer.empty() || done; });
        
        if (buffer.empty() && done) break;
        
        if (!buffer.empty()) {
            int value = buffer.front();
            buffer.pop();
            lock.unlock();
            
            std::cout << "Consumer " << id << " consumed: " 
                      << value << std::endl;
        }
    }
}
\`\`\`

## Key Concepts

**Spurious Wakeups** - Condition variables can wake up without notification.

**Predicate** - Always use a predicate (condition) when waiting.

**Unique Lock** - Condition variables require std::unique_lock, not lock_guard.

**Notify vs Broadcast** - notify_one() wakes one thread, notify_all() wakes all waiting threads.

Next, we'll explore atomic operations and lock-free programming.`,
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Lock-Free Programming",
    description: "High-performance concurrent programming with atomics",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Atomic Operations",
        type: "lesson",
        duration: 35,
        content: {
          markdown: `# Atomic Operations

## What Are Atomic Operations?

Atomic operations are indivisible operations that complete without interruption. They provide lock-free synchronization for simple shared data.

## Basic Atomic Types

\`\`\`cpp
#include <atomic>

std::atomic<int> counter{0};

void increment() {
    counter++;  // Atomic increment
}

void decrement() {
    counter--;  // Atomic decrement
}
\`\`\`

## Benefits of Atomics

**No Locks Required** - Faster than mutex-based synchronization for simple operations.

**Wait-Free Progress** - Operations complete in bounded time.

**Hardware Support** - Uses CPU atomic instructions when available.

**Scalability** - Better performance under high contention.

## Common Atomic Operations

\`\`\`cpp
std::atomic<int> value{0};

// Load
int current = value.load();

// Store
value.store(42);

// Exchange
int old = value.exchange(100);

// Compare and swap
int expected = 42;
bool success = value.compare_exchange_strong(expected, 100);
\`\`\`

## Memory Ordering

Atomics provide different memory ordering guarantees:

**memory_order_relaxed** - No synchronization, only atomicity

**memory_order_acquire** - Acquire semantics for loading

**memory_order_release** - Release semantics for storing

**memory_order_seq_cst** - Sequential consistency (default, safest)

## When to Use Atomics

Use atomics for simple counters, flags, and state that doesn't require protecting complex operations or data structures. For complex operations, stick with mutexes.

Next, we'll wrap up with best practices and common patterns.`,
        },
      },
    ],
  },
];
