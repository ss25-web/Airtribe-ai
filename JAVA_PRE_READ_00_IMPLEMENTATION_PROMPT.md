# Claude Implementation Prompt: Java Track Pre-Read 00

You are working in the Airtribe Learn Next.js app. Build a dedicated Java track Pre-Read 00 that feels as complete and polished as the Python pre-reads, but is genuinely Java-specific. This prompt is an implementation brief for code changes only. Do not commit or push this prompt file unless the user explicitly asks.

## Product Goal

Create `Java Pre-Read 00: Language Basics - The Java Runtime Lens` for the SWE Java track.

The learner should finish this pre-read understanding that Java is not "verbose Python." Java is a compiled, type-first, object-oriented backend language where source code becomes bytecode, bytecode runs on the JVM, and good backend work depends on making contracts explicit before runtime.

The experience must include:

- An end-to-end story with recurring characters.
- Eight coherent learning sections.
- Quizzes and concept mastery updates.
- A live IDE-style Java practice surface.
- 3D, animated, Blender-level educational visuals that teach Java concepts and flows.
- Layout, sidebars, badges, progress, streak, and dark mode consistency with the existing Python/SWE pre-read system.

## Non-Negotiables

- Use the existing SWE module layout system. Do not create a new shell.
- Prefer `SWEPreReadLayout`, `sweDesignSystem`, existing learner store patterns, existing badge/progress panels, and existing quiz patterns.
- Create a unique Java progress identity. Do not reuse `swe-pr-00` if that causes Java progress to share state with Python or generic SWE language basics.
- Recommended module id: `java-pr-00`.
- Do not reuse Python-specific tools with Java labels. If a visual teaches Java, its code examples, state labels, and mental model must be Java-specific.
- Do not add passive click-reveal toys. Every interactive or animated visual must teach a concrete concept through motion, state, cause, and consequence.
- Dark mode must be first-class. No low-contrast white cards pasted into dark pages.
- No overlapping text, clipped cards, cramped boxes, or tiny captions.
- Do not push prompt/context files. Implementation commits should contain product code only.

## Existing Code To Inspect First

Inspect these files before implementing:

- `src/components/SWEPreReadLayout.tsx`
- `src/components/SWELanguageBasics.tsx`
- `src/components/SWELaunchpadOverview.tsx`
- `src/components/PythonPreRead1.tsx`
- `src/components/PythonPreRead2.tsx`
- `src/components/PythonPreRead3.tsx`
- `src/components/PythonMentorFace.tsx`
- `src/components/PythonBasicsTools.tsx`
- `src/components/QuizEngine.tsx`
- `src/lib/learnerStore.ts`
- `src/app/page.tsx`

Use these files to preserve app structure, routing, store integration, style tokens, and progress behavior.

## Recommended File Plan

Implement with the smallest clean set of files:

- `src/components/JavaPreRead0.tsx`
- `src/components/JavaPreRead0Tools.tsx`
- Reuse existing mentor/avatar components if they already support Java characters cleanly. If not, create a small Java-specific face component only if necessary.
- Update Java routing in `src/app/page.tsx`.
- Update Java module progress mapping in `src/components/SWELaunchpadOverview.tsx`.

If `SWELanguageBasics.tsx` is currently acting as a generic Java module, either split Java into the dedicated component above or refactor cleanly so Python, Java, and Node progress do not collide.

## Track Placement

This should be Java track module `00` in the Software Engineering launchpad.

Expected curriculum card:

- Title: `Language Basics`
- Label: `Before You Begin`
- Status behavior:
  - `Start` when no Java sections are complete.
  - `Continue` when partially complete.
  - `Review` when all sections are complete.
- Progress should show completed Java sections out of 8.
- Java progress must persist and be visible on the curriculum page just like Python pre-read progress.

## Storyline

### Setting

Finova Systems is launching `LedgerLite`, a transaction review workflow used by finance operations teams. The product team needs a small Java backend service that validates transactions before they are reviewed by analysts.

The story begins with a deceptively simple request:

> "Can we just flag risky transactions before they reach the review queue?"

Vikram initially thinks this is a few lines of logic. Kavya shows him that in Java, a reliable backend feature is built from explicit types, methods, objects, validation boundaries, and runtime behavior.

### Main Characters

Use character cards and conversation blocks consistent with Python/SWE modules.

1. Vikram Rao
   - Role: Junior Backend Engineer
   - Company: Finova Systems
   - Function: Protagonist. Smart, new to production Java, initially frustrated by boilerplate.
   - Visual tone: blue/teal accent.

