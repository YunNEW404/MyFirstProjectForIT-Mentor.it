const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';
let operation = null;
let firstNumber = null;
const MAX_INPUT_LENGTH = 10;
let enterPressed = false;

function updateDisplay() {
    let displayText = currentInput;

    if (firstNumber !== null && operation !== null) {
        displayText = `${firstNumber} ${operation}`;

        if (currentInput !== '') {
            displayText +=  `${currentInput}`; 
        }
    }

    display.value = displayText || '0';
}

function clear() {
    currentInput = '';
    operation = null;
    firstNumber = null;
    updateDisplay();
}

function handleDigit(digit) {
    if (enterPressed) {
        enterPressed = false;
        currentInput = '';
        display.value = currentInput;
    }

    if (currentInput.length < MAX_INPUT_LENGTH) {
        if (digit === '-' && currentInput === '') {
            currentInput = '-';
        } else if (digit === '-' && currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1); 
        } else if (digit === '-' && !currentInput.startsWith('-')) {
            currentInput = '-' + currentInput; 
        } else {
            if (digit === '.' && currentInput.includes('.')) return;
            if (currentInput === '0' && digit !== '.') {
                currentInput = digit;
            } else if (currentInput === '' && digit === '.') {
                currentInput = '0.';
            } else {
                currentInput += digit;     
            }
        }
        updateDisplay();
    }
}

function handleOperation(op) {
    if (currentInput === '' && firstNumber === null) return;

    if (operation !== null && currentInput === '') {
        operation = op;  
        updateDisplay();  
        return; 
    }

    if (firstNumber === null) {
        firstNumber = parseFloat(currentInput);
    } else {
        calculateResult(op);
        if (currentInput === 'Ошибка') return;
    }

    operation = op;
    currentInput = '';
    updateDisplay();
}

function calculateResult(nextOp = null) {
    if (firstNumber === null || operation === null || currentInput === '') {
        return;
    }

    const secondNumber = parseFloat(currentInput);
    if (isNaN(secondNumber)) {
        clear();
        display.value = "Ошибка";
        currentInput = 'Ошибка';
        return;
    }

    let result;
    switch (operation) {
        case '+': result = firstNumber + secondNumber; break;
        case '-': result = firstNumber - secondNumber; break;
        case 'X': result = firstNumber * secondNumber; break;
        case '÷': 
            if (secondNumber === 0) {
                clear();
                display.value = "Ошибка";
                currentInput = 'Ошибка';
                return;
            }
            result = firstNumber / secondNumber; 
            break;
        default: return;
    }

    firstNumber = result;
    if (nextOp === null) {
        currentInput = result.toString();
        enterPressed = true;
    } else {
        currentInput = '';
    }

    operation = nextOp;
    updateDisplay();
}

function handleButtonClick(key) {
    if (!isNaN(key) || key === '.' || key === '-') {
        handleDigit(key);
    } else if (key === '±') { 
        toggleSign();
    } else if (['+', '-', 'X', '÷'].includes(key)) {
        handleOperation(key);
    } else if (key === '=') {
        calculateResult();
    } else if (key === 'C') {
        clear();
    }
}

function toggleSign() {
    if (currentInput !== '') {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value || button.textContent;
        handleButtonClick(value);
    });
});

document.addEventListener('keydown', event => {
    let key = event.key;
    if (key === '*' || key === 'x' || key === 'X') key = 'X';
    if (key === '/') key = '÷';
    if (key === 'Enter') {
        enterPressed = true;
        handleButtonClick('=');
    } else {
        handleButtonClick(key);
    }
});