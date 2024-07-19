/*-------------------------------- Constants --------------------------------*/

class Checker {
  constructor(
    checkerId,
    boardIndex,
    isKing,
    plusSeven,
    plusNine,
    plusFourteen,
    plusEighteen,
    minusSeven,
    minusNine,
    minusForteen,
    minusEighteen,
    jumpThisTurn
  ) {
    this.checkerId = -1;
    this.boardIndex = -1;
    this.isKing = false;
    this.plusSeven = false;
    this.plusNine = false;
    this.plusFourteen = false;
    this.plusEighteen = false;
    this.minusSeven = false;
    this.minusNine = false;
    this.minusForteen = false;
    this.minusEighteen = false;
    this.jumpThisTurn = false;
  }
}

/*---------------------------- Variables (state) ----------------------------*/

const game = {
  board: [],
  playerOneCheckerObjs: [],
  playerTwoCheckerObjs: [],
  turn: true,
  win: false,
};

/*------------------------ Cached Element References ------------------------*/

const cellEls = document.querySelectorAll(".board div");
const blackPiecesEls = document.querySelectorAll(".blackPiece");
const whitePiecesEls = document.querySelectorAll(".whitePiece");

/*---------------------------- Render Functions -----------------------------*/

const render = () => {};

/*-------------------------------- Functions --------------------------------*/

const initBoard = () => {
  game.board.length = 0;
  for (i = 0; i < 12; i++) {
    if (i > 3 && i < 8) {
      game.board.push(i);
      game.board.push("");
    } else {
      game.board.push("");
      game.board.push(i);
    }
  }
  for (i = 0; i < 16; i++) {
    game.board.push("");
  }
  for (i = 12; i < 24; i++) {
    if (i > 15 && i < 20) {
      game.board.push("");
      game.board.push(i);
    } else {
      game.board.push(i);
      game.board.push("");
    }
  }
};

const initPlayerOneObjs = () => {
  game.playerOneCheckerObjs.length = 0;
  for (i = 0; i < 12; i++) {
    const blackChecker = new Checker();
    game.playerOneCheckerObjs.push(blackChecker);
  }
  let initialID = 12;
  for (const checker of game.playerOneCheckerObjs) {
    checker.checkerId = initialID;
    checker.boardIndex = game.board.findIndex(
      (element) => element === initialID
    );
    initialID++;
  }
};

const initPlayerTwoObjs = () => {
  game.playerTwoCheckerObjs.length = 0;
  for (i = 0; i < 12; i++) {
    const whiteChecker = new Checker();
    game.playerTwoCheckerObjs.push(whiteChecker);
  }
  let initialID = 0;
  for (const checker of game.playerTwoCheckerObjs) {
    checker.checkerId = initialID;
    checker.boardIndex = game.board.findIndex(
      (element) => element === initialID
    );
    initialID++;
  }
};

const init = () => {
  initBoard();
  initPlayerOneObjs();
  initPlayerTwoObjs();
  game.turn = true;
  game.win = false;
};

//Fwd is moving up the screen from perspective of playerOne
const evalPlayerOneFwdMoves = () => {
  for (const checker of game.playerOneCheckerObjs) {
    const leftJumpIndex = checker.boardIndex - 18;
    const leftMoveIndex = checker.boardIndex - 9;
    const rightJumpIndex = checker.boardIndex - 14;
    const rightMoveIndex = checker.boardIndex - 7;
    if (
      game.board[leftJumpIndex] === "" &&
      game.board[leftMoveIndex] < 12 &&
      game.board[leftMoveIndex] !== "" &&
      cellEls[leftJumpIndex].classList.contains("unusedCell") === false
    ) {
      checker.minusEighteen = true;
    }
    if (
      game.board[rightJumpIndex] === "" &&
      game.board[rightMoveIndex] < 12 &&
      game.board[rightMoveIndex] !== "" &&
      cellEls[rightJumpIndex].classList.contains("unusedCell") === false
    ) {
      checker.minusForteen = true;
    }
    if (
      game.board[leftMoveIndex] === "" &&
      cellEls[leftMoveIndex].classList.contains("unusedCell") === false
    ) {
      checker.minusNine = true;
    }
    if (
      game.board[rightMoveIndex] === "" &&
      cellEls[rightMoveIndex].classList.contains("unusedCell") === false
    ) {
      checker.minusSeven = true;
    }
  }
};

