/*-------------------------------- Constants --------------------------------*/

const winningScore = gameConfig.targetScore;

/*---------------------------- Variables (state) ----------------------------*/

let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameOver = false;
let winner = false;
let gameTimer = null;
let gameStarted = false;

/*------------------------ Cached Element References ------------------------*/

const gameBoardElement = document.querySelector('#game-board');
const scoreElement = document.querySelector('#score');
const messageElement = document.querySelector('#message');
const startButtonElement = document.querySelector('#start-button');
const restartButtonElement = document.querySelector('#restart-button');
const themeButtonElement = document.querySelector('#theme-button');
const eatSoundElement = document.querySelector('#eat-sound');


/*-------------------------------- Functions --------------------------------*/
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
  messageElement.textContent = 'Press Start to play.';
  messageElement.classList.remove('winner-message');
    updateBoard();
};



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

  const foodIndex = food.y * gameConfig.boardSize + food.x;
  const foodCellElement = cellElements[foodIndex];

  foodCellElement.classList.add('food');
};

createBoard();

const cellElements = document.querySelectorAll('.cell');

initializeGame();


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

  const ateFood = newHead.x === food.x && newHead.y === food.y;
  const snakeBodyToCheck =
  ateFood === true ? snake : snake.slice(0, snake.length - 1);

const hitSnake = snakeBodyToCheck.some((segment) => {
  return segment.x === newHead.x && segment.y === newHead.y;
});

if (hitSnake === true) {
  gameOver = true;
  clearInterval(gameTimer);
  messageElement.textContent = 'Game over! The snake hit itself.';
  return;
}

  snake.unshift(newHead);

if (ateFood === true) {
  eatSoundElement.currentTime = 0;
  eatSoundElement.play();

  updateScore();
  food = getRandomFood();
}
 else {
  snake.pop();
}

  updateBoard();
};

const updateScore = () => {
  score = score + 1;
  scoreElement.textContent = score;

  if (score >= winningScore) {
    winner = true;
    gameOver = true;
    clearInterval(gameTimer);
    messageElement.textContent =
      `You win! You reached ${gameConfig.targetScore} points!`;
      messageElement.classList.add('winner-message');
  }
};

const startGame = () => {
  if (gameStarted === true || gameOver === true) {
    return;
  }

  gameStarted = true;
  messageElement.textContent = 'Use the arrow keys to move the snake.';

  gameTimer = setInterval(moveSnake, 200);
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

const getRandomFood = () => {
  let foodPosition = {};
  let foodIsOnSnake = true;

  while (foodIsOnSnake === true) {
    foodPosition = {
      x: Math.floor(Math.random() * gameConfig.boardSize),
      y: Math.floor(Math.random() * gameConfig.boardSize),
    };

    foodIsOnSnake = snake.some((segment) => {
      return segment.x === foodPosition.x && segment.y === foodPosition.y;
    });
  }

  return foodPosition;
};

const handleThemeChange = () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    themeButtonElement.textContent = 'Light Mode';
  } else {
    themeButtonElement.textContent = 'Dark Mode';
  }
};
/*----------------------------- Event Listeners -----------------------------*/

startButtonElement.addEventListener('click', startGame);
restartButtonElement.addEventListener('click', initializeGame);
themeButtonElement.addEventListener('click', handleThemeChange);
window.addEventListener('keydown', handleDirection);