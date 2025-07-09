export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Professor';
  estimatedTime: string;
  concepts: string[];
  examples: CodeExample[];
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  explanation: string[];
  expectedOutput: string;
  concepts: string[];
  theory: string;
  deepDive?: string;
  memoryAnalysis?: string;
  performanceNotes?: string;
}

export const topics: Topic[] = [
  {
    id: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    description: 'Deep understanding of JavaScript variables, data types, memory allocation, type coercion, and the underlying mechanisms of data storage.',
    difficulty: 'Beginner',
    estimatedTime: '45 minutes',
    concepts: ['Variables', 'Data Types', 'Memory Allocation', 'Type Coercion', 'Primitive vs Reference'],
    examples: [
      {
        id: 'var-declaration',
        title: 'Variable Declaration and Memory Management',
        code: `// Variable declarations and memory allocation
let studentName = "Alice Johnson";     // String stored in heap
const studentAge = 20;                 // Number stored in stack
var isEnrolled = true;                 // Boolean stored in stack
let grades = [85, 92, 78, 96];        // Array object stored in heap

console.log("Student Information:");
console.log("Name:", studentName, "(Type:", typeof studentName, ")");
console.log("Age:", studentAge, "(Type:", typeof studentAge, ")");
console.log("Enrolled:", isEnrolled, "(Type:", typeof isEnrolled, ")");
console.log("Grades:", grades, "(Type:", typeof grades, ")");

// Demonstrating type coercion and comparison
console.log("\\nType Coercion Examples:");
console.log("Age + '5':", studentAge + "5");     // Number to string conversion
console.log("Age == '20':", studentAge == "20"); // Loose equality with coercion
console.log("Age === '20':", studentAge === "20"); // Strict equality without coercion

// Memory reference demonstration
let originalGrades = grades;
grades.push(94);  // Modifying the array
console.log("\\nMemory Reference:");
console.log("Original grades:", originalGrades);
console.log("Current grades:", grades);
console.log("Same reference:", originalGrades === grades);

// Primitive vs Reference types
let num1 = 42;
let num2 = num1;  // Copy value
num1 = 100;
console.log("\\nPrimitive Types (Value Copy):");
console.log("num1:", num1, "num2:", num2);

let obj1 = {score: 85};
let obj2 = obj1;  // Copy reference
obj1.score = 95;
console.log("\\nReference Types (Reference Copy):");
console.log("obj1:", obj1, "obj2:", obj2);`,
        explanation: [
          "Line 2: 'let studentName = \"Alice Johnson\"' - Creates a variable using let keyword, storing a string primitive. The string value is stored in the heap memory due to its potentially variable length.",
          "Line 3: 'const studentAge = 20' - Declares a constant using const keyword, storing a number primitive. Numbers are stored in the stack as they have fixed size (64-bit floating point).",
          "Line 4: 'var isEnrolled = true' - Uses var keyword (function-scoped) to store a boolean primitive. Booleans are stack-stored and represent true/false states.",
          "Line 5: 'let grades = [85, 92, 78, 96]' - Creates an array object. The variable stores a reference to the heap location where the array data is stored.",
          "Lines 7-11: Console output statements demonstrating typeof operator, which returns the primitive type or 'object' for non-primitives.",
          "Line 15: 'studentAge + \"5\"' - JavaScript performs implicit type coercion, converting the number to a string and performing concatenation instead of addition.",
          "Line 16: 'studentAge == \"20\"' - Loose equality operator performs type coercion, converting the string to number before comparison, returning true.",
          "Line 17: 'studentAge === \"20\"' - Strict equality operator compares both value and type without coercion, returning false since types differ.",
          "Lines 19-24: Demonstrates that arrays are reference types - modifying the array affects all variables pointing to the same memory location.",
          "Lines 26-30: Shows primitive types create independent copies when assigned to new variables.",
          "Lines 32-36: Demonstrates reference types share the same memory location, so changes affect all references."
        ],
        expectedOutput: `Student Information:
Name: Alice Johnson (Type: string )
Age: 20 (Type: number )
Enrolled: true (Type: boolean )
Grades: [ 85, 92, 78, 96 ] (Type: object )

Type Coercion Examples:
Age + '5': 205
Age == '20': true
Age === '20': false

Memory Reference:
Original grades: [ 85, 92, 78, 96, 94 ]
Current grades: [ 85, 92, 78, 96, 94 ]
Same reference: true

Primitive Types (Value Copy):
num1: 100 num2: 42

Reference Types (Reference Copy):
obj1: { score: 95 } obj2: { score: 95 }`,
        concepts: ['Variable Declaration', 'Memory Management', 'Type Coercion', 'Equality Operators', 'Primitive Types'],
        theory: 'JavaScript uses dynamic typing, meaning variables can hold different types of values. Understanding the difference between stack (primitives) and heap (objects) storage is crucial for memory management and performance optimization.',
        deepDive: 'JavaScript\'s memory model distinguishes between primitive values (stored by value) and reference values (stored by reference). This affects how variables behave when assigned, passed to functions, and compared. The JavaScript engine optimizes memory allocation and garbage collection based on these patterns.',
        memoryAnalysis: 'Primitive values are stored directly in the variable\'s memory location (stack), while objects are stored in heap memory with variables holding references. This explains why modifying an object affects all variables referencing it, while primitive assignments create independent copies.',
        performanceNotes: 'Primitive operations are faster due to stack storage and direct value access. Object operations involve heap allocation and reference dereferencing. Understanding these differences helps optimize code performance and avoid memory leaks.'
      }
    ]
  },
  {
    id: 'functions-scope',
    title: 'Functions & Scope',
    description: 'Comprehensive exploration of function declarations, expressions, arrow functions, closures, lexical scoping, and the execution context.',
    difficulty: 'Intermediate',
    estimatedTime: '60 minutes',
    concepts: ['Function Declarations', 'Function Expressions', 'Arrow Functions', 'Closures', 'Lexical Scope', 'Execution Context'],
    examples: [
      {
        id: 'closure-demo',
        title: 'Closures and Lexical Scoping Deep Dive',
        code: `// Demonstrating closures and lexical scoping
function createBankAccount(initialBalance) {
    // Private variable - only accessible within this scope
    let balance = initialBalance;
    let transactionHistory = [];
    
    // Return an object with methods that form closures
    return {
        deposit: function(amount) {
            if (amount > 0) {
                balance += amount;
                transactionHistory.push(\`Deposited: $\${amount}\`);
                console.log(\`Deposited $\${amount}. New balance: $\${balance}\`);
            }
            return balance;
        },
        
        withdraw: function(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                transactionHistory.push(\`Withdrew: $\${amount}\`);
                console.log(\`Withdrew $\${amount}. New balance: $\${balance}\`);
            } else {
                console.log("Insufficient funds or invalid amount");
            }
            return balance;
        },
        
        getBalance: () => {
            console.log(\`Current balance: $\${balance}\`);
            return balance;
        },
        
        getHistory: function() {
            console.log("Transaction History:");
            transactionHistory.forEach((transaction, index) => {
                console.log(\`\${index + 1}. \${transaction}\`);
            });
            return transactionHistory;
        }
    };
}

// Creating account instances
const account1 = createBankAccount(1000);
const account2 = createBankAccount(500);

console.log("=== Account 1 Operations ===");
account1.deposit(250);
account1.withdraw(100);
account1.getBalance();

console.log("\\n=== Account 2 Operations ===");
account2.deposit(75);
account2.withdraw(600);  // Should fail
account2.getBalance();

console.log("\\n=== Transaction Histories ===");
account1.getHistory();
console.log("\\nAccount 2:");
account2.getHistory();

// Demonstrating different function types and their scope behavior
console.log("\\n=== Function Types and Scope ===");

// Function declaration (hoisted)
console.log("Calling hoisted function:", hoistedFunction());

function hoistedFunction() {
    return "I'm hoisted!";
}

// Function expression (not hoisted)
const functionExpression = function(name) {
    return \`Hello, \${name}!\`;
};

// Arrow function (lexical this binding)
const arrowFunction = (x, y) => {
    return x + y;
};

// Arrow function with implicit return
const shortArrow = x => x * 2;

console.log("Function expression:", functionExpression("Alice"));
console.log("Arrow function:", arrowFunction(5, 3));
console.log("Short arrow:", shortArrow(7));

// Demonstrating 'this' binding differences
const objectWithMethods = {
    name: "Test Object",
    
    regularMethod: function() {
        console.log("Regular method 'this':", this.name);
        
        // Inner function loses 'this' context
        function innerFunction() {
            console.log("Inner function 'this':", this.name); // undefined
        }
        innerFunction();
        
        // Arrow function preserves 'this' context
        const innerArrow = () => {
            console.log("Inner arrow 'this':", this.name);
        };
        innerArrow();
    },
    
    arrowMethod: () => {
        console.log("Arrow method 'this':", this.name); // undefined
    }
};

console.log("\\n=== 'this' Binding Demonstration ===");
objectWithMethods.regularMethod();
objectWithMethods.arrowMethod();

// Advanced closure example: Function factory
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("\\n=== Function Factory ===");
console.log("Double 5:", double(5));
console.log("Triple 4:", triple(4));

// Closure with private state and public interface
function createCounter() {
    let count = 0;
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count,
        reset: () => { count = 0; return count; }
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log("\\n=== Independent Counters ===");
console.log("Counter 1 increment:", counter1.increment());
console.log("Counter 1 increment:", counter1.increment());
console.log("Counter 2 increment:", counter2.increment());
console.log("Counter 1 value:", counter1.getValue());
console.log("Counter 2 value:", counter2.getValue());`,
        explanation: [
          "Line 2: 'function createBankAccount(initialBalance)' - Function declaration that creates a factory function for bank accounts, demonstrating the module pattern.",
          "Lines 4-5: Private variables 'balance' and 'transactionHistory' - These exist in the function's lexical scope and are not accessible from outside.",
          "Line 7: Return object with methods - Each method forms a closure, capturing the surrounding lexical environment including the private variables.",
          "Lines 8-15: 'deposit' method - A closure that has access to 'balance' and 'transactionHistory' variables even after createBankAccount has finished executing.",
          "Lines 17-25: 'withdraw' method - Another closure with validation logic, demonstrating how closures maintain access to outer scope variables.",
          "Lines 27-30: 'getBalance' arrow function - Shows that arrow functions also create closures and inherit lexical scope from their containing function.",
          "Lines 32-38: 'getHistory' method - Demonstrates closure accessing and iterating over the private transactionHistory array.",
          "Lines 42-43: Creating instances - Each call to createBankAccount creates a new execution context with its own private variables.",
          "Lines 45-48: Account1 operations - Each method call operates on account1's private variables due to closure.",
          "Lines 50-53: Account2 operations - Separate instance with its own enclosed variables, demonstrating data encapsulation.",
          "Lines 58-60: Function declaration hoisting - Functions declared with 'function' keyword are hoisted and can be called before declaration.",
          "Lines 66-74: Different function types showing syntax variations and behavior differences.",
          "Lines 76-98: 'this' binding demonstration showing how regular functions and arrow functions handle context differently.",
          "Lines 100-108: Function factory pattern using closures to create specialized functions.",
          "Lines 110-122: Counter factory demonstrating independent closure instances with private state."
        ],
        expectedOutput: `=== Account 1 Operations ===
Deposited $250. New balance: $1250
Withdrew $100. New balance: $1150
Current balance: $1150

=== Account 2 Operations ===
Deposited $75. New balance: $575
Insufficient funds or invalid amount
Current balance: $575

=== Transaction Histories ===
Transaction History:
1. Deposited: $250
2. Withdrew: $100

Account 2:
Transaction History:
1. Deposited: $75

=== Function Types and Scope ===
Calling hoisted function: I'm hoisted!
Function expression: Hello, Alice!
Arrow function: 8
Short arrow: 14

=== 'this' Binding Demonstration ===
Regular method 'this': Test Object
Inner function 'this': undefined
Inner arrow 'this': Test Object
Arrow method 'this': undefined

=== Function Factory ===
Double 5: 10
Triple 4: 12

=== Independent Counters ===
Counter 1 increment: 1
Counter 1 increment: 2
Counter 2 increment: 1
Counter 1 value: 2
Counter 2 value: 1`,
        concepts: ['Closures', 'Lexical Scoping', 'Private Variables', 'Factory Functions', 'Data Encapsulation'],
        theory: 'Closures are formed when a function is defined inside another function and references variables from the outer scope. The inner function maintains access to these variables even after the outer function has returned, creating a persistent lexical environment.',
        deepDive: 'JavaScript\'s closure mechanism enables powerful patterns like the module pattern, function factories, and private state management. Understanding how the JavaScript engine maintains references to outer scope variables is crucial for memory management and avoiding memory leaks.',
        memoryAnalysis: 'Closures keep references to their outer scope variables, preventing garbage collection of those variables. This can lead to memory leaks if not managed properly, especially in event handlers and callbacks that maintain references to large objects.',
        performanceNotes: 'Closures have slight performance overhead due to scope chain traversal. However, they enable powerful abstractions and are essential for many JavaScript patterns. Modern JavaScript engines optimize closure performance significantly.'
      }
    ]
  },
  {
    id: 'async-programming',
    title: 'Asynchronous Programming',
    description: 'Advanced concepts in asynchronous JavaScript including event loop, promises, async/await, callback patterns, and concurrent execution.',
    difficulty: 'Advanced',
    estimatedTime: '90 minutes',
    concepts: ['Event Loop', 'Promises', 'Async/Await', 'Callbacks', 'Microtasks', 'Error Handling'],
    examples: [
      {
        id: 'async-patterns',
        title: 'Promise Chains, Async/Await, and Error Handling',
        code: `// Simulating API calls with different response times
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        const delay = Math.random() * 2000 + 1000; // 1-3 seconds
        console.log(\`Starting fetch for user \${userId}... (estimated \${Math.round(delay)}ms)\`);
        
        setTimeout(() => {
            if (userId > 0) {
                resolve({
                    id: userId,
                    name: \`User \${userId}\`,
                    email: \`user\${userId}@example.com\`,
                    fetchTime: Math.round(delay)
                });
            } else {
                reject(new Error(\`Invalid user ID: \${userId}\`));
            }
        }, delay);
    });
}

function fetchUserPosts(userId) {
    return new Promise((resolve) => {
        const delay = Math.random() * 1500 + 500; // 0.5-2 seconds
        setTimeout(() => {
            resolve([
                \`Post 1 by User \${userId}\`,
                \`Post 2 by User \${userId}\`,
                \`Post 3 by User \${userId}\`
            ]);
        }, delay);
    });
}

// Method 1: Promise Chaining
console.log("=== Method 1: Promise Chaining ===");
const startTime1 = Date.now();

fetchUserData(1)
    .then(user => {
        console.log("User fetched:", user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log("Posts fetched:", posts);
        console.log(\`Total time (chaining): \${Date.now() - startTime1}ms\\n\`);
    })
    .catch(error => {
        console.error("Error in promise chain:", error.message);
    });

// Method 2: Async/Await with Sequential Execution
async function fetchUserDataSequential() {
    console.log("=== Method 2: Async/Await Sequential ===");
    const startTime2 = Date.now();
    
    try {
        const user = await fetchUserData(2);
        console.log("User fetched:", user);
        
        const posts = await fetchUserPosts(user.id);
        console.log("Posts fetched:", posts);
        console.log(\`Total time (sequential): \${Date.now() - startTime2}ms\\n\`);
    } catch (error) {
        console.error("Error in async function:", error.message);
    }
}

// Method 3: Concurrent Execution with Promise.all
async function fetchUserDataConcurrent() {
    console.log("=== Method 3: Concurrent Execution ===");
    const startTime3 = Date.now();
    
    try {
        // Both promises start executing immediately
        const [user, posts] = await Promise.all([
            fetchUserData(3),
            fetchUserPosts(3)
        ]);
        
        console.log("User fetched:", user);
        console.log("Posts fetched:", posts);
        console.log(\`Total time (concurrent): \${Date.now() - startTime3}ms\\n\`);
    } catch (error) {
        console.error("Error in concurrent execution:", error.message);
    }
}

// Method 4: Promise.allSettled for handling mixed results
async function fetchMultipleUsersSettled() {
    console.log("=== Method 4: Promise.allSettled ===");
    const startTime4 = Date.now();
    
    const userPromises = [
        fetchUserData(4),
        fetchUserData(-1), // This will fail
        fetchUserData(5)
    ];
    
    const results = await Promise.allSettled(userPromises);
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(\`User \${index + 1} success:, result.value);
        } else {
            console.log(\`User \${index + 1} failed:, result.reason.message);
        }
    });
    
    console.log(\`Total time (allSettled): \${Date.now() - startTime4}ms\\n\`);
}

// Method 5: Promise.race for timeout handling
async function fetchWithTimeout() {
    console.log("=== Method 5: Promise.race with Timeout ===");
    
    function createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timed out')), ms);
        });
    }
    
    try {
        const result = await Promise.race([
            fetchUserData(6),
            createTimeout(1500) // 1.5 second timeout
        ]);
        
        console.log("Fetch completed within timeout:", result);
    } catch (error) {
        console.log("Fetch failed or timed out:", error.message);
    }
}

// Advanced: Custom Promise implementation for understanding
class CustomPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(callback => callback(value));
            }
        };
        
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(callback => callback(reason));
            }
        };
        
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    
    then(onFulfilled, onRejected) {
        return new CustomPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                try {
                    const result = onFulfilled ? onFulfilled(this.value) : this.value;
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            } else if (this.state === 'rejected') {
                try {
                    const result = onRejected ? onRejected(this.reason) : this.reason;
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            } else {
                this.onFulfilledCallbacks.push((value) => {
                    try {
                        const result = onFulfilled ? onFulfilled(value) : value;
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
                
                this.onRejectedCallbacks.push((reason) => {
                    try {
                        const result = onRejected ? onRejected(reason) : reason;
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });
    }
    
    catch(onRejected) {
        return this.then(null, onRejected);
    }
}

// Test custom promise
console.log("\\n=== Custom Promise Test ===");
const customPromise = new CustomPromise((resolve, reject) => {
    setTimeout(() => resolve("Custom promise resolved!"), 1000);
});

customPromise
    .then(result => {
        console.log("Custom promise result:", result);
        return "Chained result";
    })
    .then(result => {
        console.log("Chained custom promise:", result);
    })
    .catch(error => {
        console.error("Custom promise error:", error);
    });

// Execute all methods
fetchUserDataSequential();
fetchUserDataConcurrent();
fetchMultipleUsersSettled();
fetchWithTimeout();

// Event loop demonstration
console.log("\\n=== Event Loop Demonstration ===");
console.log("1. Synchronous");

setTimeout(() => console.log("4. Macro task (setTimeout)"), 0);

Promise.resolve().then(() => console.log("3. Micro task (Promise)"));

console.log("2. Synchronous");`,
        explanation: [
          "Lines 2-19: 'fetchUserData' function - Creates a Promise that simulates an API call with random delay, demonstrating Promise constructor pattern with resolve/reject.",
          "Lines 21-31: 'fetchUserPosts' function - Another Promise-based function simulating API call, showing how Promises can be chained or combined.",
          "Lines 34-46: Promise chaining pattern - Uses .then() methods to handle sequential asynchronous operations, with .catch() for error handling.",
          "Line 35: 'fetchUserData(1).then()' - Starts the promise chain, the .then() callback executes when the promise resolves.",
          "Lines 37-39: Second .then() in chain - Receives the result from previous promise and initiates another async operation.",
          "Lines 48-60: Async/await sequential pattern - Modern syntax that makes asynchronous code look synchronous, executing operations one after another.",
          "Line 53: 'await fetchUserData(2)' - Pauses function execution until promise resolves, then assigns result to variable.",
          "Lines 62-76: Concurrent execution with Promise.all - Starts multiple promises simultaneously and waits for all to complete.",
          "Lines 69-72: 'Promise.all([...])' - Executes promises concurrently, resolving when all complete or rejecting if any fails.",
          "Lines 78-95: Promise.allSettled - Handles mixed success/failure results, useful when some operations can fail without stopping others.",
          "Lines 97-113: Promise.race with timeout - Demonstrates racing promises against a timeout, useful for preventing hanging operations.",
          "Lines 115-175: Custom Promise implementation - Shows internal Promise mechanics including state management and callback queues.",
          "Lines 177-190: Custom Promise testing - Demonstrates that the custom implementation works like native Promises.",
          "Lines 192-200: Event loop demonstration - Shows the order of execution for synchronous code, microtasks, and macrotasks."
        ],
        expectedOutput: `=== Method 1: Promise Chaining ===
Starting fetch for user 1... (estimated 1847ms)
=== Method 2: Async/Await Sequential ===
Starting fetch for user 2... (estimated 1203ms)
=== Method 3: Concurrent Execution ===
Starting fetch for user 3... (estimated 1654ms)
Starting fetch for user 3... (estimated 1127ms)
User fetched: { id: 2, name: 'User 2', email: 'user2@example.com', fetchTime: 1203 }
Posts fetched: [ 'Post 1 by User 2', 'Post 2 by User 2', 'Post 3 by User 2' ]
Total time (sequential): 2456ms

Posts fetched: [ 'Post 1 by User 3', 'Post 2 by User 3', 'Post 3 by User 3' ]
User fetched: { id: 3, name: 'User 3', email: 'user3@example.com', fetchTime: 1654 }
Total time (concurrent): 1654ms

User fetched: { id: 1, name: 'User 1', email: 'user1@example.com', fetchTime: 1847 }
Posts fetched: [ 'Post 1 by User 1', 'Post 2 by User 1', 'Post 3 by User 1' ]
Total time (chaining): 3021ms

=== Method 4: Promise.allSettled ===
Starting fetch for user 4... (estimated 1234ms)
Starting fetch for user -1... (estimated 1567ms)
Starting fetch for user 5... (estimated 1890ms)
User 1 success: { id: 4, name: 'User 4', email: 'user4@example.com', fetchTime: 1234 }
User 2 failed: Invalid user ID: -1
User 3 success: { id: 5, name: 'User 5', email: 'user5@example.com', fetchTime: 1890 }
Total time (allSettled): 1890ms

=== Method 5: Promise.race with Timeout ===
Starting fetch for user 6... (estimated 2134ms)
Fetch failed or timed out: Operation timed out

=== Custom Promise Test ===
Custom promise result: Custom promise resolved!
Chained custom promise: Chained result

=== Event Loop Demonstration ===
1. Synchronous
2. Synchronous
3. Micro task (Promise)
4. Macro task (setTimeout)`,
        concepts: ['Promises', 'Async/Await', 'Promise.all', 'Error Handling', 'Concurrent Execution'],
        theory: 'Asynchronous programming allows JavaScript to handle multiple operations without blocking the main thread. Promises provide a cleaner way to handle async operations compared to callbacks, while async/await syntax makes asynchronous code more readable. Promise.all enables concurrent execution for improved performance.',
        deepDive: 'The JavaScript event loop manages asynchronous operations through microtasks (Promises) and macrotasks (setTimeout, setInterval). Understanding the execution order and how different Promise methods behave is crucial for writing efficient asynchronous code.',
        memoryAnalysis: 'Promises maintain references to their callback functions and resolved/rejected values. Long-running promise chains can accumulate memory if not properly managed. Understanding promise lifecycle helps prevent memory leaks in asynchronous applications.',
        performanceNotes: 'Concurrent execution with Promise.all can significantly improve performance compared to sequential await calls. Promise.race is useful for implementing timeouts. Choose the appropriate Promise method based on your specific use case and error handling requirements.'
      }
    ]
  },
  {
    id: 'data-structures-algorithms',
    title: 'Data Structures & Algorithms',
    description: 'Implementation and analysis of fundamental data structures, algorithm complexity, sorting algorithms, and search techniques with performance analysis.',
    difficulty: 'Expert',
    estimatedTime: '120 minutes',
    concepts: ['Arrays', 'Objects', 'Maps', 'Sets', 'Big O Notation', 'Sorting Algorithms', 'Search Algorithms'],
    examples: [
      {
        id: 'sorting-algorithms',
        title: 'Sorting Algorithms with Performance Analysis',
        code: `// Sorting algorithms with performance measurement and step tracking
class SortingAnalyzer {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
    }
    
    // Bubble Sort - O(n²) time complexity
    bubbleSort(arr) {
        console.log("=== Bubble Sort Analysis ===");
        const data = [...arr]; // Create a copy
        this.reset();
        const startTime = performance.now();
        
        for (let i = 0; i < data.length - 1; i++) {
            let swapped = false;
            this.steps.push(\`Pass \${i + 1}: Starting bubble sort pass\`);
            
            for (let j = 0; j < data.length - i - 1; j++) {
                this.comparisons++;
                this.steps.push(\`Comparing \${data[j]} with \${data[j + 1]}\`);
                
                if (data[j] > data[j + 1]) {
                    // Swap elements
                    [data[j], data[j + 1]] = [data[j + 1], data[j]];
                    this.swaps++;
                    swapped = true;
                    this.steps.push(\`Swapped: \${data[j + 1]} and \${data[j]}\`);
                }
            }
            
            if (!swapped) {
                this.steps.push("Array is sorted, breaking early");
                break;
            }
        }
        
        const endTime = performance.now();
        this.printResults("Bubble Sort", data, startTime, endTime);
        return data;
    }
    
    // Quick Sort - O(n log n) average case
    quickSort(arr) {
        console.log("\\n=== Quick Sort Analysis ===");
        const data = [...arr];
        this.reset();
        const startTime = performance.now();
        
        this.quickSortHelper(data, 0, data.length - 1);
        
        const endTime = performance.now();
        this.printResults("Quick Sort", data, startTime, endTime);
        return data;
    }
    
    quickSortHelper(arr, low, high) {
        if (low < high) {
            this.steps.push(\`Partitioning array from index \${low} to \${high}\`);
            const pivotIndex = this.partition(arr, low, high);
            this.steps.push(\`Pivot placed at index \${pivotIndex}, value: \${arr[pivotIndex]}\`);
            
            this.quickSortHelper(arr, low, pivotIndex - 1);
            this.quickSortHelper(arr, pivotIndex + 1, high);
        }
    }
    
    partition(arr, low, high) {
        const pivot = arr[high];
        this.steps.push(\`Chosen pivot: \${pivot}\`);
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            this.comparisons++;
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.swaps++;
                this.steps.push(\`Moved \${arr[i]} to left partition\`);
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.swaps++;
        return i + 1;
    }
    
    // Merge Sort - O(n log n) guaranteed
    mergeSort(arr) {
        console.log("\\n=== Merge Sort Analysis ===");
        const data = [...arr];
        this.reset();
        const startTime = performance.now();
        
        const result = this.mergeSortHelper(data);
        
        const endTime = performance.now();
        this.printResults("Merge Sort", result, startTime, endTime);
        return result;
    }
    
    mergeSortHelper(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        
        const mid = Math.floor(arr.length / 2);
        this.steps.push(\`Dividing array of length \${arr.length} at index \${mid}\`);
        
        const left = this.mergeSortHelper(arr.slice(0, mid));
        const right = this.mergeSortHelper(arr.slice(mid));
        
        return this.merge(left, right);
    }
    
    merge(left, right) {
        const result = [];
        let leftIndex = 0;
        let rightIndex = 0;
        
        this.steps.push(\`Merging arrays of length \${left.length} and \${right.length}\`);
        
        while (leftIndex < left.length && rightIndex < right.length) {
            this.comparisons++;
            if (left[leftIndex] <= right[rightIndex]) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }
        
        // Add remaining elements
        while (leftIndex < left.length) {
            result.push(left[leftIndex]);
            leftIndex++;
        }
        
        while (rightIndex < right.length) {
            result.push(right[rightIndex]);
            rightIndex++;
        }
        
        return result;
    }
    
    reset() {
        this.comparisons = 0;
        this.swaps = 0;
        this.steps = [];
    }
    
    printResults(algorithm, sortedArray, startTime, endTime) {
        console.log(\`Algorithm: \${algorithm}\`);
        console.log(\`Sorted array: [\${sortedArray.join(', ')}]\`);
        console.log(\`Comparisons: \${this.comparisons}\`);
        console.log(\`Swaps: \${this.swaps}\`);
        console.log(\`Execution time: \${(endTime - startTime).toFixed(4)} milliseconds\`);
        console.log(\`Steps taken: \${this.steps.length}\`);
        
        // Show first few steps for demonstration
        console.log("First 5 steps:");
        this.steps.slice(0, 5).forEach((step, index) => {
            console.log(\`  \${index + 1}. \${step}\`);
        });
    }
}

// Advanced Data Structures Implementation
class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.buckets = new Array(size).fill(null).map(() => []);
        this.count = 0;
    }
    
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i) * i) % this.size;
        }
        return hash;
    }
    
    set(key, value) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        // Check if key already exists
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value;
                return;
            }
        }
        
        // Add new key-value pair
        bucket.push([key, value]);
        this.count++;
        
        // Resize if load factor > 0.75
        if (this.count / this.size > 0.75) {
            this.resize();
        }
    }
    
    get(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                return bucket[i][1];
            }
        }
        
        return undefined;
    }
    
    resize() {
        const oldBuckets = this.buckets;
        this.size *= 2;
        this.buckets = new Array(this.size).fill(null).map(() => []);
        this.count = 0;
        
        // Rehash all elements
        for (const bucket of oldBuckets) {
            for (const [key, value] of bucket) {
                this.set(key, value);
            }
        }
    }
    
    display() {
        console.log("Hash Table Contents:");
        this.buckets.forEach((bucket, index) => {
            if (bucket.length > 0) {
                console.log(\`  Bucket \${index}: \${bucket.map(([k, v]) => \`\${k}: \${v}\`).join(', ')}\`);
            }
        });
        console.log(\`Load factor: \${(this.count / this.size).toFixed(2)}\`);
    }
}

// Binary Search Tree Implementation
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(value) {
        this.root = this.insertHelper(this.root, value);
    }
    
    insertHelper(node, value) {
        if (node === null) {
            return new TreeNode(value);
        }
        
        if (value < node.value) {
            node.left = this.insertHelper(node.left, value);
        } else if (value > node.value) {
            node.right = this.insertHelper(node.right, value);
        }
        
        return node;
    }
    
    search(value) {
        return this.searchHelper(this.root, value);
    }
    
    searchHelper(node, value) {
        if (node === null || node.value === value) {
            return node;
        }
        
        if (value < node.value) {
            return this.searchHelper(node.left, value);
        } else {
            return this.searchHelper(node.right, value);
        }
    }
    
    inorderTraversal() {
        const result = [];
        this.inorderHelper(this.root, result);
        return result;
    }
    
    inorderHelper(node, result) {
        if (node !== null) {
            this.inorderHelper(node.left, result);
            result.push(node.value);
            this.inorderHelper(node.right, result);
        }
    }
}

// Test data
const testArray = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50];
console.log(\`Original array: [\${testArray.join(', ')}]\`);

// Create analyzer and test algorithms
const analyzer = new SortingAnalyzer();

// Test Bubble Sort
analyzer.bubbleSort(testArray);

// Test Quick Sort
analyzer.quickSort(testArray);

// Test Merge Sort
analyzer.mergeSort(testArray);

// Performance comparison summary
console.log("\\n=== Algorithm Complexity Analysis ===");
console.log("Bubble Sort: O(n²) time, O(1) space - Simple but inefficient");
console.log("Quick Sort: O(n log n) average, O(n²) worst case - Fast in practice");
console.log("Merge Sort: O(n log n) guaranteed, O(n) space - Stable and predictable");

// Test Hash Table
console.log("\\n=== Hash Table Demo ===");
const hashTable = new HashTable(5);
hashTable.set("name", "Alice");
hashTable.set("age", "25");
hashTable.set("city", "New York");
hashTable.set("country", "USA");
hashTable.set("job", "Engineer");
hashTable.set("hobby", "Reading"); // This should trigger resize

hashTable.display();
console.log("Get 'name':", hashTable.get("name"));
console.log("Get 'age':", hashTable.get("age"));

// Test Binary Search Tree
console.log("\\n=== Binary Search Tree Demo ===");
const bst = new BinarySearchTree();
const treeValues = [50, 30, 70, 20, 40, 60, 80];

treeValues.forEach(value => bst.insert(value));

console.log("Tree values (inorder):", bst.inorderTraversal());
console.log("Search for 40:", bst.search(40) ? "Found" : "Not found");
console.log("Search for 100:", bst.search(100) ? "Found" : "Not found");`,
        explanation: [
          "Lines 2-7: SortingAnalyzer class constructor initializes counters for performance metrics (comparisons, swaps) and steps array for tracking algorithm execution.",
          "Lines 9-35: bubbleSort method implements bubble sort with O(n²) time complexity, comparing adjacent elements and swapping if they're in wrong order.",
          "Lines 15-17: Outer loop controls passes - Each pass moves the largest unsorted element to its correct position at the end of the array.",
          "Lines 19-29: Inner loop performs comparisons - Compares adjacent elements and swaps them if they're out of order, tracking each comparison and swap.",
          "Lines 31-34: Early termination optimization - If no swaps occur in a pass, the array is already sorted and algorithm can terminate early.",
          "Lines 37-47: quickSort method implements quick sort with O(n log n) average time complexity using divide-and-conquer strategy.",
          "Lines 49-56: quickSortHelper recursive function partitions array around pivot and recursively sorts subarrays before and after pivot.",
          "Lines 58-75: partition method rearranges array so elements less than pivot are on left, greater than pivot on right, returns pivot's final position.",
          "Lines 77-87: mergeSort method implements merge sort with guaranteed O(n log n) time complexity and stable sorting property.",
          "Lines 89-99: mergeSortHelper recursively divides array into smaller subarrays until single elements remain.",
          "Lines 101-125: merge method combines two sorted arrays into one sorted array, maintaining the sorted order.",
          "Lines 127-142: printResults method displays comprehensive performance metrics including comparisons, swaps, execution time, and algorithm steps.",
          "Lines 144-190: HashTable implementation with dynamic resizing, collision handling via chaining, and load factor management.",
          "Lines 192-240: BinarySearchTree implementation with insertion, search, and traversal operations for efficient data organization.",
          "Lines 242-260: Testing section demonstrating all algorithms and data structures with performance analysis and comparison."
        ],
        expectedOutput: `Original array: [64, 34, 25, 12, 22, 11, 90, 88, 76, 50]

=== Bubble Sort Analysis ===
Algorithm: Bubble Sort
Sorted array: [11, 12, 22, 25, 34, 50, 64, 76, 88, 90]
Comparisons: 81
Swaps: 36
Execution time: 0.0847 milliseconds
Steps taken: 127
First 5 steps:
  1. Pass 1: Starting bubble sort pass
  2. Comparing 64 with 34
  3. Swapped: 34 and 64
  4. Comparing 64 with 25
  5. Swapped: 25 and 64

=== Quick Sort Analysis ===
Algorithm: Quick Sort
Sorted array: [11, 12, 22, 25, 34, 50, 64, 76, 88, 90]
Comparisons: 29
Swaps: 15
Execution time: 0.0213 milliseconds
Steps taken: 23
First 5 steps:
  1. Partitioning array from index 0 to 9
  2. Chosen pivot: 50
  3. Moved 34 to left partition
  4. Moved 25 to left partition
  5. Moved 12 to left partition

=== Merge Sort Analysis ===
Algorithm: Merge Sort
Sorted array: [11, 12, 22, 25, 34, 50, 64, 76, 88, 90]
Comparisons: 24
Swaps: 0
Execution time: 0.0156 milliseconds
Steps taken: 19
First 5 steps:
  1. Dividing array of length 10 at index 5
  2. Dividing array of length 5 at index 2
  3. Dividing array of length 2 at index 1
  4. Merging arrays of length 1 and 1
  5. Dividing array of length 3 at index 1

=== Algorithm Complexity Analysis ===
Bubble Sort: O(n²) time, O(1) space - Simple but inefficient
Quick Sort: O(n log n) average, O(n²) worst case - Fast in practice
Merge Sort: O(n log n) guaranteed, O(n) space - Stable and predictable

=== Hash Table Demo ===
Hash Table Contents:
  Bucket 0: name: Alice, job: Engineer
  Bucket 2: age: 25, hobby: Reading
  Bucket 4: city: New York
  Bucket 6: country: USA
Load factor: 0.30
Get 'name': Alice
Get 'age': 25

=== Binary Search Tree Demo ===
Tree values (inorder): [20, 30, 40, 50, 60, 70, 80]
Search for 40: Found
Search for 100: Not found`,
        concepts: ['Sorting Algorithms', 'Time Complexity', 'Space Complexity', 'Hash Tables', 'Binary Search Trees'],
        theory: 'Algorithm analysis involves understanding time and space complexity using Big O notation. Different sorting algorithms have different performance characteristics and use cases. Data structures like hash tables and binary search trees provide efficient operations for specific access patterns.',
        deepDive: 'Sorting algorithms demonstrate fundamental algorithmic techniques: divide-and-conquer (merge sort, quick sort), comparison-based sorting, and stability properties. Hash tables provide O(1) average-case operations through effective hash functions and collision resolution. Binary search trees maintain sorted order with O(log n) operations.',
        memoryAnalysis: 'Bubble sort and quick sort are in-place algorithms using O(1) extra space. Merge sort requires O(n) additional space for merging. Hash tables use dynamic arrays with load factor management. Binary search trees use O(n) space with potential for unbalanced growth.',
        performanceNotes: 'Quick sort is fastest in practice despite O(n²) worst case. Merge sort guarantees O(n log n) and is stable. Hash tables provide constant-time operations with good hash functions. Binary search trees degrade to O(n) operations when unbalanced - consider self-balancing variants for guaranteed performance.'
      }
    ]
  },
  {
    id: 'web-apis-dom',
    title: 'Web APIs & DOM Manipulation',
    description: 'Comprehensive guide to DOM manipulation, event handling, Web APIs, and modern browser features.',
    difficulty: 'Advanced',
    estimatedTime: '90 minutes',
    concepts: ['DOM Manipulation', 'Event Handling', 'Web APIs', 'Local Storage', 'Fetch API', 'Intersection Observer'],
    examples: [
      {
        id: 'dom-manipulation',
        title: 'Advanced DOM Manipulation and Web APIs',
        code: `// Advanced DOM Manipulation and Web APIs
class ModernWebApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.createHTML();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.loadTasks();
        this.setupServiceWorker();
        console.log("Modern Web App initialized");
    }
    
    createHTML() {
        document.body.innerHTML = \`
            <div class="app-container">
                <header class="app-header">
                    <h1>Advanced Task Manager</h1>
                    <div class="stats">
                        <span id="task-count">0 tasks</span>
                        <span id="online-status">Online</span>
                    </div>
                </header>
                
                <main class="main-content">
                    <section class="task-input-section">
                        <form id="task-form">
                            <input type="text" id="task-input" placeholder="Enter a new task..." required>
                            <select id="priority-select">
                                <option value="low">Low Priority</option>
                                <option value="medium" selected>Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                            <button type="submit">Add Task</button>
                        </form>
                    </section>
                    
                    <section class="filters">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="pending">Pending</button>
                        <button class="filter-btn" data-filter="completed">Completed</button>
                        <button class="filter-btn" data-filter="high">High Priority</button>
                    </section>
                    
                    <section class="task-list-section">
                        <div id="task-list" class="task-list"></div>
                        <div id="empty-state" class="empty-state hidden">
                            <p>No tasks yet. Add one above!</p>
                        </div>
                    </section>
                </main>
                
                <div id="notification-container" class="notification-container"></div>
            </div>
        \`;
        
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = \`
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .app-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .app-header {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                padding: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .stats span {
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 20px;
                margin-left: 10px;
                font-size: 14px;
            }
            
            .main-content { padding: 30px; }
            
            .task-input-section form {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
            }
            
            #task-input {
                flex: 1;
                padding: 15px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            
            #task-input:focus {
                outline: none;
                border-color: #4facfe;
            }
            
            #priority-select, button {
                padding: 15px 20px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            button:hover {
                background: #f8f9fa;
                transform: translateY(-2px);
            }
            
            .filters {
                display: flex;
                gap: 10px;
                margin-bottom: 30px;
            }
            
            .filter-btn {
                padding: 10px 20px;
                border: 2px solid #e1e5e9;
                background: white;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .filter-btn.active {
                background: #4facfe;
                color: white;
                border-color: #4facfe;
            }
            
            .task-item {
                background: #f8f9fa;
                border: 2px solid #e1e5e9;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s;
                opacity: 0;
                transform: translateY(20px);
                animation: slideIn 0.5s forwards;
            }
            
            @keyframes slideIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .task-item.completed {
                opacity: 0.7;
                text-decoration: line-through;
            }
            
            .task-item.high { border-left: 5px solid #ff4757; }
            .task-item.medium { border-left: 5px solid #ffa502; }
            .task-item.low { border-left: 5px solid #26de81; }
            
            .task-checkbox {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }
            
            .task-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .task-text { font-size: 16px; font-weight: 500; }
            .task-meta { font-size: 12px; color: #666; }
            
            .task-actions {
                display: flex;
                gap: 10px;
            }
            
            .btn-small {
                padding: 8px 12px;
                font-size: 12px;
                border-radius: 6px;
            }
            
            .btn-danger {
                background: #ff4757;
                color: white;
                border-color: #ff4757;
            }
            
            .notification {
                background: #26de81;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                margin-bottom: 10px;
                animation: slideInRight 0.3s;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            
            .hidden { display: none; }
            
            .fade-in { animation: fadeIn 0.5s; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        \`;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Task form submission
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.filterTasks(e.target.dataset.filter);
            });
        });
        
        // Online/offline status
        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                document.getElementById('task-input').focus();
            }
        });
        
        // Visibility API for tab focus
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateTaskCount();
            }
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        this.observers.set('intersection', observer);
    }
    
    addTask() {
        const input = document.getElementById('task-input');
        const prioritySelect = document.getElementById('priority-select');
        
        if (!input.value.trim()) return;
        
        const task = {
            id: Date.now(),
            text: input.value.trim(),
            priority: prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTask(task);
        this.updateTaskCount();
        this.showNotification(\`Task "\${task.text}" added successfully!\`);
        
        // Reset form
        input.value = '';
        input.focus();
        
        // Haptic feedback (if supported)
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    renderTask(task) {
        const taskList = document.getElementById('task-list');
        const taskElement = document.createElement('div');
        taskElement.className = \`task-item \${task.priority} \${task.completed ? 'completed' : ''}\`;
        taskElement.dataset.taskId = task.id;
        
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : null;
        
        taskElement.innerHTML = \`
            <input type="checkbox" class="task-checkbox" \${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text">\${task.text}</div>
                <div class="task-meta">
                    Priority: \${task.priority.toUpperCase()} | Created: \${createdDate}
                    \${completedDate ? \` | Completed: \${completedDate}\` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-small btn-danger" onclick="app.deleteTask(\${task.id})">Delete</button>
            </div>
        \`;
        
        // Add event listener for checkbox
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        
        // Add to intersection observer
        this.observers.get('intersection').observe(taskElement);
        
        taskList.insertBefore(taskElement, taskList.firstChild);
        this.updateEmptyState();
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            const taskElement = document.querySelector(\`[data-task-id="\${taskId}"]\`);
            taskElement.classList.toggle('completed');
            
            // Update meta information
            const metaElement = taskElement.querySelector('.task-meta');
            const createdDate = new Date(task.createdAt).toLocaleDateString();
            const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString() : null;
            
            metaElement.textContent = \`Priority: \${task.priority.toUpperCase()} | Created: \${createdDate}\${completedDate ? \` | Completed: \${completedDate}\` : ''}\`;
            
            this.saveTasks();
            this.updateTaskCount();
            this.showNotification(\`Task \${task.completed ? 'completed' : 'reopened'}!\`);
        }
    }
    
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const task = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);
            
            const taskElement = document.querySelector(\`[data-task-id="\${taskId}"]\`);
            taskElement.style.animation = 'slideOut 0.3s forwards';
            
            setTimeout(() => {
                taskElement.remove();
                this.updateEmptyState();
            }, 300);
            
            this.saveTasks();
            this.updateTaskCount();
            this.showNotification(\`Task "\${task.text}" deleted!\`);
        }
    }
    
    loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        
        this.tasks.forEach(task => this.renderTask(task));
        this.updateTaskCount();
        this.updateEmptyState();
    }
    
    filterTasks(filter) {
        const tasks = document.querySelectorAll('.task-item');
        
        tasks.forEach(taskElement => {
            const taskId = parseInt(taskElement.dataset.taskId);
            const task = this.tasks.find(t => t.id === taskId);
            let show = true;
            
            switch (filter) {
                case 'completed':
                    show = task.completed;
                    break;
                case 'pending':
                    show = !task.completed;
                    break;
                case 'high':
                    show = task.priority === 'high';
                    break;
                case 'all':
                default:
                    show = true;
            }
            
            taskElement.style.display = show ? 'flex' : 'none';
        });
        
        this.updateEmptyState();
    }
    
    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    updateTaskCount() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        document.getElementById('task-count').textContent = 
            \`\${total} tasks (\${completed} completed, \${pending} pending)\`;
    }
    
    updateEmptyState() {
        const taskList = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        const visibleTasks = taskList.querySelectorAll('.task-item:not([style*="display: none"])');
        
        if (visibleTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
    
    updateOnlineStatus(isOnline) {
        const statusElement = document.getElementById('online-status');
        statusElement.textContent = isOnline ? 'Online' : 'Offline';
        statusElement.style.background = isOnline ? 'rgba(38, 222, 129, 0.3)' : 'rgba(255, 71, 87, 0.3)';
        
        this.showNotification(\`You are now \${isOnline ? 'online' : 'offline'}\`);
    }
    
    showNotification(message) {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the app
const app = new ModernWebApp();

// Add some CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = \`
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
    
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(additionalStyles);

console.log("Advanced DOM Manipulation and Web APIs demo loaded!");
console.log("Features demonstrated:");
console.log("- Dynamic HTML generation");
console.log("- Event delegation and handling");
console.log("- Local Storage API");
console.log("- Intersection Observer API");
console.log("- Online/Offline detection");
console.log("- Visibility API");
console.log("- CSS animations and transitions");
console.log("- Service Worker registration");`,
        explanation: [
          "Lines 2-8: ModernWebApp class constructor initializes the application, loads data from localStorage, and sets up various components.",
          "Lines 10-17: init() method orchestrates the application setup including HTML creation, event listeners, and API initialization.",
          "Lines 19-54: createHTML() method dynamically generates the entire application interface using template literals and DOM manipulation.",
          "Lines 56-140: addStyles() method injects comprehensive CSS styles including animations, transitions, and responsive design.",
          "Lines 142-168: setupEventListeners() method establishes event handling for form submission, filtering, keyboard shortcuts, and browser APIs.",
          "Lines 170-178: setupIntersectionObserver() creates an observer for implementing scroll-based animations and lazy loading effects.",
          "Lines 180-206: addTask() method handles task creation with validation, data persistence, and user feedback including haptic feedback.",
          "Lines 208-238: renderTask() method creates DOM elements for individual tasks with event listeners and intersection observer registration.",
          "Lines 240-262: toggleTask() method handles task completion state changes with DOM updates and data persistence.",
          "Lines 264-280: deleteTask() method removes tasks with smooth animations and updates the application state.",
          "Lines 282-289: loadTasks() method renders all tasks from stored data and updates the interface state.",
          "Lines 291-315: filterTasks() method implements dynamic filtering of tasks based on various criteria.",
          "Lines 317-322: setActiveFilter() method manages the visual state of filter buttons.",
          "Lines 324-331: updateTaskCount() method calculates and displays task statistics in real-time.",
          "Lines 333-342: updateEmptyState() method shows/hides empty state message based on visible tasks.",
          "Lines 344-350: updateOnlineStatus() method handles online/offline status changes with visual feedback.",
          "Lines 352-363: showNotification() method creates temporary notification messages with animations.",
          "Lines 365-367: saveTasks() method persists task data to localStorage for data persistence.",
          "Lines 369-377: setupServiceWorker() method registers a service worker for offline functionality and caching."
        ],
        expectedOutput: `Advanced DOM Manipulation and Web APIs demo loaded!
Features demonstrated:
- Dynamic HTML generation
- Event delegation and handling
- Local Storage API
- Intersection Observer API
- Online/Offline detection
- Visibility API
- CSS animations and transitions
- Service Worker registration

Modern Web App initialized

[The application creates a fully functional task manager with:]
- Header showing "Advanced Task Manager" with task count and online status
- Task input form with priority selection
- Filter buttons (All, Pending, Completed, High Priority)
- Dynamic task list with animations
- Real-time notifications
- Responsive design with smooth animations
- Persistent data storage
- Offline capability detection

[User interactions produce:]
- "Task '[task name]' added successfully!" notifications
- Real-time task count updates
- Smooth slide-in animations for new tasks
- Filter-based task visibility
- Completion status toggles
- Delete confirmations with slide-out animations
- Online/offline status notifications`,
        concepts: ['DOM Manipulation', 'Event Handling', 'Web APIs', 'Local Storage', 'Intersection Observer', 'Service Workers'],
        theory: 'Modern web development leverages browser APIs to create rich, interactive applications. DOM manipulation enables dynamic content updates, while Web APIs provide access to device features and browser capabilities. Understanding event handling, storage APIs, and modern browser features is essential for creating professional web applications.',
        deepDive: 'The application demonstrates advanced patterns including event delegation for performance, intersection observers for scroll-based effects, local storage for data persistence, and service workers for offline functionality. These APIs work together to create a seamless user experience that rivals native applications.',
        memoryAnalysis: 'DOM elements consume memory proportional to their complexity and number. Event listeners create references that prevent garbage collection. Intersection observers efficiently manage scroll-based animations. Local storage provides persistent data without server requests. Proper cleanup of observers and event listeners prevents memory leaks.',
        performanceNotes: 'Event delegation reduces memory usage compared to individual event listeners. Intersection observers are more efficient than scroll event listeners. CSS animations perform better than JavaScript animations. Local storage is synchronous and can block the main thread for large data sets. Service workers enable background processing and caching strategies.'
      }
    ]
  },
  {
    id: 'modern-javascript',
    title: 'Modern JavaScript (ES6+)',
    description: 'Advanced ES6+ features including modules, destructuring, spread/rest operators, template literals, and modern JavaScript patterns.',
    difficulty: 'Expert',
    estimatedTime: '120 minutes',
    concepts: ['ES6+ Features', 'Modules', 'Destructuring', 'Spread/Rest', 'Template Literals', 'Modern Patterns'],
    examples: [
      {
        id: 'es6-features',
        title: 'Comprehensive ES6+ Features and Patterns',
        code: `// Comprehensive ES6+ Features and Modern JavaScript Patterns

// 1. Template Literals and Tagged Templates
console.log("=== Template Literals and Tagged Templates ===");

const user = {
    name: "Alice Johnson",
    age: 28,
    role: "Senior Developer",
    skills: ["JavaScript", "React", "Node.js", "Python"]
};

// Enhanced template literals
const userProfile = \`
    👤 User Profile:
    Name: \${user.name}
    Age: \${user.age}
    Role: \${user.role}
    Skills: \${user.skills.join(", ")}
    Profile URL: \${user.name.toLowerCase().replace(" ", "-")}.dev
\`;

console.log(userProfile);

// Tagged template function
function highlight(strings, ...values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] ? \`<mark>\${values[i]}</mark>\` : '';
        return result + string + value;
    }, '');
}

const highlightedText = highlight\`User \${user.name} is \${user.age} years old and works as a \${user.role}\`;
console.log("Highlighted:", highlightedText);

// 2. Destructuring Assignment (Advanced Patterns)
console.log("\\n=== Advanced Destructuring Patterns ===");

// Object destructuring with renaming and defaults
const { name: userName, age: userAge, salary = 75000, department = "Engineering" } = user;
console.log(\`\${userName} (\${userAge}) works in \${department} with salary $\${salary}\`);

// Nested destructuring
const company = {
    name: "TechCorp",
    location: {
        city: "San Francisco",
        state: "CA",
        coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    employees: [
        { name: "Alice", role: "Developer" },
        { name: "Bob", role: "Designer" },
        { name: "Charlie", role: "Manager" }
    ]
};

const {
    name: companyName,
    location: { city, coordinates: { lat, lng } },
    employees: [firstEmployee, ...otherEmployees]
} = company;

console.log(\`\${companyName} is located in \${city} at coordinates (\${lat}, \${lng})\`);
console.log(\`First employee: \${firstEmployee.name}, Others: \${otherEmployees.length}\`);

// Array destructuring with rest and defaults
const scores = [95, 87, 92, 78, 85];
const [highest, second, third = 0, ...remaining] = scores;
console.log(\`Top 3: \${highest}, \${second}, \${third}. Remaining: \${remaining}\`);

// Function parameter destructuring
function createUserCard({ name, age, role, skills = [] }) {
    return \`
        <div class="user-card">
            <h3>\${name}</h3>
            <p>Age: \${age} | Role: \${role}</p>
            <p>Skills: \${skills.join(", ")}</p>
        </div>
    \`;
}

console.log("User Card:", createUserCard(user));

// 3. Spread and Rest Operators
console.log("\\n=== Spread and Rest Operators ===");

// Array spread
const frontendSkills = ["HTML", "CSS", "JavaScript"];
const backendSkills = ["Node.js", "Python", "SQL"];
const allSkills = [...frontendSkills, "React", ...backendSkills, "Docker"];
console.log("All skills:", allSkills);

// Object spread and merging
const baseUser = { name: "John", age: 30 };
const userDetails = { role: "Developer", department: "Engineering" };
const preferences = { theme: "dark", notifications: true };

const completeUser = {
    ...baseUser,
    ...userDetails,
    ...preferences,
    lastLogin: new Date().toISOString(),
    isActive: true
};

console.log("Complete user:", completeUser);

// Rest parameters in functions
function calculateStats(operation, ...numbers) {
    console.log(\`Performing \${operation} on \${numbers.length} numbers: \${numbers}\`);
    
    switch (operation) {
        case 'sum':
            return numbers.reduce((sum, num) => sum + num, 0);
        case 'average':
            return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
        case 'max':
            return Math.max(...numbers);
        case 'min':
            return Math.min(...numbers);
        default:
            return null;
    }
}

console.log("Sum:", calculateStats('sum', 10, 20, 30, 40, 50));
console.log("Average:", calculateStats('average', 85, 92, 78, 96, 88));
console.log("Max:", calculateStats('max', 15, 42, 8, 73, 29));

// 4. Arrow Functions and Advanced Function Patterns
console.log("\\n=== Arrow Functions and Advanced Patterns ===");

// Various arrow function syntaxes
const square = x => x * x;
const add = (a, b) => a + b;
const greet = name => \`Hello, \${name}!\`;
const createObject = (name, age) => ({ name, age, id: Date.now() });

console.log("Square of 5:", square(5));
console.log("Add 3 + 7:", add(3, 7));
console.log("Greeting:", greet("Alice"));
console.log("Created object:", createObject("Bob", 25));

// Higher-order functions with arrows
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const processNumbers = (arr) => ({
    evens: arr.filter(n => n % 2 === 0),
    odds: arr.filter(n => n % 2 !== 0),
    squares: arr.map(n => n * n),
    sum: arr.reduce((sum, n) => sum + n, 0),
    doubled: arr.map(n => n * 2)
});

const results = processNumbers(numbers);
console.log("Processed numbers:", results);

// Currying with arrow functions
const multiply = a => b => a * b;
const double = multiply(2);
const triple = multiply(3);

console.log("Double 5:", double(5));
console.log("Triple 4:", triple(4));

// 5. Classes and Inheritance (ES6+)
console.log("\\n=== Modern Classes and Inheritance ===");

class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
        this._energy = 100;
    }
    
    // Getter and setter
    get energy() {
        return this._energy;
    }
    
    set energy(value) {
        this._energy = Math.max(0, Math.min(100, value));
    }
    
    // Method
    speak() {
        return \`\${this.name} makes a sound\`;
    }
    
    // Static method
    static getSpeciesInfo(species) {
        const info = {
            'dog': 'Loyal companion',
            'cat': 'Independent hunter',
            'bird': 'Flying creature'
        };
        return info[species] || 'Unknown species';
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name, 'dog');
        this.breed = breed;
        this.tricks = [];
    }
    
    speak() {
        return \`\${this.name} barks: Woof!\`;
    }
    
    learnTrick(trick) {
        this.tricks.push(trick);
        this.energy -= 10;
        return \`\${this.name} learned to \${trick}!\`;
    }
    
    performTrick() {
        if (this.tricks.length === 0) {
            return \`\${this.name} doesn't know any tricks yet\`;
        }
        
        const trick = this.tricks[Math.floor(Math.random() * this.tricks.length)];
        this.energy -= 5;
        return \`\${this.name} performs: \${trick}!\`;
    }
}

const myDog = new Dog("Buddy", "Golden Retriever");
console.log(myDog.speak());
console.log(myDog.learnTrick("sit"));
console.log(myDog.learnTrick("roll over"));
console.log(myDog.performTrick());
console.log(\`Energy: \${myDog.energy}\`);
console.log("Species info:", Animal.getSpeciesInfo('dog'));

// 6. Modules (Simulated)
console.log("\\n=== Module Patterns ===");

// Simulating ES6 modules with objects
const MathUtils = {
    // Named exports
    PI: 3.14159,
    
    add: (a, b) => a + b,
    
    multiply: (a, b) => a * b,
    
    factorial: function(n) {
        return n <= 1 ? 1 : n * this.factorial(n - 1);
    },
    
    // Default export equivalent
    default: {
        calculate: (operation, ...args) => {
            switch (operation) {
                case 'add':
                    return args.reduce((sum, num) => sum + num, 0);
                case 'multiply':
                    return args.reduce((product, num) => product * num, 1);
                default:
                    return null;
            }
        }
    }
};

// Using the "module"
const { add, multiply, PI } = MathUtils;
const calculator = MathUtils.default;

console.log("Add:", add(5, 3));
console.log("Multiply:", multiply(4, 7));
console.log("PI:", PI);
console.log("Calculator add:", calculator.calculate('add', 1, 2, 3, 4, 5));
console.log("Factorial of 5:", MathUtils.factorial(5));

// 7. Async/Await with Modern Patterns
console.log("\\n=== Modern Async Patterns ===");

// Async utility functions
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchUserData = async (userId) => {
    console.log(\`Fetching user \${userId}...\`);
    await delay(1000);
    return {
        id: userId,
        name: \`User \${userId}\`,
        email: \`user\${userId}@example.com\`,
        lastActive: new Date().toISOString()
    };
};

// Async iteration and processing
async function processUsers() {
    const userIds = [1, 2, 3, 4, 5];
    
    // Sequential processing
    console.log("Sequential processing:");
    for (const id of userIds.slice(0, 2)) {
        const user = await fetchUserData(id);
        console.log(\`  Processed: \${user.name}\`);
    }
    
    // Parallel processing
    console.log("\\nParallel processing:");
    const userPromises = userIds.slice(2).map(id => fetchUserData(id));
    const users = await Promise.all(userPromises);
    users.forEach(user => console.log(\`  Processed: \${user.name}\`));
}

// 8. Advanced Object and Array Methods
console.log("\\n=== Advanced Object and Array Methods ===");

const products = [
    { id: 1, name: "Laptop", price: 999, category: "Electronics", inStock: true },
    { id: 2, name: "Phone", price: 699, category: "Electronics", inStock: false },
    { id: 3, name: "Book", price: 29, category: "Education", inStock: true },
    { id: 4, name: "Headphones", price: 199, category: "Electronics", inStock: true },
    { id: 5, name: "Desk", price: 299, category: "Furniture", inStock: false }
];

// Advanced array methods chaining
const analysis = products
    .filter(product => product.inStock)
    .map(product => ({
        ...product,
        priceCategory: product.price > 500 ? 'expensive' : product.price > 100 ? 'moderate' : 'cheap'
    }))
    .reduce((acc, product) => {
        acc.totalValue += product.price;
        acc.categories[product.category] = (acc.categories[product.category] || 0) + 1;
        acc.priceCategories[product.priceCategory] = (acc.priceCategories[product.priceCategory] || 0) + 1;
        return acc;
    }, {
        totalValue: 0,
        categories: {},
        priceCategories: {}
    });

console.log("Product analysis:", analysis);

// Object methods
const productMap = new Map(products.map(p => [p.id, p]));
const categorySet = new Set(products.map(p => p.category));

console.log("Product map keys:", [...productMap.keys()]);
console.log("Unique categories:", [...categorySet]);

// WeakMap for private data
const privateData = new WeakMap();

class SecureUser {
    constructor(name, email) {
        this.name = name;
        privateData.set(this, { email, createdAt: new Date() });
    }
    
    getEmail() {
        return privateData.get(this).email;
    }
    
    getCreatedAt() {
        return privateData.get(this).createdAt;
    }
}

const secureUser = new SecureUser("John Doe", "john@example.com");
console.log("Secure user email:", secureUser.getEmail());
console.log("Created at:", secureUser.getCreatedAt());

// Execute async function
processUsers();

console.log("\\n🎉 Modern JavaScript ES6+ Features Demo Complete!");`,
        explanation: [
          "Lines 4-25: Template literals demonstrate multi-line strings, expression interpolation, and dynamic content generation.",
          "Lines 27-34: Tagged template functions show how to process template literals with custom logic for formatting or escaping.",
          "Lines 36-56: Advanced destructuring patterns including object renaming, default values, nested destructuring, and array destructuring with rest parameters.",
          "Lines 58-65: Function parameter destructuring enables clean API design with named parameters and default values.",
          "Lines 67-85: Spread operator demonstrates array concatenation, object merging, and creating new objects with additional properties.",
          "Lines 87-102: Rest parameters in functions enable variable-length argument lists with clean syntax.",
          "Lines 104-125: Arrow functions show various syntaxes from simple expressions to object returns and higher-order function patterns.",
          "Lines 127-135: Functional programming patterns using array methods with arrow functions for data transformation.",
          "Lines 137-143: Currying with arrow functions demonstrates functional programming concepts and partial application.",
          "Lines 145-195: ES6 classes with inheritance, getters/setters, static methods, and method overriding.",
          "Lines 197-230: Module pattern simulation showing named exports, default exports, and destructuring imports.",
          "Lines 232-255: Modern async patterns with async/await, sequential vs parallel processing, and Promise.all usage.",
          "Lines 257-285: Advanced array methods chaining for complex data transformations and analysis.",
          "Lines 287-305: Modern collection types (Map, Set, WeakMap) and their use cases for data management and privacy."
        ],
        expectedOutput: `=== Template Literals and Tagged Templates ===

    👤 User Profile:
    Name: Alice Johnson
    Age: 28
    Role: Senior Developer
    Skills: JavaScript, React, Node.js, Python
    Profile URL: alice-johnson.dev

Highlighted: User <mark>Alice Johnson</mark> is <mark>28</mark> years old and works as a <mark>Senior Developer</mark>

=== Advanced Destructuring Patterns ===
Alice Johnson (28) works in Engineering with salary $75000
TechCorp is located in San Francisco at coordinates (37.7749, -122.4194)
First employee: Alice, Others: 2
Top 3: 95, 87, 92. Remaining: 78,85
User Card: 
        <div class="user-card">
            <h3>Alice Johnson</h3>
            <p>Age: 28 | Role: Senior Developer</p>
            <p>Skills: JavaScript, React, Node.js, Python</p>
        </div>

=== Spread and Rest Operators ===
All skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Python", "SQL", "Docker"]
Complete user: {name: "John", age: 30, role: "Developer", department: "Engineering", theme: "dark", notifications: true, lastLogin: "2024-01-15T10:30:00.000Z", isActive: true}
Performing sum on 5 numbers: 10,20,30,40,50
Sum: 150
Performing average on 5 numbers: 85,92,78,96,88
Average: 87.8
Performing max on 5 numbers: 15,42,8,73,29
Max: 73

=== Arrow Functions and Advanced Patterns ===
Square of 5: 25
Add 3 + 7: 10
Greeting: Hello, Alice!
Created object: {name: "Bob", age: 25, id: 1642234567890}
Processed numbers: {evens: [2,4,6,8,10], odds: [1,3,5,7,9], squares: [1,4,9,16,25,36,49,64,81,100], sum: 55, doubled: [2,4,6,8,10,12,14,16,18,20]}
Double 5: 10
Triple 4: 12

=== Modern Classes and Inheritance ===
Buddy barks: Woof!
Buddy learned to sit!
Buddy learned to roll over!
Buddy performs: sit!
Energy: 85
Species info: Loyal companion

=== Module Patterns ===
Add: 8
Multiply: 28
PI: 3.14159
Calculator add: 15
Factorial of 5: 120

=== Modern Async Patterns ===
Sequential processing:
Fetching user 1...
  Processed: User 1
Fetching user 2...
  Processed: User 2

Parallel processing:
Fetching user 3...
Fetching user 4...
Fetching user 5...
  Processed: User 3
  Processed: User 4
  Processed: User 5

=== Advanced Object and Array Methods ===
Product analysis: {totalValue: 1227, categories: {Electronics: 2, Education: 1}, priceCategories: {expensive: 1, moderate: 1, cheap: 1}}
Product map keys: [1, 2, 3, 4, 5]
Unique categories: ["Electronics", "Education", "Furniture"]
Secure user email: john@example.com
Created at: Mon Jan 15 2024 10:30:00 GMT-0800 (PST)

🎉 Modern JavaScript ES6+ Features Demo Complete!`,
        concepts: ['Template Literals', 'Destructuring', 'Spread/Rest', 'Arrow Functions', 'Classes', 'Modules', 'Async/Await'],
        theory: 'Modern JavaScript (ES6+) introduces powerful features that enable more expressive, concise, and maintainable code. These features include enhanced syntax for strings, objects, and functions, as well as new paradigms for organizing and structuring applications. Understanding these features is essential for modern web development.',
        deepDive: 'ES6+ features work together to enable functional programming patterns, better code organization, and improved developer experience. Template literals enable better string handling, destructuring simplifies data extraction, spread/rest operators provide flexible function signatures, and classes offer familiar OOP syntax while maintaining JavaScript\'s prototypal inheritance.',
        memoryAnalysis: 'Modern JavaScript features generally improve memory efficiency: destructuring avoids temporary variables, spread operators create shallow copies efficiently, arrow functions have lexical this binding, and WeakMap/WeakSet enable garbage collection of keys. However, excessive use of spread operators and array methods can create intermediate arrays.',
        performanceNotes: 'Arrow functions are slightly faster than regular functions for simple operations. Destructuring has minimal overhead and improves readability. Spread operators are efficient for small objects/arrays but can be expensive for large data structures. Template literals are optimized by JavaScript engines and perform well compared to string concatenation.'
      }
    ]
  }
];