# Claude Implementation Prompt: Java Pre-Read 01 - Web & Backend Foundations

This is the first Java pre-read after `Language Basics: Java`. Build it as a complete learner-facing module, not as a requirements stub.

Important: this file is a local implementation prompt for Claude. Do not commit or push this prompt file unless the user explicitly asks. Implementation commits should contain app code only.

## Product Goal

Create Java Track Pre-Read 01:

`Web & Backend Foundations: From Browser Click to Java Service`

The learner should finish understanding what happens between a user action in a browser and Java backend code receiving a request. This pre-read teaches DNS, HTTP, client/server roles, REST, status codes, headers, CORS, auth basics, load balancing, caching, and Postman/API testing through one end-to-end story.

This is not a Java syntax module. It is the web systems foundation every Java backend engineer needs before Spring Boot.

## Placement

Track:
`Software Engineering Launchpad -> Java Track`

Module:
`01`

Existing card:
`Web & Backend Foundations`

Recommended module id:
`java-pr-01`

Recommended duration:
`Pre-read - 35-40 min`

Recommended sections:
`8`

Update Java progress mapping:

```ts
const JAVA_MODULE_SECTIONS = {
  '00': { moduleId: 'java-pr-00', total: 8 },
  '01': { moduleId: 'java-pr-01', total: 8 },
};
```

## Implementation Boundaries

Use the existing SWE pre-read system:

- `SWEPreReadLayout`
- existing learner store patterns
- existing quiz engine patterns
- existing sidebar/progress/badge/streak/right-rail design
- existing dark mode tokens and page rhythm

Do not create a separate shell. Do not create a standalone landing page. Do not build a generic web article.

## Core Learning Promise

By the end, the learner can explain:

1. How a domain becomes an IP address through DNS.
2. How browser/client, server, and backend service responsibilities differ.
3. What an HTTP request and response contain.
4. How REST maps product actions to resources and methods.
5. Why status codes, headers, and JSON bodies matter.
6. Why browsers enforce CORS.
7. How basic authentication and authorization fit into a request.
8. How load balancers and caches change backend behavior.
9. How Postman helps test an API before frontend integration.

## Visual System Rules

This module needs three different kinds of visual systems. They must not be blended together.

### 1. 3D Visuals

Definition:
Animated explanatory scenes that show a system moving over time.

Purpose:
Teach cause and effect. Example: a request packet travels from browser to DNS to load balancer to Java service and back.

Rules:

- Must show motion, sequence, state change, and consequence.
- Must not be a static diagram with mild shadows.
- Must include controls such as replay, step, scrub, or scenario switch.
- Must highlight the relevant code/API detail at the right moment.
- Must be readable in dark mode and light mode.

### 2. 3D Tools

Definition:
Interactive practice surfaces where the learner manipulates inputs and sees system behavior change.

Purpose:
Let learners test understanding. Example: change HTTP method/body/header and see server response.

Rules:

- Learner input must matter.
- The tool must validate or simulate realistic backend behavior.
- Avoid "click card to reveal text" interactions.
- A tool should produce output: route match, status code, response body, CORS result, auth result, cache hit/miss, or Postman test result.

### 3. 3D Illustrations

Definition:
Static or lightly animated scene-setting artwork that supports narrative context.

Purpose:
Establish mental models or story moments. Example: Finova's banking dashboard connected to backend service towers.

Rules:

- Illustrations are allowed to be decorative only when they support the story beat.
- They should not pretend to be tools.
- Keep them visually consistent: claymorphism, bright Java-blue/teal/violet accents, visible depth, soft bevels, stable layout.
- No cramped labels inside small objects.

## Story World

Continue the Java track story from pre-read 00.

Company:
`Finova Systems`

Product:
`LedgerLite`, a transaction review workflow for finance operations teams.

Feature:
The product team wants a web dashboard button:

`Review High-Risk Transactions`

When an analyst clicks it, the frontend should fetch high-risk transactions from a Java backend API.

The request looks simple. The story reveals the systems behind it.

## Characters

Use existing character card and conversation design. Speaker avatars must match the speaker.

### Vikram Rao

- Role: Junior Backend Engineer
- Function: Protagonist
- Motivation: Wants to connect his Java validator to a real web workflow.
- Misconception: Thinks the frontend can "just call Java."

### Kavya Menon

