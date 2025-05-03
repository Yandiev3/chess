const BOARD_SIZE = 8;
const SQUARE_SIZE = 60;
const pieces = {
  'black-rook': 'blackShapes/blackRook.svg',
  'black-queen': 'blackShapes/blackQueen.svg',
  'black-pawn': 'blackShapes/blackPawn.svg',
  'black-king': 'blackShapes/blackKing.svg',
  'black-bishop': 'blackShapes/blackOfficer.svg',
  'black-knight': 'blackShapes/blackHorse.svg',

  'white-rook': 'whiteShapes/whiteRook.svg',
  'white-knight': 'whiteShapes/whiteHorse.svg',
  'white-bishop': 'whiteShapes/whiteOfficer.svg',
  'white-queen': 'whiteShapes/whiteQueen.svg',
  'white-king': 'whiteShapes/whiteKing.svg',
  'white-pawn': 'whiteShapes/whitePawn.svg'
};

const initialBoard = [
  ['black-rook', 'black-knight', 'black-bishop', 'black-queen', 'black-king', 'black-bishop', 'black-knight', 'black-rook'],
  Array(8).fill('black-pawn'),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill('white-pawn'),
  ['white-rook', 'white-knight', 'white-bishop', 'white-queen', 'white-king', 'white-bishop', 'white-knight', 'white-rook']
];

let gameState = {
  board: JSON.parse(JSON.stringify(initialBoard)),
  currentPlayer: 'white',
  selectedPiece: null,
  selectedPosition: null,
  whiteCaptured: [],
  blackCaptured: [],
  gameOver: false,
  draggingPiece: null
};

const boardElement = document.getElementById('board');
const whiteCapturedElement = document.getElementById('white-captured');
const blackCapturedElement = document.getElementById('black-captured');
const currentPlayerElement = document.getElementById('current-player');
const gameOverModal = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const newGameButton = document.getElementById('new-game');
const promotionModal = document.getElementById('promotion-modal');
const promotionPieces = document.getElementById('promotion-pieces');

function initGame() {
  renderBoard();
  renderCapturedPieces();
  updateCurrentPlayer();
  addEventListeners();
}

function renderBoard() {
  boardElement.innerHTML = '';
  boardElement.style.width = `${BOARD_SIZE * SQUARE_SIZE}px`;
  boardElement.style.height = `${BOARD_SIZE * SQUARE_SIZE}px`;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const square = document.createElement('div');
      square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'} chess-board__cell`;
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = gameState.board[row][col];
      if (piece) {
        const pieceElement = document.createElement('img');
        pieceElement.src = pieces[piece];
        pieceElement.alt = piece;
        pieceElement.className = 'chess-piece chess-board__piece';
        pieceElement.draggable = true;
        square.appendChild(pieceElement);
      }

      boardElement.appendChild(square);
    }
  }
}

function renderCapturedPieces() {
  whiteCapturedElement.innerHTML = '';
  blackCapturedElement.innerHTML = '';

  gameState.whiteCaptured.forEach(piece => {
    const pieceElement = document.createElement('img');
    pieceElement.src = pieces[piece];
    pieceElement.alt = piece;
    pieceElement.className = 'captured-piece';
    whiteCapturedElement.appendChild(pieceElement);
  });

  gameState.blackCaptured.forEach(piece => {
    const pieceElement = document.createElement('img');
    pieceElement.src = pieces[piece];
    pieceElement.alt = piece;
    pieceElement.className = 'captured-piece';
    blackCapturedElement.appendChild(pieceElement);
  });
}

function updateCurrentPlayer() {
  currentPlayerElement.textContent = gameState.currentPlayer;
  currentPlayerElement.className = `page__current-player ${gameState.currentPlayer}`;
}

function addEventListeners() {
  boardElement.addEventListener('click', handleSquareClick);
  boardElement.addEventListener('dragstart', handleDragStart);
  boardElement.addEventListener('dragover', handleDragOver);
  boardElement.addEventListener('drop', handleDrop);
  newGameButton.addEventListener('click', resetGame);
}

