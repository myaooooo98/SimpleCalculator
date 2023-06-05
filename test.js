import { 
    operate,
    lastOperationDisplay,
    checkPercentageNum,
    roundNum,
    getKeyType,
    updateDisplay,
    updateOperand,
    calculation
 } from './script.js';

 const displayBox = document.createElement('div');
 displayBox.innerHTML = `
    <div class="previous-operand"></div>
    <div class="current-operand"></div>
 `;
const previousOperandDisplay = displayBox.querySelector('.previous-operand');
const currentOperandDisplay = displayBox.querySelector('.current-operand');

const calculator = document.createElement('div');
calculator.classList.add('calculator');
calculator.appendChild(displayBox);

const keys = document.createElement('div');
keys.id = 'calculator-keys';
calculator.appendChild(keys);

const addBtn = document.createElement('button');
addBtn.dataset.action = 'add';
addBtn.textContent = '+';
keys.appendChild(addBtn);

const subtractBtn = document.createElement('button');
subtractBtn.dataset.action = 'subtract';
subtractBtn.textContent = '-';
keys.appendChild(subtractBtn);

const multiplyBtn = document.createElement('button');
multiplyBtn.dataset.action = 'multiply';
multiplyBtn.textContent = '';
keys.appendChild(multiplyBtn);