- Role: Senior Backend Engineer
- Function: Mentor
- Motivation: Teaches the shape of a production request.
- Voice: Precise, patient, architecture-minded.

### Maya Kapoor

- Role: QA Engineer
- Function: Breaks assumptions with browser behavior, bad inputs, and repeatable tests.

### Rohan Mehta

- Role: Product Manager
- Function: Brings user need and business language.

### Dev Iyer

- Role: DevOps/SRE
- Function: Explains routing, load balancing, caching, logs, and production behavior.

### Asha Nair

- Role: Security Engineer
- Function: Explains auth, CORS, and why browser restrictions are product safety rails.

## Badges

Create 8 Java web foundation badges. They must be visually distinct and show labels under icons.

1. `DNS Mapper` - completed section 01.
2. `Request Reader` - completed section 02.
3. `REST Shaper` - completed section 03.
4. `Status Owner` - completed section 04.
5. `Header Scout` - completed section 05.
6. `CORS Debugger` - completed section 06.
7. `Auth Guard` - completed section 07.
8. `API Tester` - completed final section.

## Concept Mastery

Concept ids:

- `dns`
- `http`
- `rest`
- `status-codes`
- `headers`
- `cors`
- `auth`
- `api-testing`

Right rail labels:

- DNS & Routing
- HTTP Anatomy
- REST Design
- Status Codes
- Headers & JSON
- CORS & Browser Trust
- Auth Basics
- API Testing

## Full Learner-Facing Pre-Read Script

### Hero

Eyebrow:
`JAVA TRACK - PRE-READ 01`

Title:
`Web & Backend Foundations: From Browser Click to Java Service`

Subtitle:
`Before Spring Boot, understand the journey. A browser click becomes DNS lookup, HTTP request, routing, validation, Java code, response, and browser enforcement.`

Hero narrative:

The LedgerLite transaction validator works in a local Java file. Vikram can classify high-risk payments, reject invalid IDs, and print results to the console.

Then Rohan asks the question every backend engineer eventually hears:

Rohan:
`Can analysts click a button in the dashboard and see only the transactions that need review?`

Vikram thinks:
`The Java code already works. The frontend can just call it.`

Kavya smiles.

Kavya:
`A browser cannot call a Java method. It sends an HTTP request to a server. The backend's job is to make that request understandable, safe, and predictable.`

Learning objectives:

1. Trace a browser request from URL to Java service.
2. Read the parts of an HTTP request and response.
3. Design resource-based REST endpoints.
4. Choose useful status codes.
5. Use headers and JSON bodies correctly.
6. Explain why CORS exists.
7. Place authentication and authorization in the request flow.
8. Test an API with a Postman-style workflow before frontend integration.

3D illustration:
Use Illustration A, `LedgerLite Web Request World`, directly in the hero area or just below the hero. This is a scene-setting illustration, not the main teaching tool.

### Section 01: DNS And The First Hop

Section title:
`A URL has to find a server before Java can run`

Story:

Vikram opens the dashboard URL:

`https://ledgerlite.finova.com/review`

He points at the screen.

Vikram:
`So the browser goes to our Java app?`

Dev:
`Not yet. First the browser has to find where that name lives. Names are for humans. Networks route to IP addresses.`

Core explanation:

When a user types a URL or clicks a link, the browser needs an IP address. DNS maps a domain name to an address where traffic can be sent.

Simple flow:

1. Browser sees `ledgerlite.finova.com`.
2. Browser or OS checks cache.
3. If not cached, DNS resolvers look up the address.
4. Browser receives an IP.
5. Browser can now open a network connection.

Learner mental model:

DNS does not run your backend code. DNS only helps the browser find the machine or edge service that can receive traffic.

Code/context panel:

```txt
Human URL:
https://ledgerlite.finova.com/review

Network target:
ledgerlite.finova.com -> 203.0.113.42
```

3D Visual 1:
`DNS Lookup Flight Path`

Quiz:
Use Quiz 1.

Badge:
`DNS Mapper`

Transition:

Now the browser knows where to send traffic. But what exactly does it send?

### Section 02: HTTP Request Anatomy

Section title:
`An HTTP request is the browser's message to the backend`

Story:

Vikram opens the browser Network tab and sees rows of requests.

Vikram:
`There are headers, method, status, payload, timing. This is more than a URL.`

