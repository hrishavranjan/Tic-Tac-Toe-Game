let board = ['', '', '', '', '', '', '', '', '']; // Represents a 3x3 grid
let gameActive = true; // Indicates if the game is currently active
let currentPlayer = 'X'; // Starts with player X (the human player)
let gameMode = 'pvp'; // Default game mode is player vs player

function handleClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.id.split('-')[1]);

    // Check if the cell is already marked or if the game is not active
    if (board[cellIndex] !== '' || !gameActive) return;

    // Human move
    makeMove(cellIndex, currentPlayer);

    // Check for win or draw
    if (checkGameOver(currentPlayer)) return;

    // Switch turns or make AI move
    if (gameMode === 'pvp') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    } else {
        currentPlayer = 'O';
        aiMove();
    }
}

function makeMove(cellIndex, player) {
    board[cellIndex] = player;
    const cell = document.getElementById(`cell-${cellIndex}`);
    cell.classList.add(player.toLowerCase()); // Add class 'x' or 'o' for styling
    cell.textContent = player;
}

function aiMove() {
    const bestMove = minimax(board, currentPlayer).index;
    makeMove(bestMove, currentPlayer);

    // Check for win or draw
    if (checkGameOver(currentPlayer)) return;

    // Switch back to human player's turn
    currentPlayer = 'X';
}

function minimax(board, player) {
    // Base cases: terminal states (win, lose, draw)
    if (checkWin('X')) {
        return { score: -10 };
    } else if (checkWin('O')) {
        return { score: 10 };
    } else if (checkDraw()) {
        return { score: 0 };
    }

    // Collect possible moves and their scores
    let moves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            let move = {};
            move.index = i;
            board[i] = player;

            // Recursively call minimax for the opponent's turn
            if (player === 'O') {
                let result = minimax(board, 'X');
                move.score = result.score;
            } else {
                let result = minimax(board, 'O');
                move.score = result.score;
            }

            // Undo the move
            board[i] = '';
            moves.push(move);
        }
    }

    // Choose the best move (highest score for 'O', lowest score for 'X')
    let bestMove;
    if (player === 'O') {
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

function checkWin(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winConditions.some(condition => {
        return condition.every(index => {
            return board[index] === player;
        });
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function checkGameOver(player) {
    if (checkWin(player)) {
        announceWinner(player);
        gameActive = false;
        return true;
    }
    if (checkDraw()) {
        announceDraw();
        gameActive = false;
        return true;
    }
    return false;
}

function announceWinner(player) {
    const message = document.getElementById('result-message');
    message.textContent = `Player ${player} wins!`;
    showModal();
}

function announceDraw() {
    const message = document.getElementById('result-message');
    message.textContent = "It's a draw!";
    showModal();
}

function showModal() {
    const modal = document.getElementById('result-modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('result-modal');
    modal.style.display = 'none';
    resetGame();
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    const message = document.getElementById('message');
    message.textContent = '';

    const modal = document.getElementById('result-modal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
    });

    const resetButton = document.getElementById('reset-btn');
    resetButton.addEventListener('click', resetGame);

    const closeModalButton = document.getElementById('close-modal');
    closeModalButton.addEventListener('click', closeModal);

    const gameModeRadios = document.querySelectorAll('input[name="mode"]');
    gameModeRadios.forEach(radio => {
        radio.addEventListener('change', function(e) {
            gameMode = e.target.value;
            resetGame();
        });
    });
});
