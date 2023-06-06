// https://www.codingninjas.com/codestudio/library/jest-dom-manipulation

describe('Calculator Functions', () => {
  document.body.innerHTML = `
      <div class="calculator">
         <div id="calculator-display">
               <div class="previous-operand">Ans = 0</div>
               <div class="current-operand">0</div>
         </div>
         <div id="calculator-keys">
               <button data-action="clear">C</button>
               <button data-action="delete">DEL</button>
               <div id="numberpad">
                  <button data-number="1">1</button>
                  <button data-number="2">2</button>
                  <button data-number="3">3</button>
                  <button data-number="4">4</button>
                  <button data-number="5">5</button>
                  <button data-number="6">6</button>
                  <button data-number="7">7</button>
                  <button data-number="8">8</button>
                  <button data-number="9">9</button>
                  <button data-number="0">0</button>
               </div>
               <button data-action="decimal">.</button>
               <div id="operators">
                  <button data-action="add">+</button>
                  <button data-action="subtract">-</button>
                  <button data-action="multiply">&times;</button>
                  <button data-action="divide">÷</button>
               </div>
               <button data-action="plus-minus">+/-</button>
               <button data-action="percentage">%</button>
               <button data-action="operate">=</button> 
         </div>
      </div>
   `;

   const {
      operate,
      lastOperationDisplay,
      checkPercentageNum,
      roundNum,
      getKeyType,
      updateDisplay,
      updateOperand,
      calculation,
   } = require('./script');

   const calculator = document.querySelector('.calculator');
   const displayBox = document.getElementById('calculator-display');
   const previousOperandDisplay = displayBox.querySelector('.previous-operand');
   const currentOperandDisplay = displayBox.querySelector('.current-operand')
   const keys = document.getElementById('calculator-keys');

   test('operate - perform mathematical operation correctly', () => {
      // test addition
      expect(operate(5, 10, 'add')).toBe(15);

      // test subtraction
      expect(operate(5, -5, 'subtract')).toBe(10);

      // test multipication
      expect(operate(2.5, 4, 'multiply')).toBe(10);

      // test division
      expect(operate(15, 5, 'divide')).toBe(3);

      // test percentage number calculation
      expect(operate('15%', 5, 'add')).toBe(5.15);
      expect(operate('25%', '90%', 'add')).toBe(0.475);
      expect(operate(85,'60%', 'subtract')).toBe(34);
   });

   test('lastOperandDisplay - display the operation', () => {
      let result = lastOperationDisplay(5, 10, 'add');
      expect(result).toBe('5 + 10 =');
   });

   test('checkPercentageNum - detect percentage number and return the exact value based on the whole number', () => {
      expect(checkPercentageNum(5, 100)).toBe(5);
      expect(checkPercentageNum('57%', 100)).toBe(0.57);
      expect(checkPercentageNum('25%', 80)).toBe(20);
   });

   test('getKeyType - return the correct key based on action', () => {
      expect(getKeyType({dataset: {action: 'add'}})).toBe('operator');
      expect(getKeyType({dataset: {number: '2'}})).toBe('number');
      expect(getKeyType({dataset: {action: 'percentage'}})).toBe('percentage');
   });

   test('updateDisplay - show correct display based on the inputted key', () => {
      // test number input
      let key = document.querySelector('[data-number="5"]');
      expect(updateDisplay(key, '0', calculator)).toBe('5');
      expect(updateDisplay(key, '67.', calculator)).toBe('67.5');
      expect(updateDisplay(key, '78%', calculator)).toBe('5');


      
   });
});