function highlightPossibleMoves(position) {
  clearPossibleMoves();
  const piece = gameState.board[position.row][position.col];
  if (!piece || !piece.startsWith(gameState.currentPlayer)) return;

  const pieceType = piece.split('-')[1];
  const possibleMoves = getPossibleMoves(pieceType, position);

  possibleMoves.forEach(move => {
    const square = document.querySelector(`.chess-square[data-row="${move.row}"][data-col="${move.col}"]`);
    if (square) {
      square.classList.add('possible-move');
    }
  });
}

function clearPossibleMoves() {
  document.querySelectorAll('.chess-square').forEach(square => {
    square.classList.remove('possible-move');
  });
}

function getPossibleMoves(pieceType, position) {
  const moves = [];
  switch (pieceType) {
    case 'pawn':
      return getPawnMoves(position);
    case 'knight':
      return getKnightMoves(position);
    case 'bishop':
      return getBishopMoves(position);
    case 'rook':
      return getRookMoves(position);
    case 'queen':
      return getQueenMoves(position);
    case 'king':
      return getKingMoves(position);
    default:
      return moves;
  }
}

function getPawnMoves(position) {
  const moves = [];
  const direction = gameState.currentPlayer === 'white' ? -1 : 1;
  const startRow = gameState.currentPlayer === 'white' ? 6 : 1;

  // Move forward one square
  const oneSquare = { row: position.row + direction, col: position.col };
  if (isValidMove(position, oneSquare)) {
    moves.push(oneSquare);
  }

  // Move forward two squares from starting position
  if (position.row === startRow) {
    const twoSquares = { row: position.row + 2 * direction, col: position.col };
    if (isValidMove(position, twoSquares)) {
      moves.push(twoSquares);
    }
  }

  // Capture diagonally
  const captureLeft = { row: position.row + direction, col: position.col - 1 };
  const captureRight = { row: position.row + direction, col: position.col + 1 };
  if (isValidMove(position, captureLeft)) {
    moves.push(captureLeft);
  }
  if (isValidMove(position, captureRight)) {
    moves.push(captureRight);
  }

  return moves;
}

function getKnightMoves(position) {
  const moves = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 }, { row: 2, col: -1 }, { row: 2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 }, { row: 1, col: -2 }, { row: 1, col: 2 }
  ];

  knightMoves.forEach(move => {
    const newPosition = { row: position.row + move.row, col: position.col + move.col };
    if (isValidMove(position, newPosition)) {
      moves.push(newPosition);
    }
  });

  return moves;
}

function getBishopMoves(position) {
  const moves = [];
  const directions = [
    { row: 1, col: 1 }, { row: 1, col: -1 }, { row: -1, col: 1 }, { row: -1, col: -1 }
  ];

  directions.forEach(dir => {
    for (let i = 1; i < BOARD_SIZE; i++) {
      const newPosition = { row: position.row + i * dir.row, col: position.col + i * dir.col };
      if (!isValidMove(position, newPosition)) break;
      moves.push(newPosition);
      if (gameState.board[newPosition.row][newPosition.col]) break; // Stop at capture
    }
  });

  return moves;
}

function getRookMoves(position) {
  const moves = [];
  const directions = [
    { row: 1, col: 0 }, { row: -1, col: 0 }, { row: 0, col: 1 }, { row: 0, col: -1 }
  ];

  directions.forEach(dir => {
    for (let i = 1; i < BOARD_SIZE; i++) {
      const newPosition = { row: position.row + i * dir.row, col: position.col + i * dir.col };
      if (!isValidMove(position, newPosition)) break;
      moves.push(newPosition);
      if (gameState.board[newPosition.row][newPosition.col]) break; // Stop at capture
    }
  });

  return moves;
}

