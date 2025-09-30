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
    modules: 8,
    estMinutes: 240,
    proOnly: false
  },
  {
    slug: "memory-and-lifetimes",
    title: "Memory & Lifetimes",
    summary: "Master memory management, pointer safety, and object lifetime rules.",
    difficulty: "intermediate",
    modules: 12,
    estMinutes: 360,
    proOnly: false
  },
  {
    slug: "concurrency-and-race-freedom",
    title: "Concurrency & Race Freedom",
    summary: "Advanced threading, synchronization, and race-condition prevention.",
    difficulty: "advanced",
    modules: 10,
    estMinutes: 420,
    proOnly: true
  }
];
