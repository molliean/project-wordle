// 1. initialize the game
//     -generate a random 5-letter word from a predefined list of words
//     -set variables that store number of guesses, current guess, and guesses remaining
// 2. create interface
//     -use css grid to create a layout of 6 rows of 5 tiles
//     -show an on-screen keyboard for user input
// 3. capture user input
//    -add an event listener that captures user input on keyboard click
//    -advance to next tile & row based on number of guesses remaining
//    -add function that renders chosen letters in corresponding tiles
//    -display 'not a word' and reset letters in row if 5 letter sequence doesn't match a valid word
// 4. process guess
//    -increment guesses remaining
//    -when a row is complete, implement win/loss logic that changes tile colors in that row:
//         -leave tile color unchanged if the letter doesn't appear in the word
//         -change tile to color1 if the letter is correct but in the wrong place
//         -change tile to color2 if letter is correct and in the right place 
// 5. end game
//     -if user guess matches secret word on any row, display 'you won!' message and end game
//     -if user doesn't match secret word after 6 guesses, display 'you lost' and end game. 
//     -after last tile is filled or after correct guess, display 'new game' button to reset the game