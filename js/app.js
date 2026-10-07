/*-------------------------------- Constants --------------------------------*/

const winningScore = gameConfig.targetScore;
const bestScoreStorageKey = 'snakeBestScore';

/*---------------------------- Variables (state) ----------------------------*/

let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let bestScore = Number(localStorage.getItem(bestScoreStorageKey)) || 0;
let gameOver = false;
let winner = false;
let gameTimer = null;
let gameStarted = false;
let playerName = '';

/*------------------------ Cached Element References ------------------------*/

const gameBoardElement = document.querySelector('#game-board');
const scoreElement = document.querySelector('#score');
const bestScoreElement = document.querySelector('#best-score');
const messageElement = document.querySelector('#message');

const startScreenElement = document.querySelector('#start-screen');
const gameScreenElement = document.querySelector('#game-screen');
const playerNameInputElement = document.querySelector('#player-name');
const playerGreetingElement = document.querySelector('#player-greeting');
const startErrorElement = document.querySelector('#start-error');

const startButtonElement = document.querySelector('#start-button');
const restartButtonElement = document.querySelector('#restart-button');
const themeButtonElement = document.querySelector('#theme-button');
const eatSoundElement = document.querySelector('#eat-sound');

/*-------------------------------- Functions --------------------------------*/

const createBoard = () => {
  const totalCells = gameConfig.boardSize * gameConfig.boardSize;

  for (let i = 0; i < totalCells; i++) {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.id = `cell-${i}`;
    gameBoardElement.appendChild(cellElement);
  }
};

const updateBoard = () => {
  cellElements.forEach((cellElement) => {
    cellElement.classList.remove('snake', 'snake-head', 'food');
  });

  snake.forEach((segment, index) => {
    const cellIndex = segment.y * gameConfig.boardSize + segment.x;
    const cellElement = cellElements[cellIndex];

    if (index === 0) {
      cellElement.classList.add('snake-head');
    } else {
      cellElement.classList.add('snake');
    }
  });

  if (winner === false) {
    const foodIndex = food.y * gameConfig.boardSize + food.x;
    const foodCellElement = cellElements[foodIndex];

    if (foodCellElement) {
      foodCellElement.classList.add('food');
    }
  }
};

const initializeGame = () => {
  clearInterval(gameTimer);
  gameTimer = null;
  gameStarted = false;

  snake = gameConfig.startingSnake.map((segment) => {
    return { x: segment.x, y: segment.y };
  });

  food = {
    x: gameConfig.startingFood.x,
    y: gameConfig.startingFood.y,
  };

  direction = 'right';
  nextDirection = 'right';
  score = 0;
  gameOver = false;
  winner = false;

  scoreElement.textContent = score;
  messageElement.textContent = 'Use the arrow keys to move the snake.';
  messageElement.classList.remove('winner-message');

  updateBoard();
};

const endGame = (message) => {
  gameOver = true;
  gameStarted = false;

  clearInterval(gameTimer);
  gameTimer = null;

  messageElement.textContent = message;
};

const updateScore = () => {
  score += 1;
  scoreElement.textContent = score;

  if (score > bestScore) {
    bestScore = score;
    bestScoreElement.textContent = bestScore;
    localStorage.setItem(bestScoreStorageKey, bestScore);
  }

  if (score >= winningScore) {
    winner = true;
    endGame(`You win, ${playerName}! You reached ${winningScore} points.`);
    messageElement.classList.add('winner-message');
  }
};

const getRandomFood = () => {
  let foodPosition = {};
  let foodIsOnSnake = true;

  while (foodIsOnSnake === true) {
    foodPosition = {
      x: Math.floor(Math.random() * gameConfig.boardSize),
      y: Math.floor(Math.random() * gameConfig.boardSize),
    };

    foodIsOnSnake = snake.some((segment) => {
      return (
        segment.x === foodPosition.x &&
        segment.y === foodPosition.y
      );
    });
  }

  return foodPosition;
};

const playEatSound = () => {
  eatSoundElement.currentTime = 0;

  const soundPromise = eatSoundElement.play();

  if (soundPromise !== undefined) {
    soundPromise.catch(() => {});
  }
};

const moveSnake = () => {
  direction = nextDirection;

  const head = snake[0];
  const newHead = {
    x: head.x,
    y: head.y,
  };

  if (direction === 'right') {
    newHead.x += 1;
  } else if (direction === 'left') {
    newHead.x -= 1;
  } else if (direction === 'up') {
    newHead.y -= 1;
  } else if (direction === 'down') {
    newHead.y += 1;
  }

  const hitWall =
    newHead.x < 0 ||
    newHead.x >= gameConfig.boardSize ||
    newHead.y < 0 ||
    newHead.y >= gameConfig.boardSize;

  if (hitWall === true) {
    endGame(`Game over, ${playerName}! The snake hit the wall.`);
    return;
  }

  const ateFood = newHead.x === food.x && newHead.y === food.y;

  const snakeBodyToCheck =
    ateFood === true ? snake : snake.slice(0, snake.length - 1);

  const hitSnake = snakeBodyToCheck.some((segment) => {
    return segment.x === newHead.x && segment.y === newHead.y;
  });

  if (hitSnake === true) {
    endGame(`Game over, ${playerName}! The snake hit itself.`);
    return;
  }

  snake.unshift(newHead);

  if (ateFood === true) {
    playEatSound();
    updateScore();

    if (winner === false) {
      food = getRandomFood();
    }
  } else {
    snake.pop();
  }

  updateBoard();
};

const startGame = () => {
  const enteredName = playerNameInputElement.value.trim();

  if (enteredName === '') {
    startErrorElement.textContent = 'Please enter your name.';
    playerNameInputElement.focus();
    return;
  }

  if (gameStarted === true || gameOver === true) {
    return;
  }

  playerName = enteredName;
  startErrorElement.textContent = '';
  playerGreetingElement.textContent = `Good luck, ${playerName}!`;

  startScreenElement.hidden = true;
  gameScreenElement.hidden = false;

  gameStarted = true;
  messageElement.textContent = 'Use the arrow keys to move the snake.';
  gameTimer = setInterval(moveSnake, 200);
};

const restartGame = () => {
  initializeGame();

  playerName = '';
  playerNameInputElement.value = '';
  playerGreetingElement.textContent = '';
  startErrorElement.textContent = '';

  gameScreenElement.hidden = true;
  startScreenElement.hidden = false;

  playerNameInputElement.focus();
};

const handleDirection = (event) => {
  if (gameStarted === false || gameOver === true) {
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();

    if (nextDirection !== 'down') {
      nextDirection = 'up';
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();

    if (nextDirection !== 'up') {
      nextDirection = 'down';
    }
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();

    if (nextDirection !== 'right') {
      nextDirection = 'left';
    }
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();

    if (nextDirection !== 'left') {
      nextDirection = 'right';
    }
  }
};

const handleThemeChange = () => {
  document.body.classList.toggle('dark-mode');

  const darkModeEnabled =
    document.body.classList.contains('dark-mode');

  themeButtonElement.textContent = darkModeEnabled
    ? 'Light Mode'
    : 'Dark Mode';
};

/*----------------------------- Event Listeners -----------------------------*/

createBoard();

const cellElements = document.querySelectorAll('.cell');

bestScoreElement.textContent = bestScore;

initializeGame();

startButtonElement.addEventListener('click', startGame);
restartButtonElement.addEventListener('click', restartGame);
themeButtonElement.addEventListener('click', handleThemeChange);
window.addEventListener('keydown', handleDirection);