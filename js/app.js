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

/*---------------------------- Render Functions -----------------------------*/

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

const renderPlayerMove = (prevIndex, currentIndex) => {
  const tempPiece = cellEls[prevIndex].firstChild;
  cellEls[prevIndex].removeChild(cellEls[prevIndex].firstChild);
  cellEls[currentIndex].appendChild(tempPiece);
};

const renderRemoveEnemy = (index) => {
  cellEls[index].removeChild(cellEls[index].firstChild);
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
  initBoard();
  initPlayerObjs();
  game.turn = true;
  game.win = false;
  evalPossibleMoves();
  removeMoveIfJump();
  renderInitBoard();
  addPiecesEventListeners();
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
      checker.minusFourteen = true;
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
    checker.minusFourteen = true;
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

const switchTurn = () => {
  removeTurnEvtListeners();
  setPlayerMoveAndJumpToFalse();
  game.activeId = -1;
  game.turn = !game.turn;
  evalPossibleMoves();
  removeMoveIfJump();
  addPiecesEventListeners();
};

/*----------------------------- Event Listeners -----------------------------*/

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

  if (didPlayerJump) {
    setPlayerMoveAndJumpToFalse();
    evalPossibleMoves();
    removeMoveIfJump();
    removeTurnEvtListeners();
    for (i = 0; i < cellEls.length; i++) {
      if (game.board[i] === game.activeId) {
        cellEls[i].firstChild.addEventListener("click", handlePieceClick);
      }
    }
    let checkJumpAvailable = false;
    if (game.turn) {
      for (const checker of game.playerOneCheckerObjs) {
        if (checker.canJump()) {
          checkJumpAvailable = true;
        }
      }
    } else {
      for (const checker of game.playerTwoCheckerObjs) {
        if (checker.canJump()) {
          checkJumpAvailable = true;
        }
      }
    }
    if (!checkJumpAvailable) {
      switchTurn();
    }
  } else {
    switchTurn();
  }
};

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
    renderRemoveEnemy(enemyIndex);
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
      renderPlayerMove(prevIndex, boardIndex);
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

init();
