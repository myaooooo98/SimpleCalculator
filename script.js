const calculator = document.querySelector('.calculator');
const displayBox = document.getElementById('calculator-display');
const previousOperandDisplay = displayBox.querySelector('.previous-operand');
const currentOperandDisplay = displayBox.querySelector('.current-operand')
const numberBtns = document.querySelectorAll('[data-number]');
const actionBtns = document.querySelectorAll('[data-action]');
const keys = document.getElementById('calculator-keys');

const operatorMap = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
};

let firstOperand = null;
let operator = null;
let modValue = null;

function operate(a, b, operator) {
    let num1 = parseFloat(a);
    let num2 = parseFloat(b);
    switch (operator) {
        case 'add':
            return num1 + num2;
        case 'subtract':
            return num1 - num2;
        case 'multiply':
            return num1 * num2;
        case 'divide':
            return num1 / num2;
        default:
            return 0;
    }
}

function getKeyType(key) {
    const action = key.dataset.action;
    if (!action) return 'number';
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) return 'operator';

    // for others return action
    return action;
}

function updateCalculatorState(key, calculator) {
    const keyType = getKeyType(key);
    calculator.dataset.previousKey = keyType;
    return calculator.dataset.previousKey;
}

function updateDisplay(key, displayNum, state) {
    const keyType = getKeyType(key);
    const previousKey = updateCalculatorState(key, state);
    const keyContent  = key.textContent;

    if (keyType === 'number') {
        return displayNum === '0' ||
            previousKey === 'operator' ||
            previousKey === 'operate'
            ? keyContent
            : displayNum + keyContent;
    }

    if (keyType === 'decimal') {
        if (!displayNum.includes('.')) return displayNum + keyContent;
        if (
            previousKey === 'operator' ||
            previousKey === 'operate'
        ) return '0.';

        // if it does not fit neither condition, eg: already have '.' but '.' is hit again
        return displayNum;
    }

    if (keyType === 'operator' || keyType === 'operate') {
        return calculation(key, displayNum, previousKey, firstOperand, operator, modValue);
    }

    if (keyType === 'clear') {
        resetDefault();
        return '0';
    }
}

function resetDefault() {
    firstOperand = null;
    modValue = null;
    operator = null;
}

function calculation(key, displayNum, state, firstOperand, operator, modValue) {
    const action = key.dataset.action;
    const firstValue = firstOperand;
    const selectedOperator = operator;
    const secondValue = displayNum;

    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        operator = action;
        firstOperand = firstValue &&
            selectedOperator &&
            state !== 'operator' &&
            state !== 'calculator'
            ? operate(firstValue, secondValue, selectedOperator)
            : displayNum;
        return firstOperand;
    }
    
    if (action === 'calculate') {
        if (firstValue) {
            modValue = state === 'calculate'
                ? modValue
                : displayNum;
            firstOperand = state === 'calculate'
                ? operate(firstValue, modValue, selectedOperator)
                : operate(firstValue, secondValue, selectedOperator);
            return firstOperand;
        } else {
            return displayNum;
        }
    }
}

keys.addEventListener('click' , e => {
    if (!e.target.matches('button')) return;

    const key = e.target;
    const displayNum = currentOperandDisplay.textContent;
    const updatedString = updateDisplay(key, displayNum, calculator);

    currentOperandDisplay.textContent = updatedString;
});

// keys.addEventListener('click', e => {
//     if (e.target.matches('button')) {
//         const key = e.target;
//         const action = key.dataset.action;
//         const keyContent = key.textContent;
//         const displayNum = currentOperandDisplay.textContent;
//         const previousKey = calculator.dataset.previousKey;

//         // if it is a number
//         if (!action) {
//             if (
//                 displayNum === '0' || 
//                 previousKey === 'operator' ||
//                 previousKey === 'operate'
//             ) {
//                 currentOperandDisplay.textContent = keyContent;
//             } else {
//                 currentOperandDisplay.textContent += keyContent;
//             }
//             calculator.dataset.previousKey = 'number';
//         }

//         // if it is decimal point
//         if (action === 'decimal') {
//             if (!displayNum.includes('.')) {
//                 currentOperandDisplay.textContent += keyContent;
//             } else if (
//                 previousKey === 'operator' ||
//                 previousKey === 'operate'
//             ) {
//                 currentOperandDisplay.textContent = '0.';
//             }
//             calculator.dataset.previousKey = 'decimal'
//         }

//         // if it is an operator
//         if (
//             action === 'add' ||
//             action === 'subtract' ||
//             action === 'multiply' ||
//             action === 'divide'
//         ) {
//             const firstValue = firstOperand;
//             const selectedOperator = operator
//             const secondValue = displayNum;