2. Kavya Menon
   - Role: Senior Backend Engineer
   - Company: Finova Systems
   - Function: Mentor. Teaches Java as contracts, runtime boundaries, and maintainable backend design.
   - Visual tone: violet accent.

3. Maya Kapoor
   - Role: QA Engineer
   - Company: Finova Systems
   - Function: Finds edge cases and invalid input.
   - Visual tone: amber accent.

4. Rohan Mehta
   - Role: Product Manager
   - Company: Finova Systems
   - Function: Brings the original product request and business constraints.
   - Visual tone: coral accent.

5. Dev Iyer
   - Role: DevOps/SRE
   - Company: Finova Systems
   - Function: Explains why code that works locally still needs predictable runtime behavior.
   - Visual tone: emerald accent.

## Narrative Spine

The pre-read should feel like one continuous story:

1. Rohan asks for transaction risk flagging.
2. Vikram writes a quick script-like Java method and hits compile-time errors.
3. Kavya explains source code, compiler, bytecode, JVM, and why Java catches some mistakes early.
4. Maya supplies messy test cases: missing amount, unsupported currency, duplicate IDs.
5. Vikram learns to use types, conditionals, loops, methods, classes, and exceptions to make the behavior explicit.
6. Dev shows how the Java app runs as a service and why predictable failure matters.
7. The final challenge asks the learner to assemble a tiny Java transaction validator in the live IDE panel.

## Learning Sections

Create 8 sections. Each section needs:

- A clear heading.
- A short story beat.
- A concept explanation.
- A relevant code snippet.
- One interactive or animated learning moment.
- A quiz or check-for-understanding.

### 01. Java Identity: Source, Compiler, JVM

Concept:
Java code is written as `.java`, compiled by `javac` into `.class` bytecode, and executed by the JVM. This changes how errors surface.

Story beat:
Vikram asks why Java refuses to run code that "looks obvious." Kavya explains that the compiler is part of the team.

Code:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("LedgerLite risk check started");
    }
}
```

Teaching point:
The `main` method is the entry point. Java needs a class, method signature, and compile step before execution.

### 02. Variables And Types: Promises Before Values

Concept:
Variables in Java have declared types. Primitive values and references behave differently.

Story beat:
Vikram tries to store `"500"` in an `int`. The compiler refuses before the bug reaches production.

Code:

```java
int amount = 500;
String currency = "INR";
boolean highValue = amount > 100000;
```

Teaching point:
The type is a contract. It says what operations are legal.

### 03. Control Flow: Business Rules Become Gates

Concept:
Use `if`, `else if`, `else`, and `switch` to encode decision paths.

Story beat:
Rohan says "flag high value international payments." Kavya pushes Vikram to translate that sentence into explicit conditions.

Code:

```java
if (amount > 100000 && !currency.equals("INR")) {
    riskLevel = "HIGH";
} else {
    riskLevel = "NORMAL";
}
```

Teaching point:
Product language must become testable branches.

### 04. Loops And Collections: Processing Many Transactions

Concept:
Use arrays, `List`, and `Map` to work with groups of objects.

Story beat:
Maya sends 200 transaction samples. One transaction validator is not enough; Vikram needs a collection pipeline.

Code:

```java
List<Integer> amounts = List.of(1200, 450000, 9000);

for (int amount : amounts) {
    System.out.println(classify(amount));
}
```

Teaching point:
A loop is a repeated promise: same rule, many inputs.

### 05. Methods And Scope: Name The Unit Of Work

Concept:
Methods isolate behavior, parameters pass inputs, return types make outputs explicit.

Story beat:
Vikram has one long `main` method. Kavya asks him to extract a method that can be tested.

Code:

```java
static boolean isHighValue(int amount) {
    return amount > 100000;
}
```

Teaching point:
Methods are reusable contracts. Scope controls what each method can see.

### 06. Objects And Classes: Put Meaning Around Data

Concept:
Classes define a blueprint. Objects hold state and behavior. Constructors create valid instances.

Story beat:
Maya points out that amount without currency, id, and account owner is incomplete.

Code:

```java
class Transaction {
    String id;
    int amount;
    String currency;

