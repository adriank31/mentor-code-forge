export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // 'a', 'b', 'c', or 'd'
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "challenge";
  duration: number; // minutes
  content?: {
    markdown?: string;
    quiz?: QuizQuestion[];
    code?: {
      language: string;
      starter: string;
      solution: string;
      tests?: string;
    };
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface PathModules {
  [pathSlug: string]: Module[];
}

import { foundationsSafeBasicsModules } from "./paths/foundationsSafeBasics";
import { memoryLifetimesModules } from "./paths/memoryLifetimes";
import { concurrencyRaceFreedomModules } from "./paths/concurrencyRaceFreedom";
import { fileParsingIOModules } from "./paths/fileParsingIO";
import { hardeningFuzzingModules } from "./paths/hardeningFuzzing";

export const pathModules: PathModules = {
  "foundations-safe-basics": foundationsSafeBasicsModules,
  "memory-and-lifetimes": memoryLifetimesModules,
  "concurrency-and-race-freedom": concurrencyRaceFreedomModules,
  "file-parsing-and-robust-io": fileParsingIOModules,
  "hardening-and-fuzzing": hardeningFuzzingModules,
};
