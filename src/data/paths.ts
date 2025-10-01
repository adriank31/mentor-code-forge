export interface Path {
  slug: string;
  title: string;
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  modules: number;
  estMinutes: number;
  proOnly: boolean;
}

export const paths: Path[] = [
  {
    slug: "foundations-safe-basics",
    title: "Foundations: Safe Basics",
    summary: "Learn the fundamentals of writing secure C/C++ code from the ground up.",
    difficulty: "beginner",
    modules: 3,
    estMinutes: 240,
    proOnly: false
  },
  {
    slug: "memory-and-lifetimes",
    title: "Memory & Lifetimes",
    summary: "Master memory management, pointer safety, and object lifetime rules.",
    difficulty: "intermediate",
    modules: 3,
    estMinutes: 360,
    proOnly: true
  },
  {
    slug: "concurrency-and-race-freedom",
    title: "Concurrency & Race Freedom",
    summary: "Advanced threading, synchronization, and race-condition prevention.",
    difficulty: "advanced",
    modules: 3,
    estMinutes: 420,
    proOnly: true
  },
  {
    slug: "file-parsing-and-robust-io",
    title: "File Parsing & Robust I/O",
    summary: "Handle partial reads/writes, parse untrusted input safely, and prevent buffer overflows.",
    difficulty: "intermediate",
    modules: 3,
    estMinutes: 300,
    proOnly: false
  },
  {
    slug: "hardening-and-fuzzing",
    title: "Hardening & Fuzzing",
    summary: "Exploit prevention, fuzzing techniques, and security hardening.",
    difficulty: "advanced",
    modules: 3,
    estMinutes: 480,
    proOnly: true
  }
];
