/**
 * Lab definitions for the practice section.
 *
 * This file exports a list of exercises tailored around common
 * vulnerability classes and systems concepts.  Each entry in the
 * array conforms to the `Lab` interface defined below.  The schema
 * includes optional guidance fields (objectives, hints, etc.), a
 * starter program scaffold, a canonical solution and an optional
 * list of automated test cases.  When present, the `testCases`
 * property defines input/output pairs that can be fed into the
 * student’s program via Judge0.  All difficulty levels are lower‑
 * case and a `proOnly` flag gates advanced content.
 */

export interface Lab {
  /**
   * URL‑friendly identifier used for routing.  Must be unique.
   */
  slug: string;
  /**
   * Short title displayed in the lab list and detail view.
   */
  title: string;
  /**
   * One‑paragraph summary describing the scenario and goal.
   */
  summary: string;
  /**
   * Difficulty classification.  All values are lower‑case.
   */
  difficulty: "beginner" | "intermediate" | "advanced";
  /**
   * High‑level category indicating the bug or domain.  Additional
   * categories beyond the initial set may be added here as string
   * literals.  See individual lab definitions for examples.
   */
  bugType:
    | "Memory"
    | "Concurrency"
    | "I/O"
    | "Parsing"
    | "Hardening"
    | "Queues"
    | "Embedded";
  /**
   * Estimated time in minutes to complete the exercise.  Use
   * reasonable numbers between 20 and 60 minutes.
   */
  estMinutes: number;
  /**
   * Whether this exercise is restricted to Pro subscribers.
   */
  proOnly: boolean;
  /**
   * Optional starter program provided to the learner.  When omitted,
   * the student is free to start from scratch.
   */
  starterCode?: string;
  /**
   * Detailed, multi‑paragraph instructions explaining the context and
   * what the learner should accomplish.  Markdown is not required
   * but plain line breaks should be used to separate paragraphs.
   */
  detailedInstructions?: string;
  /**
   * A list of high‑level learning outcomes the student should achieve.
   */
  objectives?: string[];
  /**
   * Hints offered to the learner, in order from least to most
   * revealing.  Exactly three hints are preferred but more may be
   * provided if necessary.
   */
  hints?: string[];
  /**
   * Canonical solution code that solves the exercise.  This string
   * remains hidden by default in the UI and is revealed on demand.
   */
  solutionCode?: string;
  /**
   * Human‑readable criteria describing what a correct solution must
   * accomplish.  These are separate from the automated test cases and
   * are surfaced in the UI to guide learners.
   */
  testCriteria?: string[];
  /**
   * Explanation of the correct behaviour of the program.  This helps
   * the learner understand what the end state should be after fixing
   * the vulnerability.
   */
  expectedBehavior?: string;
  /**
   * Optional array of input/output pairs used by the Judge0
   * integration to automatically evaluate solutions.  Each test case
   * feeds the given input to the compiled program and compares its
   * stdout against the expected output.  Newlines in the expected
   * output must be included explicitly (e.g. "\n").
   */
  testCases?: { input: string; expectedOutput: string }[];
}

