# Simple Arithmetic Calculator PRD

**Labels:** ready-for-agent

## Problem Statement

The user needs a simple way to perform everyday arithmetic — addition, subtraction, multiplication, and division — without reaching for a phone or opening a separate app. The project is currently a bare Vite + TypeScript browser scaffold left over from an abandoned stopwatch effort: the page title still says "Stopwatch", a test file references a module that does not exist, and there is no working application.

There is no Calculator the user can open in a browser, tap digits and operators, and read a result on a Display. The user wants a focused, single-screen experience that behaves like a basic physical calculator: one Display, a button grid, and predictable arithmetic.

## Solution

Replace the orphaned stopwatch scaffolding with a dedicated Calculator screen. The user taps digit and operator buttons to build an Entry, commits operations into a running Accumulator using chain evaluation (left-to-right, no operator precedence), and reads the formatted result on the Display. Invalid operations such as division by zero put the Calculator into an Error state; pressing a digit or Clear recovers. A single Clear button fully resets everything back to zero.

The implementation separates a pure, testable Calculator engine from a thin browser UI that wires button presses to engine methods and re-renders the Display.

## User Stories

1. As a user, I want to open the app in my browser and see a Calculator with a Display and button grid, so that I can start calculating immediately without configuration.

2. As a user, I want to tap digit buttons to build an Entry on the Display, so that I can enter the numbers I want to calculate with.

3. As a user, I want the Display to show `0` when the Calculator first loads, so that I have a clear starting point.

4. As a user, I want to tap `+` to add two numbers, so that I can perform addition.

5. As a user, I want to tap `−` to subtract one number from another, so that I can perform subtraction.

6. As a user, I want to tap `×` to multiply two numbers, so that I can perform multiplication.

7. As a user, I want to tap `÷` to divide one number by another, so that I can perform division.

8. As a user, I want to tap `=` to see the final result of my calculation, so that I know the answer.

9. As a user, I want chained operations to evaluate left-to-right (e.g. `2 + 3 × 4 = 20`), so that the Calculator behaves like a basic calculator without scientific operator precedence.

10. As a user, I want to tap a decimal point button to enter fractional numbers, so that I can calculate with decimals.

11. As a user, I want only one decimal point allowed per Entry, so that I cannot type malformed numbers like `3..5`.

12. As a user, I want results displayed with smart rounding (e.g. `0.1 + 0.2` shows `0.3`, not floating-point noise), so that everyday math looks correct on the Display.

13. As a user, I want the Display to cap at a reasonable number of significant digits, so that results remain readable.

14. As a user, I want dividing by zero to show `Error` on the Display, so that I understand the operation is invalid.

15. As a user, I want to recover from an Error state by tapping any digit, so that I can start a new calculation without refreshing the page.

16. As a user, I want to recover from an Error state by tapping Clear, so that I can reset explicitly.

17. As a user, I want a single Clear (`C`) button that fully resets the Calculator to `0`, so that I can abandon a calculation in one tap.

18. As a user, I want Clear to wipe the Accumulator, pending operator, current Entry, and any Error state, so that nothing from the previous calculation lingers.

19. As a user, I want pressing an operator after a completed result to continue calculating from that result, so that I can chain calculations naturally.

20. As a user, I want pressing `=` repeatedly after a result to keep showing that result, so that the Calculator does not behave unexpectedly.

21. As a user, I want buttons large enough to tap comfortably, so that the Calculator is usable on a trackpad or touchscreen.

22. As a user, I want the Display to use a monospace font, so that digits align and remain easy to read.

23. As a user, I want the page title to say "Calculator", so that the browser tab reflects what the app is.

24. As a developer, I want the Calculator engine to be a pure module with no DOM dependencies, so that arithmetic behaviour can be tested without a browser.

25. As a developer, I want automated tests covering basic operations, chain evaluation, decimal entry, Clear, divide-by-zero, and Error recovery, so that regressions are caught early.

26. As a developer, I want orphaned stopwatch scaffolding removed, so that the codebase contains only Calculator-related code.

27. As a developer, I want a domain glossary documenting Calculator terms, so that future work uses consistent language.

28. As a user, I want the app to build and run with standard project commands, so that I can develop and deploy it without special setup.

## Implementation Decisions

### Replace stopwatch scaffolding

The abandoned stopwatch effort is removed entirely. The Calculator becomes the sole application. Orphaned stopwatch tests and references are deleted. The HTML page title is updated to "Calculator".

### Engine / UI separation

Two layers:

