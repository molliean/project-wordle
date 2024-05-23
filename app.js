// 1. initialize the game
//     -generate a random 5-letter word from a predefined list of words
//     -set variables that store number of guesses, current guess, and guesses remaining
// 2. create interface
//     -use css grid to create a layout of 6 rows of 5 tiles and a 'new game' button
// 3. capture user input
//    -add an event listener that captures user input on keyboard click
//    -advance to next tile & row based on number of guesses remaining
//    -add function that renders chosen letters in corresponding tiles
//    -increment guesses remaining
// 4. process guess
//    -display 'not a word' and reset letters in row if 5 letter sequence doesn't match a valid word
//    -when a row is complete, implement win/loss logic that changes tile colors in that row:
//         -leave tile color unchanged if the letter doesn't appear in the word
//         -change tile to color1 if the letter is correct but in the wrong place
//         -change tile to color2 if letter is correct and in the right place 
// 5. end game
//     -if user guess matches secret word on any row, display 'you won!' message and end game
//     -if user doesn't match secret word after 6 guesses, display 'you lost' and end game. 
//     -after last tile is filled or after correct guess, display 'new game' button to reset the game
// 6. Additional features
//     -make a clock showing time elapsed in the game

import { wordList } from './words.js';

let secretWord = getRandomWord();
// Function to generate secret word

function getRandomWord() {
    const randomWord = Math.floor(Math.random() * wordList.length);
    return wordList[randomWord].toUpperCase();
}
console.log(secretWord);



//let maxGuesses = 6;

// Initialize a 2D array with 6 rows and 5 columns using Array.from() method
// () => Array(5).fill('') creates a subarray of 5 elements
let guessesArray = Array.from({ length: 6 }, () => Array(5).fill(''));
let currentGuessIndex = 0;
let currentLetterIndex = 0;

// Add event listener to the entire document 
// handleKeyPress called whenever event occurs
document.addEventListener('keydown', handleKeyPress);
const validLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function handleKeyPress(e) {
    // convert letter inputs to upper case and establish list of valid letters
    const key = e.key.toUpperCase();
    // checks if value is a valid letter and if there is room in the guess
    if (validLetters.includes(key) && currentLetterIndex < 5) {
        // updates guesses array with value of key pressed
        guessesArray[currentGuessIndex][currentLetterIndex] = key;
        // calls renderTile function with current row and col indices + key
        renderTile(currentGuessIndex, currentLetterIndex, key);
        // increments letter count. must be last in this sequence bc it affects the index passed into render function
        currentLetterIndex++;
    } else if (key === 'BACKSPACE' && currentLetterIndex > 0) {
        // decrements letter count, clears letter in guesses array
        currentLetterIndex--;
        // sets current index to empty string
        guessesArray[currentGuessIndex][currentLetterIndex] = '';
        // calls renderTile function with an empty string for letter instead of key value
        renderTile(currentGuessIndex, currentLetterIndex, '');
    } else if (key === 'ENTER' && currentLetterIndex === 5) {
        // submit guess if complete
        submitGuess();
    } 
}

function renderTile(rowIndex, colIndex, letter) {
    // selects html element with class .cell + current data-row and data-col attributes
    const tileElement = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`)
    // renders content of tile in the DOM
    tileElement.textContent = letter;
}

function submitGuess() {
    // combines letters in first row to a single string

    const currentGuess = guessesArray[currentGuessIndex].join('');
    console.log(`submitted guess: ${currentGuess}`);
    const alertMessage = document.querySelector('#alert');
    alertMessage.innerHTML = '';
    // if word is not in wordList array, display error message
    if (!wordList.includes(currentGuess.toLowerCase())) {
        alertMessage.innerHTML = 'Not a valid word';
        alertMessage.style.cssText = 'color: red; text-align: center;';
        resetGuess(currentGuess);
    } else if (currentGuess === secretWord) {
        processGuess(currentGuess);
        updateColors(Array(5).fill('green'));
        setTimeout(()=>{
            alertMessage.innerHTML = 'You win!';
            alertMessage.style.cssText = 'color: red; text-align: center;';
        }, 400);
    } else {
        processGuess(currentGuess);
        if(currentGuessIndex >=5){
            alertMessage.innerHTML = `Out of guesses. Secret word is ${secretWord}`;
            alertMessage.style.cssText = 'color: red; text-align: center;';
        }
        currentGuessIndex++;
        currentLetterIndex = 0; 
    }
}

//if (wordList.includes(currentGuess.toLowerCase()) && currentGuessIndex < 6)

console.log(guessesArray);



function processGuess(guess) {
    // separate single strings into arrays of letters
    const secretWordArray = secretWord.split('');
    const guessArray = guess.split('');
    // create a new array with 5 empty slots to be filled with 'green' 'yellow' or 'gray'
    let feedback = Array(5).fill('');
    // check letters using .forEach loop
    guessArray.forEach((letter, index) => {
        if (letter === secretWordArray[index]) {
            feedback[index] = 'green';
            secretWordArray[index] = null;
        }
    })
    guessArray.forEach((letter, index) => {
        if (feedback[index] === '') {
            if (secretWordArray.includes(letter)) {
                feedback[index] = 'yellow';
                secretWordArray[index] = null;
            } else {
                feedback[index] = 'gray';
            }
        }
    });
    console.log(feedback);
    updateColors(feedback);
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
newGameButton.addEventListener('click', resetGame);

function resetGame(){
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
}