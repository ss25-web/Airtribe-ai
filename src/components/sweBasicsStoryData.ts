import type { SWETrack, SWELevel } from './sweTypes';
import type { CSLine } from './sweDesignSystem';

export type SweBasicsStorySection = {
  open: string;
  story: string;
  avatarLines: CSLine[];
  mentorName: string;
  mentorRole: string;
  mentorColor: string;
  quiz?: { question: string; options: { text: string; correct: boolean; feedback: string }[]; conceptId: string };
};

// Helper to standardise section builds
const buildSection = (open: string, story: string, lines: CSLine[], mentor: { name: string; role: string; color: string }): SweBasicsStorySection => ({
  open,
  story,
  avatarLines: lines,
  mentorName: mentor.name,
  mentorRole: mentor.role,
  mentorColor: mentor.color,
});

const PYTHON_MENTOR = { name: 'Riya', role: 'Senior Software Engineer 🐍', color: '#0369A1' };
const JAVA_MENTOR   = { name: 'Kavya', role: 'Senior Backend Engineer ☕', color: '#7C3AED' };
const NODE_MENTOR   = { name: 'Mei', role: 'Senior Full-Stack Engineer ⚡', color: '#DC2626' };

// ─── PYTHON TRACK — Blue Basket Storyline ────────────────────────────────────
// Aisha's first task: build a digital assistant for Blue Basket, a tiny online
// store. Each section follows the arc: build intuition → understand behaviour
// → see examples → reflect.
// ─────────────────────────────────────────────────────────────────────────────
const pythonBeginner = {
  identity: buildSection(
    "What kind of language is Python, really?",
    "Aisha's first task at Blue Basket is simple: write a script that prints the price of an item. She opens her first .py file and immediately notices something odd — no semicolons, no type declarations, no curly braces anywhere. Python reads almost like plain English. Her mental model from other languages falls apart completely. Then she looks closer: the code doesn't compile separately — Python runs it directly from the source file, compiling it quietly to bytecode before the Python Virtual Machine executes it. The runtime is invisible, but it's always there.",
    [
      { speaker: 'protagonist', text: "This looks like pseudocode. Where's the structure? How does Python know where a code block starts if there are no braces?" },
      { speaker: 'mentor', text: "Indentation IS the structure. Python enforces it at the language level. Source goes to bytecode, bytecode goes to the PVM — invisible but consistent across every platform." },
      { speaker: 'protagonist', text: "So indentation isn't a style preference, it's actual syntax?" },
      { speaker: 'mentor', text: "Exactly. Mess it up and the program crashes. Python's saying: readable code isn't optional, it's the law." }
    ],
    PYTHON_MENTOR
  ),

  types: buildSection(
    "Do I just assign values without declaring types?",
    "Aisha starts wiring Blue Basket's product catalog. She creates variables freely — price = 40, name = 'milk', in_stock = True — and Python accepts everything without complaint. Then she tries to build a summary string: print('Total: ' + 40). The program crashes with a TypeError. This surprises her. She thought Python was entirely flexible. Riya explains the distinction that reframes how Aisha thinks about the language: Python is dynamically typed — it figures out types at runtime, no declarations needed. But it is also strongly typed — it refuses to silently coerce incompatible types. Variables are not storage boxes; they are names bound to objects.",
    [
      { speaker: 'protagonist', text: "I did print('Total: ' + 40). Why did it crash? Python seemed so flexible until now." },
      { speaker: 'mentor', text: "Dynamic typing means Python decides the type at runtime. But strong typing means it won't silently turn 40 into a string. Use an f-string: f'Total: {40}'." },
      { speaker: 'protagonist', text: "If I write x = 10 then y = x, are they sharing the same value or two separate copies?" },
      { speaker: 'mentor', text: "They point to the same object. Variables are references, not boxes. That matters enormously with mutable types — change the list through one name, and the other sees it too." }
    ],
    PYTHON_MENTOR
  ),

  flow: buildSection(
    "How does Blue Basket decide if the store is open, or a cart is empty?",
    "Aisha needs to add store logic: show 'Open' or 'Closed' based on stock, and warn customers when their cart is empty. She writes her first conditional blocks in Python. The syntax is clean, but one thing trips her up — Python evaluates truth in ways she did not expect. An empty list [], the number zero, an empty string '', and None are all falsy. They behave like False in an if check. This is Python's truthy/falsy system, and once Aisha sees it, she starts writing cleaner conditions instinctively across every part of the codebase.",
    [
      { speaker: 'protagonist', text: "I wrote if cart == []: to check if the cart was empty. Is that the right way?" },
      { speaker: 'mentor', text: "Just write if not cart:. Empty lists, empty strings, zero, and None are all falsy in Python. No need to compare against the empty value explicitly." },
      { speaker: 'protagonist', text: "What about elif — is that the same as else if in other languages?" },
      { speaker: 'mentor', text: "Yes. if / elif / else handles your branching. break stops a loop early. continue skips the current iteration. These are your four flow-control primitives." }
    ],
    PYTHON_MENTOR
  ),

  loops: buildSection(
    "How do I loop through all products and calculate a total?",
    "Blue Basket now has 50 products. Aisha needs to loop through a cart, find the matching price in the product dictionary, and accumulate a total bill. She starts with a counter variable: for i in range(len(products)). It works, but Riya shows her a cleaner way. Python lets you loop directly over items — for product in products: — which is safer and far less error-prone. Then Aisha adds a while loop for a retry prompt and uses continue to skip unavailable items automatically.",
    [
      { speaker: 'protagonist', text: "I was manually tracking the index with i to access each product. It crashed with an off-by-one error on the last item." },
      { speaker: 'mentor', text: "Python for loops iterate directly over the collection. Use for item in cart:. If you need the index too, use enumerate(cart). No manual counter needed." },
      { speaker: 'protagonist', text: "What if a cart item isn't in the product catalog? Should I use continue to skip it?" },
      { speaker: 'mentor', text: "Exactly. Check if item in products: first, then add to total. continue skips unknowns cleanly. That's Python's loop — direct, readable, and expressive." }
    ],
    PYTHON_MENTOR
  ),

  functions: buildSection(
    "I keep duplicating the same logic. How do I reuse it?",
    "Blue Basket is growing. Aisha has written the price-lookup logic in three places: the checkout page, the admin dashboard, and the order confirmation email. When the product format changes, she updates all three. Riya tells her this is exactly what functions solve. A function is a named, reusable block of logic — define it once with def, call it everywhere. Python also supports keyword arguments, default parameters, and *args/**kwargs for flexible signatures. And functions are first-class objects: they can be assigned to variables, passed into other functions, and returned from functions.",
    [
      { speaker: 'protagonist', text: "If the product format changes, I have to update the parsing logic in three separate places. That's a maintenance nightmare." },
      { speaker: 'mentor', text: "Wrap it in a def. Fix the bug once and it's fixed everywhere the function is called. Functions are the single most powerful tool for eliminating repetition." },
      { speaker: 'protagonist', text: "Can I pass a function as an argument to another function — like a callback?" },
      { speaker: 'mentor', text: "Yes — Python functions are first-class objects. Assign them, pass them, return them. That's what makes map(), filter(), and lambda functions possible." }
    ],
    PYTHON_MENTOR
  ),

  objects: buildSection(
    "Products, customers, carts — how do I model real things in code?",
    "Blue Basket now needs to handle Product, Customer, and Cart as structured entities. Aisha has been tracking product names in one list, prices in another, and stock counts in a third — matching them by index. It's fragile and confusing. Riya introduces classes. A class is a blueprint; an object is an instance created from it, bundling its own data and behavior together. milk = Product('Milk', 40) creates one object. bread = Product('Bread', 25) creates another. Each carries its own internal state. Aisha immediately sees how this cleans up the chaos.",
    [
      { speaker: 'protagonist', text: "I keep names in one list, prices in another, and match by index. It breaks every time I add or remove a product." },
      { speaker: 'mentor', text: "That's the exact problem OOP solves. A Product class holds name, price, and stock together — one object, all related data in one place." },
      { speaker: 'protagonist', text: "What if I want to prevent a negative price? Where does that validation logic go?" },
      { speaker: 'mentor', text: "Inside the class — that's encapsulation. The object controls its own state. Write a method that validates before updating. Keep data behind behaviour." }
    ],
    PYTHON_MENTOR
  ),

  dataStructures: buildSection(
    "I use lists for everything — are there better options?",
    "Blue Basket has 10,000 registered users. Aisha writes if user_id in id_list: and the check takes over a second on every login request. The list scans every item one by one. Riya explains that Python's built-in collection types each have a specific purpose: lists are ordered and mutable. Tuples are ordered but immutable — good for fixed records like GPS coordinates. Sets are unordered, store only unique values, and do lookups in constant time. Dictionaries map keys to values and are the fastest structure for named lookups. Choosing the right structure is one of the most impactful decisions a junior developer makes.",
    [
      { speaker: 'protagonist', text: "Checking if a user ID exists in a list of 10,000 IDs takes a full second. Every. Single. Login." },
      { speaker: 'mentor', text: "Lists search linearly, checking every element. Convert that collection to a set. Sets use hashing internally — lookups happen in constant time regardless of size." },
      { speaker: 'protagonist', text: "When would I use a tuple over a list, or a dictionary over a set?" },
      { speaker: 'mentor', text: "Tuples for fixed, ordered data — like store coordinates. Dicts when you need names: {'milk': 40, 'bread': 25}. Sets for uniqueness. Lists for ordered, changeable sequences. Each has a job." }
    ],
    PYTHON_MENTOR
  ),

  challenge: buildSection(
    "Blue Basket is going live. Can your code handle the real world?",
    "Blue Basket is about to launch with real customers. Aisha's code works perfectly in the happy path — but Riya asks harder questions. What happens when the product file is missing? When a customer enters 'three' instead of a number? When a JSON order has incomplete data? This is where Pre-Read 3 begins: exception handling with try/except/else/finally, defensive validation using isinstance() and early raise, safe file I/O through the with open(...) pattern, and the discipline of virtual environments and requirements.txt for reproducibility. A professional does not just write code that runs once — they write code that fails clearly and recovers gracefully.",
    [
      { speaker: 'mentor', text: "Your app runs perfectly on your machine. What happens when the product file doesn't exist, or a customer types 'three' into the quantity field?" },
      { speaker: 'protagonist', text: "It would crash. The whole order would fail silently. I hadn't thought about any of those cases." },
      { speaker: 'mentor', text: "Wrap risky code in try/except. Validate inputs early with isinstance() and raise. Use with open(...) for safe file access. Pin your packages in requirements.txt so any teammate can reproduce your environment." },
      { speaker: 'protagonist', text: "So reliability isn't something you add at the end — it's a mindset from the very beginning?" },
      { speaker: 'mentor', text: "Exactly. A beginner celebrates when code runs. A professional asks: what happens when it doesn't? Design for failure first." }
    ],
    PYTHON_MENTOR
  ),
};

