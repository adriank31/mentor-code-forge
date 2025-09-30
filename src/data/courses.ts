export interface Course {
  slug: string;
  title: string;
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  lessons: number;
  estMinutes: number;
  proOnly: boolean;
}

export const courses: Course[] = [
  {
    slug: "foundations-safe-basics",
    title: "Foundations: Safe Basics Course",
    summary: "Comprehensive course covering secure C/C++ fundamentals.",
    difficulty: "beginner",
    lessons: 24,
    estMinutes: 480,
    proOnly: false
  },
  {
    slug: "memory-and-lifetimes",
    title: "Memory & Lifetimes Course",
    summary: "Deep dive into memory safety, RAII, and smart pointers.",
    difficulty: "intermediate",
    lessons: 32,
    estMinutes: 640,
    proOnly: false
  },
  {
    slug: "concurrency-and-race-freedom",
    title: "Concurrency & Race Freedom Course",
    summary: "Master multithreading, mutexes, atomics, and lock-free patterns.",
    difficulty: "advanced",
    lessons: 28,
    estMinutes: 720,
    proOnly: true
  }
];
