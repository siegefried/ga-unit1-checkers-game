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
    minusFourteen,
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
    this.minusFourteen = false;
    this.minusEighteen = false;
    this.jumpThisTurn = false;
  }
  canJump() {
    if (
      this.plusEighteen ||
      this.plusFourteen ||
      this.minusEighteen ||
      this.minusFourteen
    ) {
      return true;
    } else {
      return false;
    }
  }
  canMove() {
    if (this.plusNine || this.plusSeven || this.minusNine || this.minusSeven) {
      return true;
    } else {
      return false;
    }
  }
}

const KING = 99;

/*---------------------------- Variables (state) ----------------------------*/

const game = {
  board: [],
  playerOneCheckerObjs: [],
  playerTwoCheckerObjs: [],
  turn: true,
  win: false,
  activeId: -1,
};

/*------------------------ Cached Element References ------------------------*/

let cellEls = document.querySelectorAll(".board div");
let blackPiecesEls = document.querySelectorAll(".blackPiece");
let whitePiecesEls = document.querySelectorAll(".whitePiece");
const blackTurnEl = document.querySelector("#blackTurn");
const whiteTurnEl = document.querySelector("#whiteTurn");
const resetGameEl = document.querySelector("#resetGame");
const startBtnEL = document.querySelector("#start");
const hideLandingPageEl = document.querySelector(".landingHidden");
const mainGameEl = document.querySelector(".mainHidden");
const winMsgEl = document.querySelector("#winMsg");
const winMsgTextEl = document.querySelector("#winMsgText");
const rulesMsgEl = document.querySelector("#rulesMsg");
const landingRulesBtnEl = document.querySelector("#landingRules");
const navRulesBtnEl = document.querySelector("#navRules");

/*---------------------------- Render Functions -----------------------------*/

const renderTurnDisplay = () => {
  if (game.turn) {
    whiteTurnEl.classList.add("fadeOut");
    blackTurnEl.classList.remove("fadeOut");
  } else {
    whiteTurnEl.classList.remove("fadeOut");
    blackTurnEl.classList.add("fadeOut");
  }
};

const renderMovePosition = (index) => {
  cellEls[index].classList.add("moveBorder");
};

const renderJumpPosition = (index) => {
  cellEls[index].classList.add("jumpBorder");
};

const renderCanJump = (index) => {
  cellEls[index].classList.add("canJump");
};

const renderRemoveCellClasses = () => {
  for (const cell of cellEls) {
    cell.classList.remove("moveBorder");
    cell.classList.remove("jumpBorder");
    cell.classList.remove("canJump");
  }
};

const renderMovePlayer = (prevIndex, currentIndex) => {
  const tempPiece = cellEls[prevIndex].firstChild;
  cellEls[prevIndex].removeChild(cellEls[prevIndex].firstChild);
  cellEls[currentIndex].appendChild(tempPiece);
};

const renderCaptureEnemy = (index) => {
  cellEls[index].removeChild(cellEls[index].firstChild);
};

const renderKingCrown = (index) => {
  cellEls[index].firstChild.classList.add("isKing");
  if (game.turn) {
    cellEls[index].firstChild.innerHTML = "&#9818;";
  } else {
    cellEls[index].firstChild.innerHTML = "&#9812;";
  }
};

const renderInitBoard = () => {
  for (cell of cellEls) {
    cell.replaceChildren();
  }
  for (i = 0; i < game.board.length; i++) {
    if (game.board[i] !== "") {
      if (game.board[i] < 12) {
        cellEls[i].appendChild(document.createElement("p"));
        cellEls[i].firstChild.id = game.board[i];
        cellEls[i].firstChild.classList.add("whitePiece");
      }
      if (game.board[i] > 11) {
        cellEls[i].appendChild(document.createElement("p"));
        cellEls[i].firstChild.id = game.board[i];
        cellEls[i].firstChild.classList.add("blackPiece");
      }
    }
  }
  cellEls = document.querySelectorAll(".board div");
  blackPiecesEls = document.querySelectorAll(".blackPiece");
  whitePiecesEls = document.querySelectorAll(".whitePiece");
};

const renderGame = () => {
  hideLandingPageEl.classList.add("hidden");
  hideLandingPageEl.id = "notInUse";
  mainGameEl.classList.remove("hidden");
  mainGameEl.id = "main";
};

const renderWinMsg = (player) => {
  let winMsg = "";
  if (player) {
    winMsg = "Black Wins! 🎉";
  } else {
    winMsg = "White Wins! 🎉";
  }
  winMsgTextEl.innerHTML = winMsg;
  winMsgEl.show();
};

const renderRulesMsg = () => {
  rulesMsgEl.show();
};

const hideWinMsg = () => {
  winMsgEl.close();
};

const hideRulesMsg = () => {
  rulesMsgEl.close();
};

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

