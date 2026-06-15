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

const MAX_DISPLAY_LENGTH = 20;

export function formatDisplay(value: number): string {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  let formatted = Number(value.toPrecision(12)).toString();

  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }

  if (formatted.length > MAX_DISPLAY_LENGTH) {
    return 'Error';
  }

  return formatted;
}

export function pressDecimal(state: CalculatorState): CalculatorResult {
  if (state.entry?.includes('.')) {
    return { state, display: state.entry };
  }

  const entry = state.entry === null ? '0.' : `${state.entry}.`;

  return {
    state: { ...state, entry, error: false },
    display: entry,
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
    display:
      accumulator !== null ? formatDisplay(accumulator) : '0',
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
    const display =
      state.entry ??
      (state.accumulator !== null
        ? formatDisplay(state.accumulator)
        : '0');
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
    display: formatDisplay(result),
  };
}
