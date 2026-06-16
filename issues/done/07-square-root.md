# Square root

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** None — can start immediately

## Parent

[Power and Square Root](./05-power-and-square-root.md)

## What to build

Add square root as a **Unary function** — an operation that immediately transforms the value currently on the Display without introducing a pending operator.

Introduce a new public engine transition `pressSquareRoot(state)` alongside the existing transitions. Behavior:

- Read the value on the Display: the parsed Entry if the user is typing, otherwise the Accumulator (defaulting to `0` if neither is set)
- If the value is negative, transition to Error state
- On success:
  - If an Entry exists, replace the Entry with the formatted result — pending operator and Accumulator are unchanged (e.g. `2 + 9`, press `√` → Display shows `3`, then `=` → `5`)
  - If no Entry exists, update the Accumulator to the square root and show the formatted result
- If already in Error state, return unchanged (`"Error"` on Display)

No new state fields. Reuse existing Display formatting for results.

Wire a `√` button in the bottom row of the Calculator grid (to the left of `^` and `=`). The pure engine stays DOM-free; the browser UI wires the button to `pressSquareRoot` and re-renders the Display.

Update the domain glossary:

- Add **Unary function**: an operation that immediately transforms the value on the Display without introducing a pending operator
- Extend **Error state** examples to include square root of a negative number (power error examples may already be covered by the sibling slice)

## Acceptance criteria

- [ ] Enter `9`, press `√` → Display shows `3`
- [ ] Mid-chain: `2 + 9`, press `√` → Display shows `3`; press `=` → Display shows `5`
- [ ] After a completed result (e.g. `5 × 5 =` showing `25`), press `√` → Display shows `5`
- [ ] Square root of a negative number shows `"Error"` on the Display
- [ ] Error from square root is recoverable by pressing a digit or Clear
- [ ] Pressing `√` while in Error state leaves Display as `"Error"`
- [ ] User can continue calculating from a square root result using any operator
- [ ] Clear resets the Calculator after a square root calculation
- [ ] `√` button is visible in the bottom row of the Calculator grid
- [ ] CONTEXT.md includes **Unary function** and updated **Error state** examples
- [ ] Engine tests cover basic root, mid-chain, after-result, error, and recovery
- [ ] `pnpm test` and `pnpm build` succeed

## Blocked by

None — can start immediately
