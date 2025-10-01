import { Module } from "../pathModules";

export const hardeningFuzzingModules: Module[] = [
  {
    id: "module-1",
    title: "Security Hardening Fundamentals",
    description: "Learn defensive programming and exploit mitigation",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Introduction to Security Hardening",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Introduction to Security Hardening

## 🛡️ What is Security Hardening?

Security hardening is the process of securing a system by:
- Reducing attack surface
- Implementing defense in depth
- Detecting and preventing exploits
- Following secure coding practices

## 🎯 Core Security Principles

### Defense in Depth
Multiple layers of security controls:

\`\`\`cpp
// Layer 1: Input validation
if (!isValid(input)) return false;

// Layer 2: Sanitization
std::string clean = sanitize(input);

// Layer 3: Bounds checking
if (index >= array.size()) return false;

// Layer 4: Safe execution
try {
    processData(clean, index);
} catch (const std::exception& e) {
    logError(e);
    return false;
}
\`\`\`

### Principle of Least Privilege
Give minimal necessary permissions:

\`\`\`cpp
class FileProcessor {
private:
    const std::string filename;  // Immutable
    
public:
    // Read-only access
    std::string readContent() const {
        std::ifstream file(filename);
        // ... read only
    }
    
    // No write access unless explicitly needed
};
\`\`\`

### Fail Securely
When errors occur, fail to a secure state:

\`\`\`cpp
bool authenticate(const std::string& user, const std::string& pass) {
    try {
        // Attempt authentication
        return checkCredentials(user, pass);
    } catch (...) {
        // On any error, deny access
        return false;  // Secure default
    }
}
\`\`\`

## 🚫 Common Vulnerability Types

### 1. Buffer Overflows

**Vulnerable:**
\`\`\`cpp
char buffer[10];
strcpy(buffer, userInput);  // Can overflow!
\`\`\`

**Hardened:**
\`\`\`cpp
std::string buffer;
buffer = userInput;  // Safe, grows as needed
\`\`\`

### 2. Integer Overflows

**Vulnerable:**
\`\`\`cpp
size_t size = userSize * sizeof(int);
int* arr = new int[size];  // Overflow in multiplication!
\`\`\`

**Hardened:**
\`\`\`cpp
if (userSize > SIZE_MAX / sizeof(int)) {
    throw std::overflow_error("Size too large");
}
size_t size = userSize * sizeof(int);
\`\`\`

### 3. Format String Attacks

**Vulnerable:**
\`\`\`cpp
printf(userInput);  // User controls format string!
\`\`\`

**Hardened:**
\`\`\`cpp
printf("%s", userInput.c_str());  // Safe
// Or better:
std::cout << userInput;
\`\`\`

### 4. Time-of-Check to Time-of-Use (TOCTOU)

**Vulnerable:**
\`\`\`cpp
if (access(filename, R_OK) == 0) {
    // Gap here! File could change!
    FILE* f = fopen(filename, "r");
}
\`\`\`

**Hardened:**
\`\`\`cpp
FILE* f = fopen(filename, "r");
if (f == nullptr) {
    // Handle error
}
// Use file immediately
\`\`\`

## 🔐 Input Validation

### Whitelist vs Blacklist

**Blacklist (Weak):**
\`\`\`cpp
bool isValid(const std::string& input) {
    // Try to list all bad inputs
    return input.find("../") == std::string::npos &&
           input.find("..\\\\") == std::string::npos;
    // Easy to bypass!
}
\`\`\`

**Whitelist (Strong):**
\`\`\`cpp
bool isValid(const std::string& input) {
    // Only allow known good inputs
    for (char c : input) {
        if (!std::isalnum(c) && c != '-' && c != '_') {
            return false;
        }
    }
    return !input.empty() && input.length() <= 50;
}
\`\`\`

### Validation Example

\`\`\`cpp
#include <regex>

bool validateEmail(const std::string& email) {
    // Check length first
    if (email.empty() || email.length() > 254) {
        return false;
    }
    
    // Use regex for structure
    static const std::regex pattern(
        R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$)"
    );
    
    return std::regex_match(email, pattern);
}
\`\`\`

## 🔒 Memory Safety

### Bounds Checking

\`\`\`cpp
template<typename T>
T& safeAccess(std::vector<T>& vec, size_t index) {
    if (index >= vec.size()) {
        throw std::out_of_range("Index out of bounds");
    }
    return vec[index];
}
\`\`\`

### Null Pointer Checks

\`\`\`cpp
void process(Widget* widget) {
    if (widget == nullptr) {
        throw std::invalid_argument("Null widget");
    }
    widget->doSomething();
}
\`\`\`

### Use After Free Prevention

\`\`\`cpp
// Bad
Widget* widget = new Widget();
delete widget;
widget->use();  // Undefined behavior!

// Good - Use smart pointers
auto widget = std::make_unique<Widget>();
// Can't use after it's freed
\`\`\`

## 🛡️ Compiler Protections

### Stack Canaries
\`\`\`bash
g++ -fstack-protector-strong source.cpp
\`\`\`

### Address Space Layout Randomization (ASLR)
\`\`\`bash
g++ -fPIE -pie source.cpp
\`\`\`

### Non-Executable Stack
\`\`\`bash
g++ -Wl,-z,noexecstack source.cpp
\`\`\`

### All Protections
\`\`\`bash
g++ -Wall -Wextra -Werror \\
    -fstack-protector-strong \\
    -fPIE -pie \\
    -D_FORTIFY_SOURCE=2 \\
    -Wl,-z,relro,-z,now,-z,noexecstack \\
    source.cpp
\`\`\`

## 📊 Security Checklist

- [ ] Validate all inputs
- [ ] Use safe string functions
- [ ] Check array bounds
- [ ] Use smart pointers
- [ ] Enable compiler warnings
- [ ] Enable compiler protections
- [ ] Handle errors securely
- [ ] Use const correctness
- [ ] Avoid format string bugs
- [ ] Check integer overflows

## 🎯 Key Takeaways

1. **Multiple layers** of defense
2. **Validate all inputs** (whitelist approach)
3. **Use modern C++** features (smart pointers, containers)
4. **Enable compiler** security features
5. **Fail securely** on errors
6. **Never trust** user input

Next: Introduction to fuzzing and automated testing!`,
        },
      },
      {
        id: "lesson-1-2",
        title: "Input Validation Challenge",
        type: "challenge",
        duration: 25,
        content: {
          markdown: `# Input Validation Challenge

## 🎯 Your Mission

Implement secure input validation for a user registration system.

## 📋 Requirements

1. Validate username (alphanumeric, 3-20 chars)
2. Validate email format
3. Validate password strength
4. Reject invalid inputs securely
5. Provide helpful error messages

## 💡 Hints

- Use whitelist validation
- Check length constraints
- Use regex for email validation
- Check password complexity
- Never reveal which part failed (security!)`,
          code: {
            language: "cpp",
            starter: `#include <iostream>
#include <string>
#include <regex>

class InputValidator {
public:
    // TODO: Implement username validation
    // Must be 3-20 characters, alphanumeric only
    static bool validateUsername(const std::string& username) {
        
        
    }
    
    // TODO: Implement email validation
    // Must match standard email format
    static bool validateEmail(const std::string& email) {
        
        
    }
    
    // TODO: Implement password validation
    // Must be 8+ chars, have uppercase, lowercase, digit, special char
    static bool validatePassword(const std::string& password) {
        
        
    }
};

int main() {
    // Test cases
    std::cout << "=== Testing Username Validation ===\\n";
    // TODO: Test valid and invalid usernames
    
    
    std::cout << "\\n=== Testing Email Validation ===\\n";
    // TODO: Test valid and invalid emails
    
    
    std::cout << "\\n=== Testing Password Validation ===\\n";
    // TODO: Test valid and invalid passwords
    
    
    return 0;
}`,
            solution: `#include <iostream>
#include <string>
#include <regex>
#include <cctype>

class InputValidator {
public:
    // Username: 3-20 characters, alphanumeric only
    static bool validateUsername(const std::string& username) {
        // Check length
        if (username.length() < 3 || username.length() > 20) {
            return false;
        }
        
        // Check characters (whitelist)
        for (char c : username) {
            if (!std::isalnum(static_cast<unsigned char>(c))) {
                return false;
            }
        }
        
        return true;
    }
    
    // Email: standard format
    static bool validateEmail(const std::string& email) {
        // Check length
        if (email.empty() || email.length() > 254) {
            return false;
        }
        
        // Use regex for structure validation
        static const std::regex pattern(
            R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$)"
        );
        
        return std::regex_match(email, pattern);
    }
    
    // Password: 8+ chars, uppercase, lowercase, digit, special
    static bool validatePassword(const std::string& password) {
        // Check minimum length
        if (password.length() < 8) {
            return false;
        }
        
        // Check for required character types
        bool hasUpper = false;
        bool hasLower = false;
        bool hasDigit = false;
        bool hasSpecial = false;
        
        for (char c : password) {
            if (std::isupper(static_cast<unsigned char>(c))) hasUpper = true;
            else if (std::islower(static_cast<unsigned char>(c))) hasLower = true;
            else if (std::isdigit(static_cast<unsigned char>(c))) hasDigit = true;
            else if (std::ispunct(static_cast<unsigned char>(c))) hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
};

int main() {
    std::cout << "=== Testing Username Validation ===\\n";
    std::cout << "user123: " << (InputValidator::validateUsername("user123") ? "PASS" : "FAIL") << "\\n";
    std::cout << "ab: " << (InputValidator::validateUsername("ab") ? "PASS" : "FAIL") << " (too short)\\n";
    std::cout << "user@123: " << (InputValidator::validateUsername("user@123") ? "PASS" : "FAIL") << " (invalid char)\\n";
    
    std::cout << "\\n=== Testing Email Validation ===\\n";
    std::cout << "user@example.com: " << (InputValidator::validateEmail("user@example.com") ? "PASS" : "FAIL") << "\\n";
    std::cout << "invalid.email: " << (InputValidator::validateEmail("invalid.email") ? "PASS" : "FAIL") << " (no @)\\n";
    std::cout << "user@: " << (InputValidator::validateEmail("user@") ? "PASS" : "FAIL") << " (incomplete)\\n";
    
    std::cout << "\\n=== Testing Password Validation ===\\n";
    std::cout << "Pass123!: " << (InputValidator::validatePassword("Pass123!") ? "PASS" : "FAIL") << "\\n";
    std::cout << "short: " << (InputValidator::validatePassword("short") ? "PASS" : "FAIL") << " (too short)\\n";
    std::cout << "alllowercase123!: " << (InputValidator::validatePassword("alllowercase123!") ? "PASS" : "FAIL") << " (no uppercase)\\n";
    std::cout << "NoDigits!: " << (InputValidator::validatePassword("NoDigits!") ? "PASS" : "FAIL") << " (no digit)\\n";
    
    return 0;
}`,
            tests: `// Test: All validation functions implemented
// Test: Username validation works correctly
// Test: Email validation works correctly
// Test: Password validation enforces all requirements
// Test: Invalid inputs properly rejected
// Test: Valid inputs properly accepted`,
          },
        },
      },
      {
        id: "lesson-1-3",
        title: "Quiz: Security Hardening",
        type: "quiz",
        duration: 10,
        content: {
          quiz: [
            {
              question: "What is 'defense in depth'?",
              options: [
                "A single strong security measure",
                "Multiple layers of security controls",
                "Encryption only",
                "Password complexity requirements"
              ],
              correctAnswer: "b",
              explanation: "Defense in depth means implementing multiple layers of security controls so if one layer fails, others still provide protection."
            },
            {
              question: "Which validation approach is more secure?",
              options: [
                "Blacklist (block known bad inputs)",
                "Whitelist (allow only known good inputs)",
                "No validation needed",
                "Both are equally secure"
              ],
              correctAnswer: "b",
              explanation: "Whitelist validation is more secure because it only allows explicitly permitted inputs, while blacklists can be bypassed with new attack variants."
            },
            {
              question: "What is a format string vulnerability?",
              options: [
                "Using the wrong date format",
                "Allowing user input to control printf format strings",
                "Formatting code incorrectly",
                "String buffer overflow"
              ],
              correctAnswer: "b",
              explanation: "Format string vulnerabilities occur when user-controlled input is used as a format string (e.g., printf(userInput)), potentially allowing arbitrary memory reads/writes."
            },
            {
              question: "What does ASLR stand for?",
              options: [
                "Advanced Security Layer Routing",
                "Address Space Layout Randomization",
                "Automatic Safety Lock Release",
                "Array Size Limit Restriction"
              ],
              correctAnswer: "b",
              explanation: "ASLR (Address Space Layout Randomization) randomizes memory addresses, making it harder for attackers to predict where code and data will be located."
            },
            {
              question: "What's the secure way to handle authentication errors?",
              options: [
                "Tell user exactly what went wrong",
                "Return the same generic error for all failures",
                "Display detailed debug information",
                "Show database error messages"
              ],
              correctAnswer: "b",
              explanation: "Return generic errors for authentication failures to avoid giving attackers information about valid usernames, password requirements, etc."
            }
          ],
        },
      },
    ],
  },
  {
    id: "module-2",
    title: "Introduction to Fuzzing",
    description: "Automated testing for finding bugs",
    lessons: [
      {
        id: "lesson-2-1",
        title: "What is Fuzzing?",
        type: "lesson",
        duration: 30,
        content: {
          markdown: `# Introduction to Fuzzing

Fuzzing is automated testing that feeds random/malformed data to find bugs.

## Types of Fuzzing
- Mutation-based fuzzing
- Generation-based fuzzing
- Coverage-guided fuzzing`,
        },
      },
    ],
  },
  {
    id: "module-3",
    title: "Exploit Mitigation",
    description: "Techniques to prevent exploits",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Modern Exploit Mitigations",
        type: "lesson",
        duration: 35,
        content: {
          markdown: `# Exploit Mitigation Techniques

Layer defense mechanisms to prevent exploitation.

## Key Mitigations
- ASLR
- Stack canaries
- DEP/NX
- Control Flow Integrity`,
        },
      },
    ],
  },
];
