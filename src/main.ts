import './style.css';
import {
  createCalculator,
  pressClear,
  pressDecimal,
  pressDigit,
  pressEquals,
  pressOperator,
  type CalculatorResult,
  type Operator,
} from './calculator.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

let calc: CalculatorResult = createCalculator();

const calculator = document.createElement('div');
calculator.className = 'calculator';

const display = document.createElement('div');
display.className = 'display';
display.textContent = calc.display;

const buttons = document.createElement('div');
buttons.className = 'buttons';

function renderDisplay(): void {
  display.textContent = calc.display;
}

function addButton(
  label: string,
  gridArea: string,
  onClick: () => void,
): void {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.style.gridArea = gridArea;
  button.addEventListener('click', onClick);
  buttons.appendChild(button);
}

addButton('C', 'clear', () => {
  calc = pressClear(calc.state);
  renderDisplay();
});

const digitRows: Array<[string, string, string]> = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
];

for (const [d7, d8, d9] of digitRows) {
  for (const digit of [d7, d8, d9]) {
    addButton(digit, `d${digit}`, () => {
      calc = pressDigit(calc.state, digit);
      renderDisplay();
    });
  }
}

addButton('0', 'd0', () => {
  calc = pressDigit(calc.state, '0');
  renderDisplay();
});

addButton('.', 'decimal', () => {
  calc = pressDecimal(calc.state);
  renderDisplay();
});

const operators: Array<[Operator, string]> = [
  ['÷', 'divide'],
  ['×', 'multiply'],
  ['−', 'subtract'],
  ['+', 'add'],
];

for (const [op, area] of operators) {
  addButton(op, area, () => {
    calc = pressOperator(calc.state, op);
    renderDisplay();
  });
}

addButton('=', 'equals', () => {
  calc = pressEquals(calc.state);
  renderDisplay();
});

calculator.append(display, buttons);
app.append(calculator);
