const display = document.getElementById('display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');
const deleteBtn = document.getElementById('delete');
const equal = document.getElementById('equal');
const decimal = document.getElementById('decimal');

let displayValue = '';
let result = null;

function operate(number1, number2, operator) {
    let result = null;
    switch (operator) {
        case '+':
            result = number1 + number2;
            break;
        case '-':
            result = number1 - number2;
            break;
        case 'x':
            result = number1 * number2;
            break;
        case '÷':
            result = number1 / number2;
            break;
    }
    return result;
}

function displayOnCal(e) {
    displayValue += e;
    display.textContent = displayValue;
}

function resetDisplay() {
    display.textContent = '';
    displayValue = '';   
}

function deleteValue() {
    displayValue = displayValue.slice(0, -1);
    display.textContent = displayValue; 
}

function calculate() {
    const regex = /(-?\d+(?:\.\d+)?)([+, \-, x, ÷])(-?\d+(?:\.\d+)?)$/;
    let [_, num1, operator, num2] = displayValue.match(regex);
    
    console.log(_, `num1 = ${num1}`, operator, `num2 = ${num2}`);
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if(isNaN(num1) || isNaN(num2)) return;

    result = operate(num1, num2, operator);
    resetDisplay();
    displayOnCal(result);
    return result;
}

numbers.forEach(number => {
    number.addEventListener('click', e => {
        displayOnCal(e.target.textContent);
    });
});

operators.forEach(operator => {
    operator.addEventListener('click', e => {
        displayOnCal(e.target.textContent);
    });
});

clear.addEventListener('click', resetDisplay);

deleteBtn.addEventListener('click', deleteValue);

equal.addEventListener('click', calculate);

window.addEventListener('keydown', e => {
    console.log(e.keyCode, e.key);
    let num = document.querySelector(`.number[data-key="${e.keyCode}"]`);
    
    if (e.key === '*') {    // avoid 8 is inputed when * is pressed
        num = null;   
    }

    if (num) {
        displayOnCal(num.textContent);
    }

    const operatorMap = {
        '+': '+',
        '-': '-',
        '*': 'x',
        '/': '÷',
    };

    const operator = operatorMap[e.key];

    if (operator) {
        displayOnCal(operator);
        e.preventDefault();
    }

    if (e.key === '.') {
        displayOnCal(e.key);
    }

    if (e.key === 'Enter' || e.key === '=') {
        calculate();
    }

    if (e.key === 'Backspace') {
        deleteValue();
    }

    if (e.key === 'Escape') {
        resetDisplay();
    }
});

decimal.addEventListener('click', e => {
    displayOnCal(e.target.textContent);
});