//Bwd is moving down the screen from perspective of playerOne
const evalPlayerOneBwdMoves = (checker) => {
  const bwdLeftJumpIndex = checker.boardIndex + 14;
  const bwdLeftMoveIndex = checker.boardIndex + 7;
  const bwdRightJumpIndex = checker.boardIndex + 18;
  const bwdRightMoveIndex = checker.boardIndex + 9;
  if (
    game.board[bwdLeftJumpIndex] === "" &&
    game.board[bwdLeftMoveIndex] < 12 &&
    game.board[bwdLeftMoveIndex] !== "" &&
    cellEls[bwdLeftJumpIndex].classList.contains("unusedCell") === false
  ) {
    checker.plusFourteen = true;
  }
  if (
    game.board[bwdRightJumpIndex] === "" &&
    game.board[bwdRightMoveIndex] < 12 &&
    game.board[bwdRightMoveIndex] !== "" &&
    cellEls[bwdRightJumpIndex].classList.contains("unusedCell") === false
  ) {
    checker.plusEighteen = true;
  }
  if (
    game.board[bwdLeftMoveIndex] === "" &&
    cellEls[bwdLeftMoveIndex].classList.contains("unusedCell") === false
  ) {
    checker.plusSeven = true;
  }
  if (
    game.board[bwdRightMoveIndex] === "" &&
    cellEls[bwdRightMoveIndex].classList.contains("unusedCell") === false
  ) {
    checker.plusNine = true;
  }
};

const evalPlayerTwoBwdMoves = () => {
  for (const checker of game.playerTwoCheckerObjs) {
    const bwdLeftJumpIndex = checker.boardIndex + 14;
    const bwdLeftMoveIndex = checker.boardIndex + 7;
    const bwdRightJumpIndex = checker.boardIndex + 18;
    const bwdRightMoveIndex = checker.boardIndex + 9;
    if (
      game.board[bwdLeftJumpIndex] === "" &&
      game.board[bwdLeftMoveIndex] > 11 &&
      game.board[bwdLeftMoveIndex] !== "" &&
      cellEls[bwdLeftJumpIndex].classList.contains("unusedCell") === false
    ) {
      checker.plusFourteen = true;
    }
    if (
      game.board[bwdRightJumpIndex] === "" &&
      game.board[bwdRightMoveIndex] > 11 &&
      game.board[bwdRightMoveIndex] !== "" &&
      cellEls[bwdRightJumpIndex].classList.contains("unusedCell") === false
    ) {
      checker.plusEighteen = true;
    }
    if (
      game.board[bwdLeftMoveIndex] === "" &&
      cellEls[bwdLeftMoveIndex].classList.contains("unusedCell") === false
    ) {
      checker.plusSeven = true;
    }
    if (
      game.board[bwdRightMoveIndex] === "" &&
      cellEls[bwdRightMoveIndex].classList.contains("unusedCell") === false
    ) {
      checker.plusNine = true;
    }
  }
};

const evalPlayerTwoFwdMoves = (checker) => {
  const leftJumpIndex = checker.boardIndex - 18;
  const leftMoveIndex = checker.boardIndex - 9;
  const rightJumpIndex = checker.boardIndex - 14;
  const rightMoveIndex = checker.boardIndex - 7;
  if (
    game.board[leftJumpIndex] === "" &&
    game.board[leftMoveIndex] > 11 &&
    game.board[leftMoveIndex] !== "" &&
    cellEls[leftJumpIndex].classList.contains("unusedCell") === false
  ) {
    checker.minusEighteen = true;
  }
  if (
    game.board[rightJumpIndex] === "" &&
    game.board[rightMoveIndex] > 11 &&
    game.board[rightMoveIndex] !== "" &&
    cellEls[rightJumpIndex].classList.contains("unusedCell") === false
  ) {
    checker.minusForteen = true;
  }
  if (
    game.board[leftMoveIndex] === "" &&
    cellEls[leftMoveIndex].classList.contains("unusedCell") === false
  ) {
    checker.minusNine = true;
  }
  if (
    game.board[rightMoveIndex] === "" &&
    cellEls[rightMoveIndex].classList.contains("unusedCell") === false
  ) {
    checker.minusSeven = true;
  }
};

const evalPossibleMoves = () => {
  if (game.turn) {
    evalPlayerOneFwdMoves();
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.isKing) {
        evalPlayerOneBwdMoves(checker);
      }
    }
  } else {
    evalPlayerTwoBwdMoves();
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.isKing) {
        evalPlayerTwoFwdMoves(checker);
      }
    }
  }
};

/*----------------------------- Event Listeners -----------------------------*/

init();
evalPossibleMoves();

//move id15 to cell 39

// for (const checker of game.playerOneCheckerObjs) {
//   if (checker.checkerId === 15) {
//     const tempPiece = cellEls[checker.boardIndex].firstChild;
//     cellEls[checker.boardIndex].removeChild(
//       cellEls[checker.boardIndex].firstChild
//     );
//     checker.boardIndex = 39;
//     cellEls[checker.boardIndex].appendChild(tempPiece);
//   }
// }
