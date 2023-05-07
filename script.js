const display = document.getElementById('display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clear = document.getElementById('clear');

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
    }
    return result;
}

function displayOnCal(e) {
    displayValue += e;
    display.textContent = displayValue;
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

clear.addEventListener('click', e => {
    display.textContent = '';
    displayValue = '';
});