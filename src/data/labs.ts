export interface Lab {
  slug: string;
  title: string;
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  bugType: "Memory" | "Concurrency" | "I/O" | "Parsing" | "Hardening";
  estMinutes: number;
  proOnly: boolean;
  starterCode?: string;
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
}`
  },
  {
    slug: "use-after-free",
    title: "Use-After-Free Vulnerability",
    summary: "A pointer is freed, but still used later causing undefined behavior. Trigger the use-after-free, then fix by nulling pointers or refactoring ownership so no dangling pointers remain.",
    difficulty: "intermediate",
    bugType: "Memory",
    estMinutes: 35,
    proOnly: false,
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
  },
  {
    slug: "partial-io-read",
    title: "Partial I/O Read Handling",
    summary: "When read() returns fewer bytes than requested, code fails to loop to read the remainder, causing buffer gaps. Provide input to produce short reads, then patch by handling partial reads properly.",
    difficulty: "intermediate",
    bugType: "I/O",
    estMinutes: 40,
    proOnly: false,
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
}`
  },
  {
    slug: "parsing-bug-exploit",
    title: "Input Parsing Vulnerability",
    summary: "A simple data parser fails to validate input length or bounds, allowing crafted input that triggers out-of-bounds or memory corruption. Patch the parser with bounds checks, length validations, and proper error handling.",
    difficulty: "intermediate",
    bugType: "Parsing",
    estMinutes: 45,
    proOnly: false,
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
}`
  }
];
