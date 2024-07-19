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
    game.board.push("");
    game.board.push(i);
  }
  for (i = 0; i < 16; i++) {
    game.board.push("");
  }
  for (i = 12; i < 24; i++) {
    game.board.push(i);
    game.board.push("");
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

/*----------------------------- Event Listeners -----------------------------*/

init();

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