function getQueenMoves(position) {
  return [...getRookMoves(position), ...getBishopMoves(position)];
}

function getKingMoves(position) {
  const moves = [];
  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];

  kingMoves.forEach(move => {
    const newPosition = { row: position.row + move.row, col: position.col + move.col };
    if (isValidMove(position, newPosition)) {
      moves.push(newPosition);
    }
  });

  return moves;
}

function handleSquareClick(e) {
  if (gameState.gameOver) return;

  const square = e.target.closest('.chess-square');
  if (!square) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const piece = gameState.board[row][col];

  if (gameState.selectedPiece) {
    if (isValidMove(gameState.selectedPosition, { row, col })) {
      movePiece(gameState.selectedPosition, { row, col });
    }
    resetSelection();
  } else if (piece && piece.startsWith(gameState.currentPlayer)) {
    gameState.selectedPiece = piece;
    gameState.selectedPosition = { row, col };
    square.classList.add('selected');
    highlightPossibleMoves({ row, col });
  }
}

function handleDragStart(e) {
  if (gameState.gameOver) return;

  const pieceElement = e.target.closest('.chess-piece');
  if (!pieceElement) return;

  const square = pieceElement.parentElement;
  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const piece = gameState.board[row][col];

  if (piece && piece.startsWith(gameState.currentPlayer)) {
    gameState.selectedPiece = piece;
    gameState.selectedPosition = { row, col };
    gameState.draggingPiece = pieceElement;
    e.dataTransfer.setData('text/plain', `${row},${col}`);
    pieceElement.style.opacity = '0.5';
    square.classList.add('selected');
    highlightPossibleMoves({ row, col });
  } else {
    e.preventDefault();
  }
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  
  const square = e.target.closest('.chess-square');
  if (!square) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);

  if (gameState.selectedPiece && isValidMove(gameState.selectedPosition, { row, col })) {
    movePiece(gameState.selectedPosition, { row, col });
  }

  if (gameState.draggingPiece) {
    gameState.draggingPiece.style.opacity = '1';
    gameState.draggingPiece = null;
  }

  resetSelection();
}

function isValidMove(from, to) {
  if (to.row < 0 || to.row >= BOARD_SIZE || to.col < 0 || to.col >= BOARD_SIZE) {
    return false;
  }

  const targetPiece = gameState.board[to.row][to.col];
  if (targetPiece && targetPiece.startsWith(gameState.currentPlayer)) {
    return false;
  }

  const pieceType = gameState.selectedPiece.split('-')[1];
  
  switch (pieceType) {
    case 'pawn':
      return checkPawnMove(from, to, targetPiece);
    case 'knight':
      return checkKnightMove(from, to);
    case 'bishop':
      return checkBishopMove(from, to);
    case 'rook':
      return checkRookMove(from, to);
    case 'queen':
      return checkQueenMove(from, to);
    case 'king':
      return checkKingMove(from, to);
    default:
      return false;
  }
}

function checkPawnMove(from, to, targetPiece) {
  const direction = gameState.currentPlayer === 'white' ? -1 : 1;
  const startRow = gameState.currentPlayer === 'white' ? 6 : 1;

  if (to.col === from.col && to.row === from.row + direction && !targetPiece) {
    return true;
  }

  if (from.row === startRow && to.col === from.col && 
      to.row === from.row + 2 * direction && !targetPiece &&
      !gameState.board[from.row + direction][from.col]) {
    return true;
  }

  if (Math.abs(to.col - from.col) === 1 && 
      to.row === from.row + direction && 
      targetPiece && !targetPiece.startsWith(gameState.currentPlayer)) {
    return true;
  }

  return false;
}