//             if (
//                 firstValue && 
//                 selectedOperator &&
//                 previousKey !== 'operator' &&
//                 previousKey !== 'operate'
//             ) {
//                 const calcValue = operate(firstValue, secondValue, selectedOperator);
//                 currentOperandDisplay.textContent = calcValue;

//                 // update the calculated value as first value
//                 firstOperand = calcValue;
//             } else {
//                 firstOperand = displayNum;
//             }

//             operator = action;

//             // add custom attribute
//             calculator.dataset.previousKey = 'operator';
//         }


//         if (action === 'operate') {
//             let firstValue = firstOperand;
//             const selectedOperator = operator;
//             let secondValue = displayNum;

//             if (firstValue) {
//                 if (previousKey === 'operate') {
//                     // take the ans from previous calculation as first value
//                     firstValue = displayNum;
//                     secondValue = modValue;
//                 }

//                 const calcValue = operate(firstValue, secondValue, selectedOperator);
//                 currentOperandDisplay.textContent = calcValue;
//                 firstOperand = calcValue;
//             }

//             // store the second value for next calculation if '=' is hit again
//             modValue = secondValue;
//             calculator.dataset.previousKey = 'operate';
//         }
        
//         if (action === 'clear') {
//             currentOperandDisplay.textContent = '0';
//             firstOperand = null;
//             modValue = null;
//             operator = null;
//             calculator.dataset.previousKey = 'clear';
//         }
//         console.log(firstOperand, operator)
//     }
// });

// function clear() {
//     result = null;
//     referenceScreen.textContent = '';
//     displayScreen.textContent = '0';
// }

// function updateOperand() {
    
// }


// function updateDisplay(value) {
//     if (value === 'Backspace') {
//         displayValue = displayValue.slice(0, -1);
//     } else if (result !== null) {
//         if (!isNaN(parseFloat(value))) {
//             defaultSettings();
//             displayValue += value;
//         } else {
//             displayValue += value;
//             result = null;
//             console.log(displayValue, result);
//         } 
//     } else {
//         displayValue += value
//     }
//     referenceScreen.textContent = displayValue;
// }

// function updateResult(value) {
//     displayValue = value;
//     displayScreen.textContent = value;
// }

// function mathError(message) {
//     displayValue = '';
//     referenceScreen.textContent = '';
//     displayScreen.textContent = message;
// }

// function decimal() {
//     if (displayValue.includes('.')) return;
//     if (displayValue === '') {
//         updateDisplay('0');
//     }
// }

// function percentageConverter(num) {
//     return num / 100;
// }

// function plusMinueConverter(num) {
//     return num *= -1;
// }

// function calculate() {
//     const regex = /(-?\d+(?:\.\d+)?)([+\-x\÷])(-?\d+(?:\.\d+)?)$/;
//     let match = displayValue.match(regex);

//     if (!match) return mathError('MATH ERROR');

//     let [_, num1, operator, num2] = match;
//     if (operator === '÷' && num2 === 0) return mathError('Infinity');
//     const parsedNum1 = parseFloat(num1);
//     const parsedNum2 = parseFloat(num2);

//     if(isNaN(parsedNum1) || isNaN(parsedNum2)) return mathError('MATH ERROR');

//     result = operate(parsedNum1, parsedNum2, operator);
//     updateResult(result);
//     return result;
// }

// items.forEach(item => {
//     item.addEventListener('click', e => {
//         let key = e.target.dataset.key;
//         if (key === '*' || key === '/') {
//             key = operatorMap[key];
//         } else if (key === '.') {
//             decimal();
//         }
//         updateDisplay(key);
//     });
// });

// clearBtn.addEventListener('click', defaultSettings);

// deleteBtn.addEventListener('click', (e) => {
//     updateDisplay(e.target.dataset.key);
// });

// equalBtn.addEventListener('click', calculate);

// window.addEventListener('keydown', e => {
//     console.log(e.keyCode, e.key);
//     let num = document.querySelector(`.number[data-key="${e.key}"]`);
    
//     if (e.key === '*') {    // avoid 8 is inputed when * is pressed
//         num = null;   
//     }

//     if (num) {
//      updateDisplay(e.key);
//     }

//     const operator = operatorMap[e.key];

//     if (operator) {
//         updateDisplay(operator);
//         e.preventDefault();
//     }

//     if (e.key === '.') {
//         decimal();
//     }

//     if (e.key === 'Enter' || e.key === '=') {
//         calculate();
//     }

//     if (e.key === 'Backspace') {
//         updateDisplay(e.key);
//     }

//     if (e.key === 'Escape') {
//         defaultSettings();
//     }
// });
