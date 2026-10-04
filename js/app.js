/*-------------------------------- Constants --------------------------------*/

const winningScore = gameConfig.targetScore;

/*---------------------------- Variables (state) ----------------------------*/

let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let winner = false;

/*------------------------ Cached Element References ------------------------*/

const gameBoardElement = document.querySelector('#game-board');
const scoreElement = document.querySelector('#score');
const messageElement = document.querySelector('#message');
const startButtonElement = document.querySelector('#start-button');
const restartButtonElement = document.querySelector('#restart-button');

/*-------------------------------- Functions --------------------------------*/
const initializeGame = () => {
  snake = gameConfig.startingSnake.map((segment) => {
    return { x: segment.x, y: segment.y };
  });

  food = {
    x: gameConfig.startingFood.x,
    y: gameConfig.startingFood.y,
  };

  direction = 'right';
  score = 0;
  gameOver = false;
  winner = false;

  scoreElement.textContent = score;
  messageElement.textContent = 'Press Start to play.';
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
updateBoard();
/*----------------------------- Event Listeners -----------------------------*/