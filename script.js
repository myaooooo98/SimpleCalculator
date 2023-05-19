const displayBox = document.getElementById('display');
const displayEquation = displayBox.querySelector('.equation');
const displayResult = displayBox.querySelector('.result')
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equal = document.getElementById('equal');
const decimal = document.getElementById('decimal');

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
    } else if (value === 'error') {
        displayValue = 'MATH ERROR';
    } else {
        displayValue += value
    }
    displayEquation.textContent = displayValue;
}

function updateResult(value) {
    displayResult.textContent = value;
}

function calculate() {
    const regex = /(-?\d+(?:\.\d+)?)([+\-x\÷])(-?\d+(?:\.\d+)?)$/;
    let match = displayValue.match(regex);

    if (!match) return updateDisplay('error');

    let [_, num1, operator, num2] = match;
    console.log(_, `num1 = ${num1}`, operator, `num2 = ${num2}`);
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if(isNaN(num1) || isNaN(num2)) return updateDisplay('error');

    result = operate(num1, num2, operator);
    updateResult(result);
    return result;
}

numbers.forEach(number => {
    number.addEventListener('click', e => {
        updateDisplay(e.target.dataset.key);
    });
});

operators.forEach(operator => {
    operator.addEventListener('click', e => {
        updateDisplay(e.target.dataset.key);
    });
});

clear.addEventListener('click', defaultSettings);

deleteBtn.addEventListener('click', (e) => {
    updateDisplay(e.target.dataset.key);
});

equal.addEventListener('click', calculate);

decimal.addEventListener('click', e => {
    updateDisplay(e.target.dataset.key);
});

window.addEventListener('keydown', e => {
    console.log(e.keyCode, e.key);
    let num = document.querySelector(`.number[data-key="${e.key}"]`);
    
    if (e.key === '*') {    // avoid 8 is inputed when * is pressed
        num = null;   
    }

    if (num) {
     updateDisplay(e.key);
    }

    const operatorMap = {
        '+': '+',
        '-': '-',
        '*': 'x',
        '/': '÷',
    };

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
