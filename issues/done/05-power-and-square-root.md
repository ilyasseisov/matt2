# Power and Square Root

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** None — can start immediately

## Problem Statement

The Calculator currently supports four binary operations — addition, subtraction, multiplication, and division — evaluated in a left-to-right chain. Users who need to raise a number to a power or take a square root must leave the app and use another tool. The Calculator should support these everyday operations while preserving its existing behavior: a single Display, chain evaluation with no operator precedence, and Error state recovery via digit or Clear.

## Solution

Extend the Calculator with two new capabilities:

1. **Power (`^`)** — a fifth binary operator that participates in chain evaluation like `+`, `−`, `×`, and `÷`. The user enters a base, presses `^`, enters an exponent, and presses `=` to see the result on the Display.

2. **Square root (`√`)** — a unary function that immediately transforms whatever value is currently on the Display. It does not introduce a pending operator. If the user is typing an Entry, the result replaces that Entry without disturbing a pending binary operator.

Both operations follow the existing Error state rules: invalid inputs show `"Error"` on the Display until the user presses a digit or Clear. Two new buttons (`√` and `^`) are added to the bottom row of the button grid, filling the currently unused cells to the left of `=`.

The domain glossary is extended with a **Unary function** term and updated **Error state** examples.

## User Stories

1. As a user, I want to tap `^` to raise one number to the power of another, so that I can compute exponents without leaving the Calculator.

2. As a user, I want `2 ^ 3 =` to show `8` on the Display, so that basic exponentiation works as expected.

3. As a user, I want power to participate in chain evaluation left-to-right, so that `2 + 3 ^ 2 =` yields `25` (not `11`), consistent with how the Calculator already treats `+`, `−`, `×`, and `÷`.

4. As a user, I want to tap `^` after entering a base and before entering an exponent, so that the interaction matches the existing operator pattern (base, operator, exponent, equals).

5. As a user, I want the Accumulator to update when I press `^` mid-chain (as with any operator), so that chained expressions like `2 + 3 ^ 2 =` evaluate correctly step by step.

6. As a user, I want to tap `√` to take the square root of the number currently on the Display, so that I can compute roots without a second operand.

7. As a user, I want pressing `√` when the Display shows `9` to immediately show `3`, so that unary square root feels instant like on a physical calculator.

8. As a user, I want pressing `√` after a completed calculation (e.g. Display shows `25` after `5 × 5 =`) to show `5`, so that I can apply root to a result and continue calculating.

9. As a user, I want pressing `√` while typing an Entry in a pending operation to transform only that Entry, so that `2 + 9` followed by `√` shows `3` and pressing `=` yields `5`.

10. As a user, I want a pending binary operator to remain unchanged when I press `√` on the current Entry, so that unary root does not accidentally commit or cancel an in-progress operation.

11. As a user, I want pressing `√` when the Display shows the Accumulator (no Entry being typed) to update the Accumulator to its square root, so that root works whether or not I am mid-entry.

12. As a user, I want the Display to show `"Error"` when I take the square root of a negative number, so that invalid roots are handled consistently with division by zero.

13. As a user, I want the Display to show `"Error"` for `0 ^ 0`, so that undefined exponentiation is not silently assigned a value.

14. As a user, I want the Display to show `"Error"` when raising a negative base to a non-integer exponent (e.g. `(-2) ^ 0.5`), so that undefined real-number results are not shown as nonsense.

15. As a user, I want the Display to show `"Error"` when a power operation produces a non-finite result (e.g. `0 ^ −1`), so that overflow and undefined results are handled consistently.

16. As a user, I want to recover from any power or root Error by pressing a digit, so that recovery matches the existing Error state behavior.

17. As a user, I want to recover from any power or root Error by pressing Clear, so that I can fully reset after a mistake.

18. As a user, I want `√` and `^` buttons visible on the Calculator screen, so that I can discover and use the new operations without instructions.

19. As a user, I want the new buttons placed in the bottom row to the left of `=`, so that the existing operator column and digit layout remain unchanged.

20. As a user, I want power results formatted with the same smart rounding as other operations, so that the Display stays readable (e.g. no floating-point noise).

21. As a user, I want square root results formatted with the same smart rounding as other operations, so that `√9` shows `3` not `3.0000000000000004`.

22. As a user, I want pressing `√` or `^` while in Error state to have no effect (Display stays `"Error"`), so that Error state behavior is consistent across all buttons except digit and Clear.

23. As a user, I want to continue calculating from a power or root result using any operator, so that the new operations integrate into normal Calculator workflows.

24. As a user, I want Clear to reset the Calculator after a power or root calculation, so that full reset still works regardless of which operations were used.

## Implementation Decisions

### Power as a binary chain operator

