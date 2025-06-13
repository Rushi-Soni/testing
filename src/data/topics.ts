export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
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
}

export const topics: Topic[] = [
  {
    id: 'variables-datatypes',
    title: 'Variables & Data Types',
    description: 'Deep understanding of how JavaScript handles variables, memory allocation, type coercion, and the underlying mechanisms of data storage.',
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
console.log("Age === '20':", studentAge === "20"); // Strict equality without coercion`,
        explanation: [
          "Line 2: 'let studentName = \"Alice Johnson\"' - Creates a variable using let keyword, storing a string primitive. The string value is stored in the heap memory due to its potentially variable length.",
          "Line 3: 'const studentAge = 20' - Declares a constant using const keyword, storing a number primitive. Numbers are stored in the stack as they have fixed size (64-bit floating point).",
          "Line 4: 'var isEnrolled = true' - Uses var keyword (function-scoped) to store a boolean primitive. Booleans are stack-stored and represent true/false states.",
          "Line 5: 'let grades = [85, 92, 78, 96]' - Creates an array object. The variable stores a reference to the heap location where the array data is stored.",
          "Lines 7-11: Console output statements demonstrating typeof operator, which returns the primitive type or 'object' for non-primitives.",
          "Line 14: 'studentAge + \"5\"' - JavaScript performs implicit type coercion, converting the number to a string and performing concatenation instead of addition.",
          "Line 15: 'studentAge == \"20\"' - Loose equality operator performs type coercion, converting the string to number before comparison, returning true.",
          "Line 16: 'studentAge === \"20\"' - Strict equality operator compares both value and type without coercion, returning false since types differ."
        ],
        expectedOutput: `Student Information:
Name: Alice Johnson (Type: string )
Age: 20 (Type: number )
Enrolled: true (Type: boolean )
Grades: [ 85, 92, 78, 96 ] (Type: object )

Type Coercion Examples:
Age + '5': 205
Age == '20': true
Age === '20': false`,
        concepts: ['Variable Declaration', 'Memory Management', 'Type Coercion', 'Equality Operators', 'Primitive Types'],
        theory: 'JavaScript uses dynamic typing, meaning variables can hold different types of values. Understanding the difference between stack (primitives) and heap (objects) storage is crucial for memory management and performance optimization.'
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
account2.getBalance();`,
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
          "Lines 50-53: Account2 operations - Separate instance with its own enclosed variables, demonstrating data encapsulation."
        ],
        expectedOutput: `=== Account 1 Operations ===
Deposited $250. New balance: $1250
Withdrew $100. New balance: $1150
Current balance: $1150

=== Account 2 Operations ===
Deposited $75. New balance: $575
Insufficient funds or invalid amount
Current balance: $575`,
        concepts: ['Closures', 'Lexical Scoping', 'Private Variables', 'Factory Functions', 'Data Encapsulation'],
        theory: 'Closures are formed when a function is defined inside another function and references variables from the outer scope. The inner function maintains access to these variables even after the outer function has returned, creating a persistent lexical environment.'
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

// Execute all methods
fetchUserDataSequential();
fetchUserDataConcurrent();`,
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
          "Lines 54-55 vs 69-72: Sequential vs Concurrent - Sequential waits for each operation, concurrent runs them in parallel for better performance."
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
Total time (chaining): 3021ms`,
        concepts: ['Promises', 'Async/Await', 'Promise.all', 'Error Handling', 'Concurrent Execution'],
        theory: 'Asynchronous programming allows JavaScript to handle multiple operations without blocking the main thread. Promises provide a cleaner way to handle async operations compared to callbacks, while async/await syntax makes asynchronous code more readable. Promise.all enables concurrent execution for improved performance.'
      }
    ]
  },
  {
    id: 'data-structures',
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

// Test data
const testArray = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50];
console.log(\`Original array: [\${testArray.join(', ')}]\`);

// Create analyzer and test algorithms
const analyzer = new SortingAnalyzer();

// Test Bubble Sort
analyzer.bubbleSort(testArray);

// Test Quick Sort
analyzer.quickSort(testArray);

// Performance comparison summary
console.log("\\n=== Performance Summary ===");
console.log("Bubble Sort: O(n²) time complexity - suitable for small datasets");
console.log("Quick Sort: O(n log n) average case - efficient for large datasets");
console.log("Trade-offs: Bubble sort is simpler but slower, Quick sort is faster but uses recursion");`,
        explanation: [
          "Lines 2-7: SortingAnalyzer class constructor - Initializes counters for performance metrics (comparisons, swaps) and steps array for tracking algorithm execution.",
          "Lines 9-35: bubbleSort method - Implements bubble sort with O(n²) time complexity, comparing adjacent elements and swapping if they're in wrong order.",
          "Lines 15-17: Outer loop controls passes - Each pass moves the largest unsorted element to its correct position at the end of the array.",
          "Lines 19-29: Inner loop performs comparisons - Compares adjacent elements and swaps them if they're out of order, tracking each comparison and swap.",
          "Lines 31-34: Early termination optimization - If no swaps occur in a pass, the array is already sorted and algorithm can terminate early.",
          "Lines 37-47: quickSort method - Implements quick sort with O(n log n) average time complexity using divide-and-conquer strategy.",
          "Lines 49-56: quickSortHelper recursive function - Partitions array around pivot and recursively sorts subarrays before and after pivot.",
          "Lines 58-75: partition method - Rearranges array so elements less than pivot are on left, greater than pivot on right, returns pivot's final position.",
          "Lines 61-70: Partitioning logic - Uses two pointers to separate elements, moving smaller elements to left side of array.",
          "Lines 84-95: printResults method - Displays comprehensive performance metrics including comparisons, swaps, execution time, and algorithm steps for analysis."
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

=== Performance Summary ===
Bubble Sort: O(n²) time complexity - suitable for small datasets
Quick Sort: O(n log n) average case - efficient for large datasets
Trade-offs: Bubble sort is simpler but slower, Quick sort is faster but uses recursion`,
        concepts: ['Sorting Algorithms', 'Time Complexity', 'Space Complexity', 'Algorithm Analysis', 'Performance Measurement'],
        theory: 'Algorithm analysis involves understanding time and space complexity using Big O notation. Bubble sort has O(n²) time complexity making it inefficient for large datasets, while quick sort averages O(n log n) through divide-and-conquer strategy. Performance measurement helps validate theoretical analysis.'
      }
    ]
  }
];