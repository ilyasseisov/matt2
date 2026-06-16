# Power operator

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** None — can start immediately

## Parent

[Power and Square Root](./05-power-and-square-root.md)

## What to build

Add exponentiation as a fifth binary operator (`^`) that participates in chain evaluation exactly like the existing four operators.

The user enters a base, presses `^`, enters an exponent, and presses `=` to see the result on the Display. Chain evaluation remains strictly left-to-right with no operator precedence — `2 + 3 ^ 2 =` yields `25`, not `11`.

Extend the existing `Operator` union with `^`. Power uses the same commit-and-chain flow as `+`, `−`, `×`, and `÷`: pressing `^` commits any pending operation, stores `^` as the pending operator, and clears the Entry. Pressing `=` computes `accumulator ^ exponent`.

Before computing power, transition to Error state when:

- Base is `0` and exponent is `0` (`0 ^ 0`)
- Base is negative and exponent is not an integer
- The computed result is not finite (e.g. `0 ^ −1`)

On Error from power, clear the pending operator and Entry — same pattern as division by zero. Recovery via digit or Clear matches existing Error state behavior. Pressing `^` while already in Error state has no effect.

Reuse existing Display formatting for power results (12 significant digits, strip trailing zeros, max 20 characters).

Wire a `^` button in the bottom row of the Calculator grid (left of `=`, sharing the row with the future `√` button). The pure engine stays DOM-free; the browser UI wires the button to `pressOperator(state, '^')` and re-renders the Display.

## Acceptance criteria

- [ ] `2 ^ 3 =` shows `8` on the Display
- [ ] Chain evaluation: `2 + 3 ^ 2 =` shows `25`
- [ ] `0 ^ 0 =` shows `"Error"` on the Display
- [ ] Negative base with non-integer exponent (e.g. via decimal entry) shows `"Error"`
- [ ] Non-finite power result (e.g. `0 ^ −1`) shows `"Error"`
- [ ] Error from power is recoverable by pressing a digit or Clear
- [ ] Pressing `^` while in Error state leaves Display as `"Error"`
- [ ] User can continue calculating from a power result using any operator
- [ ] `^` button is visible in the bottom row of the Calculator grid
- [ ] Engine tests cover basic power, chain evaluation, error cases, and recovery
- [ ] `pnpm test` and `pnpm build` succeed

## Blocked by

None — can start immediately
