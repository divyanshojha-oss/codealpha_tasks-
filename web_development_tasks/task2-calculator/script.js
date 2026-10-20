const display = document.getElementById('display');
const expression = document.getElementById('expression');
let current = '0';
let stored = null;
let operator = null;
let waitingForOperand = false;
let justCalculated = false;

function updateDisplay() { display.textContent = current; }
function clearAll() {
  current = '0'; stored = null; operator = null;
  waitingForOperand = false; justCalculated = false;
  expression.textContent = 'Ready when you are'; updateDisplay();
}
function inputDigit(digit) {
  if (waitingForOperand || justCalculated) {
    current = digit === '.' ? '0.' : digit;
    waitingForOperand = false; justCalculated = false;
  } else if (digit === '.') {
    if (!current.includes('.')) current += '.';
  } else {
    current = current === '0' ? digit : current + digit;
  }
  updateDisplay();
}
function calculate(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? NaN : a / b;
  if (op === '%') return a % b;
  return b;
}
function chooseOperator(nextOperator) {
  const inputValue = Number(current);
  if (operator && !waitingForOperand) {
    const result = calculate(stored, operator, inputValue);
    if (!Number.isFinite(result)) { current = 'Error'; stored = null; operator = null; updateDisplay(); return; }
    current = String(Number(result.toPrecision(12)));
    stored = result; updateDisplay();
  } else {
    stored = inputValue;
  }
  operator = nextOperator; waitingForOperand = true; justCalculated = false;
  expression.textContent = `${current} ${symbol(nextOperator)}`;
}
function symbol(op) { return ({'*':'×','/':'÷','+':'+','-':'−','%':'%'})[op] || op; }
function equals() {
  if (!operator || stored === null || current === 'Error') return;
  const a = stored, b = Number(current), op = operator;
  const result = calculate(a, op, b);
  expression.textContent = `${a} ${symbol(op)} ${b} =`;
  current = Number.isFinite(result) ? String(Number(result.toPrecision(12))) : 'Cannot divide by zero';
  stored = null; operator = null; waitingForOperand = false; justCalculated = true;
  updateDisplay();
}
function deleteLast() {
  if (waitingForOperand || justCalculated || current === 'Error' || current === 'Cannot divide by zero') { current = '0'; }
  else { current = current.length > 1 ? current.slice(0, -1) : '0'; if (current === '-') current = '0'; }
  updateDisplay();
}
function toggleSign() {
  if (current !== '0' && current !== 'Error' && current !== 'Cannot divide by zero') current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}
function handleAction(action) {
  if (action === 'clear') clearAll();
  if (action === 'delete') deleteLast();
  if (action === 'sign') toggleSign();
  if (action === 'equals') equals();
}
document.querySelector('.keys').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.value !== undefined) {
    const value = button.dataset.value;
    if ('0123456789.'.includes(value) && value.length === 1) inputDigit(value);
    else chooseOperator(value);
  } else handleAction(button.dataset.action);
});
document.addEventListener('keydown', event => {
  if (/^[0-9.]$/.test(event.key)) inputDigit(event.key);
  else if (['+','-','*','/','%'].includes(event.key)) chooseOperator(event.key);
  else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); equals(); }
  else if (event.key === 'Backspace') deleteLast();
  else if (event.key === 'Escape') clearAll();
});