    Transaction(String id, int amount, String currency) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
    }
}
```

Teaching point:
Java pushes related data into named shapes that the rest of the code can trust.

### 07. Errors And Validation: Fail Predictably

Concept:
Use validation and exceptions to handle impossible or unsafe states.

Story beat:
Dev shows a production incident caused by accepting a transaction with a blank ID.

Code:

```java
static void validate(Transaction tx) {
    if (tx.id == null || tx.id.isBlank()) {
        throw new IllegalArgumentException("Transaction id is required");
    }
}
```

Teaching point:
Failing early is better than silently corrupting the workflow.

### 08. Final Challenge: Build MiniTransactionValidator

Concept:
Combine types, control flow, collections, methods, objects, and validation.

Story beat:
Vikram assembles a small validator that Maya can test and Rohan can understand.

Learner task:
Complete a tiny Java validator in the live IDE surface.

Expected final behavior:

- Reject blank transaction IDs.
- Reject negative amounts.
- Flag high value non-INR transactions.
- Print a readable result for each transaction.

## Full Learner-Facing Pre-Read Script

Claude should implement this pre-read as a coherent story, not as disconnected teaching blocks. Use the copy below as the source of truth for the learner-facing flow. Tighten wording only when needed for UI fit, but do not replace the storyline with generic Java explanations.

### Hero

Eyebrow:
`SOFTWARE ENGINEERING LAUNCHPAD - JAVA PRE-READ 00`

Title:
`Language Basics: The Java Runtime Lens`

Subtitle:
`Java is not just syntax. It is a contract between your source code, the compiler, the JVM, and the production system that has to trust it.`

Module intro:

Vikram Rao joins Finova Systems during the LedgerLite launch. The product team needs a transaction validator before finance analysts review risky payments. The request sounds small: "flag transactions that need review." Vikram opens a Java file and tries to move fast. The compiler stops him before the app ever runs.

Kavya, his mentor, tells him the first rule of Java backend work:

> "Java asks you to be explicit early so production has fewer surprises later."

Learning objectives:

1. Explain how `.java` source becomes JVM bytecode.
2. Use Java types to make values and operations explicit.
3. Translate product rules into control flow.
4. Process many records with loops and collections.
5. Extract methods with clear inputs and outputs.
6. Model real concepts with classes and objects.
7. Validate unsafe states before they spread.
8. Assemble a small Java transaction validator in an IDE-style exercise.

Character intro cards:

- Vikram Rao, Junior Backend Engineer, Finova Systems. First Java backend feature, quick thinker, still learning production contracts.
- Kavya Menon, Senior Backend Engineer, Finova Systems. Mentor who teaches Java as explicit design, not boilerplate.
- Maya Kapoor, QA Engineer, Finova Systems. Finds the edge cases product requests forget.
- Rohan Mehta, Product Manager, Finova Systems. Brings business urgency and ambiguous requirements.
- Dev Iyer, DevOps/SRE, Finova Systems. Cares about runtime behavior, logs, and production failure modes.

### Section 01 Full Script: Java Identity

Section title:
`A Java program is built before it runs`

Story opening:

Rohan drops into the backend channel just after standup.

Rohan:
`Can we flag risky transactions before they hit the analyst queue? High-value international payments should not look the same as normal transfers.`

Vikram thinks:
`That sounds like an if statement. Maybe two.`

He writes a tiny Java file and expects to run it like a script. The IDE complains before anything reaches the console.

Kavya:
`That stop sign is the point. Java has a build step. Source code becomes bytecode before the JVM runs it. If the contract is broken, the JVM never gets the chance to guess.`

Core explanation:

Java has three mental layers:

1. Source code: the `.java` file humans edit.
2. Compilation: `javac` checks the source and produces bytecode.
3. Runtime: the JVM loads and runs bytecode.

This means some mistakes are caught earlier than they would be in a scripting language. That is why Java can feel strict at first. The strictness is part of the safety model.

Code block:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("LedgerLite risk check started");
    }
}
```

Callouts:

- `public class Main`: Java code lives inside classes.
- `main`: the program entry point.
- `String[] args`: inputs passed from the command line.
- `System.out.println`: write text to the console.

3D visual:
Use Visual 1, `The Java Runtime Conveyor`.

Quiz:
Use Quiz 1.

Completion badge:
`JVM Starter`

Transition:

Vikram now understands why Java needs the compiler. His next mistake is smaller but more revealing: he gives a number the wrong kind of value.

### Section 02 Full Script: Variables And Types

Section title:
`A type is a promise the compiler can check`

Story opening:

Vikram starts modeling one transaction. Amount, currency, country, risk. Simple enough.

He writes:

```java
int amount = "500";
```

The compiler rejects it.

Vikram:
`But the text says 500. A human can see it is a number.`

Kavya:
`A human can infer. A backend system should not have to. In Java, the type tells the program which operations are legal.`

Core explanation:

