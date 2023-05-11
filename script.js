const display = document.getElementById('display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');
const equal = document.getElementById('equal');
const decimal = document.getElementById('decimal');

let displayValue = '';

function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    return x / y;
}

function operate(number1, number2, operator) {
    let result = null;
    switch (operator) {
        case '+':
            result = add(number1, number2);
            break;
        case '-':
            result = subtract(number1, number2);
            break;
        case 'x':
            result = multiply(number1, number2);
            break;
        case '÷':
            result = divide(number1, number2);
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

function calculate() {
    let operator = displayValue.match(/[+, \-, x, ÷]/g).toString();
    let [num1, num2] = displayValue.split(/[+, \-, x, ÷]/g);
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    let result = operate(num1, num2, operator);
    resetDisplay();
    displayOnCal(result);
    displayValue = '';
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

clear.addEventListener('click', resetDisplay)

equal.addEventListener('click', calculate);

window.addEventListener('keydown', e => {
    console.log(e.keyCode, e.key)

    let num = document.querySelector(`.number[data-key="${e.keyCode}"]`);
    
    if (e.key === '*') {    // avoid 8 is inputed when * is pressed
        num = null;   
    }

    if (num) {
        displayOnCal(num.textContent);
    }

    let operator = '';
    if (e.key === '+') {
        operator = '+';
    } else if (e.key === '-') {
        operator = '-';
    } else if (e.key === '*') {
        operator = 'x';
    } else if (e.key === '/') {
        operator = '÷';
    } 

    if (operator !== '') {
        displayOnCal(operator);
        e.preventDefault();
    }

    if (e.key === '.') {
        displayOnCal(e.key);
    }

    if (e.key === 'Enter' || e.key === '=') {
        calculate();
    }
});

decimal.addEventListener('click', e => {
    displayOnCal(e.target.textContent);
});