- **Calculator engine** — pure TypeScript state machine; no DOM imports.
- **Browser UI** — vanilla DOM wiring; reads Display string from engine after each button press.

This mirrors the existing project convention of testing a logic module separately from the UI (prior stopwatch test pattern).

### Calculator state machine

The engine holds four pieces of state:

- **accumulator** — running total after each committed operation in the chain
- **pendingOperator** — the operator (`+`, `−`, `×`, `÷`) waiting for the next Entry
- **entry** — the operand currently being typed (null when awaiting fresh input)
- **error** — boolean; when true, Display shows `Error` until a digit or Clear is pressed

Initial state: Display `"0"`, no pending operator, no entry, not in error.

Public transitions (each returns updated state and Display string):

```
createCalculator()
pressDigit(state, digit)      — append digit; clears error
pressDecimal(state)           — append '.' if not already in entry
pressOperator(state, op)      — commit entry, apply chain rule, store new op
pressEquals(state)            — commit entry, clear pending op, show result
pressClear(state)             — full reset to initial state
```

### Chain evaluation

When an operator is pressed (or `=` is pressed), if there is a pending operator and a committed Entry, compute `accumulator <op> entry` and store the result as the new accumulator. No operator precedence — strictly left-to-right.

Example: `2 + 3 × 4 =` → after `+` accumulator is 2; after `×` accumulator is 5; after `=` result is 20.

### Error handling

During computation, if the operator is `÷` and the Entry is `0`, transition to Error state. Display shows `"Error"`. Any digit press or Clear exits Error state.

If Display formatting produces an unreasonably long string, show `"Error"`.

### Display formatting

Smart rounding to approximately 12 significant digits. Strip trailing zeros after the decimal point. Examples: `0.30000000000000004` → `"0.3"`; `2.5` → `"2.5"`.

### Button layout

Single-screen button grid:

- Clear (`C`) across the top
- Digits `7–9`, `4–6`, `1–3`, `0`, and decimal point
- Operators `÷`, `×`, `−`, `+`, `=` in a right column
- Display element above the grid

No external UI framework. Minimal CSS: grid layout, monospace Display, large tap targets.

### Domain glossary

Create a root glossary defining: Calculator, Display, Entry, Accumulator, Chain evaluation, Error state. Glossary only — no implementation details.

### Tooling

Add Vitest as a direct dev dependency and configure the Vite test environment. The test script already references Vitest but the dependency is not declared.

## Testing Decisions

### What makes a good test

Tests assert **external behaviour** of the Calculator engine — given a sequence of button presses (expressed as engine method calls), the Display string should match what a user would see. Tests do not inspect internal state fields directly unless necessary; they drive the public transition API and assert Display output.

### Primary test seam: Calculator engine module

This is the highest useful seam. The engine exposes a pure function API (`pressDigit`, `pressOperator`, etc.) with no DOM or timer dependencies. All arithmetic, chain evaluation, formatting, and Error behaviour is verified here via Vitest unit tests.

### Secondary seam: Browser UI

Manual smoke testing in the dev server. Verify button grid renders, Display updates on click, and layout is usable. No automated browser tests for v1.

### Prior art

The project already contains a Vitest test file targeting a logic module (`formatElapsed` tests for the abandoned stopwatch). The Calculator tests follow the same pattern: import engine functions, drive transitions, assert Display strings.

### Test cases to cover

- Basic operations: `2 + 3 =` → `"5"`; `10 ÷ 4 =` → `"2.5"`
- Chain evaluation: `2 + 3 × 4 =` → `"20"`
- Decimal entry and smart rounding: `0.1 + 0.2 =` → `"0.3"`
- Clear mid-calculation resets Display to `"0"`
- Divide by zero → `"Error"`; subsequent digit recovers
- Repeated `=` after a result continues from that result

## Out of Scope

- Operator precedence (PEMDAS / BODMAS)
- Scientific functions (sin, cos, log, powers, roots)
- Memory buttons (M+, M−, MR, MC)
- Calculation history or tape
- Keyboard input
- Sign toggle (±)
- Percentage operator
- Multiple Clear levels (C vs AC) — single Clear only
- Automated browser / E2E tests
- Theming, animations, or polished visual design beyond minimal usable layout
- Persisting state across page reloads
- Mobile app or native wrapper
- Continuing or reviving the stopwatch feature

## Further Notes

All design decisions were resolved in a grill-with-docs session. No ADR is warranted — choices are simple, easily reversed, and unsurprising for a basic Calculator.

The project has no git remote configured. Issues are tracked locally in this `issues/` directory using the `ready-for-agent` triage label.