function checkKnightMove(from, to) {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function checkBishopMove(from, to) {
  if (Math.abs(to.row - from.row) !== Math.abs(to.col - from.col)) return false;
  
  const rowStep = to.row > from.row ? 1 : -1;
  const colStep = to.col > from.col ? 1 : -1;
  
  for (let i = 1; i < Math.abs(to.row - from.row); i++) {
    if (gameState.board[from.row + i * rowStep][from.col + i * colStep]) {
      return false;
    }
  }
  return true;
}

function checkRookMove(from, to) {
  if (to.row !== from.row && to.col !== from.col) return false;
  
  if (to.row === from.row) {
    const step = to.col > from.col ? 1 : -1;
    for (let i = from.col + step; i !== to.col; i += step) {
      if (gameState.board[from.row][i]) return false;
    }
  } else {
    const step = to.row > from.row ? 1 : -1;
    for (let i = from.row + step; i !== to.row; i += step) {
      if (gameState.board[i][from.col]) return false;
    }
  }
  return true;
}

function checkQueenMove(from, to) {
  return checkRookMove(from, to) || checkBishopMove(from, to);
}

function checkKingMove(from, to) {
  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);
  return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
}

function movePiece(from, to) {
  const piece = gameState.board[from.row][from.col];
  const targetPiece = gameState.board[to.row][to.col];

  if (targetPiece) {
    if (gameState.currentPlayer === 'white') {
      gameState.whiteCaptured.push(targetPiece);
    } else {
      gameState.blackCaptured.push(targetPiece);
    }
  }

  gameState.board[to.row][to.col] = piece;
  gameState.board[from.row][from.col] = null;

  if (piece.endsWith('-pawn') && (to.row === 0 || to.row === BOARD_SIZE - 1)) {
    showPromotionModal(to);
    return;
  }

  gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  updateCurrentPlayer();
  renderBoard();
  renderCapturedPieces();
  checkGameOver();
}

function showPromotionModal(position) {
  promotionPieces.innerHTML = '';
  const promotionOptions = ['queen', 'rook', 'knight', 'bishop'];

  promotionOptions.forEach(option => {
    const piece = document.createElement('img');
    piece.src = pieces[`${gameState.currentPlayer}-${option}`];
    piece.alt = `${gameState.currentPlayer}-${option}`;
    piece.className = 'promotion-piece';
    piece.addEventListener('click', () => promotePawn(position, option));
    promotionPieces.appendChild(piece);
  });

  promotionModal.style.display = 'flex';
}

function promotePawn(position, pieceType) {
  gameState.board[position.row][position.col] = `${gameState.currentPlayer}-${pieceType}`;
  promotionModal.style.display = 'none';
  gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  updateCurrentPlayer();
  renderBoard();
  renderCapturedPieces();
  checkGameOver();
}

function checkGameOver() {
  const kings = { white: false, black: false };
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = gameState.board[row][col];
      if (piece === 'white-king') kings.white = true;
      if (piece === 'black-king') kings.black = true;
    }
  }

  if (!kings.white) {
    endGame('black');
  } else if (!kings.black) {
    endGame('white');
  }
}

function endGame(winner) {
  gameState.gameOver = true;
  modalTitle.textContent = `Игра окончена! Победили ${winner === 'white' ? 'белые' : 'черные'}!`;
  gameOverModal.style.display = 'flex';
}

function resetSelection() {
  if (gameState.selectedPosition) {
    const squares = document.querySelectorAll('.chess-square');
    squares.forEach(square => square.classList.remove('selected'));
  }
  gameState.selectedPiece = null;
  gameState.selectedPosition = null;
  clearPossibleMoves();
}

function resetGame() {
  gameState = {
    board: JSON.parse(JSON.stringify(initialBoard)),
    currentPlayer: 'white',
    selectedPiece: null,
    selectedPosition: null,
    whiteCaptured: [],
    blackCaptured: [],
    gameOver: false,
    draggingPiece: null
  };

  gameOverModal.style.display = 'none';
  renderBoard();
  renderCapturedPieces();
  updateCurrentPlayer();
  clearPossibleMoves();
}

document.addEventListener('DOMContentLoaded', initGame);