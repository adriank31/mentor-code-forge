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
    proOnly: true
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
    proOnly: true
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
    proOnly: true
  }
];
