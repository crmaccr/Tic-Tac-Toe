const game = (function () {
  const emptyBoard = ["", "", "", "", "", "", "", "", ""];
  const getBoard = () => {
    return board;
  };
  let board = [...emptyBoard];

  const restart = () => {
    board = [...emptyBoard];
    console.log(status);
    changeStatus("playing");
    changeStatus("end");
    displayController.display();
  };
  const status = {
    playing: false,
    end: false,
  };
  const mark = (position, symbol) => {
    if (!status.playing || status.end) return;
    if (!board[position]) board[position] = symbol; // only when empty
    const { end, winner } = over();
    if (end) {
      changeStatus("end");
      console.log(winner);
      message.innerText = `Game over. ${
        winner ? `${winner.getName()} won` : "Game Drawn"
      }`;
      control.innerText = "restart";
    }

    displayController.display();
  };

  const changeStatus = (prop) => {
    status[prop] = !status[prop];
  };

  const over = () => {
    // Checking 3 rows;
    const allFilled = board.every((pos) => pos !== "");
    if (allFilled) return { end: true, winner: null };
    if (
      (board[0] && board[0] === board[1] && board[1] === board[2]) ||
      (board[3] && board[3] === board[4] && board[4] === board[5]) ||
      (board[6] && board[6] === board[7] && board[7] === board[8])
    ) {
      console.log("row check");
      return { end: true, winner: playerThatMarkedRecently() };
    }

    // Checking 3 column
    if (
      (board[0] && board[0] === board[3] && board[3] === board[6]) ||
      (board[1] && board[1] === board[4] && board[4] === board[7]) ||
      (board[2] && board[2] === board[5] && board[5] === board[8])
    ) {
      console.log("col check");
      return { end: true, winner: playerThatMarkedRecently() };
    }

    // Checking diagonals
    if (
      (board[0] && board[0] === board[4] && board[4] === board[8]) ||
      (board[2] && board[2] === board[4] && board[4] === board[6])
    ) {
      console.log("diagonal check");
      return { end: true, winner: playerThatMarkedRecently() };
    }
    return { end: false, winner: null };
  };
  // next turn
  const turn = () => {
    const numberOfXs = board.reduce((accumulator, pos) => {
      if (pos === "X") accumulator++;
      return accumulator;
    }, 0);
    const numberOfOs = board.reduce((accumulator, pos) => {
      if (pos === "O") accumulator++;
      return accumulator;
    }, 0);
    return numberOfXs > numberOfOs ? oPLayer : XPlayer;
  };

  // player that made last move
  const playerThatMarkedRecently = () =>
    turn() === oPLayer ? XPlayer : oPLayer;
  return { getBoard, mark, turn, over, changeStatus, restart };
})();

const displayBoard = document.querySelector(".board");
const displayController = (function (board) {
  console.log("this is the display controller");
  function display() {
    board.innerHTML = "";
    game.getBoard().forEach((position, index) => {
      const cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      cell.dataset.index = index.toString();
      cell.innerText = position || "";
      cell.addEventListener("click", function () {
        game.turn().mark(index);
      });
      board.appendChild(cell);
    });
  }

  return { display };
})(displayBoard);
displayController.display();

const player = (symbol, pName = "") => {
  let name = pName;
  function mark(position) {
    game.mark(position, symbol);
  }
  function setName(pName) {
    name = pName;
  }
  const getName = () => name;
  return { setName, getName, symbol, mark };
};

const XPlayer = player("X");
const oPLayer = player("O");

const control = document.getElementById("control");
control.addEventListener("click", () => {
  game.changeStatus("playing");
  if (control.innerText === "restart") {
    game.restart();
    message.innerText = "";
    control.innerText = "Start";
  }
});

const message = document.getElementById("message");

const form = document.querySelector("form");
form.addEventListener("submit", formHandler);
function formHandler(e) {
  e.preventDefault();
  XPlayer.setName(this.elements.playerX.value);
  oPLayer.setName(this.elements.playerO.value);
  control.removeAttribute("disabled");
}
