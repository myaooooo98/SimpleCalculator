const displayBox = document.getElementById('display');
const displayEquation = displayBox.querySelector('.equation');
const displayResult = displayBox.querySelector('.result')
const clearBtn = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equalBtn = document.getElementById('equal');
const items = document.querySelectorAll('.item');

const operatorMap = {
    '+': '+',
    '-': '-',
    '*': 'x',
    '/': '÷',
};

let displayValue = '';
let result = null;

// revise the function calculation, discaed using displayValue to do calculation
let firstOperand = '';
let secondOperand = '';

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
            if (number2 === 0) return null;
            else return number1 / number2;
        default:
            return null;
    }
}

function updateDisplay(value) {
    if (value === 'Backspace') {
        displayValue = displayValue.slice(0, -1);
    } else if (result !== null) {
        if (!isNaN(parseFloat(value))) {
            defaultSettings();
            displayValue += value;
        } else {
            displayValue += value;
            result = null;
            console.log(displayValue, result);
        } 
    } else {
        displayValue += value
    }
    displayEquation.textContent = displayValue;
}

function updateResult(value) {
    displayValue = value;
    displayResult.textContent = value;
}

function mathError() {
    displayValue = '';
    displayEquation.textContent = '';
    displayResult.textContent = 'MATH ERROR';
}

function decimal() {
    if (displayValue.includes('.')) return;
    if (displayValue === '') {
        updateDisplay('0');
    }
}

function percentageConverter(num) {
    return num / 100;
}

function calculate() {
    const regex = /(-?\d+(?:\.\d+)?)([+\-x\÷])(-?\d+(?:\.\d+)?)$/;
    let match = displayValue.match(regex);

    if (!match) return mathError();

    let [_, num1, operator, num2] = match;
    if (operator === '÷' && num2 === '0') return mathError();
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
        } else if (key === '.') {
            decimal();
        }
        updateDisplay(key);
    });
});

clearBtn.addEventListener('click', defaultSettings);

deleteBtn.addEventListener('click', (e) => {
    updateDisplay(e.target.dataset.key);
});

equalBtn.addEventListener('click', calculate);

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
        decimal();
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