const initPlayerObjs = () => {
  game.playerOneCheckerObjs.length = 0;
  game.playerTwoCheckerObjs.length = 0;
  for (i = 0; i < 24; i++) {
    if (i < 12) {
      game.playerTwoCheckerObjs.push(new Checker());
      game.playerTwoCheckerObjs[i].checkerId = i;
      game.playerTwoCheckerObjs[i].boardIndex = game.board.findIndex(
        (cell) => cell === i
      );
    }
    if (i > 11) {
      game.playerOneCheckerObjs.push(new Checker());
      game.playerOneCheckerObjs[i - 12].checkerId = i;
      game.playerOneCheckerObjs[i - 12].boardIndex = game.board.findIndex(
        (cell) => cell === i
      );
    }
  }
};

const init = () => {
  renderGame();
  renderRemoveCellClasses();
  removeTurnEvtListeners();
  initBoard();
  initPlayerObjs();
  game.turn = true;
  game.win = false;
  GainNode.activeId = -1;
  evalPlayerPossibleMoves();
  removeMoveIfJump();
  renderTurnDisplay();
  renderInitBoard();
  addPiecesEventListeners();
};

//Fwd is moving up the screen from perspective of playerOne
const evalPlayerFwdMoves = (checker) => {
  const leftJumpIndex = checker.boardIndex - 18;
  const leftMoveIndex = checker.boardIndex - 9;
  const rightJumpIndex = checker.boardIndex - 14;
  const rightMoveIndex = checker.boardIndex - 7;

  if (
    game.board[leftJumpIndex] === "" &&
    cellEls[leftJumpIndex].classList.contains("unusedCell") === false
  ) {
    if (game.turn) {
      if (game.board[leftMoveIndex] < 12 && game.board[leftMoveIndex] !== "") {
        checker.minusEighteen = true;
      }
    } else {
      if (game.board[leftMoveIndex] > 11 && game.board[leftMoveIndex] !== "") {
        checker.minusEighteen = true;
      }
    }
  }

  if (
    game.board[rightJumpIndex] === "" &&
    cellEls[rightJumpIndex].classList.contains("unusedCell") === false
  ) {
    if (game.turn) {
      if (
        game.board[rightMoveIndex] < 12 &&
        game.board[rightMoveIndex] !== ""
      ) {
        checker.minusFourteen = true;
      }
    } else {
      if (
        game.board[rightMoveIndex] > 11 &&
        game.board[rightMoveIndex] !== ""
      ) {
        checker.minusFourteen = true;
      }
    }
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

//Bwd is moving down the screen from perspective of playerOne
const evalPlayerBwdMoves = (checker) => {
  const bwdLeftJumpIndex = checker.boardIndex + 14;
  const bwdLeftMoveIndex = checker.boardIndex + 7;
  const bwdRightJumpIndex = checker.boardIndex + 18;
  const bwdRightMoveIndex = checker.boardIndex + 9;

  if (
    game.board[bwdLeftJumpIndex] === "" &&
    cellEls[bwdLeftJumpIndex].classList.contains("unusedCell") === false
  ) {
    if (game.turn) {
      if (
        game.board[bwdLeftMoveIndex] < 12 &&
        game.board[bwdLeftMoveIndex] !== ""
      ) {
        checker.plusFourteen = true;
      }
    } else {
      if (
        game.board[bwdLeftMoveIndex] > 11 &&
        game.board[bwdLeftMoveIndex] !== ""
      ) {
        checker.plusFourteen = true;
      }
    }
  }

  if (
    game.board[bwdRightJumpIndex] === "" &&
    cellEls[bwdRightJumpIndex].classList.contains("unusedCell") === false
  ) {
    if (game.turn) {
      if (
        game.board[bwdRightMoveIndex] < 12 &&
        game.board[bwdRightMoveIndex] !== ""
      ) {
        checker.plusEighteen = true;
      }
    } else {
      if (
        game.board[bwdRightMoveIndex] > 11 &&
        game.board[bwdRightMoveIndex] !== ""
      ) {
        checker.plusEighteen = true;
      }
    }
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

const evalPossibleMoves = (checker) => {
  if (game.turn) {
    evalPlayerFwdMoves(checker);
    if (checker.isKing) {
      evalPlayerBwdMoves(checker);
    }
  } else {
    evalPlayerBwdMoves(checker);
    if (checker.isKing) {
      evalPlayerFwdMoves(checker);
    }
  }
};

const evalPlayerPossibleMoves = () => {
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      evalPossibleMoves(checker);
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      evalPossibleMoves(checker);
    }
  }
};

const setJumpToFalse = (checker) => {
  checker.plusEighteen = false;
  checker.plusFourteen = false;
  checker.minusEighteen = false;
  checker.minusFourteen = false;
};

const setMoveToFalse = (checker) => {
  checker.plusNine = false;
  checker.plusSeven = false;
  checker.minusNine = false;
  checker.minusSeven = false;
};

const removeMoveIfJump = () => {
  let isJumpAvailable = false;
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.canJump()) {
        isJumpAvailable = true;
      }
    }
    if (isJumpAvailable) {
      for (const checker of game.playerOneCheckerObjs) {
        setMoveToFalse(checker);
        if (checker.canJump()) {
          console.log("can jump");
          renderCanJump([checker.boardIndex]);
        }
      }
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.canJump()) {
        isJumpAvailable = true;
      }
    }
    if (isJumpAvailable) {
      for (const checker of game.playerTwoCheckerObjs) {
        setMoveToFalse(checker);
        if (checker.canJump()) {
          console.log("can jump");
          renderCanJump([checker.boardIndex]);
        }
      }
    }
  }
};

