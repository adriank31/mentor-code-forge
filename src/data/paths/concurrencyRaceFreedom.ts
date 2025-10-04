import { Module } from "../pathModules";

// This learning path dives deep into concurrency in C++ and teaches how to write race‑free, thread‑safe programs.
// The modules below cover fundamentals, synchronization primitives, and advanced atomics and memory ordering.
// Each lesson uses clear headings, narrative explanations, and practical examples, mirroring the UI/UX structure
// of existing learning paths. Challenges and quizzes reinforce understanding with hands‑on tasks and assessments.

export const concurrencyRaceFreedomModules: Module[] = [
  {
    id: "concurrency-module-1",
    title: "Concurrency Fundamentals",
    description:
      "Explore the basic concepts of concurrency and understand why data races occur in multi‑threaded programs.",
    lessons: [
      {
        id: "concurrency-lesson-1-1",
        title: "Introduction to Concurrency",
        type: "lesson",
        duration: 15,
        content: {
          markdown: `# Introduction to Concurrency

## What Is Concurrency?

Concurrency is the ability of a program to make progress on multiple tasks “at once.” In C++, concurrency is typically achieved with **threads**, which run independently but share the same memory space. While one thread waits for I/O or a lock, another can perform computations.

Parallelism is a subset of concurrency where multiple threads literally run at the same time on separate CPU cores. Concurrency and parallelism bring performance benefits, but they also introduce complexity around coordination and data safety.

### Threads vs Processes

- **Processes** have separate address spaces. Communication between processes uses inter‑process mechanisms (pipes, sockets, shared memory).
- **Threads** share the same address space. This allows fast communication via shared variables but increases the risk of data races.

The C++ Standard Library provides the \`std::thread\` class for creating and managing threads.

## Example: Launching Threads

Below is a simple example that launches multiple threads to print messages:

\`\`\`cpp
#include <thread>
#include <vector>
#include <iostream>

void sayHello(int id) {
    std::cout << "Hello from thread " << id << std::endl;
}

int main() {
    std::vector<std::thread> threads;
    for (int i = 0; i < 3; ++i) {
        threads.emplace_back(sayHello, i);
    }

    // Wait for all threads to finish
    for (auto& t : threads) {
        t.join();
    }
    return 0;
}
\`\`\`

Each thread executes \`sayHello()\` concurrently. Notice how we call \`join()\` on each thread to wait for it to finish.

## Dangers of Concurrency

When multiple threads read and write shared data without coordination, **race conditions** and **data races** can corrupt state and produce unpredictable results. Protecting shared resources with synchronization primitives is essential for correctness and security.

Next, you’ll learn exactly what a race condition is and how to recognize it in code.`,
        },
      },
      {
        id: "concurrency-lesson-1-2",
        title: "Understanding Race Conditions",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# Understanding Race Conditions

## What Is a Race Condition?

A **race condition** occurs when the behavior of software depends on the relative timing of events, such as the order in which threads execute operations. When two threads access the same memory without proper synchronization, one thread may see or overwrite inconsistent data.

### Data Races

A **data race** is a specific type of race condition where:

- At least one thread writes to a shared variable.
- Another thread reads or writes to the same variable.
- There is no synchronization to order these accesses.

Data races cause undefined behavior. Modern compilers may optimize away reads or reorder instructions in ways that make racy code appear to work sometimes and break unpredictably.

## Example: Unsynchronized Counter

Consider two threads incrementing a shared counter:

\`\`\`cpp
#include <thread>
#include <iostream>

int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        ++counter; // Not atomic
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);
    t1.join();
    t2.join();
    std::cout << "Counter: " << counter << std::endl;
    return 0;
}
\`\`\`

The final value of \`counter\` should be 200 000, but because \`++counter\` is not atomic, the threads interleave their reads and writes unpredictably. Typical results will be far less than 200 000, indicating lost updates.

## Why Data Races Are Dangerous

Data races can:

- Corrupt program state, leading to crashes or incorrect results.
- Introduce **time‑of‑check/time‑of‑use (TOCTOU)** bugs where state changes between validation and use.
- Open the door to security vulnerabilities such as uncontrolled data disclosure or privilege escalation.

In C++, data races on built‑in types cause **undefined behavior**. The only way to avoid undefined behavior is to synchronize accesses or use \`std::atomic\`.

## Key Takeaways

- Race conditions arise when multiple threads access shared data without coordination.
- A data race is undefined behavior where at least one write occurs.
- Even simple operations like \`++counter\` are not atomic; they read, modify, and write memory in separate steps.
- To avoid races, use synchronization primitives such as mutexes or atomic types.

In the next module, you’ll learn how to protect shared data using mutexes and other primitives.`,
        },
      },
      {
        id: "concurrency-lesson-1-3",
        title: "Race Condition Challenge",
        type: "challenge",
        duration: 15,
        content: {
          markdown: `# Race Condition Challenge

## Your Mission

Modify a multi‑threaded program that increments a shared counter so that it produces the correct result every time.

## Requirements

1. Two threads each increment a global counter 100 000 times.
2. Without synchronization the result is wrong. Add the necessary synchronization to make it correct.
3. Print the final value of the counter at the end.
4. Verify the fix using atomic operations **or** a mutex.

## Hints

- \`counter++\` is not atomic. It expands to a read, increment, and write. Synchronize these steps.
- You can wrap the increment in a critical section guarded by \`std::mutex\` or use \`std::atomic<int>\`.
- Remember to join your threads before printing the counter.
- Test your program multiple times; the result should always be 200 000.`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <thread>

// TODO: define counter type (int or std::atomic<int>)
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; ++i) {
        // TODO: safely increment the counter
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);

    // TODO: join threads

    std::cout << "Counter: " << counter << std::endl;
    return 0;
}`,
            solution: `#include <iostream>
#include <thread>
#include <atomic>

// Use std::atomic<int> for thread‑safe increment
std::atomic<int> counter{0};

void increment() {
    for (int i = 0; i < 100000; ++i) {
        counter.fetch_add(1); // atomic increment
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);
    t1.join();
    t2.join();
    std::cout << "Counter: " << counter.load() << std::endl;
    return 0;
}`,
            tests: `// Test: Counter equals 200000 after running program
// Test: Both threads are joined before printing
// Test: No data races occur (verified by tsan)
// Test: Using std::atomic or a mutex produces correct result
// Test: Program prints consistent output across runs`,
          },
        },
      },
      {
        id: "concurrency-lesson-1-4",
        title: "Quiz: Concurrency Basics",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question:
                "Which of the following best describes a race condition?",
              options: [
                "Two threads access unrelated memory",
                "The correctness of the program depends on the relative timing of operations",
                "One thread runs faster than another",
                "Threads use too much CPU time",
              ],
              correctAnswer: "b",
              explanation:
                "A race condition occurs when the program’s behavior depends on the order or timing of events, such as two threads accessing shared data without proper synchronization.",
            },
            {
              question:
                "What is the result of running a program with a data race?",
              options: [
                "It always produces the correct output",
                "It yields undefined behavior and unpredictable results",
                "It runs twice as fast",
                "It consumes more memory",
              ],
              correctAnswer: "b",
              explanation:
                "Data races cause undefined behavior in C++, which means the program may produce incorrect results, crash, or exhibit erratic behavior.",
            },
            {
              question:
                "Which C++ type guarantees atomic operations on built‑in integral types?",
              options: ["int", "std::mutex", "std::atomic<int>", "std::vector<int>"],
              correctAnswer: "c",
              explanation:
                "\`std::atomic<int>\` provides atomic operations on integers, ensuring that increments and other operations are indivisible and thread‑safe.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "concurrency-module-2",
    title: "Synchronization Primitives",
    description:
      "Learn how to coordinate threads with mutexes, locks and condition variables to avoid race conditions and ensure thread safety.",
    lessons: [
      {
        id: "concurrency-lesson-2-1",
        title: "Mutexes and Locks",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# Mutexes and Locks

## Why Use Mutexes?

A **mutex** (short for *mutual exclusion*) is the simplest synchronization primitive. It ensures that only one thread at a time can execute a critical section of code that accesses shared data. Using mutexes prevents data races by serializing access to shared resources.

### Acquiring and Releasing Locks

In C++ the \`std::mutex\` class provides lock and unlock functions:

\`\`\`cpp
#include <mutex>
std::mutex m;

void safeIncrement() {
    m.lock();
    // Critical section
    ++sharedCounter;
    m.unlock();
}
\`\`\`

**Important:** Always release a mutex after acquiring it. Failing to do so causes other threads to block indefinitely.

### RAII and std::lock_guard

A safer way to handle mutexes is to use RAII (Resource Acquisition Is Initialization). With \`std::lock_guard\`, the mutex is locked in the constructor and automatically unlocked in the destructor, even if exceptions are thrown:

\`\`\`cpp
#include <mutex>
std::mutex m;

void safeIncrement() {
    std::lock_guard<std::mutex> guard(m);
    ++sharedCounter; // automatically released when guard goes out of scope
}
\`\`\`

### Unique Locks and std::scoped_lock

\`std::unique_lock\` provides more flexibility: you can lock and unlock multiple times, defer locking, or adopt an existing lock. \`std::scoped_lock\` can lock multiple mutexes at once to avoid deadlocks:

\`\`\`cpp
std::mutex m1, m2;

void safeSwap() {
    std::scoped_lock lock(m1, m2); // locks both without deadlock
    std::swap(value1, value2);
}
\`\`\`

## Deadlock Prevention

A **deadlock** occurs when two or more threads wait for each other indefinitely. To avoid deadlocks when locking multiple mutexes:

- Always acquire mutexes in a consistent order across all threads.
- Prefer \`std::scoped_lock\` or lock ordering patterns.
- Keep critical sections short.

## Key Takeaways

- Mutexes serialize access to shared data and prevent data races.
- Use RAII wrappers (\`std::lock_guard\`, \`std::unique_lock\`) to ensure mutexes are released.
- Order mutex acquisition consistently or use \`std::scoped_lock\` to avoid deadlocks.

Next, we’ll explore condition variables, which allow threads to wait for specific conditions to occur.`,
        },
      },
      {
        id: "concurrency-lesson-2-2",
        title: "Condition Variables",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# Condition Variables

## Purpose of Condition Variables

**Condition variables** provide a way for threads to wait (block) until notified that a certain condition is true. They are often used with a mutex to implement producer–consumer patterns, where one thread produces data and another consumes it.

### Waiting and Notifying

A condition variable works with an associated mutex. One thread waits on the condition while another thread notifies when a condition is met:

\`\`\`cpp
#include <condition_variable>
#include <mutex>
#include <queue>

std::mutex m;
std::condition_variable cv;
std::queue<int> dataQueue;
bool done = false;

void producer() {
    for (int i = 0; i < 5; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        std::lock_guard<std::mutex> lock(m);
        dataQueue.push(i);
        cv.notify_one(); // notify a waiting consumer
    }
    {
        std::lock_guard<std::mutex> lock(m);
        done = true;
        cv.notify_all();
    }
}

void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(m);
        cv.wait(lock, [] { return !dataQueue.empty() || done; });
        if (!dataQueue.empty()) {
            int value = dataQueue.front();
            dataQueue.pop();
            std::cout << "Consumed: " << value << std::endl;
        } else if (done) {
            break;
        }
    }
}
\`\`\`

The consumer waits on the condition variable until data is available or the producer is done. The predicate in \`wait()\` prevents spurious wakeups.

### Spurious Wakeups

A spurious wakeup occurs when \`wait()\` returns even though no notification occurred. Always use the predicate version of \`wait()\` (the lambda) or re‑check the condition after waking.

## Key Takeaways

- Condition variables allow threads to block until notified.
- Always use a mutex with a condition variable to protect shared data.
- Use predicates in \`wait()\` to handle spurious wakeups.
- Condition variables are essential for implementing producer–consumer queues and other coordination patterns.`,
        },
      },
      {
        id: "concurrency-lesson-2-3",
        title: "Synchronization Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Synchronization Challenge

## Your Mission

Implement a thread‑safe producer–consumer queue using \`std::mutex\` and \`std::condition_variable\`.

## Requirements

1. Use a queue to store integers produced by one thread and consumed by another.
2. The producer thread should generate a sequence of integers and notify the consumer when data is available.
3. The consumer thread should wait until the queue is not empty, remove an item, and process it.
4. When the producer finishes producing, it should signal the consumer to finish gracefully.

## Hints

- Protect the queue and any shared flags with a \`std::mutex\`.
- Use \`std::condition_variable\` to notify the consumer when new items are added.
- Check both the queue emptiness and a \`done\` flag in the consumer’s wait predicate to avoid deadlocks.
- Remember to call \`notify_all()\` once production is complete.
 `,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

std::mutex m;
std::condition_variable cv;
std::queue<int> q;
bool done = false;

void producer() {
    // TODO: produce integers 0..4 and push to queue
    // use notify_one() after pushing
    // set done to true and notify_all() when finished
}

void consumer() {
    // TODO: consume items until producer signals completion
}

int main() {
    std::thread t1(producer);
    std::thread t2(consumer);
    t1.join();
    t2.join();
    return 0;
}`,
            solution: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

std::mutex m;
std::condition_variable cv;
std::queue<int> q;
bool done = false;

void producer() {
    for (int i = 0; i < 5; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        {
            std::lock_guard<std::mutex> lock(m);
            q.push(i);
        }
        cv.notify_one();
    }
    {
        std::lock_guard<std::mutex> lock(m);
        done = true;
    }
    cv.notify_all();
}

void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(m);
        cv.wait(lock, [] { return !q.empty() || done; });
        if (!q.empty()) {
            int value = q.front();
            q.pop();
            lock.unlock(); // unlock while processing
            std::cout << "Consumed: " << value << std::endl;
        } else if (done) {
            break;
        }
    }
}

int main() {
    std::thread t1(producer);
    std::thread t2(consumer);
    t1.join();
    t2.join();
    return 0;
}`,
            tests: `// Test: Consumer prints all produced values in order
// Test: Program exits cleanly after production is done
// Test: No data races or deadlocks detected
// Test: Condition variable used with predicate to handle spurious wakeups
// Test: Shared data protected by mutex`,
          },
        },
      },
      {
        id: "concurrency-lesson-2-4",
        title: "Quiz: Synchronization",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question:
                "What does a mutex ensure when used correctly?",
              options: [
                "That all threads finish at the same time",
                "That only one thread executes a critical section at a time",
                "That threads never block",
                "That memory is automatically freed",
              ],
              correctAnswer: "b",
              explanation:
                "A mutex provides mutual exclusion, meaning it allows only one thread to enter a protected critical section at a time, preventing race conditions.",
            },
            {
              question:
                "Why should you use RAII wrappers like std::lock_guard with mutexes?",
              options: [
                "To acquire multiple mutexes at once",
                "To automatically lock and unlock the mutex, even if exceptions occur",
                "To speed up code execution",
                "To avoid using condition variables",
              ],
              correctAnswer: "b",
              explanation:
                "RAII wrappers like std::lock_guard lock the mutex upon construction and unlock it on destruction, ensuring the mutex is released even if an exception is thrown.",
            },
            {
              question:
                "What problem do condition variables solve?",
              options: [
                "Preventing memory leaks",
                "Allowing threads to coordinate by waiting for a condition to become true",
                "Making code run faster",
                "Avoiding the need for mutexes",
              ],
              correctAnswer: "b",
              explanation:
                "Condition variables let threads sleep until notified that a certain condition holds, enabling efficient producer–consumer and other coordination patterns.",
            },
          ],
        },
      },
    ],
  },
  {
    id: "concurrency-module-3",
    title: "Atomics and Memory Ordering",
    description:
      "Master the use of atomic variables and memory orderings in C++ to write lock‑free and high‑performance code without data races.",
    lessons: [
      {
        id: "concurrency-lesson-3-1",
        title: "Introduction to Atomics",
        type: "lesson",
        duration: 20,
        content: {
          markdown: `# Introduction to Atomics

## Why Atomics?

\`std::atomic\` types enable safe concurrent access without explicit locks. Operations on atomic variables are indivisible and thread‑safe by default. They are useful for implementing lock‑free data structures and counters where the overhead of locking would be too high.

### Basic Atomic Operations

Atomics support operations like \`load()\`, \`store()\`, \`fetch_add()\`, \`compare_exchange_weak()\` and \`compare_exchange_strong()\`.

\`\`\`cpp
#include <atomic>

std::atomic<int> counter{0};

void threadFunc() {
    counter.fetch_add(1);      // atomic increment
    int value = counter.load(); // atomic load
}
\`\`\`

### Atomic vs Mutex

- Atomics provide fine‑grained operations on a single variable.
- Mutexes can protect multiple variables and complex critical sections.
- Atomics are generally faster but only protect individual objects; misuse can still cause logic errors if multiple atomics need to be updated atomically.

## Compare‑and‑Swap (CAS)

The heart of many lock‑free algorithms is the compare‑and‑swap operation. In C++ it is implemented as \`compare_exchange_weak\` and \`compare_exchange_strong\`:

\`\`\`cpp
std::atomic<int> value{0};
int expected = 0;

// Attempt to change value from expected to 42
bool exchanged = value.compare_exchange_strong(expected, 42);
if (exchanged) {
    // Success
} else {
    // Failure, expected now contains the actual value
}
\`\`\`

\`compare_exchange\` atomically checks whether the current value is equal to \`expected\`; if so, it replaces it with the new value. Otherwise, \`expected\` is updated with the actual value and the operation fails.

## Key Takeaways

- Atomics enable lock‑free, thread‑safe operations on individual variables.
- Use \`fetch_add()\`, \`fetch_sub()\`, \`load()\`, and \`store()\` for simple atomic counters.
- Use \`compare_exchange\` for complex updates where the value must be updated only if it matches an expected state.

Next, you will learn about the subtleties of memory ordering.`,
        },
      },
      {
        id: "concurrency-lesson-3-2",
        title: "Memory Ordering",
        type: "lesson",
        duration: 25,
        content: {
          markdown: `# Memory Ordering

## Why Memory Ordering Matters

Modern CPUs and compilers reorder instructions to improve performance. When multiple threads are involved, these reorderings can produce surprising behavior unless you specify a memory order. Atomics allow you to specify how operations should be ordered relative to other memory accesses.

### Sequential Consistency

The default memory ordering for atomic operations is \`memory_order_seq_cst\`. It enforces a globally consistent order of atomic operations. This is the easiest to reason about but may have performance costs:

\`\`\`cpp
std::atomic<int> a{0}, b{0};

// Thread 1
a.store(1);                     // SC store
b.store(1);                     // SC store

// Thread 2
while (b.load() == 0) { }       // SC load
if (a.load() == 0) {            // impossible: sequential consistency ensures a == 1
    // ...
}
\`\`\`

### Acquire and Release

For more fine‑grained control you can use weaker memory orders:

- \`memory_order_release\` on a store ensures that all previous writes in this thread are visible to any thread that performs a corresponding \`memory_order_acquire\` load on the same variable.
- \`memory_order_acquire\` on a load prevents subsequent reads and writes from being reordered before the load.

\`\`\`cpp
std::atomic<bool> ready{false};
int data;

// Producer thread
data = 42;
ready.store(true, std::memory_order_release);

// Consumer thread
while (!ready.load(std::memory_order_acquire)) { }
std::cout << data << std::endl; // guaranteed to see data == 42
\`\`\`

### Relaxed Ordering

\`memory_order_relaxed\` does not impose ordering constraints. Relaxed operations guarantee atomicity but not any order relative to other memory accesses. Use it only when ordering is irrelevant, such as incrementing independent counters.

## Fences

An atomic fence (\`std::atomic_thread_fence\`) enforces ordering without performing a read or write. Fences can be used to create happens‑before relationships between operations on non‑atomic variables.

## Key Takeaways

- Sequential consistency (\`seq_cst\`) is easy to reason about but can be slower.
- Use acquire/release ordering to minimize synchronization while still enforcing ordering.
- Relaxed ordering is fast but provides no ordering guarantees beyond atomicity.
- Memory fences provide explicit ordering without modifying data.

In the final challenge, you’ll implement a simple lock‑free stack using atomics and memory ordering.`,
        },
      },
      {
        id: "concurrency-lesson-3-3",
        title: "Lock‑Free Stack Challenge",
        type: "challenge",
        duration: 20,
        content: {
          markdown: `# Lock‑Free Stack Challenge

## Your Mission

Implement a simple lock‑free stack using \`std::atomic\` and compare‑and‑swap operations. The stack should allow concurrent pushes and pops without using a mutex.

## Requirements

1. Define a \`Node\` struct with a value and a pointer to the next node.
2. Maintain a \`std::atomic<Node*>\` head pointer.
3. Use a loop with \`compare_exchange_weak()\` to push and pop nodes safely.
4. Protect memory deallocation carefully to avoid use‑after‑free (for educational purposes we can leak memory or use \`shared_ptr\`).

## Hints

- When pushing: read the current head, set the new node’s next pointer to it, then attempt to swap head with the new node.
- When popping: read head, attempt to set head to head->next with compare‑and‑swap. If it fails, retry.
- This example focuses on concurrency; safe memory reclamation (hazard pointers, epoch-based reclamation) is beyond the scope of this exercise.

 `,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <atomic>
#include <thread>

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

// TODO: atomic head pointer

void push(int value) {
    // TODO: implement lock‑free push
}

bool pop(int& result) {
    // TODO: implement lock‑free pop; return false if stack is empty
    return false;
}

int main() {
    // TODO: test pushing and popping from multiple threads
    return 0;
}`,
            solution: `#include <iostream>
#include <atomic>
#include <thread>

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

std::atomic<Node*> head{nullptr};

void push(int value) {
    Node* newNode = new Node(value);
    newNode->next = nullptr;
    Node* oldHead = head.load(std::memory_order_relaxed);
    do {
        newNode->next = oldHead;
    } while (!head.compare_exchange_weak(oldHead, newNode,
                                         std::memory_order_release,
                                         std::memory_order_relaxed));
}

bool pop(int& result) {
    Node* oldHead = head.load(std::memory_order_relaxed);
    while (oldHead) {
        Node* next = oldHead->next;
        if (head.compare_exchange_weak(oldHead, next,
                                       std::memory_order_acquire,
                                       std::memory_order_relaxed)) {
            result = oldHead->value;
            // Note: memory reclamation not handled (potential leak)
            return true;
        }
    }
    return false;
}

int main() {
    // Launch threads to push values
    std::thread t1([] {
        for (int i = 0; i < 1000; ++i) {
            push(i);
        }
    });
    std::thread t2([] {
        for (int i = 1000; i < 2000; ++i) {
            push(i);
        }
    });
    t1.join();
    t2.join();

    // Pop values
    int count = 0;
    int value;
    while (pop(value)) {
        count++;
    }
    std::cout << "Popped " << count << " values\\n";
    return 0;
}`,
            tests: `// Test: Push and pop from multiple threads
// Test: All pushed values are eventually popped
// Test: No data races detected by thread sanitizer
// Test: Implementation uses compare_exchange_weak with proper memory order
// Test: Memory reclamation note acknowledged`,
          },
        },
      },
      {
        id: "concurrency-lesson-3-4",
        title: "Quiz: Atomics and Memory Ordering",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question:
                "What advantage do atomics have over mutexes?",
              options: [
                "They allow synchronized access to multiple variables at once",
                "They provide thread‑safe operations without locks, reducing overhead",
                "They automatically free memory",
                "They prevent deadlocks completely",
              ],
              correctAnswer: "b",
              explanation:
                "Atomics allow thread‑safe operations on a single variable without acquiring a mutex, which reduces overhead and can improve performance in simple cases.",
            },
            {
              question:
                "Which memory ordering enforces a global order of all atomic operations?",
              options: [
                "memory_order_relaxed",
                "memory_order_acquire",
                "memory_order_release",
                "memory_order_seq_cst",
              ],
              correctAnswer: "d",
              explanation:
                "\`memory_order_seq_cst\` (sequential consistency) enforces a global ordering of all atomic operations, making reasoning about concurrency simpler but potentially less performant.",
            },
            {
              question:
                "When should you use compare‑and‑swap (CAS) with atomics?",
              options: [
                "When you need to update a variable based on its current value atomically",
                "When you want to automatically free memory",
                "When you need to lock multiple variables at once",
                "When you need to wait on a condition variable",
              ],
              correctAnswer: "a",
              explanation:
                "Compare‑and‑swap is used to atomically compare a variable with an expected value and, if they match, update it to a new value. This allows lock‑free algorithms where state must be updated conditionally.",
            },
          ],
        },
      },
    ],
  },
];