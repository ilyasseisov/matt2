export type Operator = '+' | '−' | '×' | '÷' | '^';

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
  if (state.error) {
    return {
      state: {
        accumulator: null,
        pendingOperator: null,
        entry: '0.',
        error: false,
      },
      display: '0.',
    };
  }

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
  if (state.error) {
    return {
      state: {
        accumulator: null,
        pendingOperator: null,
        entry: digit,
        error: false,
      },
      display: digit,
    };
  }

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

function isDivideByZero(op: Operator, entry: number): boolean {
  return op === '÷' && entry === 0;
}

function isPowerError(base: number, exponent: number): boolean {
  if (base === 0 && exponent === 0) {
    return true;
  }
  if (base < 0 && !Number.isInteger(exponent)) {
    return true;
  }
  return !Number.isFinite(Math.pow(base, exponent));
}

function isOperationError(
  op: Operator,
  base: number,
  entry: number,
): boolean {
  if (op === '÷') {
    return isDivideByZero(op, entry);
  }
  if (op === '^') {
    return isPowerError(base, entry);
  }
  return false;
}

function commitPendingOperation(
  state: CalculatorState,
): { accumulator: number | null; error: boolean } {
  if (state.pendingOperator === null || state.entry === null) {
    if (state.entry !== null) {
      return { accumulator: parseFloat(state.entry), error: false };
    }
    return { accumulator: state.accumulator, error: false };
  }

  const entryValue = parseFloat(state.entry);
  if (isOperationError(state.pendingOperator, state.accumulator ?? 0, entryValue)) {
    return { accumulator: state.accumulator, error: true };
  }

  return {
    accumulator: applyOperator(
      state.accumulator ?? 0,
      entryValue,
      state.pendingOperator,
    ),
    error: false,
  };
}

export function pressOperator(
  state: CalculatorState,
  op: Operator,
): CalculatorResult {
  if (state.error) {
    return { state, display: 'Error' };
  }

  const { accumulator, error } = commitPendingOperation(state);

  if (error) {
    return {
      state: {
        ...state,
        pendingOperator: null,
        entry: null,
        error: true,
      },
      display: 'Error',
    };
  }

  return {
    state: {
      ...state,
      accumulator,
      pendingOperator: op,
      entry: null,
      error: false,
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
    case '^':
      return Math.pow(accumulator, entry);
  }
}

export function pressEquals(state: CalculatorState): CalculatorResult {
  if (state.error) {
    return { state, display: 'Error' };
  }

  if (state.pendingOperator === null || state.entry === null) {
    const display =
      state.entry ??
      (state.accumulator !== null
        ? formatDisplay(state.accumulator)
        : '0');
    return { state, display };
  }

  const entryValue = parseFloat(state.entry);
  if (isOperationError(state.pendingOperator, state.accumulator ?? 0, entryValue)) {
    return {
      state: {
        ...state,
        pendingOperator: null,
        entry: null,
        error: true,
      },
      display: 'Error',
    };
  }

  const result = applyOperator(
    state.accumulator ?? 0,
    entryValue,
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

export function pressClear(_state: CalculatorState): CalculatorResult {
  return createCalculator();
}