const setPlayerMoveAndJumpToFalse = () => {
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      setMoveToFalse(checker);
      setJumpToFalse(checker);
      checker.jumpThisTurn = false;
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      setMoveToFalse(checker);
      setJumpToFalse(checker);
      checker.jumpThisTurn = false;
    }
  }
};

const evalIsKing = () => {
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.boardIndex < 8 && !checker.isKing) {
        checker.isKing = true;
        game.activeId = KING;
        renderKingCrown(checker.boardIndex);
      }
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.boardIndex > 55 && !checker.isKing) {
        checker.isKing = true;
        game.activeId = KING;
        renderKingCrown(checker.boardIndex);
      }
    }
  }
};

const locateActiveChecker = () => {
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.checkerId === game.activeId) {
        return checker;
      }
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.checkerId === game.activeId) {
        return checker;
      }
    }
  }
};

const evalPostAction = () => {
  let didPlayerJump = false;
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.jumpThisTurn) {
        didPlayerJump = true;
      }
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.jumpThisTurn) {
        didPlayerJump = true;
      }
    }
  }
  evalIsKing();
  if (game.activeId === KING) {
    didPlayerJump = false;
  }

  if (didPlayerJump) {
    setPlayerMoveAndJumpToFalse();
    const activeChecker = locateActiveChecker();
    evalPossibleMoves(activeChecker);
    removeMoveIfJump();
    removeTurnEvtListeners();
    if (activeChecker.canJump()) {
      cellEls[activeChecker.boardIndex].firstChild.addEventListener(
        "click",
        handlePieceClick
      );
    } else {
      evalPostAction();
    }
  } else {
    switchTurn();
  }
};

const isOpponentZero = () => {
  if (game.turn) {
    if (game.playerTwoCheckerObjs.length === 0) {
      game.win = true;
      renderWinMsg(game.win);
    }
  } else {
    if (game.playerOneCheckerObjs.length === 0) {
      game.win = true;
      renderWinMsg(!game.win);
    }
  }
};

const isActionAvailable = () => {
  let checkerAction = 0;
  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.canJump() || checker.canMove()) {
        checkerAction++;
      }
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.canJump() || checker.canMove()) {
        checkerAction++;
      }
    }
  }
  if (checkerAction === 0) {
    game.win = true;
    if (game.turn) {
      renderWinMsg(!game.win);
    } else {
      renderWinMsg(game.win);
    }
  }
};

const switchTurn = () => {
  removeTurnEvtListeners();
  isOpponentZero();
  if (game.win) {
    return;
  }
  setPlayerMoveAndJumpToFalse();
  game.activeId = -1;
  game.turn = !game.turn;
  renderTurnDisplay();
  evalPlayerPossibleMoves();
  isActionAvailable();
  if (game.win) {
    return;
  }
  removeMoveIfJump();
  addPiecesEventListeners();
};

/*----------------------------- Event Listeners -----------------------------*/