Extend the existing `Operator` union with `^`. Power uses the same commit-and-chain flow as the four existing operators: pressing `^` commits any pending operation, stores `^` as the pending operator, and clears the Entry. Pressing `=` computes `accumulator ^ entry`.

Chain evaluation remains strictly left-to-right with no operator precedence. Power does not bind tighter than addition or multiplication.

### Square root as a unary function

Introduce a new public transition `pressSquareRoot(state)` alongside the existing transitions (`pressDigit`, `pressOperator`, `pressEquals`, etc.).

Behavior:

- Read the value currently on the Display: the parsed Entry if the user is typing, otherwise the Accumulator (defaulting to `0` if neither is set).
- If the value is negative, transition to Error state.
- On success:
  - If an Entry exists, replace the Entry string with the formatted result (pending operator and Accumulator unchanged).
  - If no Entry exists, update the Accumulator to the square root and show the formatted result on the Display.
- If already in Error state, return unchanged (`"Error"` on Display).

No new state fields are required. Unary functions are a distinct category from binary operators — they do not set a pending operator.

### Error validation for power

Before computing power, transition to Error state when:

- Base is `0` and exponent is `0` (`0 ^ 0`).
- Base is negative and exponent is not an integer (detected via `Number.isInteger` on the parsed exponent).
- The computed result is not finite (safety net after exponentiation, consistent with how `formatDisplay` already rejects non-finite values).

On Error from power, clear the pending operator and Entry (same pattern as division by zero).

### Display formatting

Reuse the existing `formatDisplay` logic for both power results and square root results. No changes to the formatting rules (12 significant digits, strip trailing zeros, max 20 characters).

### Button layout

Add `√` and `^` to the bottom row of the four-column grid, occupying the two currently empty cells to the left of `=`. The grid row becomes: `√`, `^`, (empty), `=`.

### Domain glossary updates

Add **Unary function** to the glossary: an operation that immediately transforms the value on the Display without introducing a pending operator. Extend **Error state** examples to include square root of a negative number, `0 ^ 0`, negative base with non-integer exponent, and non-finite power results.

### Engine / UI separation

The pure Calculator engine remains DOM-free. The browser UI wires the new buttons to `pressSquareRoot` and `pressOperator(state, '^')` and re-renders the Display after every press — same pattern as existing buttons.

## Testing Decisions

### What makes a good test

Tests assert external behavior only: given a sequence of button presses (engine transitions), the Display shows the expected string. Tests do not inspect internal state fields, private helpers, or implementation details.

### Seam

Test at the **engine public API** — the highest existing seam. Sequences of `createCalculator`, `pressDigit`, `pressDecimal`, `pressOperator`, `pressSquareRoot`, `pressEquals`, and `pressClear` asserting the returned `display` value.

No new test seams. No direct tests on internal helpers (`applyOperator`, `commitPendingOperation`). No automated browser/DOM tests.

### Prior art

Follow the style of existing tests in the Calculator test suite: build up state through a series of transitions, assert final Display string. Existing tests cover chain evaluation, divide-by-zero Error, Error recovery via digit, Clear reset, and decimal formatting — new tests extend this pattern.

### Required test scenarios

**Power:**
- Basic: `2 ^ 3 =` → `"8"`
- Chain: `2 + 3 ^ 2 =` → `"25"`
- Error: `0 ^ 0` → `"Error"`
- Error: negative base with non-integer exponent → `"Error"`

**Square root:**
- Basic: enter `9`, press `√` → `"3"`
- Mid-chain: `2 + 9`, press `√` → `"3"`, then `=` → `"5"`
- After result: complete `5 × 5 =`, press `√` → `"5"`
- Error: square root of negative number → `"Error"`
- Recovery: Error from root, press digit → fresh Entry

### Manual smoke (not automated)

Open the app in a browser and verify: `√` and `^` buttons appear in the bottom row; power chain calculation works; square root mid-chain works; error and recovery work; Clear resets correctly.

## Out of Scope

- Operator precedence for power (e.g. `2 + 3 ^ 2` evaluating as `11`)
- General n-th root as a binary operator (cube root, etc.)
- Unary squaring (`x²`) as a separate button
- Additional unary functions (sin, cos, log, etc.)
- Keyboard input for `^` or `√`
- Changes to Display formatting rules
- Automated browser/UI tests
- Scientific notation or complex numbers

## Further Notes

- JavaScript's `Math.pow(0, 0)` returns `1`, but the Calculator explicitly treats `0 ^ 0` as an Error to avoid silently picking a convention.
- JavaScript's `Math.pow` with negative base and integer exponent works correctly (e.g. `(-2) ^ 3 = -8`); only non-integer exponents on negative bases need explicit rejection.
- The empty cell between `^` and `=` in the bottom row is intentional — it preserves visual alignment with the operator column above without adding another operation.
