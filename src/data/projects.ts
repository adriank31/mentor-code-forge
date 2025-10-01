export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  deliverables: string[];
}

export interface Project {
  slug: string;
  title: string;
  role: "Embedded" | "Systems" | "Firmware" | "Security" | "Toolchain";
  difficulty: "beginner" | "intermediate" | "advanced";
  estMinutes: number;
  summary: string;
  detailedRequirements?: string;
  technicalSpecifications?: string[];
  tags: string[];
  outcomes: string[];
  acceptanceCriteria: string[];
  starterFiles?: string[];
  starterCodeUrl?: string;
  milestones?: ProjectMilestone[];
  proOnly: boolean;
}

export const projects: Project[] = [
  {
    slug: "atomic-waker",
    title: "Lock-Free Waker Implementation",
    role: "Systems",
    difficulty: "advanced",
    estMinutes: 90,
    summary: "Implement a minimal lock-free waker so worker threads can sleep and be woken without using a heavy mutex.",
    detailedRequirements: "Build a lock-free waker mechanism that allows worker threads to efficiently sleep when idle and wake when work arrives. The implementation must handle race conditions, prevent lost wakeups, and avoid the ABA problem. Use atomic operations with appropriate memory ordering to ensure correctness on weakly-ordered architectures.",
    technicalSpecifications: [
      "Use C11 atomic operations or C++11 std::atomic",
      "Implement wake() and wait() operations",
      "Handle spurious wakeups gracefully",
      "Prevent lost wakeup and thundering herd scenarios",
      "Memory ordering: acquire-release semantics minimum",
      "Must pass ThreadSanitizer and UndefinedBehaviorSanitizer"
    ],
    tags: ["atomics", "memory-order", "CAS", "ABA"],
    outcomes: [
      "Use atomics correctly",
      "Avoid races",
      "Design wait/wake protocol"
    ],
    acceptanceCriteria: [
      "Given a sleeping worker and a pending task, When notify() is called, Then the worker wakes reliably.",
      "Given multiple rapid notify() calls, When only one wake is needed, Then lost-wake or livelock must be prevented.",
      "When run under TSAN/UBSan stress tests, Then no data races or undefined behavior occur."
    ],
    starterFiles: ["waker.h", "waker.c", "test_waker.c"],
    milestones: [
      {
        id: "design",
        title: "Design Phase",
        description: "Research lock-free algorithms and design the waker API",
        estimatedHours: 1,
        deliverables: [
          "API design document",
          "State machine diagram",
          "Memory ordering justification"
        ]
      },
      {
        id: "implementation",
        title: "Core Implementation",
        description: "Implement the lock-free waker using atomics",
        estimatedHours: 3,
        deliverables: [
          "Completed waker.c implementation",
          "Basic unit tests passing",
          "Comments explaining critical sections"
        ]
      },
      {
        id: "testing",
        title: "Testing & Validation",
        description: "Stress test and validate under sanitizers",
        estimatedHours: 2,
        deliverables: [
          "Stress test suite",
          "TSAN/UBSAN clean runs",
          "Performance benchmarks"
        ]
      }
    ],
    proOnly: true
  },
  {
    slug: "fixed-point-math",
    title: "Fixed-Point Arithmetic Library",
    role: "Embedded",
    difficulty: "intermediate",
    estMinutes: 75,
    summary: "Implement Q15 / Q31 fixed-point arithmetic with correct saturation and rounding, and compare behavior with floats.",
    tags: ["fixed-point", "saturation", "DSP"],
    outcomes: [
      "Q-format arithmetic",
      "Saturation vs wrap",
      "Error analysis"
    ],
    acceptanceCriteria: [
      "Given values near range limits, When adding, Then results saturate to min/max without wrap.",
      "Given multiplication, When rounding, Then results approximate float reference within ULP tolerance.",
      "When fuzzed inputs, Then no undefined behavior and invariants hold."
    ],
    starterFiles: ["q15.h", "q31.h", "bench.c"],
    proOnly: false
  },
  {
    slug: "crc-calc",
    title: "CRC Calculator Implementation",
    role: "Firmware",
    difficulty: "intermediate",
    estMinutes: 60,
    summary: "Implement CRC-16 / CRC-32 via bitwise and table engines and verify against standard vectors.",
    tags: ["CRC16", "CRC32", "endian"],
    outcomes: [
      "CRC algorithms",
      "Endian handling",
      "Test vectors"
    ],
    acceptanceCriteria: [
      "For published test vectors, computed CRC matches golden values.",
      "Little- vs big-endian consistent behavior.",
      "Table engine and bitwise engine outputs agree on random inputs."
    ],
    starterFiles: ["crc.h", "crc_bitwise.c", "crc_table.c"],
    proOnly: false
  },
  {
    slug: "privilege-escalation-sim",
    title: "Capability-Based Security System",
    role: "Security",
    difficulty: "advanced",
    estMinutes: 90,
    summary: "Create a minimal capability system, show an escalation path, then harden it to block that path.",
    tags: ["capabilities", "authorization", "attack-surface"],
    outcomes: [
      "Model privilege",
      "Patch escalation",
      "Least privilege"
    ],
    acceptanceCriteria: [
      "Given a low-privileged role, restricted actions fail.",
      "An attacker's path in the vulnerable policy leads to escalation.",
      "In hardened policy, the same path is blocked and logged."
    ],
    starterFiles: ["caps.h", "caps.c", "policy.json", "attack_path.md"],
    proOnly: true
  },
  {
    slug: "objfile-parser",
    title: "Object File Parser",
    role: "Toolchain",
    difficulty: "advanced",
    estMinutes: 120,
    summary: "Parse a small subset of ELF/COFF headers safely and reject malformed inputs.",
    tags: ["ELF", "COFF", "parsing"],
    outcomes: [
      "Safe parsing",
      "Relocation basics",
      "Input validation"
    ],
    acceptanceCriteria: [
      "Malformed lengths produce safe reject, not memory safety violations.",
      "Valid sample objects parsed correctly (symbols, sections).",
      "Under sanitizer / fuzz, no crash or UB."
    ],
    starterFiles: ["elf.h", "elf_parser.c", "sample binaries"],
    proOnly: true
  },
  {
    slug: "interrupt-latency",
    title: "Interrupt Latency Calculator",
    role: "Embedded",
    difficulty: "advanced",
    estMinutes: 80,
    summary: "Compute worst-case interrupt latency under preemption and masking constraints.",
    tags: ["ISR", "preemption", "scheduling"],
    outcomes: [
      "Latency modeling",
      "Masking tradeoffs",
      "Scheduling math"
    ],
    acceptanceCriteria: [
      "Latency bound derived matches simulated results.",
      "Varying masking windows updates bound monotonically.",
      "Simulated real schedule ≤ bound."
    ],
    starterFiles: ["latency.h", "latency.c", "sim.c"],
    proOnly: true
  },
  {
    slug: "mmio-ordering",
    title: "MMIO Ordering with Memory Barriers",
    role: "Systems",
    difficulty: "advanced",
    estMinutes: 70,
    summary: "Ensure correct MMIO write/read ordering using memory barriers on a re-orderable CPU model.",
    tags: ["MMIO", "memory-barrier", "reordering"],
    outcomes: [
      "Acquire/Release semantics",
      "Device ordering",
      "HB edges"
    ],
    acceptanceCriteria: [
      "Barriers prevent stale reads under reordering.",
      "Multi-core sequences preserve intended device visibility.",
      "TSAN shows no data-race issues."
    ],
    starterFiles: ["mmio.h", "device_sim.c", "test_ordering.c"],
    proOnly: true
  },
  {
    slug: "format-safety",
    title: "Safe Format String Library",
    role: "Security",
    difficulty: "intermediate",
    estMinutes: 60,
    summary: "Design a restricted mini-printf to eliminate format string vulnerabilities.",
    tags: ["printf", "format-string", "input-sanitization"],
    outcomes: [
      "Whitelist formats",
      "Secure I/O",
      "API design"
    ],
    acceptanceCriteria: [
      "Attacker input passed only as data not interpreted.",
      "Illegal specifiers cause failure, not UB.",
      "Under fuzz, sanitizer finds no UB."
    ],
    starterFiles: ["safe_printf.h", "safe_printf.c", "tests.c"],
    proOnly: false
  },
  {
    slug: "linker-symbols",
    title: "Symbol Resolution & Relocation Engine",
    role: "Toolchain",
    difficulty: "advanced",
    estMinutes: 90,
    summary: "Resolve symbols and relocations across two object files with weak/strong semantics and output a map.",
    tags: ["linker", "relocation", "symbol-resolution"],
    outcomes: [
      "Linker rules",
      "Relocation math",
      "Mapping"
    ],
    acceptanceCriteria: [
      "Strong symbols override weak symbols.",
      "Relocation entries are correctly applied.",
      "Undefined symbol leads to a clear error."
    ],
    starterFiles: ["linker.h", "symbol_table.c", "relocate.c"],
    proOnly: true
  },
  {
    slug: "watchdog-design",
    title: "Task Watchdog System",
    role: "Embedded",
    difficulty: "intermediate",
    estMinutes: 60,
    summary: "Implement a task watchdog that monitors heartbeats, detects hung tasks, and triggers recovery safely.",
    tags: ["watchdog", "fault-tolerance", "heartbeat"],
    outcomes: [
      "Timeout handling",
      "Recovery logic",
      "Stability"
    ],
    acceptanceCriteria: [
      "Missed heartbeat triggers recovery exactly once.",
      "Normal jitter does not trigger false recovery.",
      "After recovery, watchdog returns to monitoring."
    ],
    starterFiles: ["watchdog.h", "watchdog.c", "task_sim.c"],
    proOnly: false
  }
];
