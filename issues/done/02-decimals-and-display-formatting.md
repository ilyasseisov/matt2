# Decimals and display formatting

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** #01 Four operators from scaffold

## Parent

[Simple Arithmetic Calculator PRD](./prd.md)

## What to build

Extend the Calculator engine and UI so the user can enter fractional numbers and see cleanly formatted results on the Display.

Add `pressDecimal(state)` to the engine — appends `.` to the current Entry, but only one decimal point per Entry is allowed (pressing `.` again has no effect).

Add display formatting with smart rounding to approximately 12 significant digits, stripping trailing zeros after the decimal point. Example: `0.1 + 0.2 =` should show `"0.3"`, not floating-point noise. If formatting produces an unreasonably long string, show `"Error"` on the Display.

Add a decimal point button to the UI.

## Acceptance criteria

- [ ] Engine test: entering `0.1 + 0.2 =` shows Display `"0.3"`
- [ ] Engine test: `10 ÷ 4 =` shows Display `"2.5"`
- [ ] Engine test: pressing `.` twice in one Entry does not produce `3..5`
- [ ] Decimal point button is present in the UI and works in manual smoke test
- [ ] `pnpm test` and `pnpm build` succeed

## Blocked by

- [#01 Four operators from scaffold](./01-four-operators-from-scaffold.md)
