const C_TEMPLATE = `#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`;

const CPP_TEMPLATE = `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`;

export type Language = 'c' | 'cpp';

export function getDefaultSource(lang: Language, slug: string): string {
  // Could customize per puzzle slug in the future
  return lang === 'c' ? C_TEMPLATE : CPP_TEMPLATE;
}

export function storageKey({
  slug,
  userId,
  lang,
}: {
  slug: string;
  userId: string | null;
  lang: Language;
}): string {
  const userPart = userId || 'anon';
  return `curecee:puzzle:${slug}:${userPart}:${lang}`;
}

let saveTimeout: NodeJS.Timeout | null = null;

export function debouncedSave(key: string, value: string, delay = 400): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    localStorage.setItem(key, value);
  }, delay);
}
