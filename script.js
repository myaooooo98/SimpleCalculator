const calculator = document.querySelector('.calculator');
const displayBox = document.getElementById('calculator-display');
const previousOperandDisplay = displayBox.querySelector('.previous-operand');
const currentOperandDisplay = displayBox.querySelector('.current-operand')
const keys = document.getElementById('calculator-keys');
const operators = document.querySelectorAll('.operator');

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
    }
}

function lastOperationDisplay(firstValue, secondValue, operator) {
    // update the previous operand display
    const operatorMap = document.querySelector(`[data-action="${operator}"]`).textContent;

    return (previousOperandDisplay.textContent = `${firstValue} ${operatorMap} ${secondValue} =`);
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

    // set the previousKey to the current keyType for future use
    calculator.dataset.previousKey = keyType;

    // remove all active class in operators
    operators.forEach(k => k.classList.remove('active'));

    // update the variables
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
        if (previousKey === 'operator' || previousKey === 'operate') return '0.';
        // ensure no '.' can be inputted after there already have decimal or '%' in the string
        if (!displayNum.includes('.') && !displayNum.includes('%')) return displayNum + keyContent;

        // if it does not fit neither condition, eg: already have '.' but '.' is hit again
        return displayNum;
    }

    if (keyType === 'operator' || keyType === 'operate') {
        key.classList.add('active');
        return calculation(key, displayNum, previousKey);
    }

    if (keyType === 'clear') return '0';

    if (keyType === 'delete') {
        if (displayNum.match(/^-?\d$/) ||   // single digit number
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

    if (keyType === 'plus-minus') return displayNum *= -1;

    if (keyType === 'percentage') {
        if (!displayNum.includes('%')) return displayNum + keyContent;
        return displayNum;
    }
}

function updateOperand(keyType, previousState) {
    // update the variables
    const clearBtn = document.getElementById('AC/CE');

    if (keyType !== 'clear') {
        clearBtn.dataset.action = 'delete';
        clearBtn.textContent = 'CE';
    }

    if (keyType === 'number') {
        if (previousState === 'operate') {
            // record the ans from previous operation
            previousOperandDisplay.textContent = `Ans = ${firstOperand}`;
            firstOperand = null;
            operator = null;
        }
    }

    if (keyType === 'delete') {
        if (previousState === 'operator') operator = null;
        if (previousState === 'operate' || previousState === 'plus-minus') {
            previousOperandDisplay.textContent = !firstOperand ? 'Ans = 0' : `Ans = ${firstOperand}`;
            clearBtn.dataset.action = 'clear';
            clearBtn.textContent = 'AC';
        }
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
        clearBtn.dataset.action = 'clear';
        clearBtn.textContent = 'AC';
        previousOperandDisplay.textContent = 'Ans = 0';
        firstOperand = null;
        modValue = null;
        operator = null;
    }
}

function calculation(key, displayNum, previousState) {
    // calculations for operate key and operator key
    const action = key.dataset.action;
    let firstValue = firstOperand;
    const selectedOperator = operator;

    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        firstOperand = (firstValue || firstValue === 0) &&
            selectedOperator &&
            previousState !== 'operator' &&
            previousState !== 'operate'
            ? roundNum(operate(firstValue, displayNum, selectedOperator))
            : +displayNum;

        operator = action;
        return firstOperand;
    }
    
    if (action === 'operate') {
        modValue = (firstValue || firstValue === 0) && previousState === 'operate'
            ? modValue
            : displayNum;
            
        if (firstValue || firstValue === 0) {
            firstOperand = previousState === 'operate'
                ? roundNum(operate(displayNum, modValue, selectedOperator))
                : roundNum(operate(firstValue, displayNum, selectedOperator));
        } else {
            firstOperand = +displayNum;
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
    // to prevent the previous key is reinput again when enter is pressed
    if (e.key === 'Enter') e.preventDefault();     
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

module.exports = {
    operate,
    lastOperationDisplay,
    checkPercentageNum,
    roundNum,
    getKeyType,
    updateDisplay,
    updateOperand,
    calculation,
};