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
    proOnly: true
  },
  {
    slug: "concurrency-and-race-freedom",
    title: "Concurrency & Race Freedom Course",
    summary: "Master multithreading, mutexes, atomics, and lock-free patterns.",
    difficulty: "advanced",
    lessons: 28,
    estMinutes: 720,
    proOnly: true
  },
  {
    slug: "file-parsing-and-robust-io",
    title: "File Parsing & Robust I/O Course",
    summary: "Safe input handling, parsing techniques, and preventing buffer overflows.",
    difficulty: "intermediate",
    lessons: 26,
    estMinutes: 560,
    proOnly: false
  },
  {
    slug: "hardening-and-fuzzing",
    title: "Hardening & Fuzzing Course",
    summary: "Advanced security hardening, fuzzing, and exploit prevention.",
    difficulty: "advanced",
    lessons: 30,
    estMinutes: 680,
    proOnly: true
  }
];
