import type { SWETrack, SWELevel } from './sweTypes';
import type { CSLine } from './sweDesignSystem';

export type SweBasicsStorySection = {
  open: string;
  story: string;
  avatarLines: CSLine[];
  mentorName: string;
  mentorRole: string;
  mentorColor: string;
  quiz?: {
    question: string;
    options: { text: string; correct: boolean; feedback: string }[];
    conceptId: string;
  };
};

export const BASICS_STORY: Record<SWETrack, Record<SWELevel, Record<string, SweBasicsStorySection>>> = {
  python: {
    beginner: {
      identity: {
        open: "I heard Python is the language for AI. All I need to do is import tensorflow, right?",
        story: "Aisha is starting her first day at Vela. She opens a Python script to write a data parser, assuming it's built explicitly and only for machine learning.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "I'm ready to write some AI code. Every tutorial says Python is the AI language because it's so smart." },
          { speaker: 'mentor', text: "Python isn't 'smart' on its own. It's successful because it's highly readable and acts as a glue language wrapping high-performance C libraries." },
          { speaker: 'protagonist', text: "Wait, so the Python code isn't actually doing the heavy lifting in AI?" },
          { speaker: 'mentor', text: "Exactly. You write Python to coordinate the logic, but the math happens in C/C++. That's its identity: developer speed over execution speed." }
        ],
      },
      types: {
        open: "I don't have to declare types like in Java. It just figures it out. I can assign an int, then a string. Easy.",
        story: "Aisha writes a simple function that calculates total shift hours, but she accidentally passes a string '8' instead of an integer 8 from an API response.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "Why did 8 + 8 output '88' instead of 16? I thought Python was smart enough to know it's a number." },
          { speaker: 'mentor', text: "Python is dynamically typed, but strongly typed. It won't arbitrarily guess you wanted to add integers if you gave it strings." },
        ],
        quiz: {
          question: "Python executes `total = '8' + '8'`. Why does it return '88' instead of 16?",
          conceptId: 'lang-m0-python-types',
          options: [
            { text: "Python is weakly typed and converts the operation into a string concatenation automatically.", correct: false, feedback: "Python is strongly typed—it doesn't auto-cast implicitly. It does exactly what string+string implies." },
            { text: "Python variables have no type, so the + operator defaults to string concatenation.", correct: false, feedback: "Variables have types (strings), even if you didn't explicitly declare them." },
            { text: "Python infers the type of the variables at runtime as strings, and the + operator concatenates strings.", correct: true, feedback: "Correct. Dynamic typing means the type is checked at runtime, but strong typing means the behavior strictly follows the actual type." }
          ]
        }
      },
      flow: {
        open: "I'll just add one more IF statement. And another one. It's just control flow.",
        story: "Faced with five different shift types, Aisha writes a massive block of nested if/else statements. It works, but it's unreadable.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "My nested IFs work, but the linter is warning me about 'cyclomatic complexity'. What does that mean?" },
          { speaker: 'mentor', text: "It means there are too many paths through your code. Control flow isn't just about making it work; it's about making it readable for the next engineer." }
        ]
      },
      functions: {
        open: "I can just put all the logic in one big file. Why break it up if it only runs once?",
        story: "Aisha encounters her first stack trace. A function failed on line 120, but it was called by another function, which was called by another. The stack trace is terrifying.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "The app crashed and spit out 50 lines of errors. None of my code is even at the top of the error log!" },
          { speaker: 'mentor', text: "That's a stack trace. Python is telling you the exact path it took. Learn to read from bottom up. Functions isolate logic so you can trace errors back to the source." }
        ],
        quiz: {
          question: "When an exception occurs inside a nested function, how does Python report it?",
          conceptId: 'lang-m0-python-functions',
          options: [
            { text: "It prints the name of the file and the line number where the application originally started.", correct: false, feedback: "This would not help you locate the bug." },
            { text: "It generates a traceback showing the sequence of function calls that led to the error.", correct: true, feedback: "Exactly. The traceback (or call stack) is a roadmap of execution." },
            { text: "It immediately terminates and only prints the failing variable name.", correct: false, feedback: "Python provides the full call stack context, not just the failing variable." }
          ]
        }
      },
      challenge: {
        open: "Okay, I understand the pieces. Now I need to build a real program.",
        story: "Aisha is assigned a ticket to write a small reporting script for shift worker hours.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'mentor', text: "You've got the mental models. Now write it yourself. Keep the types clean, control the flow, and use a function." }
        ]
      }
    },
    advanced: {
      identity: {
        open: "I know Python. I can write a web scraper in 10 minutes. It's just a scripting language.",
        story: "Aisha joins Vela, a modern SaaS platform. She expects to write quick scripts but is handed a large, enterprise Python codebase utilizing async/await, type hinting, and metaprogramming.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "This codebase has type hints on every function and massive inheritance trees. I thought Python was supposed to be a simple scripting language." },
          { speaker: 'mentor', text: "Python scales to enterprise architectures when you apply strict disciplines like static typing (mypy) and solid design patterns. Scripting is just its surface area." }
        ]
      },
      types: {
        open: "I'll just use keyword arguments and dictionaries for everything. It's Pythonic.",
        story: "Aisha's flexible data-passing causes a silent bug where an API expects a boolean but receives a string 'False', which evaluates to truthy.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "The API test passed because 'False' is truthy. In a typed language, the compiler would have caught this instantly." },
          { speaker: 'mentor', text: "Precisely. This is why we use Dataclasses, Pydantic, and strict type hints. In an enterprise system, duck typing becomes a liability if not rigorously tested." }
        ],
        quiz: {
          question: "In complex Python applications, what is the safest way to prevent silent 'truthiness' bugs when passing data architectures?",
          conceptId: 'lang-m0-python-adv-types',
          options: [
            { text: "Use explicit type hints and a static type checker like mypy before runtime.", correct: true, feedback: "Static type checkers enforce the contract before the code even runs, preventing string-to-bool mismatch bugs." },
            { text: "Write extensive unit tests for every variable type permutation.", correct: false, feedback: "While good, static analysis prevents the issue globally without requiring exhaustive matrix testing." },
            { text: "Convert all variables to strings explicitly before comparison.", correct: false, feedback: "This masks the problem rather than enforcing type safety." }
          ]
        }
      },
      flow: {
        open: "Generators, async, and decorators are just syntactic sugar. A good old for-loop is all I need.",
        story: "A processing job that operates over 10GB of text fails because Aisha loaded the entire dataset into memory at once.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "The container ran out of memory. The loop is correct, but the data is too large for the RAM." },
          { speaker: 'mentor', text: "Control flow isn't just about branching; it's about resource management. Yielding data lazily via a generator controls the flow of memory usage." }
        ]
      },
      functions: {
        open: "Decorators are magic. I'll just wrap my functions in them without worrying about the closure mechanics.",
        story: "Aisha uses a retry decorator on a database function, but notices that the function's docstring and original name are now missing in the logs.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'protagonist', text: "My profiler shows that 'wrapper' is consuming all the CPU, not my database function." },
          { speaker: 'mentor', text: "A decorator is just a function returning a function. If you don't use functools.wraps, you lose the metadata of the original function. The stack trace hides the truth." }
        ],
        quiz: {
          question: "When writing a professional Python decorator, why must you use @functools.wraps?",
          conceptId: 'lang-m0-python-adv-functions',
          options: [
            { text: "To increase the execution speed of the wrapped function.", correct: false, feedback: "Wraps does not affect performance." },
            { text: "To preserve the original function's metadata (name, docstring) for debugging and introspection.", correct: true, feedback: "Correct. Without it, debugging becomes a nightmare as all decorated functions appear as 'wrapper' in the stack." },
            { text: "To enable the decorator to accept arguments.", correct: false, feedback: "Decorator arguments are handled via a third layer of nested functions, independent of wraps." }
          ]
        }
      },
      challenge: {
        open: "Time to write an elegant, robust solution.",
        story: "Aisha needs to implement a fast data parsing pipeline using generators and clean type systems.",
        mentorName: 'Riya', mentorRole: 'Senior Software Engineer', mentorColor: '#0369A1',
        avatarLines: [
          { speaker: 'mentor', text: "Write the logic using modern Python paradigms: strong typings, safe flow, robust functions." }
        ]
      }
    }
  },
  java: {
    beginner: {
      identity: {
        open: "Java is old and enterprise-y. Why do I have to write public static void main?",
        story: "Vikram boots up Spring Boot for his first week at Finova Systems and is overwhelmed by the sheer volume of boilerplate and compilation steps.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "I just want to print 'hello', but I have to compile the file, create a class, and define a main method. This is too much ceremony." },
          { speaker: 'mentor', text: "Java forces structure because it is designed for millions of lines of code. It compiles to bytecode so it can run securely anywhere on the JVM. The ceremony is safety." }
        ]
      },
      types: {
        open: "Why must I declare everything? Int, String, List<User>. It's so repetitive.",
        story: "Vikram tries to pass a List of Strings into a method expecting a List of Integers. The IDE turns red and stops him before he can even run it.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "My code won't even compile because of a type mismatch. It's annoying." },
          { speaker: 'mentor', text: "Annoying, but brilliant. The compiler just caught a bug that would have crashed production. Static typing is your first line of defense." }
        ],
        quiz: {
          question: "When does Java's type system catch a mismatch (e.g., assigning a String to an int)?",
          conceptId: 'lang-m0-java-types',
          options: [
            { text: "During compilation before the code ever runs.", correct: true, feedback: "Yes. The Java compiler validates all types statically, providing immediate safety." },
            { text: "At runtime, when the variable is first accessed.", correct: false, feedback: "That is how dynamically typed languages work, not Java." },
            { text: "It silently converts the string into an integer if possible.", correct: false, feedback: "Java guarantees strict type safety and does not do implicit parsing of strings to ints." }
          ]
        }
      },
      flow: {
        open: "Control flow in Java is basically the same as everything else, just with more curly braces.",
        story: "Vikram learns that Java's execution model strictly follows block scopes. He declares a variable inside a try block and gets confused when he can't access it in the catch block.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "I can't read 'responseBody' inside my catch block. It says the symbol cannot be found." },
          { speaker: 'mentor', text: "Scope in Java is rigorously bound to the curly braces {}. An error handler cannot access a variable declared inside the try block's private scope." }
        ]
      },
      functions: {
        open: "Methods belong to classes. I memorize the syntax and I'm good to go.",
        story: "Vikram calls a method that throws a checked exception. The compiler refuses to compile until he explicitly handles it.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "The compiler is forcing me to add 'throws IOException' to my method signature. Why?" },
          { speaker: 'mentor', text: "Because Java functions define implicit contracts. A checked exception explicitly warns the caller: 'This method might fail, and you are mandated to write a fallback plan.'" }
        ],
        quiz: {
          question: "What is the primary purpose of Java's 'checked exceptions'?",
          conceptId: 'lang-m0-java-functions',
          options: [
            { text: "To optimize the bytecode for faster execution paths.", correct: false, feedback: "Exceptions actually add overhead; they do not optimize bytecode." },
            { text: "To force the developer by compilation-rule to either handle a specific error or explicitly declare it can be thrown.", correct: true, feedback: "Exactly. It creates an unfoolable structural contract for error handling." },
            { text: "To catch NullPointerExceptions before the program starts.", correct: false, feedback: "NPEs are runtime (unchecked) exceptions, not checked exceptions." }
          ]
        }
      },
      challenge: {
        open: "Let's compile, run, and execute.",
        story: "Vikram is assigned to build a robust Java routine, enforcing types and writing a highly secure structured function.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'mentor', text: "Write the code. The compiler is your pair-programmer. If it compiles, you've survived round one." }
        ]
      }
    },
    advanced: {
      identity: {
        open: "I've written Java for years. I know OOP, interfaces, and Spring. What else is there?",
        story: "Vikram encounters a highly concurrent Java application running on Project Loom. Standard Java execution models of 1 thread = 1 OS thread are totally subverted.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "I spawned 100,000 threads. Why didn't the JVM crash or exhaust the OS resources?" },
          { speaker: 'mentor', text: "Because you're using Virtual Threads. The JVM is decoupling logical tasks from OS threads. Your mental model of 'threads are expensive' is officially outdated." }
        ]
      },
      types: {
        open: "Generics are just angle brackets that let you put objects in lists without casting.",
        story: "Vikram struggles with a complex API accepting Class<? extends Number> and encounters the infamous 'Heap Pollution' warning.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "Type erasure makes absolutely no sense. If the list is a List<String>, why does the JVM not know it's a List<String> at runtime?" },
          { speaker: 'mentor', text: "Because Java prioritized backward compatibility with versions before Generics existed. At runtime, it's just a List. The compiler enforces the types, but the JVM forgets them." }
        ],
        quiz: {
          question: "Due to Java's 'Type Erasure', which of the following checks is illegal at runtime?",
          conceptId: 'lang-m0-java-adv-types',
          options: [
            { text: "if (obj instanceof String)", correct: false, feedback: "Checking simple/non-generic classes is legal at runtime." },
            { text: "if (obj instanceof List<String>)", correct: true, feedback: "Correct! Because of type erasure, the JVM only sees a raw 'List'. It cannot verify the generic type '<String>' at runtime." },
            { text: "if (obj == null)", correct: false, feedback: "Null checks are always valid." }
          ]
        }
      },
      flow: {
        open: "Locks, synchronized blocks, and Executors. I know how to control threads.",
        story: "Vikram creates a deadlock where Thread A holds Lock 1 waiting for Lock 2, while Thread B holds Lock 2 waiting for Lock 1. The flow halts entirely.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "The CPU usage is essentially 0%, but the application is entirely frozen. None of my methods are returning." },
          { speaker: 'mentor', text: "That is a deadlock. This is why we use concurrent data structures or strictly order our lock acquisitions. Flow control in concurrency is a game of dead-ends." }
        ]
      },
      functions: {
        open: "Lambdas are just an alternative syntax for anonymous inner classes.",
        story: "Vikram gets a wildly confusing stack trace deep inside the Java Streams API because his lambda function threw an exception.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'protagonist', text: "The stack trace points to internal Stream Pipeline classes instead of my lambda. It's impossible to debug." },
          { speaker: 'mentor', text: "Functional programming in Java abstracts execution. That means stack traces map the internal JVM machinery, not just your logical flow. You must rely on domain-level logging." }
        ],
        quiz: {
          question: "Why do stack traces originating from within a Java Stream map or lambda look significantly more complex than standard loops?",
          conceptId: 'lang-m0-java-adv-functions',
          options: [
            { text: "Lambdas are compiled into completely separate hidden classes leading to deeper execution stacks within the Java standard library's pipeline architecture.", correct: true, feedback: "Yes! Streams use a complex pipeline architecture of internal classes, making the trace physically deeper than a structural 'for' loop." },
            { text: "The JVM does not support logging from within lambdas.", correct: false, feedback: "Logging within lambdas works exactly as expected." },
            { text: "Stream operations hide the execution context completely, generating random identifiers.", correct: false, feedback: "They don't generate random identifiers; they just expose the internal functional machinery of Java." }
          ]
        }
      },
      challenge: {
        open: "Building a highly optimized Java component.",
        story: "Vikram is finalizing a robust data structure utilizing generics and type safety.",
        mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
        avatarLines: [
          { speaker: 'mentor', text: "Let's see if you can wire up an impeccable class structure without falling into any compiler traps." }
        ]
      }
    }
  },
  nodejs: {
    beginner: {
      identity: {
        open: "It's just JavaScript, but running on my computer instead of Chrome.",
        story: "Leo writes a loop that reads 10 files synchronously. It works, but his mentor points out he is blocking the server.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "It's just JavaScript. I read the files and return them. Why is my server rejecting new connections while doing this?" },
          { speaker: 'mentor', text: "Because Node is single-threaded. If your code is busy reading a disk synchronously, it literally cannot listen for new HTTP requests. Welcome to asynchronous programming." }
        ]
      },
      types: {
        open: "No types, no rules. JavaScript rules the world.",
        story: "Leo compares a string id from a URL parameter to a numeric id from the database using strict equality. It fails silently.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "The user is in the database with ID 5. I checked `user.id === req.params.id`. But it returns false. What?!" },
          { speaker: 'mentor', text: "req.params.id is the string '5'. user.id is the number 5. Strict equality (===) does not coerce types. Dynamic typing doesn't mean type coercion is magic." }
        ],
        quiz: {
          question: "In JavaScript/Node.js, what is the result of evaluating `5 === '5'`?",
          conceptId: 'lang-m0-node-types',
          options: [
            { text: "true, because JS automatically converts the string to a number for equality.", correct: false, feedback: "That describes double equals (==), not strict equality (===)." },
            { text: "false, because strict equality checks both value AND type, and number !== string.", correct: true, feedback: "Exactly right. This prevents extremely dangerous implicit conversion bugs." },
            { text: "It throws a TypeError at runtime.", correct: false, feedback: "JS allows the comparison; it simply evaluates to false." }
          ]
        }
      },
      flow: {
        open: "If I need to do 3 things in order, I'll just put them inside each other.",
        story: "Leo discovers 'Callback Hell'. He tries to query the DB, read a file, and write a response—resulting in code indented 8 levels deep.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "My code looks like a sideways pyramid. And I have no idea how to catch an error that happens in the middle block." },
          { speaker: 'mentor', text: "That is callback hell. Control flow in modern Node.js relies on Promises and async/await to flatten that pyramid back into readable, sequential lines." }
        ]
      },
      functions: {
        open: "Functions are just blocks of code I call when I need them.",
        story: "Leo passes a class method as a callback, and inside the callback, 'this' becomes undefined.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "I passed user.printName as a callback, but 'this.name' suddenly says 'Cannot read properties of undefined'." },
          { speaker: 'mentor', text: "In JavaScript, 'this' is dynamic. It depends on *how* the function is called, not where it was defined. This is why we use arrow functions—they capture 'this' lexically." }
        ],
        quiz: {
          question: "When passing a function as a callback in Node.js, what feature ensures the `this` context remains bound to the enclosing scope?",
          conceptId: 'lang-m0-node-functions',
          options: [
            { text: "Declaring the function with the 'async' keyword.", correct: false, feedback: "Async defines promise behavior, it does not bind context." },
            { text: "Using an Arrow Function (() => {}) instead of the `function` keyword.", correct: true, feedback: "Arrow functions do not have their own 'this' mapping, they inherit it from the enclosing lexical scope." },
            { text: "Using the 'strict mode' directive.", correct: false, feedback: "Strict mode actually ensures 'this' is undefined rather than the global object, but doesn't bind it." }
          ]
        }
      },
      challenge: {
        open: "Writing asynchronous logic.",
        story: "Leo needs to build an asynchronous script that correctly uses Promises and strictly equates values.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'mentor', text: "Write the logic cleanly. Handle errors. Keep an eye on your types." }
        ]
      }
    },
    advanced: {
      identity: {
        open: "Node is just libuv and the V8 Engine. As long as I keep the event loop unblocked, I'm scaling.",
        story: "Leo deploys to production but sees massive memory leaks. The garbage collector runs constantly, effectively blocking the loop anyway.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "No synchronous operations, no heavy parsing. Why is the event loop starving?" },
          { speaker: 'mentor', text: "You have a massive closure holding onto references from every HTTP request. Garbage collection sweeps are synchronous execution phases in V8. Bad memory management ruins the event loop." }
        ]
      },
      types: {
        open: "TypeScript compiles to JavaScript. Once it runs, the types are gone, so who cares?",
        story: "Leo trusts a third-party API response because his TypeScript interface says it's a Number. At runtime, the API returns a String.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "TypeScript guaranteed `user.age` was a number. Why did `user.age.toFixed()` throw a TypeError?" },
          { speaker: 'mentor', text: "TypeScript is a structural validator at compile-time. It lies at runtime unless you actively validate I/O boundaries with Zod or Joi. Your types are illusions unless strictly guarded." }
        ],
        quiz: {
          question: "Why does TypeScript fail to prevent exceptions when fetching external API data that violates the type interface?",
          conceptId: 'lang-m0-node-adv-types',
          options: [
            { text: "TypeScript is compiled completely away; it exists only to satisfy the IDE, offering zero runtime validation.", correct: true, feedback: "Yes. Once compiled to JS, external data can be any shape. You must validate the runtime boundary using schemas." },
            { text: "TypeScript's type system handles JSON parsing improperly under asynchronous loads.", correct: false, feedback: "The async load is irrelevant; TypeScript simply doesn't exist at runtime." },
            { text: "TypeScript automatically coerces the API array into objects, breaking strict structure.", correct: false, feedback: "TS performs no coercion at runtime." }
          ]
        }
      },
      flow: {
        open: "I'll just map over an array of 5,000 users and await the database calls using Promise.all(). It's ultra-fast.",
        story: "Leo's `Promise.all` fires 5,000 simultaneous SQL queries. The connection pool gets instantly exhausted, crashing the database.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "I thought Promise.all was the most efficient way to run tasks concurrently." },
          { speaker: 'mentor', text: "It is—so efficient it effectively acts as a DDoS attack on your own database. Advanced flow control requires chunking and rate-limiting promises, not just launching them blindly." }
        ]
      },
      functions: {
        open: "Closures are incredibly powerful for creating private state.",
        story: "Leo uses closures within an Express middleware to track user analytics, inadvertently leaking gigabytes of memory.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'protagonist', text: "The memory profile points to my tracking function retaining every request object forever." },
          { speaker: 'mentor', text: "You created an implicit closure over the `req` object. Because the analytics function is referenced indefinitely, the GC cannot clear the requests. Context retention is dangerous." }
        ],
        quiz: {
          question: "How does a closure unexpectedly cause memory leaks in long-running Node.js processes?",
          conceptId: 'lang-m0-node-adv-functions',
          options: [
            { text: "Closures inherently disable V8's Garbage Collector across the entire module.", correct: false, feedback: "The GC continues to work; it just recognizes the references as 'still in use'." },
            { text: "By capturing references to large objects (like HTTP Requests) into a scope that never resolves, preventing the GC from freeing them.", correct: true, feedback: "Precisely. The GC cannot delete variables enclosed within an active function's lexical scope." },
            { text: "Closures require allocating synchronous lock memory spaces which stack up over time.", correct: false, feedback: "Node doesn't allocate synchronous lock memories for closures." }
          ]
        }
      },
      challenge: {
        open: "Building a complex integration.",
        story: "Leo builds a high-performance concurrent stream processor utilizing safe types and precise memory handling.",
        mentorName: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
        avatarLines: [
          { speaker: 'mentor', text: "Show me a flawless implementation free of race conditions and memory leaks." }
        ]
      }
    }
  }
};
