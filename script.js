const board = document.querySelector("#board");
const cells = document.querySelectorAll(".cell");
const message = document.querySelector("#message");
const resetButton = document.querySelector("#resetButton");

let boardState = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let computer = "O";
let isGameOver = false;

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (boardState[index] === "" && !isGameOver) {
        boardState[index] = human;
        cell.textContent = human;
        if (checkWin(boardState, human)) {
            endGame("You Win!");
        } else if (boardState.every(cell => cell !== "")) {
            endGame("It's a Tie!");
        } else {
            computerMove();
        }
    }
}

function computerMove() {
    const bestMove = minimax(boardState, computer).index;
    boardState[bestMove] = computer;
    cells[bestMove].textContent = computer;
    
    if (checkWin(boardState, computer)) {
        endGame("Computer Wins!");
    } else if (boardState.every(cell => cell !== "")) {
        endGame("It's a Tie!");
    }
}

function checkWin(board, player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(combo => combo.every(index => board[index] === player));
}

function endGame(result) {
    isGameOver = true;
    message.textContent = result;
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    message.textContent = "";
    isGameOver = false;
}

function minimax(newBoard, player) {
    const emptyCells = newBoard.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    // Check for terminal states
    if (checkWin(newBoard, human)) return { score: -10 };
    if (checkWin(newBoard, computer)) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    // Prioritize immediate winning moves
    if (player === computer) {
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            newBoard[index] = computer;
            if (checkWin(newBoard, computer)) {
                newBoard[index] = "";  // Reset the cell after checking
                return { index, score: 10 }; // Immediate win found
            }
            newBoard[index] = ""; // Reset the cell after checking
        }
    }

    const moves = [];

    for (const index of emptyCells) {
        const move = { index };
        newBoard[index] = player;

        // Recursive minimax call
        if (player === computer) {
            move.score = minimax(newBoard, human).score;
        } else {
            move.score = minimax(newBoard, computer).score;
        }

        newBoard[index] = ""; // Reset the cell
        moves.push(move);
    }

    // Find the optimal move
    let bestMove;
    if (player === computer) {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}
