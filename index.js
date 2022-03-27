const game = (function () {
  const emptyBoard = ["", "", "", "", "", "", "", "", ""];
  let board = [...emptyBoard];

  const restart = () => {
    board = [...emptyBoard]; // THIS LINE HAS
    console.log(board);
    displayController.display();
  };
  const status = {
    playing: false,
    end: false,
  };
  const mark = (position, symbol) => {
    if (!status.playing || status.end) return;
    if (!board[position]) board[position] = symbol; // only when empty
    if (over()) {
      changeStatus("end");
      message.innerText = "Game over";
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
    if (allFilled) return true;
    if (
      (board[0] && board[0] === board[1] && board[1] === board[2]) ||
      (board[3] && board[3] === board[4] && board[4] === board[5]) ||
      (board[6] && board[6] === board[7] && board[7] === board[8])
    ) {
      console.log("row check");
      return true;
    }

    // Checking 3 column
    if (
      (board[0] && board[0] === board[3] && board[3] === board[6]) ||
      (board[1] && board[1] === board[4] && board[4] === board[7]) ||
      (board[2] && board[2] === board[5] && board[5] === board[8])
    ) {
      console.log("col check");
      return true;
    }

    // Checking diagonals
    if (
      (board[0] && board[0] === board[4] && board[4] === board[8]) ||
      (board[2] && board[2] === board[4] && board[4] === board[6])
    ) {
      console.log("diagonal check");
      return true;
    }
    return false;
  };
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
  return { board, mark, turn, over, changeStatus, restart };
})();

const displayBoard = document.querySelector(".board");
const displayController = (function (board) {
  console.log("this is the display controller");
  function display() {
    board.innerHTML = "";
    game.board.forEach((position, index) => {
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

const player = (name, symbol) => {
  function mark(position) {
    game.mark(position, symbol);
  }
  return { name, symbol, mark };
};

const XPlayer = player("Shishir", "X");
const oPLayer = player("CPU", "O");

const control = document.getElementById("control");
control.addEventListener("click", () => {
  game.changeStatus("playing");
  if (control.innerText === "restart") {
    game.restart();
  }
});

const message = document.getElementById("message");