Kavya:
`That row is the contract between the frontend and backend. Learn to read it before writing controllers.`

Core explanation:

An HTTP request has structured parts:

- Method: what kind of action is being requested.
- URL/path: which resource is being addressed.
- Headers: metadata about the request.
- Body: data sent with the request, often JSON.

Example request:

```http
GET /api/transactions?risk=high HTTP/1.1
Host: ledgerlite.finova.com
Accept: application/json
Authorization: Bearer <token>
```

Example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": "TX-1001", "amount": 150000, "currency": "USD", "risk": "HIGH" }
]
```

3D Visual 2:
`HTTP Packet Scanner`

3D Tool 1:
`Request Builder Console`

Quiz:
Use Quiz 2.

Badge:
`Request Reader`

Transition:

Vikram can now read a request. The next question is how to name backend endpoints so they stay understandable.

### Section 03: REST And Resources

Section title:
`REST turns product actions into resource operations`

Story:

Rohan writes the endpoint he wants in a ticket:

`/getHighRiskThingsForDashboard`

Vikram nods. Kavya does not.

Kavya:
`That path names a button. A backend endpoint should usually name a resource. The action comes from the method and query.`

Core explanation:

REST is a style for designing APIs around resources.

Poor endpoint:

```http
GET /getHighRiskThingsForDashboard
```

Better endpoint:

```http
GET /api/transactions?risk=high
```

Common methods:

- `GET`: read data.
- `POST`: create something or trigger a command.
- `PUT`: replace a resource.
- `PATCH`: update part of a resource.
- `DELETE`: remove a resource.

For LedgerLite:

```http
GET    /api/transactions?risk=high
GET    /api/transactions/TX-1001
POST   /api/transactions
PATCH  /api/transactions/TX-1001/status
```

3D Tool 2:
`REST Route Workshop`

Quiz:
Use Quiz 3.

Badge:
`REST Shaper`

Transition:

The endpoint is clearer. But the backend still needs to tell the client what happened.

### Section 04: Status Codes

Section title:
`A status code is the backend's first answer`

Story:

Maya runs a request for a transaction that does not exist.

The response body says:

```json
{ "message": "No transaction found" }
```

But the status code is `200`.

Maya:
`The frontend thinks this succeeded. The message says it failed. Which one should my test trust?`

Kavya:
`The status code should tell the truth first. The body can explain it.`

Core explanation:

HTTP status codes give the client a standard way to understand the result.

Useful status codes:

- `200 OK`: request succeeded.
- `201 Created`: new resource created.
- `400 Bad Request`: client sent invalid input.
- `401 Unauthorized`: authentication missing or invalid.
- `403 Forbidden`: authenticated but not allowed.
- `404 Not Found`: resource does not exist.
- `500 Internal Server Error`: backend failed unexpectedly.

LedgerLite examples:

```http
GET /api/transactions/TX-1001 -> 200 OK
GET /api/transactions/UNKNOWN -> 404 Not Found
POST /api/transactions with missing id -> 400 Bad Request
GET /api/transactions without token -> 401 Unauthorized
```

3D Tool 3:
`Status Code Decision Deck`

Quiz:
Use Quiz 4.

Badge:
`Status Owner`

Transition:

Status codes tell what happened. Headers and bodies carry the details.

### Section 05: Headers, JSON, And Content Types

Section title:
`Headers explain the message. JSON carries the data.`

Story:

Vikram sends a request body from the frontend.

```json
{ "id": "TX-1001", "amount": 150000 }
```

The backend rejects it.

Vikram:
`The JSON looks valid.`

Kavya:
`The server also needs to know what kind of body it is receiving. That is what headers are for.`

Core explanation:

Headers are metadata. They describe how the request or response should be interpreted.

Common headers:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
Cache-Control: no-store
```

JSON body:

```json
{
  "id": "TX-1001",
  "amount": 150000,
  "currency": "USD"
}
```

Teaching point:

The server needs both metadata and data. If `Content-Type` is missing or wrong, the backend may not parse the body as JSON.

3D Visual 3:
`Header And Body Split Conveyor`

3D Tool 4:
`Header Inspector`

Quiz:
Use Quiz 5.

Badge:
`Header Scout`

Transition:

The request is now well-formed. But the browser can still block it before the Java backend response reaches the frontend code.

### Section 06: CORS And Browser Trust

Section title:
`The browser enforces boundaries your backend must respect`

Story:

Maya opens the dashboard locally:

`http://localhost:3000`