In Java, variables are declared with a type. The type defines what kind of value the variable can hold and what operations make sense.

Examples:

```java
int amount = 500;
String currency = "INR";
boolean highValue = amount > 100000;
double fee = 12.75;
```

Primitive values like `int`, `boolean`, and `double` store simple values. Reference values like `String` and `Transaction` point to objects.

Key distinction:

- Primitive: the value is stored directly.
- Reference: the variable points to an object created elsewhere.

3D visual:
Use Visual 2, `Stack And Heap Memory Theater`.

IDE exercise:
`Fix The Type`. Learner changes `int amount = "500";` to `int amount = 500;`.

Quiz:
Use Quiz 2 and Quiz 3.

Completion badge:
`Type Keeper`

Transition:

Now Vikram can store transaction values. But product rules are not values; they are decisions.

### Section 03 Full Script: Control Flow

Section title:
`Product rules become gates`

Story opening:

Rohan clarifies the request:

Rohan:
`High-value international payments should go to review. Normal domestic payments should pass through.`

Vikram writes a comment:

```java
// flag risky transactions
```

Kavya:
`A comment cannot route a transaction. Make the rule executable.`

Core explanation:

Control flow decides which path the program takes. In Java, product rules often become `if`, `else if`, `else`, and `switch` branches.

Code block:

```java
String riskLevel;

if (amount > 100000 && !currency.equals("INR")) {
    riskLevel = "HIGH";
} else {
    riskLevel = "NORMAL";
}
```

Teaching notes:

- `amount > 100000` checks size.
- `!currency.equals("INR")` checks non-INR currency.
- `&&` means both conditions must be true.
- The output is not vague. It is either `HIGH` or `NORMAL`.

Maya:
`What about INR 200000? What about USD 300? What about a missing currency?`

Kavya:
`That is why branches need examples. Every branch is a promise about behavior.`

3D visual:
Use Visual 3, `Business Rule Gate System`.

IDE exercise:
Learner adjusts amount and currency controls and watches branch highlighting update.

Quiz:
Use Quiz 4.

Completion badge:
`Branch Builder`

Transition:

One transaction works. Maya sends 200 test records. Vikram now needs the same rule to run many times.

### Section 04 Full Script: Loops And Collections

Section title:
`A loop applies one rule to many records`

Story opening:

Maya uploads a sample file:

Maya:
`Here are 200 transactions. Some are tiny, some are international, some are malformed. Your validator should not only work on the first example.`

Vikram:
`So I need the same rule across a list.`

Kavya:
`Exactly. A collection holds many values. A loop moves through them one at a time.`

Core explanation:

Java collections let you work with groups of values. For early Java work, the most important mental model is:

- `List`: ordered group of items.
- `Map`: lookup from key to value.
- Loop variable: the current item being processed.

Code block:

```java
List<Integer> amounts = List.of(1200, 450000, 9000);

for (int amount : amounts) {
    System.out.println(classify(amount));
}
```

Then upgrade to transactions:

```java
List<Transaction> transactions = List.of(tx1, tx2, tx3);

for (Transaction tx : transactions) {
    String result = TransactionValidator.classify(tx);
    System.out.println(result);
}
```

Teaching notes:

- The list is the group.
- `tx` is the current transaction.
- The loop body runs once per transaction.
- The output can be accumulated into counts, logs, or review queues.

3D visual:
Use Visual 4, `Collection Processing Factory`.

Quiz:
Use Quiz 5.

Completion badge:
`Loop Runner`

Transition:

The loop works, but the code inside it is getting messy. Kavya points to the long `main` method.

### Section 05 Full Script: Methods And Scope

Section title:
`Name the unit of work`

Story opening:

Vikram's `main` method now has printing, rule checks, sample data, and error handling in one place.

Kavya:
`If everything lives in main, nothing has a name. If nothing has a name, nothing is easy to test.`

Core explanation:

A method is a named unit of behavior. It accepts inputs, does work, and can return an output. A good method tells the next engineer what the rule means.

Code block:

```java
static boolean isHighValue(int amount) {
    return amount > 100000;
}

static boolean isInternational(String currency) {
    return !currency.equals("INR");
}

static String classify(int amount, String currency) {
    if (isHighValue(amount) && isInternational(currency)) {
        return "REVIEW";
    }

    return "APPROVED";
}
```

Teaching notes:

- Parameters are inputs.
- Return type is the output promise.
- Variables created inside a method are scoped to that method.
- Method names should reflect product meaning, not implementation trivia.

Kavya:
`A method is not just shorter code. It is a reusable decision with a name.`

