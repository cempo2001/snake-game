# Snake Game — Project Planning

## Game Choice

I will build a browser-based Snake game.

## Game Description

The player controls a snake on a grid using the arrow keys. The snake moves around the board and eats food to earn points. The game ends if the snake hits the wall or its own body. The player wins by reaching 10 points.

## Initial Game State

The game will use a 20 × 20 board. Each position on the board is represented by an `x` and `y` coordinate.

```js
const gameConfig = {
  boardSize: 20,
  targetScore: 10,
  startingSnake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  startingFood: { x: 14, y: 10 },
};

let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let winner = false;
```

## Pseudocode

1. Create the game board in the browser.
2. Initialize the snake, food, score, direction, and game status.
3. Wait for the player to press the Start button.
4. Move the snake in its current direction at regular intervals.
5. Listen for arrow-key presses and change the snake’s direction.
6. Check whether the snake has reached the food.
   - If it has, increase the score and place new food in an unoccupied cell.
   - If it has not, remove the last segment of the snake so its length stays the same.
7. Check whether the snake has hit a wall or its own body.
   - If it has, stop the game and display a loss message.
8. Check whether the score has reached 10 points.
   - If it has, stop the game and display a win message.
9. Update the board and score in the browser after each move.
10. Let the player restart the game.

## Required Game Features

- The game is displayed in the browser using DOM manipulation.
- The player controls the snake with the keyboard.
- The snake grows and the score increases when it eats food.
- The game ends if the snake hits the wall or itself.
- The player wins after reaching 10 points.
- The game displays instructions and messages for the player.

## Technologies

- HTML
- CSS
- JavaScript
- DOM manipulation
- CSS Flexbox

## Planned Project Files

- `index.html` — the structure of the game page.
- `css/style.css` — the page layout and visual styles.
- `js/app.js` — the game state, movement, controls, rendering, and game logic.
- `js/data.js` — the game configuration and starting data.
- `assets/` — images and other assets used by the game.
- `README.md` — the project description, instructions, screenshot, technologies, attributions, and next steps.