The API is running at:

`http://localhost:8080`

The request fails with a CORS error.

Vikram:
`But the API works in Postman.`

Asha:
`Postman is not a browser. Browsers protect users by enforcing origin rules.`

Core explanation:

CORS means Cross-Origin Resource Sharing. The browser checks whether a page from one origin is allowed to read responses from another origin.

Origins include:

- protocol
- domain
- port

Examples:

```txt
http://localhost:3000
http://localhost:8080
```

These are different origins because the ports differ.

The server must return CORS headers such as:

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PATCH
Access-Control-Allow-Headers: Authorization, Content-Type
```

Teaching point:

CORS is not the backend being broken. It is the browser enforcing a trust boundary.

3D Visual 4:
`CORS Browser Gate`

3D Tool 5:
`Origin Permission Simulator`

Quiz:
Use Quiz 6.

Badge:
`CORS Debugger`

Transition:

The browser can now call the API. The next question is whether the caller should be allowed to see the data.

### Section 07: Authentication And Authorization Basics

Section title:
`Who are you, and what are you allowed to do?`

Story:

Rohan wants managers to see all high-risk transactions, but analysts should only see assigned queues.

Rohan:
`Can we just hide the button for analysts?`

Asha:
`Hide the button, yes. But the backend still has to enforce the rule. Frontend visibility is not security.`

Core explanation:

Authentication answers:

`Who is making the request?`

Authorization answers:

`What is that user allowed to do?`

Common request:

```http
GET /api/transactions?risk=high
Authorization: Bearer eyJhbGciOi...
```

Backend responsibilities:

1. Verify the token.
2. Identify the user.
3. Check permissions.
4. Return only allowed data.

Possible results:

- Missing token -> `401 Unauthorized`
- Valid token but wrong role -> `403 Forbidden`
- Valid token and allowed role -> `200 OK`

3D Visual 5:
`Auth Checkpoint Tunnel`

3D Tool 6:
`Role And Permission Simulator`

Quiz:
Use Quiz 7.

Badge:
`Auth Guard`

Transition:

The API is safer now. But before the frontend depends on it, Maya wants repeatable tests.

### Section 08: Postman And API Testing

Section title:
`Test the API contract before the UI depends on it`

Story:

Maya opens Postman before the frontend team wires the dashboard.

Maya:
`If the endpoint is clear, I can test it without the UI. If I need the UI to test the API, the contract is not clear enough.`

Core explanation:

API testing tools like Postman let teams inspect and test backend behavior directly:

- method
- URL
- query params
- headers
- body
- response status
- response JSON
- timing

LedgerLite test checklist:

1. High-risk transaction list returns `200`.
2. Missing token returns `401`.
3. Analyst role cannot fetch manager queue and gets `403`.
4. Missing transaction ID returns `404`.
5. Invalid create payload returns `400`.

3D Tool 7:
`Postman Mission Control`

Final challenge:
Learner configures three requests:

1. `GET /api/transactions?risk=high` with auth token.
2. `GET /api/transactions/TX-404` expecting `404`.
3. `POST /api/transactions` with missing `id` expecting `400`.

The simulator shows pass/fail test results.

Completion reflection:

Kavya:
`Now you are ready for Spring Boot. Not because you know annotations, but because you know what the annotations will be serving: HTTP contracts.`

Module completion card:

Title:
`Java Pre-Read 01 Complete`

Body:
`You traced one dashboard click from DNS to HTTP, REST, headers, CORS, auth, and API testing. The next Java module can now introduce backend code without hiding the system around it.`

CTA:
`Next -> Java Language Basics`

Badge:
`API Tester`

## Quizzes

Each quiz should use the app's existing quiz component and update section completion and concept mastery.

### Quiz 1 - DNS

Question:
What does DNS do in the browser request flow?

Options:

1. Runs Java code on the server.
2. Converts a domain name into an address the network can route to.
3. Adds authorization headers to requests.
4. Stores the response body in the browser.

Correct:
2

Explanation:
DNS maps human-readable names like `ledgerlite.finova.com` to network addresses. It does not execute backend code.

Concept:
`dns`

### Quiz 2 - HTTP Anatomy

Question:
Which part of an HTTP request usually tells the backend what action is being requested?

Options:

1. Method
2. Font size
3. DNS cache
4. Browser tab title

Correct:
1

Explanation:
The method, such as `GET`, `POST`, or `PATCH`, describes the requested action.

Concept:
`http`

### Quiz 3 - REST

Question:
Which endpoint is the better REST-style design for reading high-risk transactions?

Options:

1. `GET /getHighRiskThingsForDashboard`
2. `GET /api/transactions?risk=high`
3. `POST /doEverything`
4. `GET /java/runHighRiskButton`

Correct:
2

Explanation:
The better endpoint names the resource, `transactions`, and uses a query parameter to filter by risk.

Concept:
`rest`

### Quiz 4 - Status Codes

Question:
A transaction ID does not exist. Which status code should the API return?

Options:

1. `200 OK`
2. `201 Created`
3. `404 Not Found`
4. `500 Internal Server Error`

Correct:
3

Explanation:
The request was understandable, but the requested resource does not exist.

Concept:
`status-codes`

### Quiz 5 - Headers

Question:
Which header tells the backend that the request body is JSON?

Options:

1. `Content-Type: application/json`
2. `Cache-Control: max-age=3600`
3. `Host: ledgerlite.finova.com`
4. `Accept-Language: en`

Correct:
1

Explanation:
`Content-Type` describes the format of the request body.

Concept:
`headers`

### Quiz 6 - CORS

Question:
Why can a request work in Postman but fail in the browser?

Options:

1. Postman deletes the backend code.
2. Browsers enforce origin rules through CORS, while Postman is not bound by the same browser policy.
3. Java cannot return JSON to browsers.
4. DNS only works for Postman.

Correct:
2

Explanation:
The browser enforces cross-origin restrictions. Postman is an API client, not a browser page running under origin rules.

Concept:
`cors`

### Quiz 7 - Auth

Question:
What is the difference between authentication and authorization?

Options:

1. Authentication asks who the user is. Authorization asks what they can do.
2. Authentication is only for CSS. Authorization is only for DNS.
3. They are the same thing.
4. Authorization always happens before the user is identified.

Correct:
1

Explanation:
Authentication identifies the caller. Authorization checks permissions.

Concept:
`auth`

### Quiz 8 - API Testing

Question:
Why test an API in Postman before wiring the frontend?

Options:

1. To prove the API contract works independently from UI behavior.
2. To avoid choosing status codes.
3. To bypass all authentication permanently.
4. To convert Java into JavaScript.

Correct:
1

Explanation:
Direct API testing helps verify method, URL, headers, body, response, and status before frontend integration.

Concept:
`api-testing`

## 3D Visual Specifications

These are animated explanatory systems. They are not practice tools. They show how systems move.

### 3D Visual 1: DNS Lookup Flight Path

Purpose:
Teach that a domain must resolve before a request can be sent.

Scene:
A browser tile sits on the left. A glowing domain card rises from the address bar. It travels through a layered DNS tower:

1. Browser cache ring.
2. OS cache ring.
3. Recursive resolver.
4. Authoritative DNS.
5. IP address beacon.

Animation:

- The browser launches `ledgerlite.finova.com`.
- If cache is selected, the card takes a short path.
- If cache miss is selected, it travels through all DNS layers.
- The final IP beacon lights up and draws a network route to the server edge.

Controls:

- `Cache hit`
- `Cache miss`
- `Replay`
- `Step`

Teaching output:

Show:

```txt
ledgerlite.finova.com -> 203.0.113.42
```

### 3D Visual 2: HTTP Packet Scanner

Purpose:
Teach method, path, headers, and body as separate request parts.

Scene:
A request packet enters a scanner tunnel. The tunnel separates it into four floating plates:

- Method
- Path
- Headers
- Body

Animation:

- Packet moves into scanner.
- Plates split apart in depth.
- Active plate rotates forward while corresponding raw HTTP line highlights.
- Response packet returns with status, headers, and JSON body.

Controls:

- `Request`
- `Response`
- `Inspect method`
- `Inspect headers`
- `Inspect body`

### 3D Visual 3: Header And Body Split Conveyor

Purpose:
Teach that headers describe the body and response expectations.

Scene:
Two-level conveyor:

- Top lane: headers as labeled chips.
- Bottom lane: JSON body as a data crate.

Animation:

- Without `Content-Type`, the JSON crate reaches a parser gate and is rejected.
- With `Content-Type: application/json`, the parser opens and extracts fields.
- With `Accept: application/json`, the response formatter returns JSON.

Controls:

- Toggle `Content-Type`
- Toggle `Accept`
- Toggle invalid JSON

### 3D Visual 4: CORS Browser Gate

Purpose:
Teach browser origin enforcement.

Scene:
A browser-origin portal at `localhost:3000` tries to read from API-origin tower at `localhost:8080`.

Animation:

- Request beam reaches API.
- API response starts returning.
- Browser CORS gate checks response headers.
- If origin allowed, response enters app.
- If not allowed, response is blocked at browser gate.

Controls:

- Origin selector.
- Allowed origin selector.
- Method selector.
- Header selector.

### 3D Visual 5: Auth Checkpoint Tunnel

Purpose:
Teach authn and authz as separate checks.

Scene:
Request capsule enters a security tunnel with two checkpoints:

1. Identity scanner.
2. Permission scanner.

Animation:

- No token: capsule stops at identity scanner -> `401`.
- Valid analyst token for manager route: passes identity, fails permission -> `403`.
- Valid manager token: passes both -> `200`.

Controls:

- Token: none, analyst, manager.
- Endpoint: own queue, manager queue.
- Replay route.

## 3D Tool Specifications

These are hands-on systems. Learner input must change output.

### 3D Tool 1: Request Builder Console

Purpose:
Let learners assemble a request and see whether the backend can interpret it.

Inputs:

- Method dropdown.
- Path input.
- Query params builder.
- Header chips.
- Body editor.

Outputs:

- Raw HTTP preview.
- Backend interpretation panel.
- Simulated response.

Scenarios:

- Valid high-risk request -> `200`.
- Missing auth -> `401`.
- Invalid method for resource -> `405`.

### 3D Tool 2: REST Route Workshop

Purpose:
Teach resource naming.

Interaction:

Learner chooses from messy product actions and maps them to method + path.

Examples:

- "Show high-risk transactions" -> `GET /api/transactions?risk=high`
- "Create a new transaction" -> `POST /api/transactions`
- "Mark transaction as reviewed" -> `PATCH /api/transactions/{id}/status`

Output:

Route quality meter:

- Resource clarity
- Method fit
- URL stability

### 3D Tool 3: Status Code Decision Deck

Purpose:
Practice choosing status codes.

Interaction:

Learner receives backend scenarios as cards and drags or selects status codes.

Scenarios:

- Valid list request.
- New transaction created.
- Missing required field.
- Missing token.
- Valid token but wrong role.
- Unknown transaction id.
- Database crashed.

Output:

Correctness with explanation and concept mastery update.

### 3D Tool 4: Header Inspector

Purpose:
Teach headers through working/failing request simulations.

Inputs:

- Add/remove `Content-Type`.
- Add/remove `Accept`.
- Add/remove `Authorization`.
- Change body shape.

Output:

- Parser gate result.
- Response format.
- Backend warning.

### 3D Tool 5: Origin Permission Simulator

Purpose:
Practice CORS diagnosis.

Inputs:

- Frontend origin.
- API origin.
- Allowed origins.
- Allowed methods.
- Allowed headers.

Output:

- Browser result: allowed or blocked.
- Missing CORS header explanation.
- Raw response header preview.

### 3D Tool 6: Role And Permission Simulator

Purpose:
Teach authn/authz outcomes.

Inputs:

- User role: anonymous, analyst, manager, admin.
- Token validity: missing, expired, valid.
- Endpoint: own queue, all high-risk, admin export.

Output:

- Identity result.
- Permission result.
- HTTP status.
- JSON response preview.

### 3D Tool 7: Postman Mission Control

Purpose:
Final API testing exercise.

UI:

- Left: request collection.
- Center: request builder.
- Right: response and tests.

Required learner tasks:

1. Configure method, URL, and auth header.
2. Send request.
3. Inspect status and response JSON.
4. Run tests:

```js
expect(status).toBe(200);
expect(response[0].risk).toBe("HIGH");
```

The tests are simulated; do not execute arbitrary JavaScript.

## 3D Illustration Specifications

These support story and mental model, but are not primary interactive tools.

### Illustration A: LedgerLite Web Request World

Placement:
Hero or immediately after hero.

Scene:
A claymorphism 3D mini-world with:

- Analyst laptop with LedgerLite dashboard.
- Browser request beam.
- DNS satellite.
- Load balancer gateway.
- Java backend service tower.
- Database vault.
- Response beam returning to dashboard.

Purpose:
Set the journey at a glance before sections break it down.

### Illustration B: Finova Network Desk

Placement:
Between sections 04 and 05.

Scene:
Kavya and Vikram at a desk with a browser network panel projected in 3D. Request rows float as cards.

Purpose:
Reinforce that backend engineers read browser network output, not just Java code.

### Illustration C: Production Traffic Lobby

Placement:
Before final challenge.

Scene:
Multiple request capsules queue at an API gateway: some pass auth, some hit cache, some route to service.

Purpose:
Prepare learner for load balancers, caches, auth, and API testing as one combined system.

## Live API Lab

This module should include an API lab, not a Java IDE. The Java code comes later. Here the learner manipulates HTTP contracts.

Recommended component:
`JavaWebFoundationsLab`

Features:

- Request builder.
- Route matcher.
- Response simulator.
- CORS checker.
- Auth checker.
- Postman-style collection.

Use deterministic simulation. Do not make real network requests.

Sample route table:

```ts
[
  {
    method: 'GET',
    path: '/api/transactions',
    requiresAuth: true,
    roles: ['analyst', 'manager'],
    query: ['risk'],
    response: { status: 200, body: [{ id: 'TX-1001', risk: 'HIGH' }] },
  },
  {
    method: 'GET',
    path: '/api/transactions/:id',
    requiresAuth: true,
    roles: ['analyst', 'manager'],
    response: { status: 200, body: { id: 'TX-1001', amount: 150000 } },
  },
  {
    method: 'POST',
    path: '/api/transactions',
    requiresAuth: true,
    roles: ['manager'],
    response: { status: 201, body: { id: 'TX-1003', created: true } },
  },
]
```

Final lab pass conditions:

- Learner sends at least three requests.
- Learner correctly diagnoses one auth failure.
- Learner correctly diagnoses one CORS failure.
- Learner gets the Postman collection tests passing.

## Routing And Progress Requirements

Expected component:
`src/components/JavaPreRead1WebBackend.tsx`

Expected tools file:
`src/components/JavaPreRead1WebBackendTools.tsx`

Expected route behavior:

- Java track module `01` opens this pre-read.
- Progress stored under `java-pr-01`.
- Completion persists on Java curriculum page.
- Module button says:
  - `Start` at 0/8.
  - `Continue` at 1-7/8.
  - `Review` at 8/8.

## Design And Quality Requirements

- Use the same high-quality pre-read template as Python and Java pre-read 00.
- Badges must show text labels under icons.
- Latest badge panel must update.
- Streak card must appear.
- Concept mastery must reflect quizzes.
- Dark mode must be explicitly checked.
- No white-on-dark low contrast cards.
- No cramped labels inside 3D objects.
- No giant containers around visuals unless the stage itself is purposeful.
- Captions below visuals should be visually designed, not tiny plain text.
- Every character thought or speech must be in a consistent character card, not a loose paragraph.
- Use correct speaker avatars.
- Validate responsive behavior at desktop, laptop, and narrow widths.

## Acceptance Checklist

Done means:

- Pre-read has 8 complete sections.
- Learner-facing story is implemented end to end.
- 3D visuals, 3D tools, and 3D illustrations are distinct systems.
- API lab works with deterministic simulated behavior.
- Quizzes update progress/mastery.
- Badges and latest badge work.
- Java curriculum progress reflects this pre-read.
- Light and dark modes both look polished.
- `npm run build` passes.
- Prompt files are not committed or pushed unless explicitly requested.

## Next Two Java Pre-Reads To Create Later

Do not implement these now unless the user asks. They are listed only to keep the sequence coherent.

1. `Java Pre-Read 02 - Java Language Basics: From Syntax To Services`
   - Deep Java syntax, JDK 21, Maven, IntelliJ, classes, methods, constructors, overloads, package structure.

2. `Java Pre-Read 03 - JVM Architecture & Memory`
   - Class loading, stack vs heap, GC, JIT, profiling, memory leaks, production JVM mental models.
