const displayBox = document.getElementById('display');
const displayEquation = displayBox.querySelector('.equation');
const displayResult = displayBox.querySelector('.result')
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equal = document.getElementById('equal');
const decimal = document.getElementById('decimal');
const items = document.querySelectorAll('.item');

const operatorMap = {
    '+': '+',
    '-': '-',
    '*': 'x',
    '/': '÷',
};

let displayValue = '';
let result = null;

function defaultSettings() {
    displayValue = '';
    result = null;
    displayEquation.textContent = '';
    displayResult.textContent = '0';
}

function operate(number1, number2, operator) {
    switch (operator) {
        case '+':
            return number1 + number2;
        case '-':
            return number1 - number2;
        case 'x':
            return number1 * number2;
        case '÷':
            return number1 / number2;
        default:
            return null;
    }
}

function updateDisplay(value) {
    if (value === 'Backspace') {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue += value
    }
    displayEquation.textContent = displayValue;
}

function updateResult(value) {
    displayResult.textContent = value;
}

function mathError() {
    displayValue = '';
    displayEquation.textContent = '';
    displayResult.textContent = 'MATH ERROR';
}

function calculate() {
    const regex = /(-?\d+(?:\.\d+)?)([+\-x\÷])(-?\d+(?:\.\d+)?)$/;
    let match = displayValue.match(regex);

    if (!match) return mathError();

    let [_, num1, operator, num2] = match;
    console.log(_, `num1 = ${num1}`, operator, `num2 = ${num2}`);
    const parsedNum1 = parseFloat(num1);
    const parsedNum2 = parseFloat(num2);

    if(isNaN(parsedNum1) || isNaN(parsedNum2)) return mathError();

    result = operate(parsedNum1, parsedNum2, operator);
    updateResult(result);
    return result;
}

items.forEach(item => {
    item.addEventListener('click', e => {
        let key = e.target.dataset.key;
        if (key === '*' || key === '/') {
            key = operatorMap[key];
        }
        updateDisplay(key);
    });
});

clear.addEventListener('click', defaultSettings);

deleteBtn.addEventListener('click', (e) => {
    updateDisplay(e.target.dataset.key);
});

equal.addEventListener('click', calculate);

window.addEventListener('keydown', e => {
    console.log(e.keyCode, e.key);
    let num = document.querySelector(`.number[data-key="${e.key}"]`);
    
    if (e.key === '*') {    // avoid 8 is inputed when * is pressed
        num = null;   
    }

    if (num) {
     updateDisplay(e.key);
    }

    const operator = operatorMap[e.key];

    if (operator) {
        updateDisplay(operator);
        e.preventDefault();
    }

    if (e.key === '.') {
        updateDisplay(e.key);
    }

    if (e.key === 'Enter' || e.key === '=') {
        calculate();
    }

    if (e.key === 'Backspace') {
        updateDisplay(e.key);
    }

    if (e.key === 'Escape') {
        defaultSettings();
    }
});
