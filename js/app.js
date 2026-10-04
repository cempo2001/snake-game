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

initializeGame();

const createBoard = () => {
  const totalCells = gameConfig.boardSize * gameConfig.boardSize;

  for (let i = 0; i < totalCells; i++) {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.id = `cell-${i}`;
    gameBoardElement.appendChild(cellElement);
  }
};

createBoard();
/*----------------------------- Event Listeners -----------------------------*/