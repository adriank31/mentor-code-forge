export interface Lab {
  slug: string;
  title: string;
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  bugType: "Memory" | "Concurrency" | "I/O" | "Parsing" | "Hardening";
  estMinutes: number;
  proOnly: boolean;
  starterCode?: string;
  detailedInstructions?: string;
  objectives?: string[];
  hints?: string[];
  solutionCode?: string;
  testCriteria?: string[];
  expectedBehavior?: string;
}

export const labs: Lab[] = [
  {
    slug: "buffer-overflow-strcpy",
    title: "Buffer Overflow in String Copy",
    summary: "Given a vulnerable C function that uses strcpy, exploit input that overruns the buffer. Then patch the code to use safe bounds-checked copying (e.g. strncpy or explicit length checks).",
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
  printf("%s\\n", buf);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a classic buffer overflow vulnerability using the unsafe strcpy function.

The vulnerable code allocates a 10-byte buffer but attempts to copy a much longer string into it. This causes memory corruption beyond the buffer boundaries, potentially overwriting adjacent memory.

Your task is to identify the vulnerability, understand its impact, and implement a secure fix using bounds-checked string operations.`,
    objectives: [
      "Identify the unsafe strcpy usage and understand why it's dangerous",
      "Understand how buffer overflows can lead to memory corruption",
      "Replace strcpy with a safe alternative like strncpy or snprintf",
      "Implement proper bounds checking to prevent buffer overflows",
      "Test your fix to ensure it handles both normal and edge cases"
    ],
    hints: [
      "The strcpy function doesn't check if the destination buffer is large enough",
      "Consider using strncpy with the buffer size as the third parameter",
      "Remember to null-terminate the string after using strncpy",
      "Alternatively, you can use snprintf for safer string formatting",
      "Always validate input length before copying to fixed-size buffers"
    ],
    solutionCode: `#include <stdio.h>
#include <string.h>

void copy_string(char* dest, const char* src, size_t dest_size) {
  // Safe: bounds-checked copy
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
      "Strings are properly null-terminated",
      "Function accepts buffer size as a parameter",
      "Handles edge cases like empty strings and maximum-length strings"
    ],
    expectedBehavior: "The program should safely truncate strings that are too long for the buffer, preventing memory corruption while maintaining proper null termination."
  },
  {
    slug: "use-after-free",
    title: "Use-After-Free Vulnerability",
    summary: "A pointer is freed, but still used later causing undefined behavior. Trigger the use-after-free, then fix by nulling pointers or refactoring ownership so no dangling pointers remain.",
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
  // Bug: use-after-free
  printf("Data: %d\\n", *c->data);
}

int main() {
  Container c;
  c.data = malloc(sizeof(int));
  *c.data = 42;
  process(&c);
  return 0;
}`,
    detailedInstructions: `This lab demonstrates a use-after-free vulnerability, one of the most dangerous memory bugs in C/C++.

The code frees memory through c->data but then immediately tries to read from that freed memory. This results in undefined behavior - the program might crash, read garbage values, or appear to work temporarily.

Use-after-free bugs are particularly dangerous because:
- Memory allocators may reuse freed memory for other purposes
- Attackers can potentially control the freed memory contents
- The bug may not manifest consistently, making it hard to debug
- Security exploits often leverage these for arbitrary code execution

Your task is to identify the dangling pointer, understand the vulnerability, and implement proper lifetime management.`,
    objectives: [
      "Understand what happens when freed memory is accessed",
      "Identify the use-after-free in the process() function",
      "Learn proper pointer lifetime management techniques",
      "Implement a fix using pointer nullification",
      "Alternatively, refactor to avoid early deallocation",
      "Verify the fix prevents undefined behavior"
    ],
    hints: [
      "The problem occurs because c->data is used after being freed",
      "One solution: Set c->data = NULL immediately after freeing",
      "Another solution: Move the free() call after the printf()",
      "Best practice: Check for NULL before dereferencing pointers",
      "Consider: Who owns the memory and when should it be freed?",
      "Valgrind or AddressSanitizer can detect use-after-free bugs"
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
      "No use-after-free occurs",
      "Memory is properly freed exactly once",
      "Pointers are set to NULL after freeing",
      "Code includes null pointer checks",
      "Passes AddressSanitizer/Valgrind without errors"
    ],
    expectedBehavior: "The program should safely print the data value and then free the memory, with pointers properly nullified to prevent accidental reuse."
  },
  {
    slug: "double-free",
    title: "Double Free Vulnerability",
    summary: "In error-handling logic, the same memory is freed twice under certain conditions. Build a reproduction, then patch with safe guards, reference counting, or avoidance of duplicate frees.",
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
    detailedInstructions: `This lab demonstrates a double-free vulnerability, where the same memory is freed multiple times.

The cleanup() function has flawed error-handling logic. When error is true, it frees the pointer, but then unconditionally frees it again at the end of the function. This corrupts the heap's internal data structures.

Double-free vulnerabilities are serious because:
- They corrupt the memory allocator's internal state
- Can lead to crashes or arbitrary code execution
- Often occur in complex error-handling paths
- May be exploitable for security attacks

Your task is to identify the double-free condition and implement proper cleanup logic.`,
    objectives: [
      "Understand the consequences of freeing memory twice",
      "Trace the execution path that leads to double-free",
      "Recognize common error-handling patterns that cause this bug",
      "Implement proper guards to prevent double-free",
      "Use pointer nullification as a defensive measure",
      "Test both error and non-error paths"
    ],
    hints: [
      "The double-free happens when error is non-zero (true)",
      "After freeing a pointer, set it to NULL to make subsequent frees safe",
      "Use else statement to ensure only one free() path executes",
      "free(NULL) is safe and does nothing in C",
      "Consider restructuring the function to have a single exit point",
      "Tools like AddressSanitizer can detect double-free at runtime"
    ],
    solutionCode: `#include <stdlib.h>
#include <stdio.h>

void cleanup(int** ptr, int error) {
  if (*ptr) {
    free(*ptr);
    *ptr = NULL; // Prevent double-free
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
  
  // Safe to call again - will do nothing
  cleanup(&data, 0);
  
  return 0;
}`,
    testCriteria: [
      "Memory is freed exactly once regardless of error flag",
      "Pointers are set to NULL after freeing",
      "Multiple cleanup calls don't cause crashes",
      "Both error=0 and error=1 paths work correctly",
      "No memory leaks or corruption detected by sanitizers"
    ],
    expectedBehavior: "The program should safely free memory exactly once, with the pointer nullified to prevent any subsequent double-free attempts."
  },
  {
    slug: "integer-overflow-allocation",
    title: "Integer Overflow in Allocation",
    summary: "A size calculation wraps due to integer overflow, causing allocation of a smaller buffer. Exploit this to cause overflow/write, then patch by checking multiplication overflow before allocation.",
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

When count * size overflows, the multiplication wraps around to a small value. For example, 0x80000000 * 2 = 0x100000000, which wraps to 0 on 32-bit systems. malloc(0) may return a small buffer, but the code then writes far beyond it.

This vulnerability is particularly dangerous because:
- It bypasses size checks that appear correct
- Attackers can trigger arbitrary heap corruption
- The bug may only manifest on specific architectures
- It's a common pattern in real-world exploits

Your task is to detect integer overflow before it causes allocation of an undersized buffer.`,
    objectives: [
      "Understand how integer overflow can wrap size calculations",
      "Recognize why count * size is dangerous without checks",
      "Learn techniques to detect multiplication overflow",
      "Implement safe allocation with overflow detection",
      "Consider architecture-specific size_t ranges",
      "Test with edge cases near SIZE_MAX"
    ],
    hints: [
      "Check if count > SIZE_MAX / size before multiplying",
      "This prevents overflow: if (size && count > SIZE_MAX / size) return NULL;",
      "SIZE_MAX is defined in <stdint.h>",
      "Alternatively, check if (count * size) / size != count after multiplication",
      "Consider using builtin functions like __builtin_mul_overflow if available",
      "Zero-size allocations should be handled explicitly"
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
  
  // Also check for zero-size edge case
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
      "Works correctly on both 32-bit and 64-bit systems",
      "No false positives on valid large allocations"
    ],
    expectedBehavior: "The program should detect the integer overflow condition and safely reject the allocation, preventing heap corruption."
  },
  {
    slug: "race-condition-counter",
    title: "Race Condition on Shared Counter",
    summary: "Multiple threads increment a shared counter non-atomically. Reproduce data race (lost updates) and patch by using proper synchronization primitives or atomic operations.",
    difficulty: "advanced",
    bugType: "Concurrency",
    estMinutes: 50,
    proOnly: true,
    starterCode: `#include <pthread.h>
#include <stdio.h>

int counter = 0;

void* increment(void* arg) {
  for (int i = 0; i < 100000; i++) {
    // Bug: non-atomic increment
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
- Thread 1 reads counter=5
- Thread 2 reads counter=5
- Thread 1 writes counter=6
- Thread 2 writes counter=6 (lost update!)

Expected final value: 200,000. Actual value: unpredictable, likely much less due to lost updates.

Your task is to fix this race condition using proper synchronization.`,
    objectives: [
      "Understand why counter++ is not atomic",
      "Observe lost updates by running the program multiple times",
      "Learn about data races and their consequences",
      "Implement synchronization using mutexes or atomic operations",
      "Compare performance of different synchronization approaches",
      "Verify correctness with ThreadSanitizer"
    ],
    hints: [
      "counter++ compiles to: load, add, store - three separate operations",
      "Use pthread_mutex_t to protect critical sections",
      "Alternatively, use C11 atomic_int with atomic_fetch_add",
      "With atomics: #include <stdatomic.h> and atomic_int counter = 0;",
      "atomic_fetch_add(&counter, 1) is lock-free and faster than mutexes",
      "Run with -fsanitize=thread to detect data races at runtime"
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
      "No deadlocks or livelocks occur"
    ],
    expectedBehavior: "The program should reliably produce a counter value of 200,000, with all increments properly synchronized and no lost updates."
  },
  {
    slug: "format-string-vulnerability",
    title: "Format String Vulnerability",
    summary: "User input is passed directly into printf() as format string. Exploit this to read or write arbitrary memory, then fix by using printf(\"%s\", input) or validating/sanitizing the format.",
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
    detailedInstructions: `This lab demonstrates a format string vulnerability, a critical security issue where user-controlled input is used as a printf format string.

When printf(msg) is called with user input, attackers can inject format specifiers like %x, %n, %s to:
- Read arbitrary stack memory with %x or %s
- Write to arbitrary memory locations with %n
- Crash the program with invalid specifiers
- Potentially achieve code execution

Try running with inputs like:
- "%x %x %x" - dumps stack contents
- "%s" - may crash by dereferencing arbitrary memory
- "%n" - writes to memory (dangerous!)

Your task is to fix the vulnerability by properly handling user input.`,
    objectives: [
      "Understand how printf interprets format specifiers",
      "Recognize why user input should never be a format string",
      "Demonstrate reading stack memory using format specifiers",
      "Implement proper input sanitization",
      "Use safe printf patterns that treat input as data",
      "Validate fix against various exploit attempts"
    ],
    hints: [
      "Never call printf(user_input) directly",
      "Use printf(\"%s\", user_input) to treat input as data, not format",
      "The %s format treats the argument as a string, not a format string",
      "Alternatively, use fputs() which doesn't interpret format specifiers",
      "Consider using puts() for simple string output",
      "Compile with -Wformat-security to catch these issues"
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
      "Compiles without warnings with -Wformat-security"
    ],
    expectedBehavior: "The program should safely print user input as literal text, without interpreting any format specifiers, preventing all format string attacks."
  },
  {
    slug: "heap-buffer-overflow",
    title: "Heap Buffer Overflow",
    summary: "A malloc-allocated buffer is overrun using memcpy or indexed write. Trigger overflow, then patch via bounds checks, safer memory allocation, or use of safer container types.",
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
- They corrupt heap structures used by malloc/free
- Can overwrite other heap objects' data
- May be exploitable for arbitrary code execution
- Often harder to detect than stack overflows

Your task is to add proper bounds checking to prevent the overflow.`,
    objectives: [
      "Understand the difference between allocated size and copy size",
      "Recognize that heap corruption may not crash immediately",
      "Learn to validate size parameters before copying",
      "Implement dynamic allocation based on actual data size",
      "Add proper error handling for allocation failures",
      "Use AddressSanitizer to detect heap corruption"
    ],
    hints: [
      "The buffer is only 10 bytes but 26 bytes are being copied",
      "Allocate buf based on the actual length: malloc(len + 1)",
      "Always check if malloc returns NULL (allocation failure)",
      "Use size_t consistently for buffer sizes",
      "Consider adding a maximum size limit for safety",
      "Run with -fsanitize=address to detect heap overflows"
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
  
  // Now copy is safe - buffer is exactly the right size
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
      "Properly manages memory lifecycle"
    ],
    expectedBehavior: "The program should allocate appropriately sized buffers and safely copy data without overflowing heap boundaries or corrupting adjacent memory."
  },
  {
    slug: "null-pointer-deref",
    title: "Null Pointer Dereference",
    summary: "Under certain error branches, a null pointer is dereferenced. Reproduce null deref crash, then patch by adding defensive null checks or early exits.",
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
- They cause immediate program crashes
- Can lead to denial of service in production systems
- May mask other bugs by crashing before they're detected
- In some cases, can be exploited for security attacks

Your task is to add proper null pointer checks to handle allocation failures gracefully.`,
    objectives: [
      "Understand when and why functions return NULL",
      "Recognize the importance of checking return values",
      "Learn defensive programming with null checks",
      "Implement proper error handling for allocation failures",
      "Distinguish between NULL checks and other validations",
      "Write resilient code that handles failures gracefully"
    ],
    hints: [
      "Check if data is NULL before dereferencing it",
      "Use if (!data) to check for NULL",
      "Alternatively: if (data == NULL)",
      "Print an error message when allocation fails",
      "Return non-zero exit code on error",
      "Consider: Should allocate_data print its own error message?"
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
      "Returns non-zero exit code on failure",
      "Frees allocated memory in success path",
      "Works correctly when should_fail is 0 or 1"
    ],
    expectedBehavior: "The program should check for NULL pointers, print an informative error message when allocation fails, and exit gracefully without crashing."
  },
  {
    slug: "partial-io-read",
    title: "Partial I/O Read Handling",
    summary: "When read() returns fewer bytes than requested, code fails to loop to read the remainder, causing buffer gaps. Provide input to produce short reads, then patch by handling partial reads properly.",
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
- Network packet boundaries
- Signal interruptions (EINTR)
- Available data in buffers
- Terminal input characteristics

The vulnerable code assumes read() returns all 100 bytes, but it might return 10, then 20, then 30, etc. This leaves uninitialized gaps in the buffer and causes data corruption.

Your task is to implement proper partial read handling with a loop.`,
    objectives: [
      "Understand that read() may return less than requested",
      "Learn the conditions that cause short reads",
      "Implement a loop to handle partial reads correctly",
      "Handle error conditions like EINTR appropriately",
      "Distinguish between EOF, errors, and short reads",
      "Write robust I/O code that handles all edge cases"
    ],
    hints: [
      "read() returns the number of bytes actually read, not requested",
      "Use a loop: while (total < count) to read remaining bytes",
      "Check for errors: if (n == -1 && errno == EINTR) continue;",
      "EOF is indicated by read() returning 0",
      "Update buffer pointer: buf + total for next read",
      "Keep track of total bytes read across iterations"
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
      "Works with various input sizes and patterns"
    ],
    expectedBehavior: "The program should read all available data by looping until the full count is reached or EOF is encountered, handling interruptions and errors gracefully."
  },
  {
    slug: "parsing-bug-exploit",
    title: "Input Parsing Vulnerability",
    summary: "A simple data parser fails to validate input length or bounds, allowing crafted input that triggers out-of-bounds or memory corruption. Patch the parser with bounds checks, length validations, and proper error handling.",
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
- Network protocol parsers
- File format handlers
- Deserialization code
- Binary data processors

The vulnerability allows attackers to:
- Overflow stack or heap buffers
- Corrupt adjacent data structures
- Potentially execute arbitrary code
- Cause crashes or undefined behavior

Your task is to add proper bounds validation before trusting untrusted input.`,
    objectives: [
      "Understand the danger of trusting attacker-controlled length fields",
      "Recognize integer-based vulnerabilities in parsing",
      "Learn to validate all inputs before use",
      "Implement bounds checking for length fields",
      "Handle invalid packets with proper error reporting",
      "Test parser against malformed and malicious inputs"
    ],
    hints: [
      "Validate pkt.length before using it: if (pkt.length > 64)",
      "Also check for negative lengths if using signed integers",
      "Consider: Can length be larger than the input buffer?",
      "Return error codes or use exceptions for invalid packets",
      "Add sanity checks: length should be reasonable, not huge",
      "Fuzz test your parser with random malformed inputs"
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
      "No buffer overflows with malicious inputs"
    ],
    expectedBehavior: "The parser should validate all length fields against buffer sizes, reject malicious packets with appropriate error messages, and never allow buffer overflows."
  }
];
