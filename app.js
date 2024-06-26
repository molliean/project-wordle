
import { wordList } from './words.js';

let secretWord = getRandomWord();

function getRandomWord() {
    const randomWord = Math.floor(Math.random() * wordList.length);
    return wordList[randomWord].toUpperCase();
}
console.log(secretWord);

let guessesArray = Array.from({ length: 6 }, () => Array(5).fill(''));
let currentGuessIndex = 0;
let currentLetterIndex = 0;

const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('click', (e) => {
    const clickedElement = e.target;
        if (clickedElement.classList.contains('key')) {
        handleOnScreenKeyPress(clickedElement);
    }
});

function handleOnScreenKeyPress(keyElement) {
    const key = keyElement.getAttribute('data-key');
    handleKeyPress({ key });
}

function handleKeyPress(e) {
    const key = e.key.toUpperCase();
    if (validLetters.includes(key) && currentLetterIndex < 5) {
        guessesArray[currentGuessIndex][currentLetterIndex] = key;
        renderTile(currentGuessIndex, currentLetterIndex, key);
        currentLetterIndex++;
    } else if (key === 'BACKSPACE' && currentLetterIndex > 0) {
        currentLetterIndex--;
        guessesArray[currentGuessIndex][currentLetterIndex] = '';
        renderTile(currentGuessIndex, currentLetterIndex, '');
    } else if (key === 'ENTER' && currentLetterIndex === 5) {
        submitGuess();
    }
}

function updateKeyboardVisualState(letter, color) {
    const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
    if (keyElement && !keyElement.classList.contains('action')) { // Do not update 'enter' or 'backspace'
        keyElement.classList.remove('green', 'yellow', 'gray');
        if (color === 'green') {
            keyElement.classList.add('green');
        } else if (color === 'yellow') {
            keyElement.classList.add('yellow');
        } else if (color === 'gray') {
            keyElement.classList.add('gray');
        }
    }
}

function renderTile(rowIndex, colIndex, letter) {
    const tileElement = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`)
    tileElement.textContent = letter;
}

function submitGuess() {
    const currentGuess = guessesArray[currentGuessIndex].join('');
    console.log(`submitted guess: ${currentGuess}`);
    const alertMessage = document.querySelector('#alert');
    alertMessage.innerHTML = '';
    if (!wordList.includes(currentGuess.toLowerCase())) {
        alertMessage.innerHTML = 'Not a valid word';
        alertMessage.style.cssText = 'color: red; text-align: center;';
        resetGuess(currentGuess);
    } else  {
        processGuess(currentGuess);
        if(currentGuess === secretWord){
            updateColors(Array(5).fill('green'));
            setTimeout(() => {
                alertMessage.innerHTML = 'You win!';
                alertMessage.style.cssText = 'color: red; text-align: center;';
            }, 400);
        } else {
            if (currentGuessIndex >= 5) {
                setTimeout(() =>{
                    alertMessage.innerHTML = `Out of guesses. Secret word is ${secretWord}`;
                    alertMessage.style.cssText = 'color: red; text-align: center;';
                    resetGame();
                }, 400);
        }
        currentGuessIndex++;
        currentLetterIndex = 0;
    }  
}}

function processGuess(guess) {
    const secretWordArray = secretWord.split('');
    const guessArray = guess.split('');
    let feedback = Array(5).fill('');
    guessArray.forEach((letter, index) => {
        if (letter === secretWordArray[index]) {
            feedback[index] = 'green';
            secretWordArray[index] = null;
        }
    })
    guessArray.forEach((letter, index) => {
        if (feedback[index] === '') {
            const secretIndex = secretWordArray.indexOf(letter);
            if (secretIndex !== -1) {
                feedback[index] = 'yellow';
                secretWordArray[secretIndex] = null;
            } else {
                feedback[index] = 'gray';
            }
        }
    });
    console.log(feedback);
    console.log(guessesArray);
    updateColors(feedback);
    guessArray.forEach((letter, index) => {
        updateKeyboardVisualState(letter, feedback[index]);
    });
};

function updateColors(feedback) {
    const colorsArray = feedback;
    colorsArray.forEach((color, index) => {
        const tileElement = document.querySelector(`.cell[data-row="${currentGuessIndex}"][data-col="${index}"]`);
        if (color === 'green') {
            tileElement.classList.add('green');
        } else if (color === 'yellow') {
            tileElement.classList.add('yellow');
        } else {
            tileElement.classList.add('gray');
        }
    });
}

function resetGuess(guess) {
    guessesArray[currentGuessIndex].forEach((_, index) => {
        guessesArray[currentGuessIndex][index] = '';
        renderTile(currentGuessIndex, index, '');
    });
    currentLetterIndex = 0;
}

const newGameButton = document.querySelector('#button');
newGameButton.addEventListener('click', () => {
    newGameButton.blur();
    resetGame();
});

function resetGame() {
    document.activeElement.blur();
    const alertMessage = document.querySelector('#alert');
    guessesArray.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            guessesArray[rowIndex][colIndex] = '';
            const tileElement = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            tileElement.textContent = '';
            tileElement.classList.remove('green', 'yellow', 'gray');
        })
    });
    currentGuessIndex = 0;
    currentLetterIndex = 0;
    secretWord = getRandomWord();
    alertMessage.innerHTML = '';
    console.log(secretWord);

    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('green', 'yellow', 'gray', 'guessed');
    });
}
