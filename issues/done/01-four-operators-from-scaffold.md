# Four operators from scaffold

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** None — can start immediately

## Parent

[Simple Arithmetic Calculator PRD](./prd.md)

## What to build

Establish the Calculator foundation end-to-end: domain glossary, test tooling, a pure Calculator engine, and a browser UI that replaces the orphaned stopwatch scaffold.

On load the Display reads `0`. The user can tap digits to build an Entry, tap `+`, `−`, `×`, or `÷` to select an operation, and tap `=` to see the result on the Display. Each operation works for whole-number inputs (decimal entry and smart formatting come in a later slice).

Create the domain glossary defining Calculator, Display, Entry, Accumulator, Chain evaluation, and Error state. Remove orphaned stopwatch references. Add Vitest as a direct dev dependency and configure the test environment.

The engine is a pure state machine with no DOM dependencies:

```
createCalculator()
pressDigit(state, digit)
pressOperator(state, op)    — +, −, ×, ÷
pressEquals(state)
```

State fields: accumulator, pendingOperator, entry, error (error handling comes in slice #03).

The UI wires button clicks to engine transitions and re-renders the Display after every press. Layout may be minimal in this slice — a working Display and all required buttons is enough.

## Acceptance criteria

- [ ] CONTEXT.md exists with the six glossary terms from the PRD
- [ ] Orphaned stopwatch test file is removed; page title reads "Calculator"
- [ ] Vitest is a declared dev dependency; `pnpm test` runs successfully
- [ ] Engine tests cover all four operations with whole numbers (e.g. `2 + 3 =` → `"5"`, `10 ÷ 4 =` → `"2.5"` as raw float display is acceptable here)
- [ ] Opening the app in the browser shows a Display and buttons for digits, four operators, and equals
- [ ] Clicking through `2 + 3 =` in the browser shows `5` on the Display
- [ ] `pnpm build` succeeds

## Blocked by

None — can start immediately
