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

const PYTHON_MENTOR = { name: 'Riya', role: 'Senior Software Engineer', color: '#0369A1' };
const JAVA_MENTOR = { name: 'Kavya', role: 'Senior Backend Engineer', color: '#7C3AED' };
const NODE_MENTOR = { name: 'Mei', role: 'Senior Full-Stack Engineer', color: '#DC2626' };

// We supply one excellent 'beginner' payload, and map advanced to match it for structural consistency, 
// per user directive to focus on single, solid beginner execution.
const pythonBeginner = {
  variables: buildSection(
    "How do I print something? Also, where are the type definitions?",
    "Aisha begins her first ticket. She tries to print a formatted string but gets a TypeError when mixing a number with a string.",
    [
      { speaker: 'protagonist', text: "I did `print('Total: ' + 50)`. Why did it crash?" },
      { speaker: 'mentor', text: "Python won't magically turn the integer 50 into a string. You must use f-strings or explicit conversion. Let's practice standard variables and outputs first." }
    ],
    PYTHON_MENTOR
  ),
  flow: buildSection(
    "Are IF statements just the same in every language?",
    "Aisha writes an if-else block to check user ages, applying curly braces by muscle memory.",
    [
      { speaker: 'protagonist', text: "My if statement won't compile. I used curly braces..." },
      { speaker: 'mentor', text: "In Python, whitespace IS syntax. Remove the braces and indent exactly 4 spaces. It enforces readable structure globally." }
    ],
    PYTHON_MENTOR
  ),
  loops: buildSection(
    "I need to read 100 items. Do I use `for (int i=0;...)`?",
    "Aisha attempts to iterate over a list by manually controlling an index variable.",
    [
      { speaker: 'protagonist', text: "Managing the 'i' counter manually is causing a list-index-out-of-range error." },
      { speaker: 'mentor', text: "Python loops directly over the items. Just say `for item in items:`. If you need numbers, use `range()`. The language handles the iteration." }
    ],
    PYTHON_MENTOR
  ),
  functions: buildSection(
    "I keep reusing the same 10 lines of code. It looks messy.",
    "Aisha notices her parsing logic is duplicated across three files.",
    [
      { speaker: 'protagonist', text: "If the data format changes, I have to update the logic in three separate places." },
      { speaker: 'mentor', text: "Wrap it in a `def`. Functions encapsulate logic. A bug fixed in the function is immediately fixed everywhere it's called." }
    ],
    PYTHON_MENTOR
  ),
  objects: buildSection(
    "It's just variables. Why do we need objects?",
    "Aisha struggles to keep user profiles organized since she carries around three separate lists for names, emails, and IDs.",
    [
      { speaker: 'protagonist', text: "Matching index 4 of `names` with index 4 of `emails` is getting really hard to trace safely." },
      { speaker: 'mentor', text: "An object (or a class instance) groups state and behavior together. One `User` object holds its own name and email in memory permanently." }
    ],
    PYTHON_MENTOR
  ),
  dataStructures: buildSection(
    "I just use Lists for everything. What else is there?",
    "Aisha needs to check if a specific user ID exists in a list of 10,000 IDs. The search is too slow.",
    [
      { speaker: 'protagonist', text: "Using `if id in ID_list` takes a full second because it has to look at every single item." },
      { speaker: 'mentor', text: "If you need rapid lookups or uniqueness, use a Set or a Dictionary. They bucket data intuitively so your checks happen instantly." }
    ],
    PYTHON_MENTOR
  ),
  challenge: buildSection(
    "Time to put it all together.",
    "Aisha is assigned to build a CLI Number Guessing Game.",
    [
      { speaker: 'mentor', text: "Let's build a real app. Take input, use a loop, write a function, and track guesses in a Set. You've got this." }
    ],
    PYTHON_MENTOR
  ),
};