// ─── JAVA TRACK ──────────────────────────────────────────────────────────────
const javaBeginner = {
  identity: buildSection(
    "Java needs a class for everything? Even Hello World?",
    "Vikram creates his first Java file. He expects to write a simple function, but the compiler demands everything live inside a class with a specific entry-point signature.",
    [
      { speaker: 'protagonist', text: "Why do I need public static void main(String[] args) just to print one line? That's 5 tokens of boilerplate!" },
      { speaker: 'mentor', text: "Java is a strictly object-oriented, statically-typed, compiled language. Every execution starts from a class method. The verbosity is intentional — it makes behaviour explicit and safe at scale." }
    ],
    JAVA_MENTOR
  ),
  types: buildSection(
    "Why must I declare the type of every single variable?",
    "Vikram creates his first Java file and realises he must declare the type of every variable before it compiles.",
    [
      { speaker: 'protagonist', text: "I tried age = 25 and the compiler immediately rejected it." },
      { speaker: 'mentor', text: "Java demands explicit types. int age = 25;. This static typing ensures variables are securely tracked before the program even runs — no surprises at runtime." }
    ],
    JAVA_MENTOR
  ),
  flow: buildSection(
    "Control flow in Java uses curly braces, right?",
    "Vikram writes an if-else block but forgets a curly brace, causing the logic to execute unconditionally.",
    [
      { speaker: 'protagonist', text: "The second line of my 'if' block ran even though the condition was false!" },
      { speaker: 'mentor', text: "Without matching curly braces {}, Java only binds the very first statement to the if. Always use braces to lock down your control flow." }
    ],
    JAVA_MENTOR
  ),
  loops: buildSection(
    "I need to iterate over thousands of records.",
    "Vikram writes a traditional C-style loop but gets an off-by-one array exception at the very end.",
    [
      { speaker: 'protagonist', text: "It crashed on the final loop because i <= array.length searched beyond the array boundary." },
      { speaker: 'mentor', text: "Arrays are zero-indexed. Use the enhanced for-loop for (String name : names) when you don't need the index — it's immune to boundary errors." }
    ],
    JAVA_MENTOR
  ),
  functions: buildSection(
    "What is a Method compared to a Function?",
    "Vikram attempts to write an isolated function outside of a class structure.",
    [
      { speaker: 'protagonist', text: "The compiler says 'class, interface, or enum expected'. I just want a helper function!" },
      { speaker: 'mentor', text: "In Java, everything lives inside a class. We call them methods. To use a helper without instantiating an object, declare it as public static." }
    ],
    JAVA_MENTOR
  ),
  objects: buildSection(
    "The 'new' keyword creates an object. But where does it go?",
    "Vikram creates multiple objects but loses track of their variable references.",
    [
      { speaker: 'protagonist', text: "I passed user1 to a method, changed its name, and the original user1 changed too!" },
      { speaker: 'mentor', text: "Java passes object references by value. You didn't copy the object — you handed the method a pointer to the same physical memory block on the Heap." }
    ],
    JAVA_MENTOR
  ),
  dataStructures: buildSection(
    "Arrays are fixed size? How do I add more data?",
    "Vikram tries to add a 6th item to an array initialised with a size of 5.",
    [
      { speaker: 'protagonist', text: "I got an ArrayIndexOutOfBoundsException when trying to add a new contact." },
      { speaker: 'mentor', text: "Arrays cannot grow in Java. For dynamic collections, use ArrayList or HashSet — they resize automatically." }
    ],
    JAVA_MENTOR
  ),
  challenge: buildSection(
    "Let's compile and execute an application.",
    "Vikram needs to build a CLI Contact Manager using Java Collections.",
    [
      { speaker: 'mentor', text: "Structure a Contact class, write a loop to read input, and use a HashMap to store and retrieve contacts instantly." }
    ],
    JAVA_MENTOR
  ),
};

