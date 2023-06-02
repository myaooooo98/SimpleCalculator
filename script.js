const calculator = document.querySelector('.calculator');
const displayBox = document.getElementById('calculator-display');
const previousOperandDisplay = displayBox.querySelector('.previous-operand');
const currentOperandDisplay = displayBox.querySelector('.current-operand')
const keys = document.getElementById('calculator-keys');

const keydownMapper = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '.': 'decimal',
    '%': 'percentage',
    '=': 'operate',
    'Enter': 'operate',
    'Backspace': 'delete',
    'Escape': 'clear',
};

let firstOperand = null;
let operator = null;
let modValue = null;

function operate(a, b, operator) {
    // carry out the mathematical operation
    let num1 = checkPercentageNum(a, 100);
    let num2 = checkPercentageNum(b, num1);
    
    lastOperationDisplay(a, b, operator)

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

function lastOperationDisplay(firstValue, secondValue, operator) {
    const operatorMap = document.querySelector(`[data-action="${operator}"]`).textContent;
    
    return previousOperandDisplay.textContent = `${firstValue} ${operatorMap} ${secondValue} =`
}

function checkPercentageNum(value, wholeNum) {
    // to check whether it is a percentage
    const regex = /-?\d+(?:\.\d+)?%$/;
    if (regex.test(value)) {
        return wholeNum!== 100
            ? parseFloat(value) / 100 * wholeNum
            : parseFloat(value) / wholeNum;
    } else {
        return parseFloat(value);
    }
}

function roundNum(num) {
    // round of the answer to 6 decimal places
    return parseFloat(num.toFixed(6));
}

function getKeyType(key) {
    // classified the key based on data-action
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

function updateDisplay(key, displayNum, calculator) {
    // update the currentOperandDisplay
    const keyType = getKeyType(key);
    const previousKey = calculator.dataset.previousKey;
    const keyContent  = key.textContent;

    calculator.dataset.previousKey = keyType;
    updateOperand(keyType, previousKey);

    if (keyType === 'number') {
        return displayNum === '0' ||
            previousKey === 'operator' ||
            previousKey === 'operate' ||
            displayNum.includes('%')
            ? keyContent
            : displayNum + keyContent;
    }

    if (keyType === 'decimal') {
        if (
            previousKey === 'operator' ||
            previousKey === 'operate'
        ) return '0.';
        // ensure no '.' can be inputted after there already have decimal or '%' in the string
        if (!displayNum.includes('.') && !displayNum.includes('%')) return displayNum + keyContent;

        // if it does not fit neither condition, eg: already have '.' but '.' is hit again
        return displayNum;
    }

    if (keyType === 'operator' || keyType === 'operate') {
        return calculation(key, displayNum, previousKey);
    }

    if (keyType === 'clear') {
        return '0';
    }

    if (keyType === 'delete') {
        if (displayNum.match(/^-?\d$/) || 
        previousKey === 'clear' || 
        previousKey === 'operate' || 
        previousKey === 'plus-minus'
        ) {
            return '0';
        } else if (previousKey === 'operator') {
            return displayNum;
        } else {
            return displayNum.slice(0, -1);
        }
    }

    if (keyType === 'plus-minus') {
        return displayNum *= -1;
    }

    if (keyType === 'percentage') {
        if (!displayNum.includes('%')) return displayNum + keyContent;
        return displayNum;
    }
}

function updateOperand(keyType, previousState) {
    if (keyType === 'number') {
        if (previousState === 'operate') {
            firstOperand = null;
            operator = null;
        }
    }

    if (keyType === 'delete') {
        if (previousState === 'operator') operator = null;
    }

    if (keyType === 'plus-minus') {
         // if the user change the sign after clicked the operator (reset it)
        if (previousState === 'operate') operator = null;
        if (previousState === 'operator') {
            firstOperand = null;
            operator = null;
        }
    }

    if (keyType === 'clear') {
        firstOperand = null;
        modValue = null;
        operator = null;
    }
}

function calculation(key, displayNum, previousState) {
    const action = key.dataset.action;
    let firstValue = firstOperand;
    const selectedOperator = operator;

    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        firstOperand = firstValue &&
            selectedOperator &&
            previousState !== 'operator' &&
            previousState !== 'operate'
            ? roundNum(operate(firstValue, displayNum, selectedOperator))
            : displayNum;

        operator = action;
        return firstOperand;
    }
    
    if (action === 'operate') {
        modValue = firstValue && previousState === 'operate'
            ? modValue
            : displayNum;
            
        if (firstValue) {
            firstOperand = previousState === 'operate'
                ? roundNum(operate(displayNum, modValue, selectedOperator))
                : roundNum(operate(firstValue, displayNum, selectedOperator));
        } else {
            firstOperand = displayNum;
        }
        return firstOperand
    }
}


// when user clicked the button
keys.addEventListener('click' , e => {
    if (!e.target.matches('button')) return;

    const key = e.target;
    const displayNum = currentOperandDisplay.textContent;
    const updatedString = updateDisplay(key, displayNum, calculator);

    currentOperandDisplay.textContent = updatedString;
});

// when user using keyboard
window.addEventListener('keydown', e => {
    let key = null;
    let targetBtn = null;
    const displayNum = currentOperandDisplay.textContent;

    if (e.key >= 0 && e.key <= 9) {
        key = e.key;
        targetBtn = document.querySelector(`[data-number="${key}"]`);
    }

    if (!targetBtn) {
        key = keydownMapper[e.key];
        targetBtn = document.querySelector(`[data-action=${key}]`)
    }

    // stop updateDisplay to be carry out with null object
    if (!targetBtn) return;
    
    const updatedString = updateDisplay(targetBtn, displayNum, calculator);

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