IDE exercise:
Learner completes `isHighValue(int amount)`.

Quiz:
Use Quiz 6.

Completion badge:
`Method Maker`

Transition:

Methods help, but amount and currency still travel separately. Maya finds a bug where a transaction amount is paired with the wrong currency.

### Section 06 Full Script: Objects And Classes

Section title:
`A class keeps related meaning together`

Story opening:

Maya reports a strange result:

Maya:
`The validator marked an INR transaction as USD. I think the amount and currency came from different rows.`

Vikram:
`I passed them as separate variables.`

Kavya:
`Then the code had no way to know they belonged together. Make the concept real.`

Core explanation:

A class defines a shape for related data and behavior. An object is one instance of that shape. For backend work, classes help represent concepts that should not be split apart.

Code block:

```java
class Transaction {
    String id;
    int amount;
    String currency;

    Transaction(String id, int amount, String currency) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
    }
}
```

Object creation:

```java
Transaction tx = new Transaction("TX-1001", 150000, "USD");
```

Teaching notes:

- `class Transaction` is the blueprint.
- `id`, `amount`, and `currency` are fields.
- The constructor creates a valid starting object.
- `new Transaction(...)` creates one instance.

3D visual:
Use Visual 5, `Class Blueprint Assembler`.

Quiz:
Use Quiz 7.

Completion badge:
`Object Shaper`

Transition:

The object shape is clearer. But an object can still be created with unsafe values unless the program guards against them.

### Section 07 Full Script: Errors And Validation

Section title:
`Invalid states should stop early`

Story opening:

Dev joins the review after a staging failure.

Dev:
`The service accepted a transaction with a blank ID. The logs show review decisions, but no one can trace which transaction caused them.`

Vikram:
`The code did not crash.`

Dev:
`That is the problem. It kept going with data it could not trust.`

Core explanation:

Validation checks whether data is safe before deeper processing. Exceptions let Java stop a path that should not continue.

Code block:

```java
static void validate(Transaction tx) {
    if (tx.id == null || tx.id.isBlank()) {
        throw new IllegalArgumentException("Transaction id is required");
    }

    if (tx.amount < 0) {
        throw new IllegalArgumentException("Amount cannot be negative");
    }
}
```

Teaching notes:

- Validation belongs near the boundary where data enters.
- Exceptions should explain the violated rule.
- Failing early makes production behavior easier to diagnose.

Kavya:
`Java cannot know your business rules by itself. But once you state them, it can help enforce them.`

3D visual:
Use Visual 6, `Exception Runway`.

Quiz:
Use Quiz 8.

Completion badge:
`Guard Rail`

Transition:

Vikram has the pieces. The final step is assembling them into a small working validator.

### Section 08 Full Script: Final Challenge

Section title:
`Build the MiniTransactionValidator`

Story opening:

Rohan wants the feature in the sprint demo. Maya wants testable behavior. Dev wants predictable logs. Kavya gives Vikram one final task.

Kavya:
`Do not build a giant system. Build one honest slice. Source, types, rule, loop, object, validation, output. If that slice is clear, the service can grow safely.`

Challenge intro:

Complete the Java validator in the IDE panel. The simulator should show compile checks, runtime output, and the JVM model.

Starter files:

`src/Transaction.java`

```java
class Transaction {
    String id;
    int amount;
    String currency;

    Transaction(String id, int amount, String currency) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
    }
}
```

`src/TransactionValidator.java`

```java
class TransactionValidator {
    static void validate(Transaction tx) {
        // TODO: reject blank ids and negative amounts
    }

    static boolean requiresReview(Transaction tx) {
        // TODO: high value non-INR transactions require review
        return false;
    }

    static String classify(Transaction tx) {
        validate(tx);

        if (requiresReview(tx)) {
            return "REVIEW";
        }

        return "APPROVED";
    }
}
```

`src/Main.java`

```java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Transaction> transactions = List.of(
            new Transaction("TX-1001", 150000, "USD"),
            new Transaction("TX-1002", 9000, "INR"),
            new Transaction("", 1200, "INR")
        );

        for (Transaction tx : transactions) {
            System.out.println(TransactionValidator.classify(tx));
        }
    }
}
```

Expected solution behavior:

- `TX-1001` prints `REVIEW`.
- `TX-1002` prints `APPROVED`.
- Blank ID throws `IllegalArgumentException: Transaction id is required`.

Success state copy:

`You built the smallest honest Java backend slice: a type, a rule, a loop, an object, a guard, and a visible runtime result.`

Final reflection prompt:

`When a product request says "just flag risky transactions," what are the hidden Java contracts you now know to ask for?`

Suggested answer:

The PM should clarify what counts as risky, which fields define a transaction, what invalid data should be rejected, what output the service should produce, and how failures should appear in logs or user-facing workflows.

Completion badge:
`Validator Builder`

Module completion card:

Title:
`Java Pre-Read 00 Complete`

Body:
`You followed Vikram from a vague product request to a small Java validator. You saw how Java turns assumptions into explicit contracts before code reaches production.`

CTA:
`Next -> Java Web Foundations`

## Live IDE Integration

Build an IDE-style practice area that looks and behaves like a real coding environment.

### UI Requirements

- File tree panel:
  - `src/Main.java`
  - `src/Transaction.java`
  - `src/TransactionValidator.java`
- Editor panel:
  - Use Monaco if already available in the project.
  - If Monaco is not already installed, do not add a heavy dependency without checking project patterns. Use a polished textarea/code panel with syntax-colored preview if needed.
- Console panel:
  - Shows compile diagnostics, simulated output, and JVM state.
- Runtime model panel:
  - Shows source file -> compile -> bytecode -> JVM -> stack/heap/output.

### Execution Model

Do not pretend to run arbitrary Java in the browser.

Use a deterministic Java Runner Simulator:

- Curated exercises have expected patterns.
- The simulator can check for missing method names, invalid type assignments, missing validation, and expected output.
- The console should clearly label:
  - `Compile check`
  - `Runtime output`
  - `JVM model`

### Practice Exercises

1. Hello Ledger
   - Run a complete `Main.java`.
   - Teaches entry point and output.

2. Fix The Type
   - Broken code:

```java
int amount = "500";
```

   - Learner fixes to:

```java
int amount = 500;
```

3. Write A Guard
   - Learner completes:

```java
static boolean isHighValue(int amount) {
    // TODO
}
```

4. Create A Transaction
   - Learner instantiates a `Transaction` object.

5. Final Validator
   - Learner completes validation logic and sees the full simulated pipeline.

## 3D Animated Visuals

Use code-native 3D where possible: Three.js if already in use, CSS 3D with `transform-style: preserve-3d`, Framer Motion springs, layered shadows, or canvas. The visuals must feel dimensional, bright, tactile, and educational.

Do not create flat diagrams dressed up as 3D. Each visual must show motion through a system.

### Visual 1: The Java Runtime Conveyor

Purpose:
Teach source -> compiler -> bytecode -> JVM -> output.

Scene:
A full-width 3D conveyor stage with five stations:

1. `Main.java` source slab.
2. `javac` compiler gate.
3. `.class` bytecode cube stack.
4. JVM glass chamber.
5. Console output terminal.

Animation:

- A glowing source file card moves into the compiler gate.
- If code is valid, it compresses into small bytecode cubes.
- Cubes enter the JVM chamber.
- The JVM chamber lights up the stack and heap.
- Console output appears as a projected hologram.

Interaction:

- Step controls: `Write`, `Compile`, `Load`, `Run`, `Output`.
- A scrubber allows learners to replay the pipeline.
- A broken-code toggle shows the source card rejected at the compiler gate with a visible diagnostic.

Teaching labels:

- `Compile-time error: caught before JVM`
- `Bytecode: portable instruction format`
- `JVM: runtime environment`

### Visual 2: Stack And Heap Memory Theater

Purpose:
Teach primitives vs references.

Scene:
A split 3D stage:

- Left: stack tower with labeled slots.
- Right: heap island with object capsules.
- References are glowing beams from stack slots to heap objects.

Animation:

- `int amount = 500` drops a solid value block into a stack slot.
- `Transaction tx = new Transaction(...)` creates a heap object and places a reference beam in the stack.
- `Transaction copy = tx` creates a second reference beam to the same object.
- Updating `tx.amount` changes the heap object, and both references glow.

Interaction:

- Buttons: `primitive assignment`, `new object`, `copy reference`, `mutate object`.
- Each step updates code, memory view, and explanation together.

Teaching labels:

- `Primitive: value stored directly`
- `Reference: address-like link to object`
- `Two variables can point to one object`

### Visual 3: Business Rule Gate System

Purpose:
Teach conditionals as explicit product gates.

Scene:
A transaction capsule travels along a 3D track through four gates:

1. Amount gate.
2. Currency gate.
3. Country gate.
4. Risk score gate.

Animation:

- The transaction card carries properties like amount, currency, and country.
- Gates open, close, or route the transaction to `NORMAL`, `REVIEW`, or `BLOCKED`.
- Changing inputs changes the route in real time.

