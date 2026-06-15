export type Operator = '+' | '−' | '×' | '÷';

export interface CalculatorState {
  accumulator: number | null;
  pendingOperator: Operator | null;
  entry: string | null;
  error: boolean;
}

export interface CalculatorResult {
  state: CalculatorState;
  display: string;
}

export function createCalculator(): CalculatorResult {
  return {
    state: {
      accumulator: null,
      pendingOperator: null,
      entry: null,
      error: false,
    },
    display: '0',
  };
}

export function pressDigit(
  state: CalculatorState,
  digit: string,
): CalculatorResult {
  const entry =
    state.entry === null
      ? digit
      : state.entry === '0'
        ? digit
        : state.entry + digit;

  return {
    state: { ...state, entry, error: false },
    display: entry,
  };
}

export function pressOperator(
  state: CalculatorState,
  op: Operator,
): CalculatorResult {
  const entryValue = state.entry !== null ? parseFloat(state.entry) : null;
  const accumulator =
    entryValue !== null ? entryValue : state.accumulator;

  return {
    state: {
      ...state,
      accumulator,
      pendingOperator: op,
      entry: null,
    },
    display: String(accumulator ?? '0'),
  };
}

function applyOperator(
  accumulator: number,
  entry: number,
  op: Operator,
): number {
  switch (op) {
    case '+':
      return accumulator + entry;
    case '−':
      return accumulator - entry;
    case '×':
      return accumulator * entry;
    case '÷':
      return accumulator / entry;
  }
}

export function pressEquals(state: CalculatorState): CalculatorResult {
  if (state.pendingOperator === null || state.entry === null) {
    const display = state.entry ?? String(state.accumulator ?? '0');
    return { state, display };
  }

  const result = applyOperator(
    state.accumulator ?? 0,
    parseFloat(state.entry),
    state.pendingOperator,
  );

  return {
    state: {
      accumulator: result,
      pendingOperator: null,
      entry: null,
      error: false,
    },
    display: String(result),
  };
}
