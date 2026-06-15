import { describe, expect, it } from 'vitest';
import {
  createCalculator,
  pressDecimal,
  pressDigit,
  pressEquals,
  pressOperator,
} from './calculator.ts';

describe('Calculator', () => {
  it('shows 0 on initial load', () => {
    const { display } = createCalculator();
    expect(display).toBe('0');
  });

  it('adds two whole numbers', () => {
    let calc = createCalculator();
    calc = pressDigit(calc.state, '2');
    calc = pressOperator(calc.state, '+');
    calc = pressDigit(calc.state, '3');
    calc = pressEquals(calc.state);
    expect(calc.display).toBe('5');
  });

  it('subtracts two whole numbers', () => {
    let calc = createCalculator();
    calc = pressDigit(calc.state, '9');
    calc = pressOperator(calc.state, '−');
    calc = pressDigit(calc.state, '4');
    calc = pressEquals(calc.state);
    expect(calc.display).toBe('5');
  });

  it('multiplies two whole numbers', () => {
    let calc = createCalculator();
    calc = pressDigit(calc.state, '6');
    calc = pressOperator(calc.state, '×');
    calc = pressDigit(calc.state, '7');
    calc = pressEquals(calc.state);
    expect(calc.display).toBe('42');
  });

  it('divides two numbers', () => {
    let calc = createCalculator();
    calc = pressDigit(calc.state, '1');
    calc = pressDigit(calc.state, '0');
    calc = pressOperator(calc.state, '÷');
    calc = pressDigit(calc.state, '4');
    calc = pressEquals(calc.state);
    expect(calc.display).toBe('2.5');
  });

  it('formats floating-point addition cleanly', () => {
    let calc = createCalculator();
    calc = pressDigit(calc.state, '0');
    calc = pressDecimal(calc.state);
    calc = pressDigit(calc.state, '1');
    calc = pressOperator(calc.state, '+');
    calc = pressDigit(calc.state, '0');
    calc = pressDecimal(calc.state);
    calc = pressDigit(calc.state, '2');
    calc = pressEquals(calc.state);
    expect(calc.display).toBe('0.3');
  });

  it('allows only one decimal point per entry', () => {
    let calc = createCalculator();
    calc = pressDigit(calc.state, '3');
    calc = pressDecimal(calc.state);
    calc = pressDecimal(calc.state);
    calc = pressDigit(calc.state, '5');
    expect(calc.display).toBe('3.5');
  });
});