// ─── NODE.JS TRACK ───────────────────────────────────────────────────────────
const nodeBeginner = {
  identity: buildSection(
    "Is Node.js a language or a runtime?",
    "Leo starts his first Node.js project. He's written frontend JavaScript before, but now wonders why there's no browser, no DOM, no window — yet the syntax is identical.",
    [
      { speaker: 'protagonist', text: "Is Node.js a different language from JavaScript? The syntax looks identical but document doesn't exist." },
      { speaker: 'mentor', text: "Node.js is a runtime — it runs JavaScript outside the browser using Chrome's V8 engine. No DOM, but you get the file system, network, and process APIs instead. Same language, different environment." }
    ],
    NODE_MENTOR
  ),
  types: buildSection(
    "const vs let vs var — and are there real types in JS?",
    "Leo's variable gets unexpectedly overwritten by another block of code because of how JavaScript handles variable scope.",
    [
      { speaker: 'protagonist', text: "I used var for the user ID, but it leaked outside the if-statement and overwrote my database key." },
      { speaker: 'mentor', text: "Use const by default, let only when the value must reassign. Never var — it has function scope, not block scope. And JavaScript will silently coerce types if you don't pay attention." }
    ],
    NODE_MENTOR
  ),
  flow: buildSection(
    "Truthy and Falsy values are confusing.",
    "Leo strictly equates a string '0' to a number 0 and it fails, causing a login loop.",
    [
      { speaker: 'protagonist', text: "I checked if (id == 5). It worked. But if (id === 5) failed!" },
      { speaker: 'mentor', text: "Double equals coerces types magically. Triple equals === is strict. In Node, always enforce strict equality to prevent serious logic breaches." }
    ],
    NODE_MENTOR
  ),
  loops: buildSection(
    "Should I use .forEach() or a standard loop?",
    "Leo tries to use the await keyword inside a .forEach() loop to fetch database records sequentially.",
    [
      { speaker: 'protagonist', text: "The .forEach loop didn't wait for my database query to finish! All queries launched simultaneously." },
      { speaker: 'mentor', text: "Array methods like .forEach don't respect async/await pausing. If order matters, use a standard for...of loop instead." }
    ],
    NODE_MENTOR
  ),
  functions: buildSection(
    "Arrow Functions and lexical scoping.",
    "Leo creates a standard callback function but loses access to his class variables.",
    [
      { speaker: 'protagonist', text: "Inside the callback, this.name is completely undefined." },
      { speaker: 'mentor', text: "Standard functions hijack the this context. Use Arrow Functions () => {} to inherit the surrounding lexical scope cleanly." }
    ],
    NODE_MENTOR
  ),
  objects: buildSection(
    "Wait, everything is secretly an object?",
    "Leo is surprised to realise he can attach data directly onto arrays or functions.",
    [
      { speaker: 'protagonist', text: "I accidentally assigned array.myLabel = 'data' and it didn't throw an error." },
      { speaker: 'mentor', text: "In JavaScript, arrays and functions are specialised Objects under the hood. Powerful, but it requires disciplined boundaries to avoid confusion." }
    ],
    NODE_MENTOR
  ),
  dataStructures: buildSection(
    "If objects are key-value stores, why do Maps exist?",
    "Leo uses a standard JS {} Object as a dictionary but iterates over inherited prototype properties by accident.",
    [
      { speaker: 'protagonist', text: "My loop printed out internal JS functions instead of just my key-value data." },
      { speaker: 'mentor', text: "Plain objects inherit prototype baggage. The Map structure guarantees pure key-value iteration — no prototype noise, and any type can be a key." }
    ],
    NODE_MENTOR
  ),
  challenge: buildSection(
    "Building an interactive script.",
    "Leo is assigned to build a CLI To-Do list using classes, arrays, and standard functions.",
    [
      { speaker: 'mentor', text: "Structure the To-Do list. Prevent duplicates with Sets, handle async with for...of, and use arrow functions throughout. 🚀" }
    ],
    NODE_MENTOR
  ),
};

// Mirroring beginner payload to advanced to satisfy types
export const BASICS_STORY: Record<SWETrack, Record<SWELevel, Record<string, SweBasicsStorySection>>> = {
  python:  { beginner: pythonBeginner, advanced: pythonBeginner },
  java:    { beginner: javaBeginner,   advanced: javaBeginner   },
  nodejs:  { beginner: nodeBeginner,   advanced: nodeBeginner   },
};