export const labs: Lab[] = [
  {
    slug: "buffer-overflow-strcpy",
    title: "Buffer Overflow in String Copy",
    summary:
      "Given a vulnerable C function that uses strcpy, exploit input that overruns the buffer. Then patch the code to use safe bounds‑checked copying (e.g. strncpy or explicit length checks).",
    difficulty: "beginner",
    bugType: "Memory",
    estMinutes: 30,
    proOnly: false,
    starterCode: `#include <stdio.h>
#include <string.h>

void copy_string(char* dest, const char* src) {
  // Bug: no bounds checking
  strcpy(dest, src);
}

int main() {
  char buf[10];
  copy_string(buf, "This is way too long!");
  printf("%s\n", buf);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a classic buffer overflow vulnerability using the unsafe strcpy function.

The vulnerable code allocates a 10‑byte buffer but attempts to copy a much longer string into it. This causes memory corruption beyond the buffer boundaries, potentially overwriting adjacent memory.

Your task is to identify the vulnerability, understand its impact, and implement a secure fix using bounds‑checked string operations.`,
    objectives: [
      "Identify the unsafe strcpy usage and understand why it's dangerous",
      "Understand how buffer overflows can lead to memory corruption",
      "Replace strcpy with a safe alternative like strncpy or snprintf",
      "Implement proper bounds checking to prevent buffer overflows",
      "Test your fix to ensure it handles both normal and edge cases",
    ],
    hints: [
      "The strcpy function doesn't check if the destination buffer is large enough",
      "Consider using strncpy with the buffer size as the third parameter",
      "Remember to null‑terminate the string after using strncpy",
      "Alternatively, you can use snprintf for safer string formatting",
      "Always validate input length before copying to fixed‑size buffers",
    ],
    solutionCode: `#include <stdio.h>
#include <string.h>

void copy_string(char* dest, const char* src, size_t dest_size) {
  // Safe: bounds‑checked copy
  strncpy(dest, src, dest_size - 1);
  dest[dest_size - 1] = '\\0'; // Ensure null termination
}

int main() {
  char buf[10];
  copy_string(buf, "This is way too long!", sizeof(buf));
  printf("%s\\n", buf);
  return 0;
}`,
    testCriteria: [
      "Code compiles without warnings",
      "No buffer overflow occurs with long input strings",
      "Strings are properly null‑terminated",
      "Function accepts buffer size as a parameter",
      "Handles edge cases like empty strings and maximum‑length strings",
    ],
    expectedBehavior:
      "The program should safely truncate strings that are too long for the buffer, preventing memory corruption while maintaining proper null termination.",
    // Since the starter code does not consume input, the test cases simply run the program
    testCases: [
      { input: "", expectedOutput: "This is w\\n" },
      { input: "\n", expectedOutput: "This is w\\n" },
      { input: "ignored input", expectedOutput: "This is w\\n" },
    ],
  },
  {
    slug: "use-after-free",
    title: "Use‑After‑Free Vulnerability",
    summary:
      "A pointer is freed, but still used later causing undefined behavior. Trigger the use‑after‑free, then fix by nulling pointers or refactoring ownership so no dangling pointers remain.",
    difficulty: "intermediate",
    bugType: "Memory",
    estMinutes: 35,
    proOnly: true,
    starterCode: `#include <stdlib.h>
#include <stdio.h>

typedef struct {
  int* data;
} Container;

void process(Container* c) {
  free(c->data);
  // Bug: use‑after‑free
  printf("Data: %d\\n", *c->data);
}

int main() {
  Container c;
  c.data = malloc(sizeof(int));
  *c.data = 42;
  process(&c);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a use‑after‑free vulnerability, one of the most dangerous memory bugs in C/C++.

The code frees memory through c->data but then immediately tries to read from that freed memory. This results in undefined behavior – the program might crash, read garbage values, or appear to work temporarily.

Use‑after‑free bugs are particularly dangerous because:
– Memory allocators may reuse freed memory for other purposes
– Attackers can potentially control the freed memory contents
– The bug may not manifest consistently, making it hard to debug
– Security exploits often leverage these for arbitrary code execution

Your task is to identify the dangling pointer, understand the vulnerability, and implement proper lifetime management.`,
    objectives: [
      "Understand what happens when freed memory is accessed",
      "Identify the use‑after‑free in the process() function",
      "Learn proper pointer lifetime management techniques",
      "Implement a fix using pointer nullification",
      "Alternatively, refactor to avoid early deallocation",
      "Verify the fix prevents undefined behavior",
    ],
    hints: [
      "The problem occurs because c->data is used after being freed",
      "One solution: Set c->data = NULL immediately after freeing",
      "Another solution: Move the free() call after the printf()",
      "Best practice: Check for NULL before dereferencing pointers",
      "Consider: Who owns the memory and when should it be freed?",
      "Valgrind or AddressSanitizer can detect use‑after‑free bugs",
    ],
    solutionCode: `#include <stdlib.h>
#include <stdio.h>

typedef struct {
  int* data;
} Container;

void process(Container* c) {
  // Solution 1: Read before freeing
  if (c->data) {
    printf("Data: %d\\n", *c->data);
    free(c->data);
    c->data = NULL; // Prevent dangling pointer
  }
}

int main() {
  Container c;
  c.data = malloc(sizeof(int));
  if (!c.data) {
    return 1; // Allocation failed
  }
  *c.data = 42;
  process(&c);
  return 0;
}`,
    testCriteria: [
      "No use‑after‑free occurs",
      "Memory is properly freed exactly once",
      "Pointers are set to NULL after freeing",
      "Code includes null pointer checks",
      "Passes AddressSanitizer/Valgrind without errors",
    ],
    expectedBehavior:
      "The program should safely print the data value and then free the memory, with pointers properly nullified to prevent accidental reuse.",
    testCases: [
      { input: "", expectedOutput: "Data: 42\\n" },
      { input: "ignored", expectedOutput: "Data: 42\\n" },
      { input: "\n", expectedOutput: "Data: 42\\n" },
    ],
  },
  {
    slug: "double-free",
    title: "Double Free Vulnerability",
    summary:
      "In error‑handling logic, the same memory is freed twice under certain conditions. Build a reproduction, then patch with safe guards, reference counting, or avoidance of duplicate frees.",
    difficulty: "intermediate",
    bugType: "Memory",
    estMinutes: 30,
    proOnly: false,
    starterCode: `#include <stdlib.h>
#include <stdio.h>

void cleanup(int* ptr, int error) {
  if (error) {
    free(ptr);
  }
  // Bug: double free if error is true
  free(ptr);
}

int main() {
  int* data = malloc(sizeof(int));
  cleanup(data, 1);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a double‑free vulnerability, where the same memory is freed multiple times.

The cleanup() function has flawed error‑handling logic. When error is true, it frees the pointer, but then unconditionally frees it again at the end of the function. This corrupts the heap's internal data structures.

Double‑free vulnerabilities are serious because:
– They corrupt the memory allocator's internal state
– Can lead to crashes or arbitrary code execution
– Often occur in complex error‑handling paths
– May be exploitable for security attacks

Your task is to identify the double‑free condition and implement proper cleanup logic.`,
    objectives: [
      "Understand the consequences of freeing memory twice",
      "Trace the execution path that leads to double‑free",
      "Recognize common error‑handling patterns that cause this bug",
      "Implement proper guards to prevent double‑free",
      "Use pointer nullification as a defensive measure",
      "Test both error and non‑error paths",
    ],
    hints: [
      "The double‑free happens when error is non‑zero (true)",
      "After freeing a pointer, set it to NULL to make subsequent frees safe",
      "Use else statement to ensure only one free() path executes",
      "free(NULL) is safe and does nothing in C",
      "Consider restructuring the function to have a single exit point",
      "Tools like AddressSanitizer can detect double‑free at runtime",
    ],
    solutionCode: `#include <stdlib.h>
#include <stdio.h>

void cleanup(int** ptr, int error) {
  if (*ptr) {
    free(*ptr);
    *ptr = NULL; // Prevent double‑free
  }
}

int main() {
  int* data = malloc(sizeof(int));
  if (!data) {
    return 1;
  }
  *data = 42;
  
  // Pass address of pointer so cleanup can null it
  cleanup(&data, 1);
  
  // Safe to call again – will do nothing
  cleanup(&data, 0);
  
  return 0;
}`,
    testCriteria: [
      "Memory is freed exactly once regardless of error flag",
      "Pointers are set to NULL after freeing",
      "Multiple cleanup calls don't cause crashes",
      "Both error=0 and error=1 paths work correctly",
      "No memory leaks or corruption detected by sanitizers",
    ],
    expectedBehavior:
      "The program should safely free memory exactly once, with the pointer nullified to prevent any subsequent double‑free attempts.",
    testCases: [
      { input: "", expectedOutput: "" },
      { input: "ignored", expectedOutput: "" },
      { input: "\n", expectedOutput: "" },
    ],
  },
  {
    slug: "integer-overflow-allocation",
    title: "Integer Overflow in Allocation",
    summary:
      "A size calculation wraps due to integer overflow, causing allocation of a smaller buffer. Exploit this to cause overflow/write, then patch by checking multiplication overflow before allocation.",
    difficulty: "advanced",
    bugType: "Memory",
    estMinutes: 45,
    proOnly: true,
    starterCode: `#include <stdlib.h>
#include <string.h>

void* safe_alloc(size_t count, size_t size) {
  // Bug: count * size can overflow
  return malloc(count * size);
}

int main() {
  size_t huge = 0x80000000;
  char* buf = safe_alloc(huge, 2);
  memset(buf, 'A', 100); // writes beyond allocated
  free(buf);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates an integer overflow vulnerability in memory allocation, a subtle but critical security issue.

When count * size overflows, the multiplication wraps around to a small value. For example, 0x80000000 * 2 = 0x100000000, which wraps to 0 on 32‑bit systems. malloc(0) may return a small buffer, but the code then writes far beyond it.

This vulnerability is particularly dangerous because:
– It bypasses size checks that appear correct
– Attackers can trigger arbitrary heap corruption
– The bug may only manifest on specific architectures
– It's a common pattern in real‑world exploits

Your task is to detect integer overflow before it causes allocation of an undersized buffer.`,
    objectives: [
      "Understand how integer overflow can wrap size calculations",
      "Recognize why count * size is dangerous without checks",
      "Learn techniques to detect multiplication overflow",
      "Implement safe allocation with overflow detection",
      "Consider architecture‑specific size_t ranges",
      "Test with edge cases near SIZE_MAX",
    ],
    hints: [
      "Check if count > SIZE_MAX / size before multiplying",
      "This prevents overflow: if (size && count > SIZE_MAX / size) return NULL;",
      "SIZE_MAX is defined in <stdint.h>",
      "Alternatively, check if (count * size) / size != count after multiplication",
      "Consider using builtin functions like __builtin_mul_overflow if available",
      "Zero‑size allocations should be handled explicitly",
    ],
    solutionCode: `#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdio.h>

void* safe_alloc(size_t count, size_t size) {
  // Check for overflow before multiplication
  if (size != 0 && count > SIZE_MAX / size) {
    fprintf(stderr, "Allocation would overflow\\n");
    return NULL;
  }
  
  size_t total = count * size;
  
  // Also check for zero‑size edge case
  if (total == 0) {
    return NULL;
  }
  
  return malloc(total);
}

int main() {
  size_t huge = 0x80000000;
  char* buf = safe_alloc(huge, 2);
  
  if (!buf) {
    printf("Allocation safely rejected\\n");
    return 0;
  }
  
  memset(buf, 'A', 100);
  free(buf);
  return 0;
}`,
    testCriteria: [
      "Detects and rejects overflowing allocations",
      "Returns NULL when count * size would overflow",
      "Handles zero count and zero size correctly",
      "Works correctly on both 32‑bit and 64‑bit systems",
      "No false positives on valid large allocations",
    ],
    expectedBehavior:
      "The program should detect the integer overflow condition and safely reject the allocation, preventing heap corruption.",
    testCases: [
      { input: "", expectedOutput: "Allocation safely rejected\\n" },
      { input: "ignored", expectedOutput: "Allocation safely rejected\\n" },
      { input: "\n", expectedOutput: "Allocation safely rejected\\n" },
    ],
  },
  {
    slug: "race-condition-counter",
    title: "Race Condition on Shared Counter",
    summary:
      "Multiple threads increment a shared counter non‑atomically. Reproduce data race (lost updates) and patch by using proper synchronization primitives or atomic operations.",
    difficulty: "advanced",
    bugType: "Concurrency",
    estMinutes: 50,
    proOnly: true,
    starterCode: `#include <pthread.h>
#include <stdio.h>

int counter = 0;

void* increment(void* arg) {
  for (int i = 0; i < 100000; i++) {
    // Bug: non‑atomic increment
    counter++;
  }
  return NULL;
}

int main() {
  pthread_t t1, t2;
  pthread_create(&t1, NULL, increment, NULL);
  pthread_create(&t2, NULL, increment, NULL);
  pthread_join(t1, NULL);
  pthread_join(t2, NULL);
  printf("Counter: %d\\n", counter);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a classic race condition on a shared counter variable accessed by multiple threads.

The counter++ operation looks atomic but actually consists of three steps: read counter, add 1, write counter. When multiple threads execute these steps concurrently without synchronization, updates can be lost.

For example:
– Thread 1 reads counter=5
– Thread 2 reads counter=5
– Thread 1 writes counter=6
– Thread 2 writes counter=6 (lost update!)

Expected final value: 200,000. Actual value: unpredictable, likely much less due to lost updates.

Your task is to fix this race condition using proper synchronization.`,
    objectives: [
      "Understand why counter++ is not atomic",
      "Observe lost updates by running the program multiple times",
      "Learn about data races and their consequences",
      "Implement synchronization using mutexes or atomic operations",
      "Compare performance of different synchronization approaches",
      "Verify correctness with ThreadSanitizer",
    ],
    hints: [
      "counter++ compiles to: load, add, store – three separate operations",
      "Use pthread_mutex_t to protect critical sections",
      "Alternatively, use C11 atomic_int with atomic_fetch_add",
      "With atomics: #include <stdatomic.h> and atomic_int counter = 0;",
      "atomic_fetch_add(&counter, 1) is lock‑free and faster than mutexes",
      "Run with -fsanitize=thread to detect data races at runtime",
    ],
    solutionCode: `#include <pthread.h>
#include <stdio.h>
#include <stdatomic.h>

// Solution using C11 atomics
atomic_int counter = 0;

void* increment(void* arg) {
  for (int i = 0; i < 100000; i++) {
    atomic_fetch_add(&counter, 1);
  }
  return NULL;
}

/* Alternative solution using mutex:
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
int counter = 0;

void* increment(void* arg) {
  for (int i = 0; i < 100000; i++) {
    pthread_mutex_lock(&lock);
    counter++;
    pthread_mutex_unlock(&lock);
  }
  return NULL;
}
*/

int main() {
  pthread_t t1, t2;
  pthread_create(&t1, NULL, increment, NULL);
  pthread_create(&t2, NULL, increment, NULL);
  pthread_join(t1, NULL);
  pthread_join(t2, NULL);
  printf("Counter: %d\\n", atomic_load(&counter));
  return 0;
}`,
    testCriteria: [
      "Final counter value is always exactly 200,000",
      "No data races detected by ThreadSanitizer",
      "Code compiles with -pthread flag",
      "Works correctly with more than 2 threads",
      "No deadlocks or livelocks occur",
    ],
    expectedBehavior:
      "The program should reliably produce a counter value of 200,000, with all increments properly synchronized and no lost updates.",
    testCases: [
      { input: "", expectedOutput: "Counter: 200000\\n" },
      { input: "ignored", expectedOutput: "Counter: 200000\\n" },
      { input: "\n", expectedOutput: "Counter: 200000\\n" },
    ],
  },
  {
    slug: "format-string-vulnerability",
    title: "Format String Vulnerability",
    summary:
      "User input is passed directly into printf() as format string. Exploit this to read or write arbitrary memory, then fix by using printf(\"%s\", input) or validating/sanitizing the format.",
    difficulty: "advanced",
    bugType: "Hardening",
    estMinutes: 40,
    proOnly: true,
    starterCode: `#include <stdio.h>

void log_message(const char* msg) {
  // Bug: format string vulnerability
  printf(msg);
  printf("\\n");
}

int main() {
  char input[100];
  fgets(input, sizeof(input), stdin);
  log_message(input);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a format string vulnerability, a critical security issue where user‑controlled input is used as a printf format string.

When printf(msg) is called with user input, attackers can inject format specifiers like %x, %n, %s to:
– Read arbitrary stack memory with %x or %s
– Write to arbitrary memory locations with %n
– Crash the program with invalid specifiers
– Potentially achieve code execution

Try running with inputs like:
– "%x %x %x" – dumps stack contents
– "%s" – may crash by dereferencing arbitrary memory
– "%n" – writes to memory (dangerous!)

Your task is to fix the vulnerability by properly handling user input.`,
    objectives: [
      "Understand how printf interprets format specifiers",
      "Recognize why user input should never be a format string",
      "Demonstrate reading stack memory using format specifiers",
      "Implement proper input sanitization",
      "Use safe printf patterns that treat input as data",
      "Validate fix against various exploit attempts",
    ],
    hints: [
      "Never call printf(user_input) directly",
      "Use printf(\"%s\", user_input) to treat input as data, not format",
      "The %s format treats the argument as a string, not a format string",
      "Alternatively, use fputs() which doesn't interpret format specifiers",
      "Consider using puts() for simple string output",
      "Compile with -Wformat-security to catch these issues",
    ],
    solutionCode: `#include <stdio.h>
#include <string.h>

void log_message(const char* msg) {
  // Solution: Treat input as data, not format
  printf("%s", msg);
  printf("\\n");
  
  // Alternative solutions:
  // fputs(msg, stdout);
  // puts(msg);
}

int main() {
  char input[100];
  if (fgets(input, sizeof(input), stdin)) {
    // Remove trailing newline if present
    input[strcspn(input, "\\n")] = 0;
    log_message(input);
  }
  return 0;
}`,
    testCriteria: [
      "Input with %x %s %n is printed as literal text",
      "No stack memory is leaked",
      "No memory writes occur from %n",
      "Program doesn't crash with malicious format strings",
      "Compiles without warnings with -Wformat-security",
    ],
    expectedBehavior:
      "The program should safely print user input as literal text, without interpreting any format specifiers, preventing all format string attacks.",
    testCases: [
      { input: "hello\\n", expectedOutput: "hello\\n" },
      { input: "%x %x\\n", expectedOutput: "%x %x\\n" },
      { input: "format string test\\n", expectedOutput: "format string test\\n" },
    ],
  },
  {
    slug: "heap-buffer-overflow",
    title: "Heap Buffer Overflow",
    summary:
      "A malloc‑allocated buffer is overrun using memcpy or indexed write. Trigger overflow, then patch via bounds checks, safer memory allocation, or use of safer container types.",
    difficulty: "intermediate",
    bugType: "Memory",
    estMinutes: 35,
    proOnly: false,
    starterCode: `#include <stdlib.h>
#include <string.h>

void copy_data(const char* src, size_t len) {
  char* buf = malloc(10);
  // Bug: no bounds check, copies beyond buffer
  memcpy(buf, src, len);
  free(buf);
}

int main() {
  copy_data("This is a very long string", 26);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a heap buffer overflow, where data is copied beyond the bounds of a dynamically allocated buffer.

The copy_data() function allocates only 10 bytes but then copies 26 bytes into it. This corrupts heap metadata and adjacent allocations, potentially leading to crashes or security exploits.

Heap buffer overflows are dangerous because:
– They corrupt heap structures used by malloc/free
– Can overwrite other heap objects' data
– May be exploitable for arbitrary code execution
– Often harder to detect than stack overflows

Your task is to add proper bounds checking to prevent the overflow.`,
    objectives: [
      "Understand the difference between allocated size and copy size",
      "Recognize that heap corruption may not crash immediately",
      "Learn to validate size parameters before copying",
      "Implement dynamic allocation based on actual data size",
      "Add proper error handling for allocation failures",
      "Use AddressSanitizer to detect heap corruption",
    ],
    hints: [
      "The buffer is only 10 bytes but 26 bytes are being copied",
      "Allocate buf based on the actual length: malloc(len + 1)",
      "Always check if malloc returns NULL (allocation failure)",
      "Use size_t consistently for buffer sizes",
      "Consider adding a maximum size limit for safety",
      "Run with -fsanitize=address to detect heap overflows",
    ],
    solutionCode: `#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#define MAX_BUFFER_SIZE 1024

void copy_data(const char* src, size_t len) {
  // Validate input size
  if (len > MAX_BUFFER_SIZE) {
    fprintf(stderr, "Data too large: %zu bytes\\n", len);
    return;
  }
  
  // Allocate buffer to fit actual data
  char* buf = malloc(len);
  if (!buf) {
    fprintf(stderr, "Allocation failed\\n");
    return;
  }
  
  // Now copy is safe – buffer is exactly the right size
  memcpy(buf, src, len);
  
  // Use the data...
  printf("Copied %zu bytes successfully\\n", len);
  
  free(buf);
}

int main() {
  const char* data = "This is a very long string";
  copy_data(data, strlen(data) + 1); // +1 for null terminator
  return 0;
}`,
    testCriteria: [
      "Buffer size matches the data being copied",
      "No heap corruption detected by sanitizers",
      "Handles allocation failures gracefully",
      "Validates input size against maximum limits",
      "Properly manages memory lifecycle",
    ],
    expectedBehavior:
      "The program should allocate appropriately sized buffers and safely copy data without overflowing heap boundaries or corrupting adjacent memory.",
    testCases: [
      { input: "", expectedOutput: "Copied 26 bytes successfully\\n" },
      { input: "ignored", expectedOutput: "Copied 26 bytes successfully\\n" },
      { input: "\n", expectedOutput: "Copied 26 bytes successfully\\n" },
    ],
  },
  {
    slug: "null-pointer-deref",
    title: "Null Pointer Dereference",
    summary:
      "Under certain error branches, a null pointer is dereferenced. Reproduce null deref crash, then patch by adding defensive null checks or early exits.",
    difficulty: "beginner",
    bugType: "Memory",
    estMinutes: 25,
    proOnly: false,
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int* allocate_data(int should_fail) {
  if (should_fail) {
    return NULL;
  }
  int* p = malloc(sizeof(int));
  *p = 42;
  return p;
}

int main() {
  int* data = allocate_data(1);
  // Bug: no null check
  printf("Value: %d\\n", *data);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a null pointer dereference, one of the most common bugs in C programs.

The allocate_data() function returns NULL when should_fail is true, but main() doesn't check for this before dereferencing the pointer. This causes an immediate segmentation fault.

Null pointer dereferences are problematic because:
– They cause immediate program crashes
– Can lead to denial of service in production systems
– May mask other bugs by crashing before they're detected
– In some cases, can be exploited for security attacks

Your task is to add proper null pointer checks to handle allocation failures gracefully.`,
    objectives: [
      "Understand when and why functions return NULL",
      "Recognize the importance of checking return values",
      "Learn defensive programming with null checks",
      "Implement proper error handling for allocation failures",
      "Distinguish between NULL checks and other validations",
      "Write resilient code that handles failures gracefully",
    ],
    hints: [
      "Check if data is NULL before dereferencing it",
      "Use if (!data) to check for NULL",
      "Alternatively: if (data == NULL)",
      "Print an error message when allocation fails",
      "Return non‑zero exit code on error",
      "Consider: Should allocate_data print its own error message?",
    ],
    solutionCode: `#include <stdio.h>
#include <stdlib.h>

int* allocate_data(int should_fail) {
  if (should_fail) {
    fprintf(stderr, "Allocation intentionally failed\\n");
    return NULL;
  }
  int* p = malloc(sizeof(int));
  if (!p) {
    fprintf(stderr, "malloc failed\\n");
    return NULL;
  }
  *p = 42;
  return p;
}

int main() {
  int* data = allocate_data(1);
  
  // Defensive null check
  if (!data) {
    fprintf(stderr, "Error: Failed to allocate data\\n");
    return 1; // Return error code
  }
  
  printf("Value: %d\\n", *data);
  free(data);
  return 0;
}`,
    testCriteria: [
      "Program doesn't crash when allocation fails",
      "Prints appropriate error messages",
      "Returns non‑zero exit code on failure",
      "Frees allocated memory in success path",
      "Works correctly when should_fail is 0 or 1",
    ],
    expectedBehavior:
      "The program should check for NULL pointers, print an informative error message when allocation fails, and exit gracefully without crashing.",
    testCases: [
      { input: "", expectedOutput: "Allocation intentionally failed\\nError: Failed to allocate data\\n" },
      { input: "ignored", expectedOutput: "Allocation intentionally failed\\nError: Failed to allocate data\\n" },
      { input: "\n", expectedOutput: "Allocation intentionally failed\\nError: Failed to allocate data\\n" },
    ],
  },
  {
    slug: "partial-io-read",
    title: "Partial I/O Read Handling",
    summary:
      "When read() returns fewer bytes than requested, code fails to loop to read the remainder, causing buffer gaps. Provide input to produce short reads, then patch by handling partial reads properly.",
    difficulty: "intermediate",
    bugType: "I/O",
    estMinutes: 40,
    proOnly: true,
    starterCode: `#include <unistd.h>
#include <stdio.h>

int read_full(int fd, char* buf, size_t count) {
  // Bug: assumes read() returns all requested bytes
  ssize_t n = read(fd, buf, count);
  return n;
}

int main() {
  char buffer[100];
  int bytes = read_full(0, buffer, 100);
  printf("Read %d bytes\\n", bytes);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates improper handling of partial I/O reads, a common pitfall in systems programming.

The read() system call is not guaranteed to return all requested bytes in a single call. It may return fewer bytes due to:
– Network packet boundaries
– Signal interruptions (EINTR)
– Available data in buffers
– Terminal input characteristics

The vulnerable code assumes read() returns all 100 bytes, but it might return 10, then 20, then 30, etc. This leaves uninitialized gaps in the buffer and causes data corruption.

Your task is to implement proper partial read handling with a loop.`,
    objectives: [
      "Understand that read() may return less than requested",
      "Learn the conditions that cause short reads",
      "Implement a loop to handle partial reads correctly",
      "Handle error conditions like EINTR appropriately",
      "Distinguish between EOF, errors, and short reads",
      "Write robust I/O code that handles all edge cases",
    ],
    hints: [
      "read() returns the number of bytes actually read, not requested",
      "Use a loop: while (total < count) to read remaining bytes",
      "Check for errors: if (n == -1 && errno == EINTR) continue;",
      "EOF is indicated by read() returning 0",
      "Update buffer pointer: buf + total for next read",
      "Keep track of total bytes read across iterations",
    ],
    solutionCode: `#include <unistd.h>
#include <stdio.h>
#include <errno.h>

ssize_t read_full(int fd, char* buf, size_t count) {
  size_t total = 0;
  
  while (total < count) {
    ssize_t n = read(fd, buf + total, count - total);
    
    if (n == -1) {
      if (errno == EINTR) {
        // Interrupted by signal, retry
        continue;
      }
      // Real error occurred
      return -1;
    }
    
    if (n == 0) {
      // EOF reached
      break;
    }
    
    total += n;
  }
  
  return total;
}

int main() {
  char buffer[100] = {0};
  ssize_t bytes = read_full(0, buffer, 100);
  
  if (bytes == -1) {
    perror("read_full failed");
    return 1;
  }
  
  printf("Read %zd bytes\\n", bytes);
  return 0;
}`,
    testCriteria: [
      "Handles short reads correctly with looping",
      "Properly handles EINTR errors",
      "Detects and handles EOF correctly",
      "Returns total bytes read across all iterations",
      "Works with various input sizes and patterns",
    ],
    expectedBehavior:
      "The program should read all available data by looping until the full count is reached or EOF is encountered, handling interruptions and errors gracefully.",
    testCases: [
      { input: "", expectedOutput: "Read 0 bytes\\n" },
      { input: "ignored", expectedOutput: "Read 0 bytes\\n" },
      { input: "\n", expectedOutput: "Read 0 bytes\\n" },
    ],
  },
  {
    slug: "parsing-bug-exploit",
    title: "Input Parsing Vulnerability",
    summary:
      "A simple data parser fails to validate input length or bounds, allowing crafted input that triggers out‑of‑bounds or memory corruption. Patch the parser with bounds checks, length validations, and proper error handling.",
    difficulty: "intermediate",
    bugType: "Parsing",
    estMinutes: 45,
    proOnly: true,
    starterCode: `#include <stdio.h>
#include <string.h>

typedef struct {
  int length;
  char data[64];
} Packet;

void parse_packet(const char* input) {
  Packet pkt;
  // Bug: trusts length field without validation
  memcpy(&pkt.length, input, 4);
  memcpy(pkt.data, input + 4, pkt.length);
  printf("Parsed %d bytes\\n", pkt.length);
}

int main() {
  char malicious[100];
  *(int*)malicious = 200; // length > 64
  memset(malicious + 4, 'A', 96);
  parse_packet(malicious);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a parsing vulnerability where untrusted length fields are used without validation.

The parse_packet() function reads a length field from the input and blindly uses it to copy data. An attacker can provide length=200 while the buffer is only 64 bytes, causing a buffer overflow.

This pattern is common in:
– Network protocol parsers
– File format handlers
– Deserialization code
– Binary data processors

The vulnerability allows attackers to:
– Overflow stack or heap buffers
– Corrupt adjacent data structures
– Potentially execute arbitrary code
– Cause crashes or undefined behavior

Your task is to add proper bounds validation before trusting untrusted input.`,
    objectives: [
      "Understand the danger of trusting attacker‑controlled length fields",
      "Recognize integer‑based vulnerabilities in parsing",
      "Learn to validate all inputs before use",
      "Implement bounds checking for length fields",
      "Handle invalid packets with proper error reporting",
      "Test parser against malformed and malicious inputs",
    ],
    hints: [
      "Validate pkt.length before using it: if (pkt.length > 64)",
      "Also check for negative lengths if using signed integers",
      "Consider: Can length be larger than the input buffer?",
      "Return error codes or use exceptions for invalid packets",
      "Add sanity checks: length should be reasonable, not huge",
      "Fuzz test your parser with random malformed inputs",
    ],
    solutionCode: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

typedef struct {
  int length;
  char data[64];
} Packet;

bool parse_packet(const char* input, size_t input_size, Packet* pkt) {
  // Ensure we have enough bytes for the length field
  if (input_size < sizeof(int)) {
    fprintf(stderr, "Input too small for length field\\n");
    return false;
  }
  
  memcpy(&pkt->length, input, sizeof(int));
  
  // Validate length field
  if (pkt->length < 0) {
    fprintf(stderr, "Invalid negative length: %d\\n", pkt->length);
    return false;
  }
  
  if (pkt->length > 64) {
    fprintf(stderr, "Length exceeds buffer: %d > 64\\n", pkt->length);
    return false;
  }
  
  // Ensure input has enough bytes for the data
  if (input_size < sizeof(int) + pkt->length) {
    fprintf(stderr, "Input too small for claimed data\\n");
    return false;
  }
  
  // Safe to copy now
  memcpy(pkt->data, input + sizeof(int), pkt->length);
  printf("Parsed %d bytes successfully\\n", pkt->length);
  return true;
}

int main() {
  char malicious[100];
  *(int*)malicious = 200; // length > 64
  memset(malicious + 4, 'A', 96);
  
  Packet pkt;
  if (!parse_packet(malicious, sizeof(malicious), &pkt)) {
    fprintf(stderr, "Failed to parse malicious packet (as expected)\\n");
    return 1;
  }
  
  return 0;
}`,
    testCriteria: [
      "Validates length field before using it",
      "Rejects packets with length > 64",
      "Handles negative length values",
      "Checks that input buffer is large enough",
      "Returns error status for invalid packets",
      "No buffer overflows with malicious inputs",
    ],
    expectedBehavior:
      "The parser should validate all length fields against buffer sizes, reject malicious packets with appropriate error messages, and never allow buffer overflows.",
    testCases: [
      { input: "", expectedOutput: "Length exceeds buffer: 200 > 64\\nFailed to parse malicious packet (as expected)\\n" },
      { input: "ignored", expectedOutput: "Length exceeds buffer: 200 > 64\\nFailed to parse malicious packet (as expected)\\n" },
      { input: "\n", expectedOutput: "Length exceeds buffer: 200 > 64\\nFailed to parse malicious packet (as expected)\\n" },
    ],
  },

  // -----------------------------------------------------------------------
  // New labs derived from the attached specification

  // Ring Buffer Off‑By‑One
  {
    slug: "ring-buffer-off-by-one",
    title: "Ring Buffer Off‑By‑One",
    summary:
      "Implement a fixed‑size circular queue and track down an off‑by‑one error that corrupts the head/tail pointers.",
    difficulty: "intermediate",
    bugType: "Queues",
    estMinutes: 25,
    proOnly: false,
    starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

struct RingBuffer {
    std::vector<int> buf;
    int head;
    int tail;
    int count;
    int capacity;
    RingBuffer(int n) : buf(n), head(0), tail(0), count(0), capacity(n) {}
    bool enqueue(int x) {
        if (count == capacity) return false;
        buf[tail] = x;
        tail = (tail + 1) % capacity;
        count++;
        return true;
    }
    bool dequeue(int &x) {
        if (count == 0) return false;
        x = buf[head];
        head = (head + 1) % capacity;
        count--;
        return true;
    }
};

int main() {
    int n;
    std::cin >> n;
    std::cin.ignore();
    RingBuffer rb(n);
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;
        if (cmd == "ENQ") {
            int val;
            iss >> val;
            if (!rb.enqueue(val)) {
                std::cout << "overflow\\n";
            }
        } else if (cmd == "DEQ") {
            int val;
            if (rb.dequeue(val)) {
                std::cout << val << "\\n";
            } else {
                std::cout << "underflow\\n";
            }
        }
    }
    return 0;
}`,
    detailedInstructions: `Study the provided ring buffer implementation and note how head, tail and count are updated.

Compile and run the starter code against the supplied test cases to observe incorrect behaviour.

Look for conditions where the buffer appears full or empty one element too soon or too late.

Adjust the logic so that full and empty states are detected correctly and indices wrap cleanly at the end of the array.

Re‑run the tests to confirm that overflow and underflow messages only occur when appropriate.`,
    objectives: [
      "Understand how circular buffers manage head and tail indices",
      "Identify the off‑by‑one bug that causes incorrect enqueue/dequeue behaviour",
      "Correctly update indices when the buffer becomes full or empty",
      "Ensure wrap‑around logic respects the buffer’s capacity",
    ],
    hints: [
      "Track both the head and tail indices as well as a count of elements to distinguish full from empty.",
      "Use modulo arithmetic to wrap indices back to the start when they reach the capacity.",
      "Check the conditions for full and empty before updating the indices; off‑by‑one errors often occur in these comparisons.",
    ],
    solutionCode: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

struct RingBuffer {
    std::vector<int> buf;
    int head;
    int tail;
    int count;
    int capacity;
    RingBuffer(int n) : buf(n), head(0), tail(0), count(0), capacity(n) {}
    bool enqueue(int x) {
        if (count == capacity) return false;
        buf[tail] = x;
        tail = (tail + 1) % capacity;
        count++;
        return true;
    }
    bool dequeue(int &x) {
        if (count == 0) return false;
        x = buf[head];
        head = (head + 1) % capacity;
        count--;
        return true;
    }
};

int main() {
    int n;
    std::cin >> n;
    std::cin.ignore();
    RingBuffer rb(n);
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;
        if (cmd == "ENQ") {
            int val;
            iss >> val;
            if (!rb.enqueue(val)) {
                std::cout << "overflow\\n";
            }
        } else if (cmd == "DEQ") {
            int val;
            if (rb.dequeue(val)) {
                std::cout << val << "\\n";
            } else {
                std::cout << "underflow\\n";
            }
        }
    }
    return 0;
}`,
    testCases: [
      {
        input: "2\nENQ 1\nENQ 2\nENQ 3\nDEQ\nDEQ\nDEQ\n",
        expectedOutput: "overflow\\n1\\n2\\nunderflow\\n",
      },
      {
        input: "3\nENQ 5\nDEQ\nENQ 6\nENQ 7\nDEQ\nDEQ\n",
        expectedOutput: "5\\n6\\n7\\n",
      },
      {
        input: "1\nDEQ\nENQ 8\nDEQ\n",
        expectedOutput: "underflow\\n8\\n",
      },
    ],
  },

  // TOCTOU vulnerability
  {
    slug: "toctou-vulnerability",
    title: "Time‑of‑Check to Time‑of‑Use (TOCTOU)",
    summary:
      "Demonstrate a classic TOCTOU vulnerability by comparing a value during a security check and then using it later without re‑verification.",
    difficulty: "advanced",
    bugType: "Hardening",
    estMinutes: 40,
    proOnly: true,
    starterCode: `#include <iostream>
int main() {
    int uidBefore, uidAfter;
    std::cin >> uidBefore >> uidAfter;
    // TODO: compare the identifiers before and after the check
    // Currently the code incorrectly assumes the resource never changes
    std::cout << "safe\\n";
    return 0;
}
`,
    detailedInstructions: `Inspect the starter code which reads two identifiers representing the state before and after a check.

Notice that the current implementation always reports the resource as safe regardless of the state change.

Update the logic to compare the identifiers and detect when the state has changed between checks.

Output 'unsafe' when the values differ and 'safe' when they are identical.

Test your solution against the provided scenarios to ensure proper detection.`,
    objectives: [
      "Understand why time‑of‑check to time‑of‑use vulnerabilities arise",
      "Simulate a race between checking a resource’s state and using it",
      "Implement a second check immediately before the sensitive operation",
      "Return an appropriate security decision based on the consistency of the checks",
    ],
    hints: [
      "The vulnerability occurs when the resource is assumed to remain the same after the initial check.",
      "Read both the 'before' and 'after' identifiers from input and compare them.",
      "If they differ, report that a race has been detected by outputting 'unsafe'.",
    ],
    solutionCode: `#include <iostream>
int main() {
    int uidBefore, uidAfter;
    std::cin >> uidBefore >> uidAfter;
    if (uidBefore != uidAfter) {
        std::cout << "unsafe\\n";
    } else {
        std::cout << "safe\\n";
    }
    return 0;
}
`,
    testCases: [
      { input: "1 2\n", expectedOutput: "unsafe\n" },
      { input: "3 3\n", expectedOutput: "safe\n" },
      { input: "0 1\n", expectedOutput: "unsafe\n" },
    ],
  },

  // Bit‑Packed Flags Parser
  {
    slug: "bit-packed-flags-parser",
    title: "Bit‑Packed Flags Parser",
    summary:
      "Work with bit‑packed status registers by setting or clearing individual bits using masks without disturbing neighbouring fields.",
    difficulty: "beginner",
    bugType: "Embedded",
    estMinutes: 20,
    proOnly: false,
    starterCode: `#include <iostream>
#include <iomanip>
#include <string>
int main() {
    unsigned int value;
    std::cin >> std::hex >> value;
    std::string op;
    int bit;
    std::cin >> op >> bit;
    // TODO: modify 'value' based on op and bit
    std::cout << "0x" << std::uppercase << std::setfill('0') << std::setw(2) << std::hex << value << "\\n";
    return 0;
}
`,
    detailedInstructions: `Read an initial byte value in hexadecimal (e.g. 0x0F) from standard input.

Parse an operation of the form 'SET <bit>' or 'CLEAR <bit>' where <bit> is 0–7.

Use bitwise OR to set a bit and bitwise AND with the complement to clear a bit.

When printing the result, include the '0x' prefix and pad single‑digit bytes with a leading zero.`,
    objectives: [
      "Parse an unsigned integer value from input",
      "Apply a set or clear operation to a specific bit position",
      "Ensure that other bits remain unchanged after the operation",
      "Output the modified value in hexadecimal format",
    ],
    hints: [
      "Bit positions are zero‑indexed from the least significant bit (LSB).",
      "To set bit b: value |= (1u << b).",
      "To clear bit b: value &= ~(1u << b).",
    ],
    solutionCode: `#include <iostream>
#include <iomanip>
#include <string>
int main() {
    unsigned int value;
    std::cin >> std::hex >> value;
    std::string op;
    int bit;
    std::cin >> op >> bit;
    if (op == "SET") {
        value |= (1u << bit);
    } else if (op == "CLEAR") {
        value &= ~(1u << bit);
    }
    std::cout << "0x" << std::uppercase << std::setfill('0') << std::setw(2) << std::hex << value << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "0x00\nSET 0\n", expectedOutput: "0x01\n" },
      { input: "0xFF\nCLEAR 7\n", expectedOutput: "0x7F\n" },
      { input: "0x10\nCLEAR 4\n", expectedOutput: "0x00\n" },
    ],
  },

  // Constant‑Time Password Compare
  {
    slug: "constant-time-password-compare",
    title: "Constant‑Time Password Compare",
    summary:
      "Compare two strings in a way that does not reveal length or character differences through timing side channels.",
    difficulty: "intermediate",
    bugType: "Hardening",
    estMinutes: 30,
    proOnly: true,
    starterCode: `#include <iostream>
#include <string>
bool insecure_compare(const std::string &a, const std::string &b) {
    return a == b;
}

int main() {
    std::string expected;
    std::string attempt;
    std::getline(std::cin, expected);
    std::getline(std::cin, attempt);
    bool result = insecure_compare(expected, attempt);
    std::cout << (result ? "match" : "mismatch") << "\\n";
    return 0;
}
`,
    detailedInstructions: `Read two lines from standard input: the expected password and the user’s attempt.

Notice that the provided helper uses direct comparison and returns immediately on mismatch.

Write a new function that iterates over the maximum length of the two strings, XORs the characters and accumulates differences.

After iterating through all positions, also compare the lengths to avoid accepting truncated strings.

Output 'match' when the strings are identical and 'mismatch' otherwise.`,
    objectives: [
      "Understand how naive string comparisons can leak information via timing",
      "Implement a comparison that inspects every character regardless of mismatches",
      "Ensure that both the length and content of the strings match before returning true",
      "Return 'match' or 'mismatch' accordingly",
    ],
    hints: [
      "Timing attacks rely on short‑circuiting comparisons that exit early on the first mismatch.",
      "Use a single variable to accumulate the XOR of all corresponding characters of both strings, padding with zeros when one is shorter.",
      "A constant‑time compare should only return true when the accumulated difference is zero and the lengths match exactly.",
    ],
    solutionCode: `#include <iostream>
#include <string>
bool constant_time_equal(const std::string &a, const std::string &b) {
    size_t maxLen = a.size() > b.size() ? a.size() : b.size();
    unsigned char diff = 0;
    for (size_t i = 0; i < maxLen; ++i) {
        unsigned char ca = i < a.size() ? static_cast<unsigned char>(a[i]) : 0;
        unsigned char cb = i < b.size() ? static_cast<unsigned char>(b[i]) : 0;
        diff |= ca ^ cb;
    }
    return diff == 0 && a.size() == b.size();
}

int main() {
    std::string expected;
    std::string attempt;
    std::getline(std::cin, expected);
    std::getline(std::cin, attempt);
    bool result = constant_time_equal(expected, attempt);
    std::cout << (result ? "match" : "mismatch") << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "secret\nsecret\n", expectedOutput: "match\n" },
      { input: "secret\nsecreT\n", expectedOutput: "mismatch\n" },
      { input: "abc\nabcd\n", expectedOutput: "mismatch\n" },
    ],
  },

  // Lock‑Free SPSC Queue
  {
    slug: "lock-free-spsc-queue",
    title: "Lock‑Free Single‑Producer Queue (SPSC)",
    summary:
      "Implement a ring buffer that supports a single producer and single consumer without using mutexes. Learn to use atomic variables and memory ordering to build a lock‑free data structure.",
    difficulty: "advanced",
    bugType: "Concurrency",
    estMinutes: 45,
    proOnly: true,
    starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <atomic>

struct SPSCQueue {
    std::vector<int> buf;
    std::atomic<int> head;
    std::atomic<int> tail;
    int capacity;
    SPSCQueue(int n) : buf(n), head(0), tail(0), capacity(n) {}
    bool push(int x) {
        // TODO: implement lock‑free push using atomics
        return false;
    }
    bool pop(int &x) {
        // TODO: implement lock‑free pop using atomics
        return false;
    }
};

int main() {
    int n;
    std::cin >> n;
    std::cin.ignore();
    SPSCQueue q(n);
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;
        if (cmd == "PUSH") {
            int v;
            iss >> v;
            if (!q.push(v)) {
                std::cout << "overflow\\n";
            }
        } else if (cmd == "POP") {
            int v;
            if (q.pop(v)) {
                std::cout << v << "\\n";
            } else {
                std::cout << "underflow\\n";
            }
        }
    }
    return 0;
}
`,
    detailedInstructions: `Review the provided ring buffer skeleton that uses std::atomic for head and tail indices.

Fill in the push and pop methods to respect the capacity and update indices atomically.

Return false from push when the buffer is full and from pop when it is empty.

Test your implementation with the supplied sequences of PUSH and POP commands to verify correct ordering and overflow/underflow detection.

Consider how acquire and release semantics ensure visibility between producer and consumer threads.`,
    objectives: [
      "Use atomic variables to track head and tail indices",
      "Detect full and empty conditions using head and tail values",
      "Apply appropriate memory orderings (acquire/release) when loading and storing indices",
      "Ensure that the producer and consumer can safely operate concurrently without locks",
    ],
    hints: [
      "Use memory_order_acquire when reading the other thread’s index and memory_order_release when publishing your own update.",
      "The queue is full when the next tail index equals the current head index; it is empty when head equals tail.",
      "Perform modulo arithmetic on indices to wrap around at the buffer’s capacity.",
    ],
    solutionCode: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <atomic>

struct SPSCQueue {
    std::vector<int> buf;
    std::atomic<int> head;
    std::atomic<int> tail;
    int capacity;
    SPSCQueue(int n) : buf(n), head(0), tail(0), capacity(n) {}
    bool push(int x) {
        int t = tail.load(std::memory_order_relaxed);
        int h = head.load(std::memory_order_acquire);
        int next = (t + 1) % capacity;
        if (next == h) return false;
        buf[t] = x;
        tail.store(next, std::memory_order_release);
        return true;
    }
    bool pop(int &x) {
        int h = head.load(std::memory_order_relaxed);
        int t = tail.load(std::memory_order_acquire);
        if (h == t) return false;
        x = buf[h];
        int next = (h + 1) % capacity;
        head.store(next, std::memory_order_release);
        return true;
    }
};

int main() {
    int n;
    std::cin >> n;
    std::cin.ignore();
    SPSCQueue q(n);
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;
        if (cmd == "PUSH") {
            int v;
            iss >> v;
            if (!q.push(v)) {
                std::cout << "overflow\\n";
            }
        } else if (cmd == "POP") {
            int v;
            if (q.pop(v)) {
                std::cout << v << "\\n";
            } else {
                std::cout << "underflow\\n";
            }
        }
    }
    return 0;
}
`,
    testCases: [
      {
        input: "2\nPUSH 1\nPUSH 2\nPUSH 3\nPOP\nPOP\nPOP\n",
        expectedOutput: "overflow\\n1\\n2\\nunderflow\\n",
      },
      {
        input: "3\nPUSH 10\nPOP\nPUSH 20\nPUSH 30\nPOP\nPOP\n",
        expectedOutput: "10\\n20\\n30\\n",
      },
      {
        input: "1\nPOP\nPUSH 5\nPOP\n",
        expectedOutput: "underflow\\n5\\n",
      },
    ],
  },

  // UART RX Frame Validator
  {
    slug: "uart-rx-frame-validator",
    title: "UART RX Frame Validator",
    summary:
      "Parse a simple framed UART packet consisting of a header, length, payload and checksum. Reject malformed frames and validate payload integrity using an additive checksum.",
    difficulty: "intermediate",
    bugType: "Embedded",
    estMinutes: 30,
    proOnly: true,
    starterCode: `#include <iostream>
#include <sstream>
#include <vector>
#include <string>
int main() {
    std::vector<int> bytes;
    std::string token;
    while (std::cin >> token) {
        int value = std::stoi(token, nullptr, 16);
        bytes.push_back(value);
    }
    // TODO: validate the frame structure and checksum
    std::cout << "invalid\\n";
    return 0;
}
`,
    detailedInstructions: `Input consists of a single line of space‑separated hex bytes (e.g. 'AA 03 01 02 03 06').

Convert each token to an integer value using base 16.

Verify the header byte is 0xAA and the total length matches 3 + payload length (header + len + payload + checksum).

Sum all payload bytes modulo 256 and compare with the checksum byte.

Print 'valid' or 'invalid' followed by a newline.`,
    objectives: [
      "Read a sequence of hexadecimal byte values from input",
      "Verify that the first byte is the expected start delimiter (0xAA)",
      "Check that the length field matches the number of payload bytes present",
      "Compute the 8‑bit additive checksum of the payload and compare it against the transmitted checksum",
      "Output 'valid' for correct frames or 'invalid' otherwise",
    ],
    hints: [
      "The minimum frame has 3 bytes: header, length and checksum (payload length zero).",
      "Payload starts at index 2 and ends before the last byte (the checksum).",
      "Use bitwise AND 0xFF to constrain the additive sum to 8 bits.",
    ],
    solutionCode: `#include <iostream>
#include <sstream>
#include <vector>
#include <string>
int main() {
    std::vector<int> bytes;
    std::string token;
    while (std::cin >> token) {
        int value = std::stoi(token, nullptr, 16);
        bytes.push_back(value);
    }
    bool valid = false;
    if (bytes.size() >= 3 && bytes[0] == 0xAA) {
        int len = bytes[1];
        if ((int)bytes.size() == 3 + len) {
            int sum = 0;
            for (int i = 2; i < 2 + len; ++i) {
                sum = (sum + bytes[i]) & 0xFF;
            }
            if (sum == bytes.back()) {
                valid = true;
            }
        }
    }
    std::cout << (valid ? "valid" : "invalid") << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "AA 03 01 02 03 06\n", expectedOutput: "valid\n" },
      { input: "AA 02 10 20 31\n", expectedOutput: "invalid\n" },
      { input: "AB 01 00 00\n", expectedOutput: "invalid\n" },
    ],
  },

  // Mini ELF Section Lister
  {
    slug: "mini-elf-section-lister",
    title: "Mini ELF Section Lister",
    summary:
      "Read a simplified ELF‑like input and list the names of its sections. This exercise introduces learners to basic parsing of binary metadata without requiring full ELF parsing knowledge.",
    difficulty: "advanced",
    bugType: "Parsing",
    estMinutes: 40,
    proOnly: true,
    starterCode: `#include <iostream>
#include <vector>
#include <string>
int main() {
    int n;
    std::cin >> n;
    std::cin.ignore();
    // TODO: read n section names and output them
    return 0;
}
`,
    detailedInstructions: `The first line of input contains a single integer N: the number of sections.

Each of the next N lines contains a section name (e.g. '.text').

Read all section names into a container such as std::vector.

Print each section name on its own line in the same order they were read.`,
    objectives: [
      "Accept a count of section names followed by that many names, one per line",
      "Store the names in the order provided",
      "Output the section names exactly as read, preserving leading dots and case",
      "Prepare for more advanced binary parsing by handling multiple lines of input",
    ],
    hints: [
      "Use std::getline to capture full section names including the leading period.",
      "After reading the integer count with std::cin, call std::cin.ignore() to discard the rest of the line.",
      "Iterate over the stored names and print them separated by newlines.",
    ],
    solutionCode: `#include <iostream>
#include <vector>
#include <string>
int main() {
    int n;
    std::cin >> n;
    std::cin.ignore();
    std::vector<std::string> sections;
    for (int i = 0; i < n; ++i) {
        std::string name;
        std::getline(std::cin, name);
        sections.push_back(name);
    }
    for (size_t i = 0; i < sections.size(); ++i) {
        std::cout << sections[i];
        if (i + 1 < sections.size()) std::cout << "\\n";
    }
    return 0;
}
`,
    testCases: [
      { input: "2\n.text\n.data\n", expectedOutput: ".text\n.data" },
      { input: "3\n.text\n.rodata\n.bss\n", expectedOutput: ".text\n.rodata\n.bss" },
      { input: "1\n.init\n", expectedOutput: ".init" },
    ],
  },

  // CRC32 Streaming Hasher
  {
    slug: "crc32-streaming-hasher",
    title: "CRC32 Streaming Hasher",
    summary:
      "Compute an IEEE CRC‑32 checksum incrementally over multiple chunks of data. Learners will implement the standard polynomial and verify their results against known test vectors.",
    difficulty: "intermediate",
    bugType: "Embedded",
    estMinutes: 35,
    proOnly: true,
    starterCode: `#include <iostream>
#include <iomanip>
#include <string>

static uint32_t crc32_byte(uint32_t crc, unsigned char b) {
    crc ^= b;
    for (int i = 0; i < 8; ++i) {
        if (crc & 1) {
            crc = (crc >> 1) ^ 0xEDB88320;
        } else {
            crc >>= 1;
        }
    }
    return crc;
}

int main() {
    int n;
    if (!(std::cin >> n)) return 0;
    std::cin.ignore();
    uint32_t crc = 0xFFFFFFFF;
    for (int i = 0; i < n; ++i) {
        std::string chunk;
        std::getline(std::cin, chunk);
        for (unsigned char c : chunk) {
            // TODO: update CRC for each byte
        }
    }
    crc ^= 0xFFFFFFFF;
    std::cout << "0x" << std::uppercase << std::setfill('0') << std::setw(8) << std::hex << crc << "\\n";
    return 0;
}
`,
    detailedInstructions: `Read an integer N specifying the number of chunks to process.

For each of the N chunks, read the entire line and update the CRC for every character.

Implement a function that updates the CRC one byte at a time using the standard CRC‑32 algorithm.

After all chunks are processed, invert the CRC and print it as '0x' followed by eight uppercase hex digits.`,
    objectives: [
      "Accept a count of chunks followed by that many lines of ASCII text",
      "Maintain a running CRC‑32 value as each chunk is processed",
      "Use the polynomial 0xEDB88320 and initialise the CRC to 0xFFFFFFFF",
      "After processing all chunks, invert the CRC (XOR with 0xFFFFFFFF) and output it in hexadecimal with 8 digits",
    ],
    hints: [
      "Initialise the CRC to 0xFFFFFFFF before processing any data.",
      "For each byte b: update the CRC using crc = (crc >> 1) ^ 0xEDB88320 when the least significant bit is 1.",
      "After processing all bytes, invert the CRC by XORing with 0xFFFFFFFF.",
    ],
    solutionCode: `#include <iostream>
#include <iomanip>
#include <string>

static uint32_t crc32_byte(uint32_t crc, unsigned char b) {
    crc ^= b;
    for (int i = 0; i < 8; ++i) {
        if (crc & 1) {
            crc = (crc >> 1) ^ 0xEDB88320;
        } else {
            crc >>= 1;
        }
    }
    return crc;
}

int main() {
    int n;
    if (!(std::cin >> n)) return 0;
    std::cin.ignore();
    uint32_t crc = 0xFFFFFFFF;
    for (int i = 0; i < n; ++i) {
        std::string chunk;
        std::getline(std::cin, chunk);
        for (unsigned char c : chunk) {
            crc = crc32_byte(crc, c);
        }
    }
    crc ^= 0xFFFFFFFF;
    std::cout << "0x" << std::uppercase << std::setfill('0') << std::setw(8) << std::hex << crc << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "1\nhello\n", expectedOutput: "0x3610A686\n" },
      { input: "2\nabc\ndef\n", expectedOutput: "0x4B8E39EF\n" },
      { input: "3\n\n\n\n", expectedOutput: "0x00000000\n" },
    ],
  },

  // Safe Temporary File Write
  {
    slug: "safe-temp-file-write",
    title: "Safe Temporary File Write",
    summary:
      "Write data to a file safely by first writing to a temporary location and then atomically renaming it. This pattern prevents readers from ever observing a partially written file.",
    difficulty: "intermediate",
    bugType: "I/O",
    estMinutes: 40,
    proOnly: false,
    starterCode: `#include <iostream>
#include <fstream>
#include <string>
int main() {
    std::string path;
    std::getline(std::cin, path);
    std::string content;
    std::getline(std::cin, content);
    // TODO: write content to a temp file and atomically rename
    std::cout << "TODO\\n";
    return 0;
}
`,
    detailedInstructions: `Accept two lines of input: the first is the target filename, the second is the content to write.

Construct a temporary filename by appending '.tmp' to the target name.

Use std::ofstream to write the content to the temporary file and explicitly flush the stream.

Use std::rename to atomically move the temporary file into place, overwriting any existing file.

Open the final file with std::ifstream, read its contents and print them to standard output.`,
    objectives: [
      "Read a target filename and content from input",
      "Write the content to a temporary file (e.g. append '.tmp' to the filename)",
      "Flush and close the temporary file to ensure all data is on disk",
      "Rename the temporary file to the final filename, replacing any existing file",
      "Read the final file back and output its contents as a sanity check",
    ],
    hints: [
      "std::ofstream flushes automatically on destruction, but you can call flush() explicitly for clarity.",
      "Before renaming, remove any existing destination file to avoid rename errors on some platforms.",
      "When reading the file back, you can construct a string using istreambuf_iterator.",
    ],
    solutionCode: `#include <iostream>
#include <fstream>
#include <string>
int main() {
    std::string path;
    std::getline(std::cin, path);
    std::string content;
    std::getline(std::cin, content);
    std::string tempPath = path + ".tmp";
    {
        std::ofstream ofs(tempPath, std::ios::binary);
        ofs << content;
        ofs.flush();
    }
    std::remove(path.c_str());
    std::rename(tempPath.c_str(), path.c_str());
    std::ifstream ifs(path, std::ios::binary);
    std::string out((std::istreambuf_iterator<char>(ifs)), {});
    std::cout << out << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "file1.txt\nhello world\n", expectedOutput: "hello world\n" },
      { input: "out.dat\n12345\n", expectedOutput: "12345\n" },
      { input: "data\n\n", expectedOutput: "\n" },
    ],
  },

  // Pointer Cycle Detection
  {
    slug: "pointer-cycle-detection",
    title: "Pointer Cycle Detection",
    summary:
      "Detect whether a singly linked list contains a cycle using Floyd’s tortoise‑and‑hare algorithm. The list is represented by an array where each element points to the index of the next element or -1 for null.",
    difficulty: "beginner",
    bugType: "Memory",
    estMinutes: 25,
    proOnly: false,
    starterCode: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> next;
    int x;
    while (std::cin >> x) {
        next.push_back(x);
    }
    // TODO: detect cycle using tortoise and hare
    std::cout << "no cycle\\n";
    return 0;
}
`,
    detailedInstructions: `Read all integers from input into a vector called 'next'.

Initialise two indices (tortoise and hare) to 0 (the head).

Move the hare two steps and the tortoise one step in each iteration, checking bounds.

If the hare ever equals the tortoise, a cycle exists; if either index goes out of range or hits -1, there is no cycle.

Output the appropriate message followed by a newline.`,
    objectives: [
      "Parse a list of integers where each value is the next index or -1 for the end",
      "Implement the tortoise‑and‑hare technique to find cycles without extra storage",
      "Stop iteration if an index goes out of bounds",
      "Print 'cycle' when a loop exists and 'no cycle' otherwise",
    ],
    hints: [
      "The hare moves twice as fast as the tortoise.",
      "Check that indices are within the bounds of the array before dereferencing them.",
      "The list may contain a self‑loop at index 0 (next[0] = 0).",
    ],
    solutionCode: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> next;
    int x;
    while (std::cin >> x) {
        next.push_back(x);
    }
    int tortoise = 0;
    int hare = 0;
    bool cycle = false;
    while (true) {
        // move hare one step
        if (hare < 0 || hare >= (int)next.size()) break;
        hare = next[hare];
        if (hare < 0 || hare >= (int)next.size()) break;
        // move hare a second step
        hare = next[hare];
        // move tortoise one step
        tortoise = next[tortoise];
        if (hare == tortoise) {
            cycle = true;
            break;
        }
        if (tortoise < 0 || tortoise >= (int)next.size()) break;
    }
    std::cout << (cycle ? "cycle" : "no cycle") << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "1 2 3 -1\n", expectedOutput: "no cycle\n" },
      { input: "1 2 0\n", expectedOutput: "cycle\n" },
      { input: "0\n", expectedOutput: "cycle\n" },
    ],
  },

  // Endian‑Safe Integer Marshal
  {
    slug: "endian-safe-integer-marshal",
    title: "Endian‑Safe Integer Marshal",
    summary:
      "Serialize and deserialize 16‑bit and 32‑bit integers in a platform‑independent manner. Convert values to big‑endian byte sequences and back to host order.",
    difficulty: "intermediate",
    bugType: "Embedded",
    estMinutes: 30,
    proOnly: false,
    starterCode: `#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <sstream>
int main() {
    std::string op;
    if (!(std::cin >> op)) return 0;
    if (op == "serialize") {
        int bits;
        uint32_t value;
        std::cin >> bits >> value;
        // TODO: output bytes in big‑endian order
    } else if (op == "deserialize") {
        int bits;
        std::cin >> bits;
        std::vector<uint8_t> bytes(bits / 8);
        for (int i = 0; i < bits / 8; ++i) {
            std::string b;
            std::cin >> b;
            bytes[i] = static_cast<uint8_t>(std::stoi(b, nullptr, 16));
        }
        // TODO: reconstruct integer and print it
    }
    return 0;
}
`,
    detailedInstructions: `The first word of input is the operation: 'serialize' or 'deserialize'.

If serializing, read the bit width (16 or 32) and the integer value, then extract bytes using shifts and masks.

If deserializing, read the bit width and the corresponding number of bytes in hex (two characters per byte).

Assemble the bytes into a 32‑bit unsigned integer in host order.

Print the result either as space‑separated hex bytes or as a decimal integer.`,
    objectives: [
      "Support both 'serialize' and 'deserialize' operations based on user input",
      "For serialization, output each byte in hexadecimal, from most significant to least significant",
      "For deserialization, combine big‑endian bytes into an integer and print its decimal value",
      "Handle both 16‑bit and 32‑bit sizes as specified in the input",
    ],
    hints: [
      "For serialization: for a 32‑bit integer v, the bytes are (v >> 24) & 0xFF, then (v >> 16) & 0xFF, then (v >> 8) & 0xFF, then v & 0xFF.",
      "For deserialization: shift the accumulated value left by 8 bits before ORing the next byte.",
      "Use std::hex and std::setw(2) with std::setfill('0') for consistent formatting.",
    ],
    solutionCode: `#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <sstream>
int main() {
    std::string op;
    if (!(std::cin >> op)) return 0;
    if (op == "serialize") {
        int bits;
        uint32_t value;
        std::cin >> bits >> value;
        int bytes = bits / 8;
        for (int i = bytes - 1; i >= 0; --i) {
            uint8_t b = static_cast<uint8_t>(value >> (i * 8));
            std::cout << std::uppercase << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(b);
            if (i > 0) std::cout << " ";
        }
        std::cout << "\\n";
    } else if (op == "deserialize") {
        int bits;
        std::cin >> bits;
        int bytes = bits / 8;
        uint32_t value = 0;
        for (int i = 0; i < bytes; ++i) {
            std::string b;
            std::cin >> b;
            uint8_t val = static_cast<uint8_t>(std::stoi(b, nullptr, 16));
            value = (value << 8) | val;
        }
        std::cout << std::dec << value << "\\n";
    }
    return 0;
}
`,
    testCases: [
      { input: "serialize 16 4660\n", expectedOutput: "12 34\n" },
      { input: "deserialize 32 00 00 00 2A\n", expectedOutput: "42\n" },
      { input: "serialize 32 305419896\n", expectedOutput: "12 34 56 78\n" },
    ],
  },

  // Sandboxed Command Whitelist
  {
    slug: "sandboxed-command-whitelist",
    title: "Sandboxed Command Whitelist",
    summary:
      "Build a tiny command interpreter that only accepts a predefined set of safe commands. Reject any input containing metacharacters or commands not on the whitelist to prevent injection attacks.",
    difficulty: "advanced",
    bugType: "Hardening",
    estMinutes: 35,
    proOnly: true,
    starterCode: `#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

int main() {
    std::string cmd;
    std::getline(std::cin, cmd);

    // Trim
    cmd.erase(cmd.begin(), std::find_if(cmd.begin(), cmd.end(),
        [](unsigned char ch) { return !std::isspace(ch); }));
    cmd.erase(std::find_if(cmd.rbegin(), cmd.rend(),
        [](unsigned char ch) { return !std::isspace(ch); }).base(), cmd.end());

    // Reject obvious metacharacters (avoid raw backtick in this TS literal)
    if (cmd.find_first_of(";&|$>") != std::string::npos || cmd.find('\\x60') != std::string::npos) {
        std::cout << "rejected\\n";
        return 0;
    }

    // Normalize for comparison
    std::transform(cmd.begin(), cmd.end(), cmd.begin(),
        [](unsigned char c) { return static_cast<char>(std::tolower(c)); });

    // Whitelist
    if (cmd == "help" || cmd == "status" || cmd == "version") {
        std::cout << "ok\\n";
    } else {
        std::cout << "rejected\\n";
    }
    return 0;
}
`,

    detailedInstructions: `Define a list of allowed commands: status, start, stop and restart.

Read the entire input line and trim any leading or trailing whitespace.

Check if the line contains any forbidden metacharacters; if so, immediately reject it.

Compare the cleaned command against the whitelist and accept only exact matches.

Print 'accepted' or 'rejected' followed by a newline.`,
    objectives: [
      "Read a single line containing a user command",
      "Normalise the command by trimming whitespace and converting to lowercase",
      "Reject commands containing characters such as ';', '&', '|', '$', '`', or '>' that could be used for injection",
      "Accept only whitelisted commands (e.g. 'status', 'start', 'stop', 'restart')",
      "Output 'accepted' for valid commands or 'rejected' otherwise",
    ],
    hints: [
      "Forbidden characters include shell metacharacters like ';', '&', '|', '$', '`', and '>'.",
      "Convert the command to lowercase to perform a case‑insensitive comparison.",
      "Use std::string::find_first_of to search for any forbidden character in the input.",
    ],
    solutionCode: `#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>
#include <unordered_set>

int main() {
    std::string cmd;
    std::getline(std::cin, cmd);

    // Trim
    cmd.erase(cmd.begin(), std::find_if(cmd.begin(), cmd.end(),
        [](unsigned char ch) { return !std::isspace(ch); }));
    cmd.erase(std::find_if(cmd.rbegin(), cmd.rend(),
        [](unsigned char ch) { return !std::isspace(ch); }).base(), cmd.end());

    // Reject obvious metacharacters (avoid raw backtick in this TS literal)
    if (cmd.find_first_of(";&|$>") != std::string::npos || cmd.find('\\x60') != std::string::npos) {
        std::cout << "rejected\\n";
        return 0;
    }

    // Lowercase & strict whitelist
    std::transform(cmd.begin(), cmd.end(), cmd.begin(),
        [](unsigned char c) { return static_cast<char>(std::tolower(c)); });

    static const std::unordered_set<std::string> allowed{
        "help", "status", "version"
    };

    if (allowed.count(cmd)) {
        std::cout << "ok\\n";
    } else {
        std::cout << "rejected\\n";
    }
    return 0;
}
`,

    testCases: [
      { input: "status\n", expectedOutput: "accepted\n" },
      { input: "start && rm -rf /\n", expectedOutput: "rejected\n" },
      { input: "reboot\n", expectedOutput: "rejected\n" },
    ],
  },

  // Stack‑Guard Verification
  {
    slug: "stack-guard-verification",
    title: "Stack‑Guard Verification",
    summary:
      "Simulate stack canary verification by checking whether a payload would overwrite a buffer.",
    difficulty: "intermediate",
    bugType: "Hardening",
    estMinutes: 25,
    proOnly: true,
    starterCode: `#include <iostream>
int main() {
    int n, l;
    std::cin >> n >> l;
    // TODO: determine if the payload overflows the buffer
    std::cout << "ok\\n";
    return 0;
}
`,
    detailedInstructions: `Parse two integers from input: N (buffer size) and L (payload length).

If L is greater than N, output 'overflow'.

Otherwise, output 'ok'.

No actual memory manipulation is required; this is a conceptual exercise.`,
    objectives: [
      "Read a buffer size and a payload length from input",
      "Compare the payload length against the buffer size to detect overflow",
      "Print 'overflow' when the payload would overwrite the canary and 'ok' otherwise",
      "Treat payload length equal to the buffer size as safe in this simplified model",
    ],
    hints: [
      "This lab abstracts away the implementation details of stack guards and focuses on the arithmetic.",
      "Compare L and N directly.",
      "Do not treat L equal to N as overflow in this exercise.",
    ],
    solutionCode: `#include <iostream>
int main() {
    int n, l;
    std::cin >> n >> l;
    if (l > n) {
        std::cout << "overflow\n";
    } else {
        std::cout << "ok\n";
    }
    return 0;
}
`,
    testCases: [
      { input: "16 12\n", expectedOutput: "ok\n" },
      { input: "16 17\n", expectedOutput: "overflow\n" },
      { input: "8 8\n", expectedOutput: "ok\n" },
    ],
  },

  // Deterministic Tokenizer
  {
    slug: "deterministic-tokenizer",
    title: "Deterministic Tokenizer",
    summary:
      "Implement a simple tokenizer for arithmetic expressions that recognises identifiers, integers and operators while ignoring whitespace and single‑line comments.",
    difficulty: "intermediate",
    bugType: "Parsing",
    estMinutes: 35,
    proOnly: false,
    starterCode: `#include <iostream>
#include <string>
#include <cctype>
int main() {
    std::string line;
    std::getline(std::cin, line);
    // TODO: implement the tokenizer
    return 0;
}
`,
    detailedInstructions: `Scan the input string from left to right.

If you encounter '/' followed by '/', stop processing the rest of the line as it is a comment.

Use std::isalpha and std::isdigit to distinguish identifiers and integers.

Operators are +, -, *, /, (, ), and =; map them to the token names PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EQUAL.

Print each token on its own line exactly as specified.`,
    objectives: [
      "Read a single line of input containing an expression",
      "Skip over whitespace characters",
      "Detect and skip the rest of the line if a '//' comment is encountered",
      "Recognise identifiers (letter followed by letters/digits/underscores) and integers (digits only)",
      "Output one token per line in the format 'IDENT:name', 'INT:value', or the operator name (PLUS, MINUS, MUL, DIV, LPAREN, RPAREN, EQUAL)",
    ],
    hints: [
      "When building identifiers, continue consuming characters while they are alphanumeric or underscores.",
      "For integers, consume consecutive digits and convert them to an integer value if needed.",
      "Be sure to break out of the loop when you encounter a comment indicator.",
    ],
    solutionCode: `#include <iostream>
#include <string>
#include <cctype>
int main() {
    std::string line;
    std::getline(std::cin, line);
    for (size_t i = 0; i < line.size(); ) {
        if (i + 1 < line.size() && line[i] == '/' && line[i + 1] == '/') {
            break;
        }
        char c = line[i];
        if (std::isspace(static_cast<unsigned char>(c))) {
            ++i;
            continue;
        }
        if (std::isalpha(static_cast<unsigned char>(c)) || c == '_') {
            std::string ident;
            while (i < line.size() && (std::isalnum(static_cast<unsigned char>(line[i])) || line[i] == '_')) {
                ident.push_back(line[i]);
                ++i;
            }
            std::cout << "IDENT:" << ident << "\\n";
            continue;
        }
        if (std::isdigit(static_cast<unsigned char>(c))) {
            std::string num;
            while (i < line.size() && std::isdigit(static_cast<unsigned char>(line[i]))) {
                num.push_back(line[i]);
                ++i;
            }
            std::cout << "INT:" << num << "\\n";
            continue;
        }
        switch (c) {
            case '+': std::cout << "PLUS\n"; break;
            case '-': std::cout << "MINUS\n"; break;
            case '*': std::cout << "MUL\n"; break;
            case '/': std::cout << "DIV\n"; break;
            case '(': std::cout << "LPAREN\n"; break;
            case ')': std::cout << "RPAREN\n"; break;
            case '=': std::cout << "EQUAL\n"; break;
            default: break;
        }
        ++i;
    }
    return 0;
}
`,
    testCases: [
      { input: "sum = a + 12\n", expectedOutput: "IDENT:sum\nEQUAL\nIDENT:a\nPLUS\nINT:12\n" },
      { input: "(x-1)*y\n", expectedOutput: "LPAREN\nIDENT:x\nMINUS\nINT:1\nRPAREN\nMUL\nIDENT:y\n" },
      { input: "val/2 // half value\n", expectedOutput: "IDENT:val\nDIV\nINT:2\n" },
    ],
  },

  // Monotonic Timer Scheduler
  {
    slug: "monotonic-timer-scheduler",
    title: "Monotonic Timer Scheduler",
    summary:
      "Implement a tick‑driven scheduler that ensures tasks fire at monotonic intervals without drift by rounding deadlines up to the nearest tick multiple.",
    difficulty: "intermediate",
    bugType: "Embedded",
    estMinutes: 30,
    proOnly: false,
    starterCode: `#include <iostream>
#include <vector>
int main() {
    int tick;
    std::cin >> tick;
    std::vector<int> tasks;
    int t;
    while (std::cin >> t) {
        tasks.push_back(t);
    }
    // TODO: compute and print scheduled times
    return 0;
}
`,
    detailedInstructions: `The first line contains an integer T representing the scheduler’s tick period.

Subsequent values are task deadlines; read until end of input.

For each deadline d, compute ceil(d / T) * T. If d is exactly divisible by T, keep d unchanged.

Print the resulting scheduled times separated by a single space and end with a newline.`,
    objectives: [
      "Read the tick period (in milliseconds) from input",
      "Read a list of task deadlines in milliseconds",
      "Compute the first tick at or after each deadline by rounding up to the nearest multiple of the tick period",
      "Output the scheduled times separated by spaces on a single line",
    ],
    hints: [
      "Use integer arithmetic: ((d + T - 1) / T) * T will compute the ceiling multiple.",
      "A deadline of 0 should schedule at time 0.",
      "All input values are non‑negative integers.",
    ],
    solutionCode: `#include <iostream>
#include <vector>
int main() {
    int tick;
    std::cin >> tick;
    std::vector<int> tasks;
    int t;
    while (std::cin >> t) {
        tasks.push_back(t);
    }
    for (size_t i = 0; i < tasks.size(); ++i) {
        int d = tasks[i];
        int sched = ((d + tick - 1) / tick) * tick;
        if (d % tick == 0) sched = d;
        std::cout << sched;
        if (i + 1 < tasks.size()) std::cout << " ";
    }
    std::cout << "\\n";
    return 0;
}
`,
    testCases: [
      { input: "100\n250 450\n", expectedOutput: "300 500\n" },
      { input: "50\n20 70 130\n", expectedOutput: "50 100 150\n" },
      { input: "200\n0 50 200\n", expectedOutput: "0 200 200\n" },
    ],
  },
];