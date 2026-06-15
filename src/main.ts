import './style.css';
import {
  createCalculator,
  pressDigit,
  pressEquals,
  pressOperator,
  type CalculatorResult,
  type Operator,
} from './calculator.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

let calc: CalculatorResult = createCalculator();

const display = document.createElement('div');
display.className = 'display';
display.textContent = calc.display;

const buttons = document.createElement('div');
buttons.className = 'buttons';

function renderDisplay(): void {
  display.textContent = calc.display;
}

function addButton(label: string, onClick: () => void): void {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onClick);
  buttons.appendChild(button);
}

for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
  addButton(digit, () => {
    calc = pressDigit(calc.state, digit);
    renderDisplay();
  });
}

for (const op of ['+', '−', '×', '÷'] as Operator[]) {
  addButton(op, () => {
    calc = pressOperator(calc.state, op);
    renderDisplay();
  });
}

addButton('=', () => {
  calc = pressEquals(calc.state);
  renderDisplay();
});

app.append(display, buttons);
