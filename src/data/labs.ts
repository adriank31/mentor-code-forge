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
    summary: "Fix an off-by-one error in a bounded string copy operation.",
    difficulty: "beginner",
    bugType: "Memory",
    estMinutes: 20,
    proOnly: false,
    starterCode: `#include <stdio.h>
#include <string.h>

void copy_string(char* dest, const char* src, size_t n) {
  // Bug: off-by-one in strncpy
  strncpy(dest, src, n);
}

int main() {
  char buf[10];
  copy_string(buf, "Hello World!", 10);
  printf("%s\\n", buf);
  return 0;
}`
  },
  {
    slug: "use-after-free",
    title: "Use-After-Free Vulnerability",
    summary: "Detect and fix a dangling pointer bug after memory deallocation.",
    difficulty: "intermediate",
    bugType: "Memory",
    estMinutes: 30,
    proOnly: false,
    starterCode: `#include <stdlib.h>

typedef struct {
  int* data;
} Container;

void process(Container* c) {
  free(c->data);
  // Bug: use-after-free
  *c->data = 42;
}

int main() {
  Container c;
  c.data = malloc(sizeof(int));
  process(&c);
  return 0;
}`
  },
  {
    slug: "race-condition-counter",
    title: "Race Condition on Shared Counter",
    summary: "Fix non-atomic increment operations causing race conditions.",
    difficulty: "advanced",
    bugType: "Concurrency",
    estMinutes: 40,
    proOnly: true,
    starterCode: `#include <pthread.h>

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
  return 0;
}`
  }
];
