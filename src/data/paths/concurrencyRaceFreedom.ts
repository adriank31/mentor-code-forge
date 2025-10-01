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

## 🔀 Concurrency vs Parallelism

### Concurrency
Multiple tasks making progress (not necessarily simultaneously):
- **Interleaved execution** on single core
- **Task switching** creates illusion of simultaneity
- About **dealing with** multiple things at once

### Parallelism
Multiple tasks executing simultaneously:
- **True simultaneous execution** on multiple cores
- **Actual parallel work** happening
- About **doing** multiple things at once

## 🎯 Why Concurrency Matters

### Performance
- Utilize multiple CPU cores
- Reduce idle time
- Faster program execution

### Responsiveness
- Keep UI responsive while processing
- Handle multiple users simultaneously
- Background tasks without blocking

### Resource Utilization
- Maximize hardware usage
- Better throughput
- Efficient server applications

## 🧵 Threads in C++

### Creating Threads

\`\`\`cpp
#include <thread>
#include <iostream>

void task() {
    std::cout << "Hello from thread!\\n";
}

int main() {
    std::thread t(task);  // Create thread
    t.join();             // Wait for completion
    return 0;
}
\`\`\`

### Thread with Parameters

\`\`\`cpp
void printNumber(int n) {
    std::cout << "Number: " << n << "\\n";
}

std::thread t1(printNumber, 42);
std::thread t2(printNumber, 100);

t1.join();
t2.join();
\`\`\`

### Lambda Functions

\`\`\`cpp
std::thread t([]() {
    std::cout << "Lambda thread!\\n";
});
t.join();
\`\`\`

## ⚠️ The Race Condition Problem

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

The simple \`counter++\` is actually:
1. Read counter value
2. Add 1
3. Write back

Two threads can interleave these steps!

## 🔐 Thread Safety with Mutex

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

## 🛡️ RAII Lock Guards

Better approach - automatic unlocking:

\`\`\`cpp
void increment() {
    for (int i = 0; i < 100000; ++i) {
        std::lock_guard<std::mutex> lock(mtx);
        counter++;
        // Automatically unlocked when lock goes out of scope
    }
}
\`\`\`

## 🎯 Common Threading Patterns

### Fire and Forget
\`\`\`cpp
std::thread t(backgroundTask);
t.detach();  // Thread runs independently
\`\`\`

### Wait for Completion
\`\`\`cpp
std::thread t(task);
t.join();  // Wait for thread to finish
\`\`\`

### Multiple Threads
\`\`\`cpp
std::vector<std::thread> threads;
for (int i = 0; i < 10; ++i) {
    threads.emplace_back(task, i);
}
for (auto& t : threads) {
    t.join();
}
\`\`\`

## ⚠️ Common Mistakes

### Forgetting to Join/Detach
\`\`\`cpp
{
    std::thread t(task);
}  // CRASH! Thread destroyed without join/detach
\`\`\`

### Data Races
\`\`\`cpp
int shared = 0;
std::thread t1([&]{ shared++; });  // Race!
std::thread t2([&]{ shared++; });  // Race!
\`\`\`

### Deadlock
\`\`\`cpp
std::mutex m1, m2;
// Thread 1: locks m1, then m2
// Thread 2: locks m2, then m1
// DEADLOCK!
\`\`\`

## 🎯 Key Takeaways

1. **Threads** enable parallel execution
2. **Race conditions** occur without synchronization
3. **Mutexes** protect shared data
4. **Lock guards** provide RAII for mutexes
5. **Always join** or detach threads
6. **Be careful** with shared data

Next: Deep dive into mutexes and synchronization!`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Thread Safety Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Thread Safety Challenge

## 🎯 Your Mission

Create a thread-safe counter that multiple threads can increment simultaneously.

## 📋 Requirements

1. Create a counter that multiple threads will increment
2. Use a mutex to protect the counter
3. Use lock_guard for automatic unlocking
4. Launch multiple threads
5. Verify the final count is correct

## 💡 Hints

- Use std::mutex for synchronization
- Use std::lock_guard for RAII locking
- Use std::thread to create threads
- Use .join() to wait for threads`,
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
    std::cout << "Launching " << numThreads << " threads...\\n";
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back(incrementCounter, iterations);
    }
    
    // Wait for all threads
    std::cout << "Waiting for threads to complete...\\n";
    for (auto& t : threads) {
        t.join();
    }
    
    // Print final counter value
    std::cout << "Final counter value: " << counter << "\\n";
    std::cout << "Expected: " << (numThreads * iterations) << "\\n";
    
    if (counter == numThreads * iterations) {
        std::cout << "SUCCESS: Counter is correct!\\n";
    } else {
        std::cout << "FAILURE: Counter is incorrect!\\n";
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
    description: "Master advanced threading patterns",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Condition Variables",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Condition Variables

Efficient thread synchronization and coordination.

## Producer-Consumer Pattern
\`\`\`cpp
std::mutex mtx;
std::condition_variable cv;
std::queue<int> buffer;

void producer() {
    std::lock_guard<std::mutex> lock(mtx);
    buffer.push(42);
    cv.notify_one();
}
\`\`\``,
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Lock-Free Programming",
    description: "High-performance concurrent programming",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Atomic Operations",
        type: "lesson",
        duration: 35,
        content: {
          markdown: `# Atomic Operations

Lock-free synchronization using atomic operations.`,
        },
      },
    ],
  },
];
