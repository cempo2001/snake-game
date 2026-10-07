# Snake Game Project Planning

This document connects each gameplay pseudocode step to the part of the project that implements it. The examples use the project files `index.html`, `css/style.css`, `js/app.js`, and `js/data.js`.

## Project files

- `index.html` — game interface and DOM elements.
- `css/style.css` — page layout, board, cells, controls, themes, and visual effects.
- `js/data.js` — board dimensions, target score, and starting positions.
- `js/app.js` — game state, functions, event listeners, game rules, and DOM updates.
- `assets/` — background image and sound used by the game.

## Pseudocode and implementation plan

### 1. Create the game board in the browser

**Project parts:** `index.html`, `css/style.css`, `app.js` (`createBoard`), and `data.js` (`gameConfig.boardSize`).

The HTML provides an empty board container. JavaScript creates one `.cell` element for every board position and appends the cells to that container.

```html
<section id="game-board" aria-label="Snake game board"></section>
```

```js
const createBoard = () => {
  const totalCells = gameConfig.boardSize * gameConfig.boardSize;

  for (let i = 0; i < totalCells; i++) {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.id = `cell-${i}`;
    gameBoardElement.appendChild(cellElement);
  }
};
```

```css
#game-board {
  display: flex;
  flex-wrap: wrap;
  width: min(80vw, 400px);
  aspect-ratio: 1 / 1;
}

.cell {
  width: 5%;
  height: 5%;
}
```

### 2. Initialize the snake, food, score, direction, and game status

**Project parts:** `data.js` (`gameConfig`) and `app.js` (state variables and `initializeGame`).

`gameConfig` contains the starting settings. The state variables hold values that can change while the player plays.

```js
// js/data.js
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
```

```js
// js/app.js
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameOver = false;
let winner = false;
let gameTimer = null;
let gameStarted = false;
```

The `initializeGame()` function resets these values and updates the score and message shown on the page.

### 3. Wait for the player to press the Start button

**Project parts:** `index.html` (Start button), `app.js` (`startGame` and cached references).

```html
<button id="start-button">Start Game</button>
```

```js
const startButtonElement = document.querySelector('#start-button');

const startGame = () => {
  if (gameStarted === true || gameOver === true) {
    return;
  }

  gameStarted = true;
  messageElement.textContent = 'Use the arrow keys to move the snake.';
  gameTimer = setInterval(moveSnake, 200);
};

startButtonElement.addEventListener('click', startGame);
```

The Start button's click listener calls `startGame`. The interval calls `moveSnake` repeatedly so the snake moves at a regular pace. The name-entry screen is handled before the game screen is shown.

### 4. Move the snake in its current direction at regular intervals

**Project parts:** `app.js` (`moveSnake`, `direction`, `nextDirection`, and `gameTimer`).

The snake's head is the first item in the `snake` array. The function calculates a new head position by changing its x or y coordinate.

```js
const head = snake[0];
const newHead = { x: head.x, y: head.y };

direction = nextDirection;

if (direction === 'right') {
  newHead.x += 1;
} else if (direction === 'left') {
  newHead.x -= 1;
} else if (direction === 'up') {
  newHead.y -= 1;
} else if (direction === 'down') {
  newHead.y += 1;
}
```

`setInterval(moveSnake, 200)` runs the movement function every 200 milliseconds while the game is active.

### 5. Listen for arrow-key presses and change the snake's direction

**Project parts:** `app.js` (`handleDirection`) and a `keydown` event listener.

```js
const handleDirection = (event) => {
  if (gameStarted === false || gameOver === true) {
    return;
  }

  if (event.key === 'ArrowUp' && nextDirection !== 'down') {
    nextDirection = 'up';
  } else if (event.key === 'ArrowDown' && nextDirection !== 'up') {
    nextDirection = 'down';
  } else if (event.key === 'ArrowLeft' && nextDirection !== 'right') {
    nextDirection = 'left';
  } else if (event.key === 'ArrowRight' && nextDirection !== 'left') {
    nextDirection = 'right';
  }
};

window.addEventListener('keydown', handleDirection);
```

The checks prevent the snake from reversing directly into itself. The full project handler also prevents the browser from scrolling when an arrow key is pressed during play.

### 6. Check whether the snake has reached the food

**Project parts:** `app.js` (`moveSnake`, `updateScore`, and `getRandomFood`).

The next head position is compared with the food position. If both coordinates match, the snake has eaten the food.

```js
const ateFood = newHead.x === food.x && newHead.y === food.y;

snake.unshift(newHead);

if (ateFood === true) {
  updateScore();
  food = getRandomFood();
} else {
  snake.pop();
}
```