Interaction:

- Sliders and toggles for amount, currency, and country.
- Route path animates after every change.
- Code block highlights the currently active branch.

Teaching labels:

- `Product sentence`
- `Boolean condition`
- `Branch outcome`

### Visual 4: Collection Processing Factory

Purpose:
Teach loops and collections.

Scene:
A 3D factory line with a `List<Transaction>` crate feeding transaction cards into a loop machine.

Animation:

- Cards move one-by-one under a loop cursor.
- The current item rises.
- Validator arms inspect amount and currency.
- Output bins collect `APPROVED`, `REVIEW`, and `REJECTED`.
- A counter and map update beside the line.

Interaction:

- Play, pause, next item, reset.
- Learner can add one transaction to the list.
- Code line `for (Transaction tx : transactions)` pulses while the cursor advances.

Teaching labels:

- `Collection: many values in one structure`
- `Loop variable: current item`
- `Accumulator: summary built over time`

### Visual 5: Class Blueprint Assembler

Purpose:
Teach classes, fields, constructors, methods, and instances.

Scene:
A blueprint table projects a `Transaction` class as a 3D wireframe. Fields, constructor, and methods are physical modules that snap into the blueprint.

Animation:

- Field plates slide into the class blueprint.
- Constructor key turns and creates an object instance.
- Method gear attaches to the instance and can be invoked.
- Multiple objects are stamped from the same class blueprint.

Interaction:

- Learner chooses which piece to add next.
- Invalid pieces refuse to snap and explain why.
- A mini-code panel updates as the class forms.

Teaching labels:

- `Class: blueprint`
- `Constructor: valid starting state`
- `Object: one instance`
- `Method: named behavior`

### Visual 6: Exception Runway

Purpose:
Teach validation and exceptions.

Scene:
A transaction capsule approaches a runway. Valid transactions land safely; invalid ones hit a guard rail and launch an exception signal to a catch tower.

Animation:

- Blank ID transaction hits the first guard.
- Red `IllegalArgumentException` object rises.
- A catch tower receives it and displays a human-readable diagnostic.
- A safe transaction passes through and enters the queue.

Interaction:

- Toggle ID blank/nonblank.
- Toggle negative amount.
- Toggle unsupported currency.
- See exact validation method line highlighted.

Teaching labels:

- `Validate before processing`
- `Throw when state is impossible`
- `Handle failures predictably`

## Quizzes

Use the existing quiz system and concept mastery patterns. Each quiz should include a question, options, correct answer, explanation, and concept id.

### Quiz 1: Runtime Pipeline

Question:
What happens before Java code runs on the JVM?

Options:

1. The browser interprets the `.java` file directly.
2. `javac` compiles source code into bytecode.
3. The database converts Java into SQL.
4. Java skips compilation when code is short.

Correct:
2

Explanation:
Java source is compiled into bytecode first. The JVM then runs that bytecode.

Concept:
`runtime`

### Quiz 2: Type Safety

Question:
Why does this fail?

```java
int amount = "500";
```

Options:

1. Java does not support numbers.
2. The variable name is too long.
3. A `String` value cannot be assigned to an `int`.
4. The code needs a loop.

Correct:
3

Explanation:
Java variables have declared types. `"500"` is text, while `int` expects a whole number.

Concept:
`types`

### Quiz 3: Primitive Vs Reference

Question:
Which Java value is a reference to an object?

Options:

1. `int amount = 500;`
2. `boolean approved = true;`
3. `Transaction tx = new Transaction(...);`
4. `char grade = 'A';`

Correct:
3

Explanation:
`tx` stores a reference to a `Transaction` object on the heap.

Concept:
`memory`

### Quiz 4: Branching

Question:
Which condition best represents "high value non-INR transaction"?

Options:

1. `amount > 100000 && !currency.equals("INR")`
2. `amount > 100000 || currency.equals("INR")`
3. `amount < 100000 && currency.equals("INR")`
4. `currency = "INR"`

Correct:
1

Explanation:
Both conditions must be true: high amount and currency not equal to INR.

Concept:
`control-flow`

### Quiz 5: Loop Variable

Question:
In `for (Transaction tx : transactions)`, what does `tx` represent?

Options:

1. The whole list.
2. The current transaction being processed.
3. The JVM.
4. The class file.

Correct:
2

Explanation:
In an enhanced for loop, `tx` is the current item from the collection.

Concept:
`collections`

### Quiz 6: Methods

Question:
Why extract `isHighValue(int amount)` into a method?

