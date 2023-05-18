const displayBox = document.getElementById('display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equal = document.getElementById('equal');
const decimal = document.getElementById('decimal');

let displayValue = '';
let result = null;
let isCalculate = false;

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
    if (value === 'clear') {
        displayValue = '';
    } else if (value === 'delete') {
        displayValue = displayValue.slice(0, -1);
    } else if (value === 'error') {
        displayValue = 'ERROR';
    } else {
        if (isCalculate && result !== null && !isNaN(value)) {
            displayValue = '';
        } 
        displayValue += value
    }
    displayBox.textContent = displayValue;
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
    updateDisplay('clear');
    updateDisplay(result);
    isCalculate = !isCalculate;
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

clear.addEventListener('click', () => {
    updateDisplay('clear')
});

deleteBtn.addEventListener('click', () => {
    updateDisplay('delete')
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
     updateDisplay(num.textContent);
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
        updateDisplay('delete');
    }

    if (e.key === 'Escape') {
        updateDisplay('clear');
    }
});