const javaBeginner = {
  variables: buildSection(
    "Why must I declare everything? Int, String, Boolean...",
    "Vikram creates his first Java file and realizes he must declare the type of every variable before it compiles.",
    [
      { speaker: 'protagonist', text: "I tried `age = 25` and the compiler immediately rejected it." },
      { speaker: 'mentor', text: "Java demands explicit types. `int age = 25;`. This static typing ensures variables are securely tracked before the program even runs." }
    ],
    JAVA_MENTOR
  ),
  flow: buildSection(
    "Control flow in Java uses curly braces, right?",
    "Vikram writes an if-else block but forgets a curly brace, causing the logic to execute unconditionally.",
    [
      { speaker: 'protagonist', text: "The second line of my 'if' block ran even though the condition was false!" },
      { speaker: 'mentor', text: "Without matching curly braces `{}`, Java only binds the very first statement to the `if`. Always use braces to lock down your control flow." }
    ],
    JAVA_MENTOR
  ),
  loops: buildSection(
    "I need to iterate over thousands of records.",
    "Vikram writes a traditional C-style loop but gets an off-by-one array exception at the very end.",
    [
      { speaker: 'protagonist', text: "It crashed on the final loop because `i <= array.length` searched beyond the array boundary." },
      { speaker: 'mentor', text: "Arrays are zero-indexed. Use the enhanced for-loop `for (String name : names)` when you don't need the index—it's completely immune to boundary errors." }
    ],
    JAVA_MENTOR
  ),
  functions: buildSection(
    "What is a Method compared to a Function?",
    "Vikram attempts to write an isolated function outside of a class structure.",
    [
      { speaker: 'protagonist', text: "The compiler says 'class, interface, or enum expected'. I just want a helper function!" },
      { speaker: 'mentor', text: "In Java, EVERYTHING lives inside a class. We call them methods. To use a helper without instantiating an object, declare it as `public static`." }
    ],
    JAVA_MENTOR
  ),
  objects: buildSection(
    "The 'new' keyword creates an object. But where does it go?",
    "Vikram creates multiple objects but loses track of their variable references.",
    [
      { speaker: 'protagonist', text: "I passed `user1` to a method, changed its name, and the original `user1` changed too!" },
      { speaker: 'mentor', text: "Java passes object references by value. You didn't copy the object; you handed the method a pointer to the exact same physical memory block on the Heap." }
    ],
    JAVA_MENTOR
  ),
  dataStructures: buildSection(
    "Arrays are fixed size? How do I add more data?",
    "Vikram tries to add a 6th item to an array initialized with a size of 5.",
    [
      { speaker: 'protagonist', text: "I got an `ArrayIndexOutOfBoundsException` when trying to add a new contact." },
      { speaker: 'mentor', text: "Arrays cannot grow in Java. For dynamic collections, you graduate to `ArrayList` or `HashSet`. They resize automatically." }
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

const nodeBeginner = {
  variables: buildSection(
    "const vs let vs var. What's the difference?",
    "Leo starts building an Express route but his variable gets unexpectedly overwritten by another block of code.",
    [
      { speaker: 'protagonist', text: "I used `var` for the user ID, but it leaked outside the if-statement and overwrote my database key." },
      { speaker: 'mentor', text: "Never use `var`. Use `const` by default for safety, and `let` only if the value must change later. This locks the scope." }
    ],
    NODE_MENTOR
  ),
  flow: buildSection(
    "Truthy and Falsy values are confusing.",
    "Leo strictly equates a string '0' to a number 0 and it fails, causing a login loop.",
    [
      { speaker: 'protagonist', text: "I checked `if (id == 5)`. It worked. But `if (id === 5)` failed!" },
      { speaker: 'mentor', text: "Double equals coerces types magically. Triple equals `===` is strict. In Node, you must enforce strict equality to prevent serious logic breaches." }
    ],
    NODE_MENTOR
  ),
  loops: buildSection(
    "Should I use .forEach() or a standard loop?",
    "Leo tries to use the `await` keyword inside a `.forEach()` loop to fetch database records sequentially.",
    [
      { speaker: 'protagonist', text: "The `.forEach` loop didn't wait for my database query to finish! All queries launched simultaneously." },
      { speaker: 'mentor', text: "Array methods like `.forEach` don't respect async/await pausing. If order matters, you must use a standard `for...of` loop." }
    ],
    NODE_MENTOR
  ),
  functions: buildSection(
    "Arrow Functions and lexical scoping.",
    "Leo creates a standard callback function, but loses access to his class variables.",
    [
      { speaker: 'protagonist', text: "Inside the callback, `this.name` is completely undefined." },
      { speaker: 'mentor', text: "Standard functions hijack the `this` context. Use Arrow Functions `() => {}` to inherit the surrounding memory block smoothly." }
    ],
    NODE_MENTOR
  ),
  objects: buildSection(
    "Wait, everything is secretly an object?",
    "Leo is surprised to realize he can attach data directly onto arrays or functions.",
    [
      { speaker: 'protagonist', text: "I accidentally assigned `array.myLabel = 'data'` and it didn't throw an error." },
      { speaker: 'mentor', text: "In JavaScript, arrays and functions are fundamentally just specialized Object memory mappings. It's powerful, but also requires disciplined boundaries." }
    ],
    NODE_MENTOR
  ),
  dataStructures: buildSection(
    "If objects are key-value sets, why do Maps exist?",
    "Leo uses a standard JS `{}` Object as a dictionary, but iterates over inherited prototype properties by accident.",
    [
      { speaker: 'protagonist', text: "My loop printed out internal JS functions instead of just my key-value data." },
      { speaker: 'mentor', text: "Objects inherit prototype baggage. The new `Map` structure guarantees sheer key-value purity, keeping iteration safe and direct." }
    ],
    NODE_MENTOR
  ),
  challenge: buildSection(
    "Building an interactive script.",
    "Leo is assigned to build a CLI To-Do list using classes, arrays, and standard functions.",
    [
      { speaker: 'mentor', text: "Structure the To-Do list. Add logic to prevent duplicates via Sets, and utilize arrow functions for your loops." }
    ],
    NODE_MENTOR
  ),
};

// Mirroring beginner payload to advanced simply to satisfy types without writing an entire parallel set,
// as the explicit directive was to focus rigidly on a simplified, core pedagogical beginner track.
export const BASICS_STORY: Record<SWETrack, Record<SWELevel, Record<string, SweBasicsStorySection>>> = {
  python: { beginner: pythonBeginner, advanced: pythonBeginner },
  java: { beginner: javaBeginner, advanced: javaBeginner },
  nodejs: { beginner: nodeBeginner, advanced: nodeBeginner },
};
