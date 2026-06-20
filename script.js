const puzzles = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],

  [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
];

const board = document.querySelector(".board");

let originalPuzzle = JSON.parse(JSON.stringify(puzzles[0]));
let currentPuzzle = JSON.parse(JSON.stringify(puzzles[0]));

function isValidMove(board, row, col, value) {
  if (value === 0) return true;

  // Column
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col] === value) {
      return false;
    }
  }

  // Row
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === value) {
      return false;
    }
  }

  // 3x3 Box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if ((i !== row || j !== col) && board[i][j] === value) {
        return false;
      }
    }
  }

  return true;
}

function renderBoard() {
  board.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("input");

      cell.maxLength = 1;
      if (col === 2 || col === 5) {
        cell.classList.add("box-right");
      }

      if (row === 2 || row === 5) {
        cell.classList.add("box-bottom");
      }

      if (currentPuzzle[row][col] !== 0) {
        cell.value = currentPuzzle[row][col];
        cell.readOnly = true;
        cell.classList.add("fixed");
      }

      cell.addEventListener("input", function () {
        if (cell.value === "") {
          currentPuzzle[row][col] = 0;
          cell.classList.remove("valid");
          cell.classList.remove("invalid");
          return;
        }

        const value = Number(cell.value);

        if (isNaN(value) || value < 1 || value > 9) {
          cell.value = "";
          return;
        }

        currentPuzzle[row][col] = value;

        if (isValidMove(currentPuzzle, row, col, value)) {
          cell.classList.remove("invalid");
          cell.classList.add("valid");
          if (isSolved(currentPuzzle)) {
            alert("🎉 Sudoku Solved!");
          }
        } else {
          cell.classList.remove("valid");
          cell.classList.add("invalid");
        }
      });

      board.appendChild(cell);
    }
  }
}

renderBoard();

document.getElementById("resetBtn").addEventListener("click", () => {
  currentPuzzle = JSON.parse(JSON.stringify(originalPuzzle));
  renderBoard();
});

document.getElementById("newGameBtn").addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * puzzles.length);

  originalPuzzle = JSON.parse(JSON.stringify(puzzles[randomIndex]));

  currentPuzzle = JSON.parse(JSON.stringify(puzzles[randomIndex]));

  renderBoard();
});
function isSolved(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];

      if (value === 0) {
        return false;
      }

      if (!isValidMove(board, row, col, value)) {
        return false;
      }
    }
  }

  return true;
}
