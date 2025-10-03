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
    summary: "Implement a complete Q15 and Q31 fixed-point arithmetic library with correct saturation, rounding, and overflow handling for embedded DSP applications.",
    detailedRequirements: `Build a production-ready fixed-point arithmetic library for embedded systems without FPU support. Implement Q15 (16-bit) and Q31 (32-bit) fixed-point number formats with full arithmetic operations.

The library must handle edge cases correctly: saturation on overflow, proper rounding modes, and accurate range management. Compare results against floating-point references to quantify precision loss.

This project simulates real-world embedded DSP development where floating-point operations are too expensive or unavailable, requiring efficient integer-based arithmetic with controlled precision.`,
    technicalSpecifications: [
      "Implement Q15 format: 1 sign bit, 15 fractional bits",
      "Implement Q31 format: 1 sign bit, 31 fractional bits",
      "Operations: add, subtract, multiply, divide",
      "Saturation arithmetic: clamp to [MIN, MAX] on overflow",
      "Rounding: round-to-nearest-even for multiplication",
      "Conversion functions between Q15, Q31, int, and float",
      "Comparison with floating-point reference implementation",
      "Performance benchmarks showing cycle counts"
    ],
    tags: ["fixed-point", "saturation", "DSP", "Q-format", "embedded"],
    outcomes: [
      "Master Q-format fixed-point arithmetic fundamentals",
      "Understand saturation vs wrap-around overflow behavior",
      "Implement efficient fixed-point operations in C",
      "Perform error analysis comparing fixed vs floating point",
      "Learn DSP-specific numeric programming techniques",
      "Optimize for embedded systems without FPU"
    ],
    acceptanceCriteria: [
      "Given values near INT16_MAX in Q15, When adding, Then results saturate to Q15_MAX without wrapping",
      "Given Q15 multiplication, When rounding, Then results match floating-point within 1 ULP",
      "Given Q31 operations, When tested with boundary values, Then no undefined behavior occurs",
      "Given 1000 random operations, When comparing with float, Then average error < 0.01%",
      "Given performance benchmarks, When measuring cycles, Then operations complete in < 10 cycles each"
    ],
    starterFiles: ["q15.h", "q15.c", "q31.h", "q31.c", "test_fixed.c", "bench.c"],
    starterCodeUrl: `// q15.h
#ifndef Q15_H
#define Q15_H

#include <stdint.h>

typedef int16_t q15_t;

#define Q15_MAX  32767
#define Q15_MIN  -32768
#define Q15_ONE  32767

// TODO: Implement these functions
q15_t q15_add(q15_t a, q15_t b);
q15_t q15_sub(q15_t a, q15_t b);
q15_t q15_mul(q15_t a, q15_t b);
q15_t q15_div(q15_t a, q15_t b);

// Conversion functions
q15_t q15_from_int(int32_t val);
q15_t q15_from_float(float val);
float q15_to_float(q15_t val);

#endif

// q15.c - Starter implementation
#include "q15.h"
#include <limits.h>

q15_t q15_add(q15_t a, q15_t b) {
    // TODO: Implement with saturation
    return a + b; // BUG: No saturation
}

// TODO: Implement remaining functions

// test_fixed.c
#include <stdio.h>
#include "q15.h"

int main() {
    // TODO: Add comprehensive tests
    q15_t a = q15_from_float(0.5f);
    q15_t b = q15_from_float(0.5f);
    q15_t sum = q15_add(a, b);
    printf("0.5 + 0.5 = %f\\n", q15_to_float(sum));
    return 0;
}`,
    milestones: [
      {
        id: "q15_basic",
        title: "Q15 Basic Operations",
        description: "Implement core Q15 arithmetic with saturation",
        estimatedHours: 4,
        deliverables: [
          "q15_add, q15_sub with saturation logic",
          "q15_mul with correct right-shift and rounding",
          "Conversion functions: int/float <-> Q15",
          "Unit tests for basic operations"
        ]
      },
      {
        id: "q31_implementation",
        title: "Q31 Format Support",
        description: "Extend library to support 32-bit Q31 format",
        estimatedHours: 3,
        deliverables: [
          "Q31 arithmetic operations",
          "64-bit intermediate values for multiplication",
          "Q15 <-> Q31 conversion functions",
          "Edge case tests for Q31"
        ]
      },
      {
        id: "validation",
        title: "Validation & Benchmarking",
        description: "Compare against floating-point and measure performance",
        estimatedHours: 2,
        deliverables: [
          "Error analysis comparing fixed vs float",
          "Saturation boundary tests",
          "Performance benchmarks with cycle counts",
          "Documentation of precision limitations"
        ]
      }
    ],
    proOnly: true
  },
  {
    slug: "crc-calc",
    title: "CRC Calculator Implementation",
    role: "Firmware",
    difficulty: "intermediate",
    estMinutes: 60,
    summary: "Implement CRC-16 and CRC-32 checksum algorithms using both bitwise and table-driven approaches, handling endianness correctly for firmware data integrity verification.",
    detailedRequirements: `Build a complete CRC (Cyclic Redundancy Check) implementation supporting CRC-16 and CRC-32 standards commonly used in firmware and communication protocols.

Implement two different calculation methods:
1. Bitwise algorithm: Slower but minimal code size
2. Table-driven algorithm: Faster using pre-computed lookup tables

The implementation must handle both little-endian and big-endian data correctly and validate against published test vectors from standards documents.

This project is essential for understanding data integrity mechanisms used in firmware updates, serial protocols, and embedded file systems.`,
    technicalSpecifications: [
      "CRC-16-CCITT (polynomial 0x1021, init 0xFFFF)",
      "CRC-32 (polynomial 0x04C11DB7, init 0xFFFFFFFF)",
      "Bitwise implementation using shift-and-XOR",
      "Table-driven implementation with 256-entry lookup table",
      "Table generation at compile-time or runtime",
      "Endianness handling for multi-byte data",
      "Incremental CRC calculation support",
      "Validation against official test vectors"
    ],
    tags: ["CRC16", "CRC32", "checksum", "endian", "firmware"],
    outcomes: [
      "Understand CRC algorithm theory and polynomial division",
      "Implement bitwise CRC calculation from scratch",
      "Optimize using table-driven approach",
      "Handle endianness correctly in data processing",
      "Validate implementations against standard test vectors",
      "Compare performance trade-offs between methods"
    ],
    acceptanceCriteria: [
      "Given standard test string '123456789', When computing CRC-16-CCITT, Then result is 0x29B1",
      "Given same input, When computing CRC-32, Then result is 0xCBF43926",
      "Given random data, When comparing bitwise vs table methods, Then outputs are identical",
      "Given little-endian and big-endian input, When CRC computed, Then results handle byte order correctly",
      "Given 1MB data, When using table method, Then completes at least 5x faster than bitwise"
    ],
    starterFiles: ["crc.h", "crc_bitwise.c", "crc_table.c", "test_vectors.c", "benchmark.c"],
    starterCodeUrl: `// crc.h
#ifndef CRC_H
#define CRC_H

#include <stdint.h>
#include <stddef.h>

// CRC-16-CCITT
uint16_t crc16_bitwise(const uint8_t *data, size_t len);
uint16_t crc16_table(const uint8_t *data, size_t len);

// CRC-32
uint32_t crc32_bitwise(const uint8_t *data, size_t len);
uint32_t crc32_table(const uint8_t *data, size_t len);

// Table generation
void crc16_generate_table(uint16_t table[256]);
void crc32_generate_table(uint32_t table[256]);

#endif

// crc_bitwise.c - Starter
#include "crc.h"

uint16_t crc16_bitwise(const uint8_t *data, size_t len) {
    uint16_t crc = 0xFFFF; // Initial value
    // TODO: Implement bitwise CRC-16-CCITT
    // Polynomial: 0x1021
    for (size_t i = 0; i < len; i++) {
        // Your implementation here
    }
    return crc;
}

// TODO: Implement other functions

// test_vectors.c
#include <stdio.h>
#include <string.h>
#include "crc.h"

int main() {
    const char *test = "123456789";
    uint16_t crc16 = crc16_bitwise((uint8_t*)test, strlen(test));
    printf("CRC-16: 0x%04X (expected: 0x29B1)\\n", crc16);
    return 0;
}`,
    milestones: [
      {
        id: "bitwise_crc16",
        title: "Bitwise CRC-16 Implementation",
        description: "Implement CRC-16-CCITT using bitwise algorithm",
        estimatedHours: 2,
        deliverables: [
          "Working crc16_bitwise function",
          "Passes standard test vector (0x29B1)",
          "Handles empty and single-byte inputs",
          "Code comments explaining algorithm"
        ]
      },
      {
        id: "table_driven",
        title: "Table-Driven Optimization",
        description: "Implement table-driven CRC for performance",
        estimatedHours: 2,
        deliverables: [
          "Table generation functions",
          "Table-driven CRC-16 and CRC-32",
          "Verification that table matches bitwise",
          "Performance comparison benchmarks"
        ]
      },
      {
        id: "crc32_and_validation",
        title: "CRC-32 & Comprehensive Testing",
        description: "Add CRC-32 support and validate all implementations",
        estimatedHours: 2,
        deliverables: [
          "Complete CRC-32 implementation",
          "All standard test vectors passing",
          "Endianness handling tests",
          "Documentation of polynomials and parameters"
        ]
      }
    ],
    proOnly: false
  },
  {
    slug: "privilege-escalation-sim",
    title: "Capability-Based Security System",
    role: "Security",
    difficulty: "advanced",
    estMinutes: 90,
    summary: "Design and implement a capability-based security system with role-based access control, demonstrate a privilege escalation attack, then harden the system to prevent it.",
    detailedRequirements: `Build a capability-based authorization system that grants fine-grained permissions to subjects (users/processes) for operations on objects (resources).

Phase 1: Create a working but vulnerable capability system with multiple roles (admin, operator, user, guest) and operations (read, write, execute, grant).

Phase 2: Document and demonstrate a privilege escalation path where a low-privileged user can gain unauthorized capabilities.

Phase 3: Harden the system by implementing proper access controls, capability delegation limits, and audit logging to prevent the escalation.

This project teaches security principles applicable to OS kernels, microservices, and secure system design.`,
    technicalSpecifications: [
      "Define capability structure: (subject, object, operation, constraints)",
      "Implement roles: admin, operator, user, guest with hierarchical permissions",
      "Operations: read, write, execute, grant_capability, revoke_capability",
      "Capability delegation with transitive grant limits",
      "Access control checks before all operations",
      "Audit logging for security-relevant events",
      "JSON-based policy configuration",
      "Privilege escalation attack demonstration"
    ],
    tags: ["capabilities", "authorization", "RBAC", "security", "attack-surface"],
    outcomes: [
      "Understand capability-based vs ACL security models",
      "Design fine-grained access control systems",
      "Identify privilege escalation vulnerabilities",
      "Implement defense-in-depth security mechanisms",
      "Apply principle of least privilege",
      "Create secure capability delegation protocols",
      "Develop security auditing and logging"
    ],
    acceptanceCriteria: [
      "Given a 'guest' role, When attempting write operations, Then access is denied and logged",
      "Given vulnerable policy, When exploiting grant_capability chain, Then guest achieves admin privileges",
      "Given hardened policy, When attempting same exploit, Then escalation fails with audit alert",
      "Given capability delegation, When exceeding depth limit, Then further delegation is prevented",
      "Given audit log, When reviewing escalation attempt, Then all steps are traceable"
    ],
    starterFiles: ["caps.h", "caps.c", "policy.json", "audit.c", "attack_demo.c", "hardened_policy.json"],
    starterCodeUrl: `// caps.h
#ifndef CAPS_H
#define CAPS_H

#include <stdbool.h>

typedef enum {
    OP_READ,
    OP_WRITE,
    OP_EXECUTE,
    OP_GRANT,
    OP_REVOKE
} Operation;

typedef enum {
    ROLE_ADMIN,
    ROLE_OPERATOR,
    ROLE_USER,
    ROLE_GUEST
} Role;

typedef struct {
    Role role;
    const char* object;
    Operation operation;
    int delegation_depth;
} Capability;

// TODO: Implement capability system
bool check_capability(const Capability* cap);
bool grant_capability(Role granter, Role grantee, const char* object, Operation op);
void load_policy(const char* policy_file);
void audit_log(const char* action, Role subject, const char* details);

#endif

// caps.c - Starter implementation
#include "caps.h"
#include <stdio.h>

bool check_capability(const Capability* cap) {
    // TODO: Implement proper checks
    // BUG: Current implementation is too permissive
    if (cap->role == ROLE_ADMIN) {
        return true; // Admin can do anything
    }
    // TODO: Add proper role-based checking
    return false;
}

// policy.json - Vulnerable policy
{
  "roles": {
    "admin": ["read", "write", "execute", "grant", "revoke"],
    "operator": ["read", "write", "execute"],
    "user": ["read", "write"],
    "guest": ["read"]
  },
  "grant_rules": {
    "operator_can_grant": ["user_capabilities"],
    "user_can_grant": ["guest_capabilities"]
  }
}

// attack_demo.c
#include "caps.h"
#include <stdio.h>

void demonstrate_escalation() {
    printf("=== Privilege Escalation Demo ===\\n");
    // TODO: Show how guest can escalate to admin
    printf("Step 1: Guest obtains write via user grant\\n");
    printf("Step 2: User grants operator capability\\n");
    printf("Step 3: Escalation complete!\\n");
}`,
    milestones: [
      {
        id: "basic_system",
        title: "Basic Capability System",
        description: "Implement core capability checking and policy loading",
        estimatedHours: 3,
        deliverables: [
          "Capability structure and operations defined",
          "Role-based permission checking",
          "JSON policy parser",
          "Basic audit logging"
        ]
      },
      {
        id: "exploit_demo",
        title: "Privilege Escalation Demonstration",
        description: "Create and document a working privilege escalation attack",
        estimatedHours: 2,
        deliverables: [
          "Vulnerable policy configuration",
          "Working exploit demonstration code",
          "attack_path.md documenting the escalation",
          "Evidence of successful privilege gain"
        ]
      },
      {
        id: "hardening",
        title: "Security Hardening",
        description: "Implement defenses to prevent privilege escalation",
        estimatedHours: 4,
        deliverables: [
          "Hardened policy with delegation limits",
          "Capability chain depth checking",
          "Enhanced audit logging with alerting",
          "Verification that exploit no longer works",
          "Security analysis document"
        ]
      }
    ],
    proOnly: true
  },
  {
    slug: "objfile-parser",
    title: "Object File Parser",
    role: "Toolchain",
    difficulty: "advanced",
    estMinutes: 120,
    summary: "Build a safe and robust parser for ELF object files that extracts headers, sections, and symbol tables while properly validating all inputs to prevent security vulnerabilities.",
    detailedRequirements: `Implement a production-quality parser for the ELF (Executable and Linkable Format) object file format used by compilers and linkers.

The parser must handle:
- ELF header validation (magic numbers, architecture, endianness)
- Section headers parsing (code, data, BSS sections)
- Symbol table extraction (function and variable symbols)
- String table handling for symbol names
- Basic relocation entry parsing

Critical requirement: The parser must be defensive against malformed inputs. Malicious object files should be safely rejected, not cause crashes or memory corruption. This simulates real-world toolchain security requirements.`,
    technicalSpecifications: [
      "Support ELF32 and ELF64 formats",
      "Parse ELF header: magic, class, data, version, machine",
      "Extract program headers and section headers",
      "Parse .symtab (symbol table) and .strtab (string table)",
      "Handle .text, .data, .bss, .rodata sections",
      "Basic relocation entry parsing (.rel/.rela sections)",
      "Validate all offsets and sizes against file bounds",
      "Reject malformed files with clear error messages",
      "Pass fuzzing with AddressSanitizer and UBSanitizer"
    ],
    tags: ["ELF", "parsing", "toolchain", "binary-format", "security"],
    outcomes: [
      "Understand ELF object file format structure",
      "Implement safe binary file parsing",
      "Master input validation and bounds checking",
      "Handle endianness and alignment requirements",
      "Learn toolchain internals (symbols, sections, relocations)",
      "Apply defensive programming against malicious inputs"
    ],
    acceptanceCriteria: [
      "Given valid ELF file, When parsing, Then correctly extracts headers, sections, and symbols",
      "Given malformed size fields, When parsing, Then safely rejects without crash or UB",
      "Given offset pointing beyond file, When accessing, Then bounds check prevents read",
      "Given symbol table, When extracting names, Then handles truncated strings safely",
      "Given fuzz testing with 10000 malformed files, Then no crashes or sanitizer violations"
    ],
    starterFiles: ["elf.h", "elf_parser.c", "elf_validator.c", "test_parser.c", "sample.o"],
    starterCodeUrl: `// elf.h
#ifndef ELF_H
#define ELF_H

#include <stdint.h>
#include <stdbool.h>

#define EI_NIDENT 16

typedef struct {
    unsigned char e_ident[EI_NIDENT];
    uint16_t e_type;
    uint16_t e_machine;
    uint32_t e_version;
    uint64_t e_entry;
    uint64_t e_phoff;
    uint64_t e_shoff;
    uint32_t e_flags;
    uint16_t e_ehsize;
    uint16_t e_phentsize;
    uint16_t e_phnum;
    uint16_t e_shentsize;
    uint16_t e_shnum;
    uint16_t e_shstrndx;
} Elf64_Ehdr;

typedef struct {
    uint32_t sh_name;
    uint32_t sh_type;
    uint64_t sh_flags;
    uint64_t sh_addr;
    uint64_t sh_offset;
    uint64_t sh_size;
    uint32_t sh_link;
    uint32_t sh_info;
    uint64_t sh_addralign;
    uint64_t sh_entsize;
} Elf64_Shdr;

// Parser API
bool elf_parse_file(const char* filename);
bool elf_validate_header(const Elf64_Ehdr* hdr, size_t file_size);
bool elf_parse_sections(const uint8_t* data, size_t size, const Elf64_Ehdr* hdr);

#endif

// elf_parser.c - Starter
#include "elf.h"
#include <stdio.h>
#include <string.h>

bool elf_validate_header(const Elf64_Ehdr* hdr, size_t file_size) {
    // TODO: Validate ELF magic number (0x7F E L F)
    if (memcmp(hdr->e_ident, "\\x7FELF", 4) != 0) {
        fprintf(stderr, "Invalid ELF magic\\n");
        return false;
    }
    
    // TODO: Add more validation
    // - Check e_shoff bounds
    // - Validate e_shnum and e_shentsize
    // - Ensure section headers don't exceed file size
    
    return true; // BUG: Incomplete validation
}

bool elf_parse_sections(const uint8_t* data, size_t size, const Elf64_Ehdr* hdr) {
    // TODO: Safely parse section headers
    // TODO: Extract symbol table and string table
    // TODO: Bounds check all offsets
    return false;
}

// test_parser.c
#include "elf.h"
#include <stdio.h>

int main(int argc, char** argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <elf-file>\\n", argv[0]);
        return 1;
    }
    
    if (elf_parse_file(argv[1])) {
        printf("Successfully parsed ELF file\\n");
        return 0;
    } else {
        fprintf(stderr, "Failed to parse ELF file\\n");
        return 1;
    }
}`,
    milestones: [
      {
        id: "header_parsing",
        title: "ELF Header Validation",
        description: "Parse and validate ELF headers with security checks",
        estimatedHours: 3,
        deliverables: [
          "ELF header structure definitions",
          "Magic number validation",
          "Architecture and endianness detection",
          "Bounds checking for section/program headers",
          "Rejects malformed headers safely"
        ]
      },
      {
        id: "sections_symbols",
        title: "Section and Symbol Parsing",
        description: "Extract sections and symbol tables with full validation",
        estimatedHours: 4,
        deliverables: [
          "Section header parsing with offset validation",
          "Symbol table extraction",
          "String table handling with bounds checks",
          "Pretty-printer for sections and symbols",
          "Test suite with valid ELF files"
        ]
      },
      {
        id: "hardening_fuzzing",
        title: "Security Hardening & Fuzzing",
        description: "Harden against malicious inputs and fuzz test",
        estimatedHours: 3,
        deliverables: [
          "Comprehensive input validation",
          "Integer overflow checks in size calculations",
          "Passes AddressSanitizer and UBSanitizer",
          "Fuzzing corpus with malformed files",
          "No crashes in fuzz testing session"
        ]
      }
    ],
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