Options:

1. To hide code from the compiler.
2. To make a named, reusable rule with a clear input and output.
3. To make Java dynamically typed.
4. To avoid writing tests.

Correct:
2

Explanation:
Methods name behavior, accept inputs, and return explicit outputs.

Concept:
`methods`

### Quiz 7: Classes

Question:
What is a Java class best understood as?

Options:

1. A one-time variable.
2. A blueprint for creating objects with related data and behavior.
3. A database table that Java automatically saves.
4. A console command.

Correct:
2

Explanation:
A class defines the shape and behavior that object instances will have.

Concept:
`objects`

### Quiz 8: Validation

Question:
Why throw an exception for a blank transaction ID?

Options:

1. To make the code longer.
2. To fail early when the program reaches an invalid state.
3. To skip compilation.
4. To convert the ID into a number.

Correct:
2

Explanation:
Blank IDs are invalid. Throwing an exception prevents unsafe data from moving deeper into the system.

Concept:
`validation`

## Badges

Add Java-specific badges that match the existing badge panel design, including label text and latest badge panel.

Recommended badges:

1. `JVM Starter` - completed runtime pipeline.
2. `Type Keeper` - fixed type mismatch.
3. `Branch Builder` - encoded a product rule.
4. `Loop Runner` - processed a collection.
5. `Method Maker` - extracted a reusable method.
6. `Object Shaper` - created a class and instance.
7. `Guard Rail` - added validation.
8. `Validator Builder` - completed final challenge.

Use relevant icons from the existing icon/badge system. Do not use identical placeholder badges.

## Design Requirements

### Layout

- Match the Python/SWE pre-read shell.
- Left contents rail should show all 8 sections and completion checkmarks.
- Right rail should show level, XP, module progress, badges with labels, latest badge, concept mastery, and streak.
- Header progress should reflect Java pre-read progress.
- Main column width and spacing should match existing high-quality pre-reads.

### Character Blocks

- All mentor, character, speaking, and thinking moments must use the existing conversation/card template.
- Do not leave story paragraphs floating immediately after a mentor box if a character is thinking or speaking.
- If Vikram thinks, use a Vikram thought card.
- If Kavya says something, use Kavya's avatar and card.
- Do not assign a speaker's line to the wrong avatar.

### 3D Visual Style

- Bright, colorful, claymorphism-inspired, with visible depth.
- Use shadows, bevels, perspective, object layering, and responsive sizing.
- Avoid flat pastel rectangles arranged like a slide.
- Avoid oversized containers that make visuals feel trapped.
- Avoid text cramming inside small 3D objects. If a label is long, move explanation to a detail panel.
- Use stable dimensions so animations do not cause layout shift.

### Dark Mode

Every visual must have explicit dark-mode colors:

- Text contrast must be readable.
- Cards should not glow white on dark backgrounds.
- Shadows should become depth glows, not muddy grey blur.
- Stage backgrounds should harmonize with the module dark theme.
- Verify captions, axis labels, code text, and badges.

### Responsive

Test at:

- Desktop wide viewport.
- Laptop viewport around 1366x768.
- Mobile/narrow viewport.

No overlap, clipping, or horizontal scroll.

## Acceptance Criteria

The implementation is done only when all checks pass:

- Java track module 00 opens the new Java pre-read.
- Java progress uses `java-pr-00` or another unique Java id and does not collide with Python.
- Curriculum page retains Java pre-read completion state.
- Eight sections render in contents rail.
- Quizzes update completion/mastery.
- Badges are distinct, labeled, and show latest completed badge.
- Streak card appears in the right rail.
- Live IDE simulator is present and clearly labeled as simulated Java execution.
- 3D visuals teach actual Java concepts and are not passive decoration.
- Dark mode looks intentional.
- `npm run build` passes.
- No prompt/context markdown files are staged or committed unless the user explicitly asks.

## Implementation Notes

- Keep edits scoped.
- Preserve existing Python, GenAI, PM, and Node behavior.
- Reuse existing design tokens and helper components wherever possible.
- If you need to create new reusable visual helpers, place them in Java-specific files first unless another module already needs them.
- Avoid broad refactors unless required for clean routing or progress separation.
- Use TypeScript types for section ids, quiz ids, badge ids, and visual state.
- No `any` for major data structures.

## Final Developer Handoff Summary

When finished, report:

- Files changed.
- Route used for Java Pre-Read 00.
- How progress is stored.
- Which 3D visuals were implemented.
- Which tests/build commands were run.
- Any known visual risks or follow-up recommendations.
