const boardSize = 3;
    let board = Array.from(Array(boardSize), () => Array(boardSize).fill(''));
    let currentPlayer = 'X';
    let gameFinished = false;
    let playWithBot = false;

    const startWindow = document.querySelector('.start-window');
    const gameWindow = document.querySelector('.game-window');
    const gameBoardElement = document.getElementById('gameBoard');
    const messageElement = document.querySelector('.message');
    const turnMessageElement = document.getElementById('turnMessage');
    const playAgainButton = document.querySelector('.play-again-button');
    const modal = document.getElementById('myModal');
    const gameOverMessage = document.getElementById('gameOverMessage');

    // Initialize the game board
    function initializeBoard() {
      // Clear the existing board
      gameBoardElement.innerHTML = '';
      for (let i = 0; i < boardSize; i++) {
        const row = gameBoardElement.insertRow(i);
        for (let j = 0; j < boardSize; j++) {
          const cell = row.insertCell(j);
          cell.addEventListener('click', () => makeMove(i, j));
        }
      }
    }

    // Start the game with the bot
    function startGameWithBot() {
      playWithBot = true;
      startGame();
    }

    // Start the game with a friend
    function startGameWithFriend() {
      playWithBot = false;
      startGame();
    }

    // Start the game
    function startGame() {
      startWindow.style.display = 'none';
      gameWindow.style.display = 'flex';
      initializeBoard();

      if (playWithBot && currentPlayer === 'O') {
        // Bot's move using minimax algorithm
        makeBotMove();
      }
    }

    // Make a move on the board
    function makeMove(row, col) {
      if (gameFinished || board[row][col] !== '') return;

      board[row][col] = currentPlayer;
      renderBoard();

      if (checkWinner(currentPlayer)) {
        displayMessage(`${currentPlayer} wins!`);
        gameFinished = true;
      } else if (isBoardFull()) {
        displayMessage("It's a draw!");
        gameFinished = true;
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnMessage();

        if (playWithBot && currentPlayer === 'O') {
          // Bot's move using minimax algorithm
          makeBotMove();
        }
      }

      if (gameFinished) {
        playAgainButton.style.display = 'block';
        showModal();
        updateGameOverMessage();
      }
    }

    // Make a move for the bot using the minimax algorithm
    function makeBotMove() {
      let bestMove = findBestMove();
      if (bestMove) {
        setTimeout(() => makeMove(bestMove.row, bestMove.col), 500);
      }
    }

    // Find the best move using the minimax algorithm
    function findBestMove() {
      let bestScore = -Infinity;
      let move = null;

      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (board[i][j] === '') {
            board[i][j] = 'O';
            let score = minimax(board, 0, false);
            board[i][j] = '';

            if (score > bestScore) {
              bestScore = score;
              move = { row: i, col: j };
            }
          }
        }
      }

      return move;
    }

    // The minimax algorithm
    function minimax(board, depth, isMaximizing) {
      let result = checkWinner('O') ? 1 : checkWinner('X') ? -1 : 0;

      if (result !== 0) {
        return result;
      }

      if (isBoardFull()) {
        return 0;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === '') {
              board[i][j] = 'O';
              let score = minimax(board, depth + 1, false);
              board[i][j] = '';
              bestScore = Math.max(score, bestScore);
            }
          }
        }

        return bestScore;
      } else {
        let bestScore = Infinity;

        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === '') {
              board[i][j] = 'X';
              let score = minimax(board, depth + 1, true);
              board[i][j] = '';
              bestScore = Math.min(score, bestScore);
            }
          }
        }

        return bestScore;
      }
    }

    // Update the turn message
    function updateTurnMessage() {
      turnMessageElement.textContent = `${currentPlayer}'s turn`;
    }

    // Check if there is a winner
    function checkWinner(player) {
      // Check rows, columns, and diagonals
      for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === player) ||
            board.every(row => row[i] === player)) {
          return true;
        }
      }

      if (board.every((row, index) => row[index] === player) ||
          board.every((row, index) => row[boardSize - 1 - index] === player)) {
        return true;
      }

      return false;
    }

    // Check if the board is full
    function isBoardFull() {
      return board.every(row => row.every(cell => cell !== ''));
    }

    // Render the current state of the board
    function renderBoard() {
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          gameBoardElement.rows[i].cells[j].textContent = board[i][j];
        }
      }
    }

    // Display a message to the user
    function displayMessage(msg) {
      messageElement.textContent = msg;
    }

    // Show the modal
    function showModal() {
      modal.style.display = 'flex';
    }

    // Hide the modal
    function hideModal() {
      modal.style.display = 'none';
    }

    // Update the game over message in the modal
    function updateGameOverMessage() {
      if (checkWinner('X')) {
        gameOverMessage.textContent = 'Game Over! X wins!';
      } else if (checkWinner('O')) {
        gameOverMessage.textContent = 'Game Over! O wins!';
      } else {
        gameOverMessage.textContent = "Game Over! It's a draw!";
      }
    }

    // Reset the game
    function resetGame() {
      board = Array.from(Array(boardSize), () => Array(boardSize).fill(''));
      renderBoard();
      displayMessage('');
      playAgainButton.style.display = 'none';
      currentPlayer = 'X';
      gameFinished = false;

      if (playWithBot && currentPlayer === 'O') {
        // Bot's move using minimax algorithm
        makeBotMove();
      }

      hideModal();
    }

    // Go back to the home page
    function goToHomePage() {
      gameWindow.style.display = 'none';
      startWindow.style.display = 'flex';
      // Clear the board when navigating back to the home page
      initializeBoard();
    }

    // Show the "Play Again" button after selecting "No" in the modal
    function showPlayAgainButton() {
      playAgainButton.style.display = 'block';
      hideModal();
    }