const handleCellClick = (event) => {
  event.target.classList.add("actionCell");
  let boardIndex = -1;
  for (let i = 0; i < cellEls.length; i++) {
    if (cellEls[i].classList.contains("actionCell")) {
      boardIndex = i;
    }
  }
  event.target.classList.remove("actionCell");
  renderRemoveCellClasses();

  const captureEnemy = (checker, jumpIndex) => {
    checker.jumpThisTurn = true;
    let enemyIndex = -1;
    switch (jumpIndex - checker.boardIndex) {
      case 18:
        enemyIndex = checker.boardIndex + 9;
        break;
      case 14:
        enemyIndex = checker.boardIndex + 7;
        break;
      case -18:
        enemyIndex = checker.boardIndex - 9;
        break;
      case -14:
        enemyIndex = checker.boardIndex - 7;
        break;
    }

    let enemyObjIndex = -1;
    if (game.turn) {
      enemyObjIndex = game.playerTwoCheckerObjs.findIndex(
        (checker) => checker.boardIndex === enemyIndex
      );
      game.playerTwoCheckerObjs.splice(enemyObjIndex, 1);
    } else {
      enemyObjIndex = game.playerOneCheckerObjs.findIndex(
        (checker) => checker.boardIndex === enemyIndex
      );
      game.playerOneCheckerObjs.splice(enemyObjIndex, 1);
    }
    game.board[enemyIndex] = "";
    renderCaptureEnemy(enemyIndex);
  };

  const movePlayerPiece = (checker) => {
    if (checker.checkerId === game.activeId) {
      const prevIndex = checker.boardIndex;
      if (Math.abs(boardIndex - prevIndex) > 9) {
        captureEnemy(checker, boardIndex);
      }
      game.board[checker.boardIndex] = "";
      checker.boardIndex = boardIndex;
      game.board[boardIndex] = checker.checkerId;
      renderMovePlayer(prevIndex, boardIndex);
      evalPostAction();
    }
  };

  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      movePlayerPiece(checker);
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      movePlayerPiece(checker);
    }
  }
};

const handlePieceClick = (event) => {
  renderRemoveCellClasses();
  for (const cell of cellEls) {
    cell.removeEventListener("click", handleCellClick);
  }
  game.activeId = Number(event.target.id);

  const displayJump = (checker) => {
    console.log("can jump");
    if (checker.plusEighteen) {
      renderJumpPosition(checker.boardIndex + 18);
      cellEls[checker.boardIndex + 18].addEventListener(
        "click",
        handleCellClick
      );
    }
    if (checker.plusFourteen) {
      renderJumpPosition(checker.boardIndex + 14);
      cellEls[checker.boardIndex + 14].addEventListener(
        "click",
        handleCellClick
      );
    }
    if (checker.minusEighteen) {
      renderJumpPosition(checker.boardIndex - 18);
      cellEls[checker.boardIndex - 18].addEventListener(
        "click",
        handleCellClick
      );
    }
    if (checker.minusFourteen) {
      renderJumpPosition(checker.boardIndex - 14);
      cellEls[checker.boardIndex - 14].addEventListener(
        "click",
        handleCellClick
      );
    }
  };

  const displayMove = (checker) => {
    console.log("can move");
    if (checker.plusNine) {
      renderMovePosition(checker.boardIndex + 9);
      cellEls[checker.boardIndex + 9].addEventListener(
        "click",
        handleCellClick
      );
    }
    if (checker.plusSeven) {
      renderMovePosition(checker.boardIndex + 7);
      cellEls[checker.boardIndex + 7].addEventListener(
        "click",
        handleCellClick
      );
    }
    if (checker.minusNine) {
      renderMovePosition(checker.boardIndex - 9);

      cellEls[checker.boardIndex - 9].addEventListener(
        "click",
        handleCellClick
      );
    }
    if (checker.minusSeven) {
      renderMovePosition(checker.boardIndex - 7);

      cellEls[checker.boardIndex - 7].addEventListener(
        "click",
        handleCellClick
      );
    }
  };

  if (game.turn) {
    for (const checker of game.playerOneCheckerObjs) {
      if (checker.checkerId === Number(event.target.id)) {
        if (!checker.canJump() && !checker.canMove()) {
          console.log("no action");
          return;
        }
        if (checker.canJump()) {
          displayJump(checker);
        }
        if (checker.canMove()) {
          displayMove(checker);
        }
      }
    }
  } else {
    for (const checker of game.playerTwoCheckerObjs) {
      if (checker.checkerId === Number(event.target.id)) {
        if (!checker.canJump() && !checker.canMove()) {
          console.log("no action");
          return;
        }
        if (checker.canJump()) {
          displayJump(checker);
        }
        if (checker.canMove()) {
          displayMove(checker);
        }
      }
    }
  }
};

const removeTurnEvtListeners = () => {
  for (const cell of cellEls) {
    cell.removeEventListener("click", handleCellClick);
  }
  if (game.turn) {
    for (const checker of blackPiecesEls) {
      checker.removeEventListener("click", handlePieceClick);
    }
  } else {
    for (const checker of whitePiecesEls) {
      checker.removeEventListener("click", handlePieceClick);
    }
  }
};

const addPiecesEventListeners = () => {
  if (game.turn) {
    for (const checker of blackPiecesEls) {
      checker.addEventListener("click", handlePieceClick);
    }
  } else {
    for (const checker of whitePiecesEls) {
      checker.addEventListener("click", handlePieceClick);
    }
  }
};

const addNavEvtListeners = () => {
  startBtnEL.addEventListener("click", init);
  resetGameEl.addEventListener("click", init);
  landingRulesBtnEl.addEventListener("click", renderRulesMsg);
  navRulesBtnEl.addEventListener("click", renderRulesMsg);
};

addNavEvtListeners();