When food is eaten, the new head is added but the tail is kept, so the snake grows. Otherwise, `pop()` removes the last segment and keeps the snake at the same length. `getRandomFood()` chooses a new position that is not occupied by the snake.

### 7. Check whether the snake has hit a wall or its own body

**Project parts:** `app.js` (`moveSnake`, collision checks, `gameOver`, and `gameTimer`).

The wall check makes sure the new head remains within the board coordinates. The body check uses `some()` to look for a matching segment.

```js
if (
  newHead.x < 0 ||
  newHead.x >= gameConfig.boardSize ||
  newHead.y < 0 ||
  newHead.y >= gameConfig.boardSize
) {
  gameOver = true;
  clearInterval(gameTimer);
  messageElement.textContent = 'Game over! The snake hit the wall.';
  return;
}
```

```js
const snakeBodyToCheck = ateFood === true
  ? snake
  : snake.slice(0, snake.length - 1);

const hitSnake = snakeBodyToCheck.some((segment) => {
  return segment.x === newHead.x && segment.y === newHead.y;
});
```

When the snake is not eating, its tail will move away, so that last segment is left out of the collision check. When it is eating, the tail stays in place, so every segment must be checked. If the snake hits itself, the game stops and a loss message is displayed.

### 8. Check whether the score has reached 10 points

**Project parts:** `data.js` (`targetScore`) and `app.js` (`updateScore`, `winner`, `gameOver`, and `gameTimer`).

```js
const updateScore = () => {
  score = score + 1;
  scoreElement.textContent = score;

  if (score >= gameConfig.targetScore) {
    winner = true;
    gameOver = true;
    clearInterval(gameTimer);
    messageElement.textContent =
      `You win! You reached ${gameConfig.targetScore} points!`;
  }
};
```

The target is stored in `gameConfig`, so the winning score can be changed in `data.js` without rewriting the game logic.

### 9. Update the board and score in the browser after each move

**Project parts:** `app.js` (`updateBoard`, `scoreElement`, `rendered cellElements`) and `css/style.css` (cell classes).

```js
const updateBoard = () => {
  cellElements.forEach((cellElement) => {
    cellElement.classList.remove('snake', 'snake-head', 'food');
  });

  snake.forEach((segment, index) => {
    const cellIndex = segment.y * gameConfig.boardSize + segment.x;
    const cellElement = cellElements[cellIndex];
    cellElement.classList.add(index === 0 ? 'snake-head' : 'snake');
  });

  const foodIndex = food.y * gameConfig.boardSize + food.x;
  cellElements[foodIndex].classList.add('food');
};
```

```css
.cell.snake { background-color: #2e8b57; }
.cell.snake-head { background-color: #14532d; }
.cell.food { background-color: #b42318; }
```

`updateBoard()` clears old classes and applies the correct class to each cell based on the current state. `scoreElement.textContent` displays the latest score. `moveSnake()` calls `updateBoard()` after a successful move.

### 10. Allow the player to restart the game

**Project parts:** `index.html` (Restart button), `app.js` (`initializeGame`) and a click listener.

```html
<button id="restart-button">Restart</button>
```

```js
const restartButtonElement = document.querySelector('#restart-button');
restartButtonElement.addEventListener('click', initializeGame);
```

`initializeGame()` clears the timer, resets the snake, food, direction, score, and game status, then updates the page to show the ready-to-play state. In this project, Restart returns the player to the name-entry screen.

### 11. Save and display the player's best score in the browser

**Project parts:** `app.js` (`localStorage`, best-score display), and `index.html` (best-score element).

```html
<p>Best score: <span id="best-score">0</span></p>
```

```js
const savedBestScore = Number(localStorage.getItem('snakeBestScore')) || 0;
bestScoreElement.textContent = savedBestScore;

if (score > savedBestScore) {
  localStorage.setItem('snakeBestScore', score);
  bestScoreElement.textContent = score;
}
```

`localStorage` keeps the best score in the player's browser after a refresh. The current score resets when a new game starts; the saved best score remains.

## Styling and layout notes

**Project parts:** `css/style.css`.

Flexbox is used to center and stack the game interface. CSS classes style the snake, head, and food. The dark-mode class changes the page colors, while a win-state class can trigger the win animation.

```css
body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

body.dark-mode {
  color: #f3f4f6;
  background-color: #172923;
}
```

## Test checklist

- Enter a player name and start the game.
- Check movement in all four directions.
- Confirm food increases the score and grows the snake.
- Confirm food never appears on the snake.
- Test wall and self-collisions.
- Reach 10 points and confirm the win message.
- Restart, switch themes, and verify the saved best score remains after refreshing.
