# Chain evaluation, Clear, and Error state

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** #02 Decimals and display formatting

## Parent

[Simple Arithmetic Calculator PRD](./prd.md)

## What to build

Complete the Calculator engine behaviour for chained calculations, full reset, and invalid operations.

**Chain evaluation:** when an operator is pressed (or `=` is pressed), commit the current Entry against the Accumulator using the pending operator, left-to-right with no operator precedence. Example: `2 + 3 × 4 =` → Display `"20"`.

**Clear:** add `pressClear(state)` — fully resets Accumulator, pending operator, Entry, and Error state. Display returns to `"0"`. Add a `C` button to the UI.

**Error state:** dividing by zero transitions to Error state; Display shows `"Error"`. Pressing any digit or Clear exits Error state and starts fresh. Pressing an operator after a completed result continues calculating from that result. Repeated `=` after a result keeps showing that result.

## Acceptance criteria

- [ ] Engine test: `2 + 3 × 4 =` → Display `"20"`
- [ ] Engine test: `5 ÷ 0 =` → Display `"Error"`
- [ ] Engine test: after `"Error"`, pressing a digit starts a new Entry (Display no longer shows `"Error"`)
- [ ] Engine test: Clear mid-calculation resets Display to `"0"` with no lingering state
- [ ] Engine test: after `2 + 3 =`, pressing `× 4 =` → Display `"20"`
- [ ] `C` button is present in the UI and resets the Calculator in manual smoke test
- [ ] Dividing by zero in the browser shows `"Error"`; tapping a digit recovers
- [ ] `pnpm test` and `pnpm build` succeed

## Blocked by

- [#02 Decimals and display formatting](./02-decimals-and-display-formatting.md)
