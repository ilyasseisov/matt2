# Domain Glossary

## Calculator

The application that performs arithmetic. It holds internal state (Accumulator, pending operator, current Entry, Error state) and exposes transitions driven by button presses.

## Display

The string shown to the user on screen. It reflects the current Entry while typing, the running Accumulator after an operator is pressed, or the result after `=`. Shows `"0"` on initial load and `"Error"` when in Error state.

## Entry

The operand the user is currently typing by pressing digit buttons. Null when awaiting fresh input after an operator or equals.

## Accumulator

The running total after each committed operation in a chain. Holds the left-hand value while the user types the next Entry.

## Chain evaluation

Evaluating operations strictly left-to-right with no operator precedence. Example: `2 + 3 × 4 =` yields `20`, not `14`.

## Unary function

An operation that immediately transforms the value on the Display without introducing a pending operator. Example: pressing `√` when the Display shows `9` immediately shows `3`.

## Error state

A state entered when an invalid operation occurs (e.g. division by zero, square root of a negative number, `0 ^ 0`, negative base with non-integer exponent, or non-finite power result). The Display shows `"Error"` until the user presses a digit or Clear.
