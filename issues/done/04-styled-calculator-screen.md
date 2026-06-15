# Styled calculator screen

**Type:** AFK  
**Triage label:** ready-for-agent  
**Blocked by:** #03 Chain evaluation, Clear, and Error state

## Parent

[Simple Arithmetic Calculator PRD](./prd.md)

## What to build

Polish the Calculator UI into the final single-screen layout described in the PRD. All engine behaviour is complete from prior slices — this slice is layout and styling only.

Final button grid:

- Clear (`C`) across the top
- Digits `7–9`, `4–6`, `1–3`, `0`, and decimal point
- Operators `÷`, `×`, `−`, `+`, `=` in a right column
- Display element above the grid

Style with minimal CSS: grid layout, monospace Display, large tap targets. No external UI framework, no animations or theming beyond usable defaults.

## Acceptance criteria

- [ ] Button grid matches the PRD layout (Clear top row, digit rows, operator column, Display above)
- [ ] Display uses a monospace font
- [ ] Buttons are large enough to tap comfortably on trackpad or touchscreen
- [ ] All buttons from prior slices still function correctly after layout change
- [ ] Manual smoke test: chain calculation, decimal entry, divide-by-zero, and Clear all work in the browser
- [ ] `pnpm test` and `pnpm build` succeed

## Blocked by

- [#03 Chain evaluation, Clear, and Error state](./03-chain-clear-and-error.md)
