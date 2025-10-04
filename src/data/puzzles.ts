export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface Puzzle {
  slug: string;
  title: string;
  summary: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "Embedded Systems" | "Systems Programming" | "Firmware Engineering" | "Cybersecurity Engineering" | "Toolchain Developer";
  tags: string[];
  estMinutes: number;
  sampleInput?: string;
  sampleOutput?: string;
  hints: string[];
  proOnly?: boolean;
  testCases: TestCase[];
}

export const puzzles: Puzzle[] = [
  {
    slug: "overflow-detection",
    title: "Integer Overflow Detection",
    summary: "Detect integer overflow without using 128-bit types or built-in checks.",
    description: "Given two signed integers, detect whether their sum would overflow the 32-bit range without using 128-bit types or built-in overflow checks. Return a safe result or indicate overflow.",
    difficulty: "intermediate",
    category: "Systems Programming",
    tags: ["overflow", "arithmetic", "safety"],
    estMinutes: 25,
    sampleInput: "INT_MAX, 1",
    sampleOutput: "OVERFLOW",
    hints: [
      "Consider the sign of the operands and result",
      "Overflow occurs when adding two positive numbers yields negative",
      "Use comparison logic before performing the operation"
    ],
    testCases: [
      { input: "2147483647 1", expectedOutput: "OVERFLOW" },
      { input: "100 200", expectedOutput: "300" },
      { input: "-2147483648 -1", expectedOutput: "OVERFLOW", hidden: true }
    ]
  },
  {
    slug: "pointer-chase",
    title: "Pointer Chain Traversal",
    summary: "Follow a chain of pointers and detect cycles.",
    description: "Given an array of integer indices, simulate pointer jumping: follow a chain of pointers until a terminal node or cycle. Detect cycles and return the node hit or 'cycle'.",
    difficulty: "intermediate",
    category: "Systems Programming",
    tags: ["pointers", "cycle-detection", "data-structures"],
    estMinutes: 30,
    sampleInput: "[1, 2, 3, 1]",
    sampleOutput: "cycle at index 1",
    hints: [
      "Use Floyd's cycle detection algorithm (tortoise and hare)",
      "Track visited indices to detect cycles",
      "Handle out-of-bounds indices as terminal nodes"
    ],
    testCases: [
      { input: "1 2 3 1", expectedOutput: "cycle at index 1" },
      { input: "1 2 -1", expectedOutput: "terminal" },
      { input: "0", expectedOutput: "cycle at index 0", hidden: true }
    ]
  },
  {
    slug: "memory-reuse",
    title: "Memory Allocator Simulation",
    summary: "Simulate memory reuse and detect aliasing bugs.",
    description: "Simulate an allocator that reuses freed memory slots. Given a sequence of allocate() and free() operations, predict which blocks get reused and detect double-use of freed memory (aliasing).",
    difficulty: "advanced",
    category: "Systems Programming",
    tags: ["memory-management", "allocator", "aliasing"],
    estMinutes: 45,
    sampleInput: "alloc(10), free(0), alloc(10), use(0)",
    sampleOutput: "double-use detected",
    hints: [
      "Maintain a free list of available blocks",
      "Track the state of each allocated block",
      "Detect use-after-free by checking block status"
    ],
    proOnly: true,
    testCases: [
      { input: "alloc 10\nfree 0\nalloc 10\nuse 0", expectedOutput: "double-use detected" },
      { input: "alloc 20\nalloc 30\nfree 0", expectedOutput: "ok" },
      { input: "alloc 10\nfree 0\nalloc 5", expectedOutput: "reused block 0", hidden: true }
    ]
  },
  {
    slug: "xor-encode",
    title: "XOR Encoding/Decoding",
    summary: "Implement XOR cipher with edge case handling.",
    description: "Given an input string and a one-byte key, encode by XOR. Then given the encoded result and key, decode back. Also detect if applying XOR twice returns original. Handle edge cases like zero key.",
    difficulty: "beginner",
    category: "Cybersecurity Engineering",
    tags: ["xor", "encoding", "cipher"],
    estMinutes: 20,
    sampleInput: "'HELLO', 0x5A",
    sampleOutput: "encoded, then decoded back to 'HELLO'",
    hints: [
      "XOR is its own inverse: x ^ k ^ k = x",
      "Zero key means no encryption",
      "Handle null terminators carefully"
    ],
    testCases: [
      { input: "HELLO 90", expectedOutput: "HELLO" },
      { input: "TEST 0", expectedOutput: "TEST" },
      { input: "ABC 255", expectedOutput: "ABC", hidden: true }
    ]
  },
  {
    slug: "bitmask-flip",
    title: "Bitmask Operations",
    summary: "Process a sequence of bitmask flip operations.",
    description: "You have a 32-bit bitmask and a sequence of flip operations (toggle bits, set bits, clear bits). Process each operation and return the final mask. Support cumulative flips and overlapping ranges.",
    difficulty: "intermediate",
    category: "Embedded Systems",
    tags: ["bitwise", "bitmask", "operations"],
    estMinutes: 25,
    sampleInput: "mask=0, set(0-7), flip(4-11), clear(0-3)",
    sampleOutput: "0x00000FF0",
    hints: [
      "Use bitwise OR for set, XOR for flip, AND with complement for clear",
      "Create range masks using shifts and subtraction",
      "Test with edge cases at bit boundaries"
    ],
    testCases: [
      { input: "0\nset 0 7\nflip 4 11\nclear 0 3", expectedOutput: "0x00000FF0" },
      { input: "0\nset 0 15", expectedOutput: "0x0000FFFF" },
      { input: "0xFFFFFFFF\nclear 0 31", expectedOutput: "0x00000000", hidden: true }
    ]
  },
  {
    slug: "stack-depth",
    title: "Stack Depth Analysis",
    summary: "Compute maximum safe recursion depth.",
    description: "Given a recursive function call pattern (e.g. recursion depth rules or dependencies), compute the maximum stack depth reachable without overflow. Detect if the recursion would exceed a safe threshold.",
    difficulty: "advanced",
    category: "Systems Programming",
    tags: ["recursion", "stack", "analysis"],
    estMinutes: 40,
    sampleInput: "fib(n) with max stack 1000 frames",
    sampleOutput: "max safe n=997",
    hints: [
      "Calculate stack frame size for each function",
      "Consider tail recursion optimization",
      "Account for compiler-specific stack usage"
    ],
    proOnly: true,
    testCases: [
      { input: "fib 1000", expectedOutput: "997" },
      { input: "factorial 500", expectedOutput: "500" },
      { input: "fibonacci 10000", expectedOutput: "9997", hidden: true }
    ]
  },
  {
    slug: "string-rotation",
    title: "String Rotation Check",
    summary: "Check if one string is a rotation of another in O(n) time.",
    description: "Given two strings s1 and s2, check if s2 is a rotation of s1. You must do this in linear time and constant extra space (aside from buffers).",
    difficulty: "intermediate",
    category: "Systems Programming",
    tags: ["strings", "rotation", "algorithms"],
    estMinutes: 30,
    sampleInput: "s1='waterbottle', s2='erbottlewat'",
    sampleOutput: "true",
    hints: [
      "A rotation means s2 is a substring of s1+s1",
      "Use strstr or implement KMP for linear search",
      "Check lengths first as a quick filter"
    ],
    testCases: [
      { input: "waterbottle\nerbottlewat", expectedOutput: "true" },
      { input: "hello\nworld", expectedOutput: "false" },
      { input: "abc\nbca", expectedOutput: "true", hidden: true }
    ]
  },
  {
    slug: "checksum-validate",
    title: "Checksum Validation",
    summary: "Compute and verify 16-bit checksums.",
    description: "Compute and verify a 16-bit checksum (e.g. ICMP style). Given a data block appended with checksum, validate integrity. Also generate correct checksum for corrupted blocks.",
    difficulty: "intermediate",
    category: "Firmware Engineering",
    tags: ["checksum", "integrity", "validation"],
    estMinutes: 30,
    sampleInput: "data=[0x12, 0x34, 0x56, 0x78], checksum=0xBBCC",
    sampleOutput: "valid/invalid",
    hints: [
      "Sum all 16-bit words and add carry bits",
      "Take one's complement for final checksum",
      "Handle odd-length data by padding"
    ],
    testCases: [
      { input: "0x12 0x34 0x56 0x78\n0xBBCC", expectedOutput: "valid" },
      { input: "0xFF 0xFF\n0x0000", expectedOutput: "valid" },
      { input: "0x12 0x34\n0xFFFF", expectedOutput: "invalid", hidden: true }
    ]
  },
  {
    slug: "integer-saturation",
    title: "Saturating Arithmetic",
    summary: "Implement addition with saturation instead of wrapping.",
    description: "Implement integer addition that saturates (clips) at the min/max value of the type instead of wrapping. For example, adding two values beyond 32-bit signed range should return INT_MAX or INT_MIN accordingly.",
    difficulty: "intermediate",
    category: "Embedded Systems",
    tags: ["saturation", "arithmetic", "overflow"],
    estMinutes: 25,
    sampleInput: "INT_MAX + 100",
    sampleOutput: "INT_MAX (saturated)",
    hints: [
      "Check for overflow before performing addition",
      "Clamp to INT_MAX or INT_MIN on overflow",
      "Consider both positive and negative overflow cases"
    ],
    testCases: [
      { input: "2147483647 100", expectedOutput: "2147483647" },
      { input: "100 200", expectedOutput: "300" },
      { input: "-2147483648 -100", expectedOutput: "-2147483648", hidden: true }
    ]
  },
  {
    slug: "binary-manipulation",
    title: "Binary String Queries",
    summary: "Efficient binary string operations and queries.",
    description: "Given a binary string or integer, support queries: count bits, flip a range of bits, test if palindrome, etc. All operations must be efficient (e.g. segment tree or bit operations).",
    difficulty: "advanced",
    category: "Toolchain Developer",
    tags: ["binary", "bitwise", "data-structures"],
    estMinutes: 50,
    sampleInput: "binary=10110110, count_bits(0-7), flip(2-5), is_palindrome()",
    sampleOutput: "5, 10001110, false",
    hints: [
      "Use Brian Kernighan's algorithm for bit counting",
      "XOR with mask for range flips",
      "For palindrome, compare bits from both ends"
    ],
    proOnly: true,
    testCases: [
      { input: "10110110\ncount 0 7\nflip 2 5\npalindrome", expectedOutput: "5\n10001110\nfalse" },
      { input: "11111111\ncount 0 7", expectedOutput: "8" },
      { input: "10101010\npalindrome", expectedOutput: "false", hidden: true }
    ]
  },
  {
    slug: "interrupt-timing",
    title: "Interrupt Handler Timing",
    summary:
      "Detect missed or overlapping interrupts from timestamp sequences.",
    description:
      "Input: first line = expected interval Δt (µs). Second line = space-separated interrupt timestamps (µs) in ascending order. For each consecutive pair, if gap < Δt, report 'overlap at <t2>'. If gap > Δt, compute how many were missed: floor((gap-1)/Δt) and report 'missed N'. If neither occurs for the entire sequence, output 'ok'. If multiple events happen, report only the first encountered (overlap takes priority).",
    difficulty: "intermediate",
    category: "Embedded Systems",
    tags: ["interrupts", "timing", "embedded"],
    estMinutes: 30,
    sampleInput: "100\n0 95 200 300",
    sampleOutput: "overlap at 95",
    hints: [
      "Walk adjacent timestamps, computing differences.",
      "gap < Δt → overlap; gap > Δt → missed interrupts.",
      "Stop after first event; otherwise print 'ok'."
    ],
    testCases: [
      { input: "100\n0 95 200 300", expectedOutput: "overlap at 95" },
      { input: "100\n0 110 220 330", expectedOutput: "ok" },
      { input: "50\n0 200", expectedOutput: "missed 3", hidden: true }
    ]
  },
  {
    slug: "endian-conversion",
    title: "Endian Conversion",
    summary: "Reverse the byte order of a 32-bit value.",
    description:
      "Input: one 32-bit unsigned integer in hex (e.g., 0xAABBCCDD). Output the value with bytes reversed (e.g., 0xDDCCBBAA). Avoid intrinsics like htonl/ntohl.",
    difficulty: "beginner",
    category: "Embedded Systems",
    tags: ["endianness", "bitwise", "bytes"],
    estMinutes: 20,
    sampleInput: "0x12345678",
    sampleOutput: "0x78563412",
    hints: [
      "Mask-and-shift each byte to the correct position.",
      "Combine bytes using bitwise OR.",
      "Be careful with hex formatting (0x prefix, uppercase/lowercase consistent)."
    ],
    testCases: [
      { input: "0x12345678", expectedOutput: "0x78563412" },
      { input: "0xAABBCCDD", expectedOutput: "0xDDCCBBAA" },
      { input: "0x00000001", expectedOutput: "0x01000000", hidden: true }
    ]
  },
  {
    slug: "ring-buffer",
    title: "Circular Buffer Simulation",
    summary:
      "Implement a fixed-capacity circular buffer with enqueue/dequeue behavior.",
    description:
      "First line: capacity N. Subsequent lines: 'enqueue X' or 'dequeue'. On enqueue to a full buffer, print 'overflow' and ignore. On dequeue from empty, print 'underflow'. Otherwise print the dequeued value. Use head/tail indices modulo N and track count.",
    difficulty: "intermediate",
    category: "Embedded Systems",
    tags: ["buffer", "queue", "data-structures"],
    estMinutes: 30,
    sampleInput:
      "2\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\ndequeue\ndequeue",
    sampleOutput: "overflow\n1\n2\nunderflow",
    hints: [
      "Keep a size counter to distinguish empty vs full when head == tail.",
      "Only move head/tail when the operation succeeds.",
      "Use modulo arithmetic for wrap-around."
    ],
    testCases: [
      {
        input:
          "2\nenqueue 1\nenqueue 2\nenqueue 3\ndequeue\ndequeue\ndequeue",
        expectedOutput: "overflow\n1\n2\nunderflow"
      },
      {
        input:
          "3\nenqueue 10\ndequeue\nenqueue 20\nenqueue 30\ndequeue\ndequeue",
        expectedOutput: "10\n20\n30"
      },
      { input: "1\ndequeue", expectedOutput: "underflow", hidden: true }
    ]
  },
  {
    slug: "device-state-machine",
    title: "Device State Machine",
    summary: "Model a simple OFF→ON→SLEEP device with events.",
    description:
      "States: OFF, ON, SLEEP. Start OFF. Events: 'press' toggles OFF→ON, ON→OFF, SLEEP→ON. 'timeout' from ON enters SLEEP. 'activity' from SLEEP returns to ON. Input: one line with space-separated events. Output: final state.",
    difficulty: "intermediate",
    category: "Embedded Systems",
    tags: ["state-machine", "finite-automata", "embedded"],
    estMinutes: 25,
    sampleInput: "press timeout activity press",
    sampleOutput: "OFF",
    hints: [
      "Represent transitions in a table or switch.",
      "Track current state and apply each event sequentially.",
      "Be explicit about each (state,event) pair."
    ],
    testCases: [
      { input: "press timeout activity press", expectedOutput: "OFF" },
      { input: "press press", expectedOutput: "OFF" },
      { input: "press timeout", expectedOutput: "SLEEP", hidden: true }
    ]
  },
  {
    slug: "watchdog-timer-reset",
    title: "Watchdog Timer Reset",
    summary:
      "Detect the first time a watchdog would reset given heartbeat gaps.",
    description:
      "Input: first line = timeout T (ms). Second line = space-separated heartbeat times (ms) in ascending order. The watchdog resets if any gap between heartbeats exceeds T. Output 'reset at <time>' where <time> is previous_heartbeat + T, or 'no reset' if none.",
    difficulty: "beginner",
    category: "Embedded Systems",
    tags: ["timers", "watchdog", "reliability"],
    estMinutes: 20,
    sampleInput: "100\n10 40 30 60",
    sampleOutput: "reset at 110",
    hints: [
      "Compute differences between consecutive times.",
      "If gap > T, reset occurs at prev + T.",
      "If no gap exceeds T, print 'no reset'."
    ],
    testCases: [
      { input: "100\n10 40 30 60", expectedOutput: "reset at 110" },
      { input: "50\n0 20 70", expectedOutput: "reset at 50" },
      { input: "30\n0 20 30", expectedOutput: "no reset", hidden: true }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Systems Programming (5)
  {
    slug: "pointer-chase",
    title: "Pointer Chain Traversal",
    summary: "Follow index pointers until terminal or cycle.",
    description:
      "Input: a space-separated list of integers where each value i points to the next index i, and -1 means terminal. Start at index 0. If a cycle is detected, print 'cycle at <idx>'; if traversal reaches -1 or goes out of bounds, print 'terminal'.",
    difficulty: "intermediate",
    category: "Systems Programming",
    tags: ["pointers", "cycle-detection", "arrays"],
    estMinutes: 30,
    sampleInput: "1 2 3 1",
    sampleOutput: "cycle at 1",
    hints: [
      "Use Floyd’s tortoise-and-hare or a visited set.",
      "Check bounds each step.",
      "Stop when value is -1."
    ],
    testCases: [
      { input: "1 2 3 1", expectedOutput: "cycle at 1" },
      { input: "1 2 -1", expectedOutput: "terminal" },
      { input: "0", expectedOutput: "cycle at 0", hidden: true }
    ]
  },
  {
    slug: "memory-reuse",
    title: "Memory Allocator Simulation",
    summary: "Track reuse and use-after-free risks.",
    description:
      "Operations: 'alloc S' returns next index; 'free I' frees index I; 'use I' reads index I. Print 'reused block I' if a freed block I is allocated again; print 'double-use detected' if 'use I' occurs after I is freed; otherwise print 'ok' at the end if nothing suspicious occurred.",
    difficulty: "advanced",
    category: "Systems Programming",
    tags: ["memory", "allocator", "UAF"],
    estMinutes: 45,
    proOnly: true,
    sampleInput: "alloc 10\nfree 0\nalloc 10\nuse 0",
    sampleOutput: "double-use detected",
    hints: [
      "Track state of each allocation: allocated/freed.",
      "Maintain a free list to enable reuse.",
      "Flag 'use' on a freed block."
    ],
    testCases: [
      { input: "alloc 10\nfree 0\nalloc 10\nuse 0", expectedOutput: "double-use detected" },
      { input: "alloc 20\nalloc 30\nfree 0", expectedOutput: "ok" },
      { input: "alloc 10\nfree 0\nalloc 5", expectedOutput: "reused block 0", hidden: true }
    ]
  },
  {
    slug: "cache-simulator",
    title: "Tiny Direct-Mapped Cache",
    summary: "Simulate hits/misses in a direct-mapped cache.",
    description:
      "Input: first line 'L B' → L = number of lines, B = bytes per line (both powers of two). Second line: space-separated byte addresses (decimal). For each access, print 'hit' or 'miss'. After the sequence, print a summary line 'hits=X misses=Y'. Use index=(addr/B)%L and tag=floor(addr/B)/L.",
    difficulty: "intermediate",
    category: "Systems Programming",
    tags: ["cache", "performance", "simulation"],
    estMinutes: 35,
    sampleInput: "4 16\n0 16 32 0",
    sampleOutput: "miss miss miss hit\nhits=1 misses=3",
    hints: [
      "Compute block number = addr / B.",
      "Line index = block % L; tag = block / L.",
      "Store tag/valid per line."
    ],
    testCases: [
      { input: "4 16\n0 16 32 0", expectedOutput: "miss miss miss hit\nhits=1 misses=3" },
      { input: "2 8\n0 8 16 24", expectedOutput: "miss miss miss miss\nhits=0 misses=4" },
      { input: "1 32\n0 64 0", expectedOutput: "miss miss miss\nhits=0 misses=3", hidden: true }
    ]
  },
  {
    slug: "deadlock-detection",
    title: "Resource Allocation Deadlock",
    summary: "Detect a cycle in wait-for relationships.",
    description:
      "Input: lines describing a system. Format: first line 'P R' (processes, resources). Then zero or more 'req p r' (p requests r) and 'alloc p r' (resource r allocated to p). Determine if a deadlock exists via a cycle in a wait-for graph. Output 'deadlock' or 'no deadlock'.",
    difficulty: "intermediate",
    category: "Systems Programming",
    tags: ["deadlock", "graphs", "os"],
    estMinutes: 35,
    sampleInput:
      "2 2\nreq 0 0\nreq 1 1\nalloc 0 1\nalloc 1 0",
    sampleOutput: "deadlock",
    hints: [
      "Build wait-for edges p→q when p waits for a resource held by q.",
      "Detect cycle via DFS or Kahn’s algorithm.",
      "Ignore satisfied req edges where no one holds the resource."
    ],
    testCases: [
      { input: "2 2\nreq 0 0\nreq 1 1\nalloc 0 1\nalloc 1 0", expectedOutput: "deadlock" },
      { input: "1 1\nreq 0 0\nalloc 0 0", expectedOutput: "no deadlock" },
      { input: "3 3\nreq 0 0\nreq 1 1\nreq 2 2\nalloc 0 1\nalloc 1 2\nalloc 2 0", expectedOutput: "deadlock", hidden: true }
    ]
  },
  {
    slug: "file-permission-parser",
    title: "Unix Mode String to Octal",
    summary: "Convert symbolic permissions (e.g., rwxr-x---) to octal.",
    description:
      "Input: a single permission string of length 9 (e.g., rwxr-x---). Output its octal representation (e.g., 750). Consider r=4, w=2, x=1 per triad.",
    difficulty: "beginner",
    category: "Systems Programming",
    tags: ["parsing", "filesystems", "permissions"],
    estMinutes: 15,
    sampleInput: "rwxr-x---",
    sampleOutput: "750",
    hints: [
      "Process user, group, other in chunks of 3.",
      "Sum bits per triad (r=4,w=2,x=1).",
      "Concatenate the three digits."
    ],
    testCases: [
      { input: "rwxr-x---", expectedOutput: "750" },
      { input: "rw-r--r--", expectedOutput: "644" },
      { input: "rwxrwxrwx", expectedOutput: "777", hidden: true }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Firmware Engineering (3)
  {
    slug: "moving-average-filter",
    title: "Moving Average Filter",
    summary: "Compute a running average with window N.",
    description:
      "First line: window size N. Second line: space-separated integer samples. Output the running average after each sample (2 decimals), separated by spaces. For fewer than N samples, average over the samples seen so far.",
    difficulty: "beginner",
    category: "Firmware Engineering",
    tags: ["filters", "signals", "averaging"],
    estMinutes: 20,
    sampleInput: "3\n1 2 3 4 5",
    sampleOutput: "1.00 1.50 2.00 3.00 4.00",
    hints: [
      "Keep a running sum and circular buffer.",
      "Subtract the value that falls out of the window.",
      "Format with fixed(2)."
    ],
    testCases: [
      { input: "3\n1 2 3 4", expectedOutput: "1.00 1.50 2.00 3.00" },
      { input: "5\n10 20 30", expectedOutput: "10.00 15.00 20.00" },
      { input: "2\n5 5 5 5", expectedOutput: "5.00 5.00 5.00 5.00", hidden: true }
    ]
  },
  {
    slug: "memory-leak-detection",
    title: "Leak Tracker",
    summary: "Report unfreed IDs after alloc/free operations.",
    description:
      "Operations: 'alloc <ID> <size>' allocates an object ID; 'free <ID>' frees it. After processing all lines, output either 'no leak' or a space-separated list of leaked IDs in allocation order.",
    difficulty: "intermediate",
    category: "Firmware Engineering",
    tags: ["memory", "resource-tracking", "robustness"],
    estMinutes: 30,
    sampleInput: "alloc A 10\nalloc B 20\nfree A",
    sampleOutput: "B",
    hints: [
      "Maintain an ordered list of active IDs.",
      "Remove IDs on free.",
      "At EOF, print remaining IDs or 'no leak'."
    ],
    testCases: [
      { input: "alloc X 10\nalloc Y 5\nfree X\nfree Y", expectedOutput: "no leak" },
      { input: "alloc A 10\nalloc B 5\nfree A", expectedOutput: "B" },
      { input: "alloc A 1\nalloc B 1\nalloc C 1\nfree B\nfree C", expectedOutput: "A", hidden: true }
    ]
  },
  {
    slug: "bootloader-checksum",
    title: "8-bit Additive Checksum",
    summary: "Verify and compute a simple 8-bit checksum.",
    description:
      "Input: first line N (number of bytes), second line N hex bytes (e.g., 0x01). Output the additive checksum modulo 256 as '0xHH'. If the last byte is a claimed checksum (optional), also print 'valid' or 'invalid'.",
    difficulty: "advanced",
    category: "Firmware Engineering",
    tags: ["checksum", "integrity", "embedded"],
    estMinutes: 40,
    proOnly: true,
    sampleInput: "4\n0x01 0x02 0x03 0x04",
    sampleOutput: "0x0A",
    hints: [
      "Sum all bytes as unsigned, then mod 256.",
      "Normalize hex parsing (with/without 0x).",
      "If a final claimed checksum is provided, compare."
    ],
    testCases: [
      { input: "4\n0x01 0x02 0x03 0x04", expectedOutput: "0x0A" },
      { input: "3\n0xFF 0x01 0x00", expectedOutput: "0x00" },
      { input: "5\n0x01 0x02 0x03 0xF9 0x0A", expectedOutput: "valid", hidden: true }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Cybersecurity Engineering (4)
  {
    slug: "stack-canary-verification",
    title: "Stack Canary Check",
    summary: "Simulate overflow detection with a stack canary.",
    description:
      "Input: first line = buffer size N. Second line = payload length L. If L > N, output 'overflow'; else output 'ok'. This models whether a write would smash the canary (beyond the buffer) in a simple scenario.",
    difficulty: "intermediate",
    category: "Cybersecurity Engineering",
    tags: ["memory-safety", "overflow", "defense"],
    estMinutes: 20,
    sampleInput: "16\n12",
    sampleOutput: "ok",
    hints: [
      "Compare lengths, no actual bytes needed.",
      "Assume canary sits just after the buffer.",
      "Treat equality (L == N) as safe in this model."
    ],
    testCases: [
      { input: "16\n12", expectedOutput: "ok" },
      { input: "16\n17", expectedOutput: "overflow" },
      { input: "8\n8", expectedOutput: "ok", hidden: true }
    ]
  },
  {
    slug: "rsa-keygen-validation",
    title: "RSA Parameter Validator",
    summary: "Validate small RSA parameters p, q, e.",
    description:
      "Input: p q e (integers). Output 'valid' if p and q are prime, p≠q, and gcd(e,(p-1)(q-1))=1; otherwise 'invalid'. No big-int math needed for small inputs.",
    difficulty: "advanced",
    category: "Cybersecurity Engineering",
    tags: ["crypto", "number-theory", "rsa"],
    estMinutes: 35,
    proOnly: true,
    sampleInput: "11 13 7",
    sampleOutput: "valid",
    hints: [
      "Implement a simple primality test (trial division).",
      "Compute phi=(p-1)(q-1) and gcd(e,phi).",
      "Check p≠q."
    ],
    testCases: [
      { input: "11 13 7", expectedOutput: "valid" },
      { input: "11 11 3", expectedOutput: "invalid" },
      { input: "17 19 18", expectedOutput: "invalid", hidden: true }
    ]
  },
  {
    slug: "xor-encode",
    title: "XOR Encode/Decode",
    summary: "Round-trip a string with a one-byte XOR key.",
    description:
      "Input: a line of ASCII text, then a line with an integer key 0..255. Encode via XOR, then decode back, and output the decoded text. For testing, your program should output the decoded string exactly.",
    difficulty: "beginner",
    category: "Cybersecurity Engineering",
    tags: ["xor", "encoding", "symmetry"],
    estMinutes: 20,
    sampleInput: "HELLO\n90",
    sampleOutput: "HELLO",
    hints: [
      "XOR is its own inverse.",
      "Treat bytes unsigned.",
      "Leave characters unchanged when key=0."
    ],
    testCases: [
      { input: "HELLO\n90", expectedOutput: "HELLO" },
      { input: "TEST\n0", expectedOutput: "TEST" },
      { input: "ABC\n255", expectedOutput: "ABC", hidden: true }
    ]
  },
  {
    slug: "sql-injection-sanitizer",
    title: "Basic SQL Injection Heuristics",
    summary: "Flag obviously unsafe input strings.",
    description:
      "Input: a single line string. If it contains dangerous patterns like `--`, `;`, `' OR '1'='1'` (case-insensitive, allow whitespace variation), output 'unsafe'; otherwise 'safe'.",
    difficulty: "intermediate",
    category: "Cybersecurity Engineering",
    tags: ["input-validation", "sanitization", "parsing"],
    estMinutes: 20,
    sampleInput: "admin' OR '1'='1",
    sampleOutput: "unsafe",
    hints: [
      "Normalize case and whitespace for matching.",
      "Look for common tautology and comment sequences.",
      "When unsure, prefer flagging unsafe."
    ],
    testCases: [
      { input: "admin' OR '1'='1", expectedOutput: "unsafe" },
      { input: "alice@example.com", expectedOutput: "safe" },
      { input: "name; DROP TABLE users; --", expectedOutput: "unsafe", hidden: true }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Toolchain Developer (3)
  {
    slug: "simple-lexer",
    title: "Whitespace-Insensitive Lexer",
    summary: "Tokenize digits and + - * / ( ) as simple tokens.",
    description:
      "Input: a single arithmetic expression with nonnegative integers and + - * / ( ). Output one token per line in the format shown: INT:<n>, PLUS, MINUS, MUL, DIV, LPAREN, RPAREN.",
    difficulty: "intermediate",
    category: "Toolchain Developer",
    tags: ["lexer", "parsing", "tokens"],
    estMinutes: 30,
    sampleInput: "12+(3*4)-5",
    sampleOutput:
      "INT:12\nPLUS\nLPAREN\nINT:3\nMUL\nINT:4\nRPAREN\nMINUS\nINT:5",
    hints: [
      "Scan left-to-right, accumulate digit runs.",
      "Skip whitespace.",
      "Emit one token per lexeme."
    ],
    testCases: [
      { input: "7-2", expectedOutput: "INT:7\nMINUS\nINT:2" },
      {
        input: "(1+2)*3",
        expectedOutput:
          "LPAREN\nINT:1\nPLUS\nINT:2\nRPAREN\nMUL\nINT:3"
      },
      {
        input: "10 / (5 - 3)",
        expectedOutput:
          "INT:10\nDIV\nLPAREN\nINT:5\nMINUS\nINT:3\nRPAREN",
        hidden: true
      }
    ]
  },
  {
    slug: "asm-encoder",
    title: "Tiny 16-bit ISA Encoder",
    summary: "Encode MOV/ADD/SUB instructions into 16-bit words.",
    description:
      "ISA: MOV Rn, #imm → opcode 0x1; ADD Rn, Rm → opcode 0x2; SUB Rn, Rm → opcode 0x3. Encoding: [4 bits opcode][4 bits dest][4 bits src/imm_hi][4 bits imm_lo]. For register-to-register ops, low nibble = 0. Input: one instruction per line; Output: uppercase hex word per line (0xNNNN). Registers 0..15; immediates 0..255.",
    difficulty: "advanced",
    category: "Toolchain Developer",
    tags: ["assembly", "encoding", "bitfields"],
    estMinutes: 45,
    proOnly: true,
    sampleInput: "MOV R1, #170",
    sampleOutput: "0x11AA",
    hints: [
      "Parse op, registers, and immediate carefully.",
      "Split immediate into high/low nibbles.",
      "For ADD/SUB, set low nibble to 0."
    ],
    testCases: [
      { input: "MOV R1, #170", expectedOutput: "0x11AA" },
      { input: "ADD R2, R3", expectedOutput: "0x2230" },
      { input: "SUB R0, R15", expectedOutput: "0x30F0", hidden: true }
    ]
  },
  {
    slug: "macro-expander",
    title: "Single-Pass Macro Expander",
    summary: "Replace tokens by macro definitions.",
    description:
      "First line M = number of macros. Next M lines: 'NAME VALUE' (no spaces in NAME; VALUE has no spaces either for simplicity). Final line: a code line. Replace tokens that match macro names with their VALUE. Preserve spacing and other tokens. Output the expanded line.",
    difficulty: "intermediate",
    category: "Toolchain Developer",
    tags: ["preprocessor", "macros", "tokens"],
    estMinutes: 25,
    sampleInput: "2\nPI 3.14\nDOUBLE_PI PI*2\narea = PI * r * r",
    sampleOutput: "area = 3.14 * r * r",
    hints: [
      "Tokenize by whitespace/punctuation boundaries.",
      "Perform replacements only on exact token matches.",
      "Repeat until all macro names in the line are handled."
    ],
    testCases: [
      { input: "1\nX 10\nX + X", expectedOutput: "10 + 10" },
      {
        input: "2\nHELLO hi\nWORLD earth\nHELLO WORLD",
        expectedOutput: "hi earth"
      },
      {
        input: "1\nPI 3.14\ncirc = 2 * PI * r",
        expectedOutput: "circ = 2 * 3.14 * r",
        hidden: true
      }
    ]
  }
];
