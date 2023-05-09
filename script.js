const display = document.getElementById('display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');
const equal = document.getElementById('equal');

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
            result =  add(number1, number2);
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
        default:
            throw new Error('Invalid operator');
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

equal.addEventListener('click', e => {
    let operator = displayValue.match(/[+, \-, x, ÷]/g).toString();
    let [num1, num2] = displayValue.split(/[+, \-, x, ÷]/g);
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    let result = operate(num1, num2, operator);
    resetDisplay();
    displayOnCal(result);
    displayValue = '';
});

window.addEventListener('keydown', e => {
    let num = document.querySelector(`.number[data-key="${e.keyCode}"]`);
    if (!num) return;
    displayOnCal(num.textContent);
});