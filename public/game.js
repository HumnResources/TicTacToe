
/* TIC TAC TOE BY CHASE ZISKA
*
* INITIALIZE VARIABLES
*
*/
let gameBoard = [["", "", ""],  // [0][0], [0][1], [0][2]
                 ["", "", ""],  // [1][0], [1][1], [1][2]
                 ["", "", ""]]; // [2][0], [2][1], [2][2]
let isGameOver = false;
const player = 'X';
const computer = 'O';
const boardContainer = document.querySelector(".grid");
const winnerStatement = document.getElementById("winner");
const logStatement = document.getElementById("log");

/*
*
* BOARD DISPLAY
*
*/
const render_board = (board) => {
  boardContainer.innerHTML = "";
  var cellIndex = 0;  
  const rows = board.length, cols = board[0].length;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      boardContainer.innerHTML += `<div id='cell_${cellIndex}' class='cell' onclick='play_player(${cellIndex}, "${player}")'>${board[i][j]}</div>`;
      if (board[i][j] == player || board[i][j] == computer) {
        document.querySelector(`#cell_${cellIndex}`).classList.add("occupied");
      }
      cellIndex++;
    }
  }
}

const make_move = (move, mark) => {
  // Updates global gameBoard variable to visualize change to user
  get_remaining_moves(gameBoard).forEach(m => {
      if (m === move) {
          var cellIndex = 0;
          const rows = gameBoard.length, cols = gameBoard[0].length;
          for (var i = 0; i < rows; i++) {
              for (var j = 0; j < cols; j++) {
                  if (cellIndex === move) {
                      gameBoard[i][j] = mark;
                      render_board(gameBoard)
                  }
                  cellIndex++;
              }
          }
      }
  })
}

const get_remaining_moves = (board) => {
  // Returns a list of available indexies, for condition checks and ai
    
  const rows = board.length, cols = board[0].length;
  var moves = [];
  var cellIndex = 0;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (board[i][j] === "") {
        moves.push(cellIndex);
      }
      cellIndex++;
    }
  }
  return moves;
}

const play_player = (move, mark) => {
    get_remaining_moves(gameBoard).forEach(mv => {
        if (mv.toString() == move) {
          make_move(move, mark)
          game_loop()
          play_computer()
        }
    })
}


/*
*
* AI MINIMAX
*
*/
const play_computer = () => {
  if (!isGameOver) {
    var selected;
    selected = minimax(gameBoard, 10, false)
    
    make_move(selected[0], computer);
    game_loop();
  }
}

const minimax = (board, depth, isMax) => {
    var moves = get_remaining_moves(board);
    var offset = moves.length;
    var winner = check_winner(board);
    
    if (winner === player) {
        return [-1, 10+offset];
    }
    else if (winner === computer) {
        return [-1, -10-offset];
    }
    else if (depth === 0 || offset === 0) {
        if (isMax) {
            return [-1, offset];
        }
        else {
            return [-1, -offset];
        } 
    }
    
    var bestScore = 0;
    var bestMove = -1;
    if (isMax) {
      bestScore = -Infinity;
      moves.forEach(move => {
        var nBoard = simulate_move(board, move, player)
        var moveScore = minimax(nBoard, depth-1, false)[1];
        if (moveScore > bestScore) {
            bestScore = moveScore;
            bestMove = move;
        }
      })
    }
    else {
      bestScore = Infinity;
      moves.forEach(move => {
        var nBoard = simulate_move(board, move, computer)
        var moveScore = minimax(nBoard, depth-1, true)[1];
        if (moveScore < bestScore) {
            bestScore = moveScore;
            bestMove = move;
        }
      })
    } 
    return [bestMove, bestScore];
}

const check_game_over = (board) => {
  let flag = true;
  board.forEach(row => {
      row.forEach(cell => {
          if (cell !== player && cell !== computer) {
              flag = false;
          }
      })
  })
  return flag;
};

const simulate_move = (board, move, mark) => {
    
  var copyBoard = board.map(a => a.slice())
  var cellIndex = 0;
  const rows = board.length, cols = board[0].length;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (cellIndex === move) {
        copyBoard[i][j] = mark;
      }
      cellIndex++;
    }
  }
  return copyBoard;
}


/*
*
* CONDITION CHECKS + RESET
*
*/
const transpose = (matrix) => {
  const rows = matrix.length, cols = matrix[0].length;
  const grid = [];
  for (var j = 0; j < cols; j++) {
    grid[j] = Array(rows);
  }
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[j][i] = matrix[i][j];
    }
  }
  return grid;
}
  
const check_line = (a, b, c) => {
  return (a === b && b === c && 
          (a === player || a === computer));
}

const check_winner = (board) => {
  var res = false;
  board.forEach((row, i) => {
      if (check_line(row[0], row[1], row[2])) {
          res = row[0]
      }
  })
  transpose(board).forEach(row => {
    if (check_line(row[0], row[1], row[2])) {
        res = row[0]
    }
  })
  var diag = (check_line(board[0][0], board[1][1], board[2][2]) || 
             check_line(board[0][2], board[1][1], board[2][0]) && 
             (board[1][1] === player || board[1][1] === computer))
  if (diag) {
    res = board[1][1];
  }
  return res;
}

const check_draw = (board) => {
  return (!check_winner(board) && 
          get_remaining_moves(board).length == 0)
}

const check_game = () => {
  var result = check_winner(gameBoard);
  if (result === computer) {
    winner.innerText = "Winner is computer";
    winner.classList.add("computerWin");
    isGameOver = true;
  }
  else if (result === player) {
    winner.innerText = "Winner is player!!";
    winner.classList.add("playerWin");
    isGameOver = true;
  }
  else if (check_draw(gameBoard)) {
    winner.innerText = "Draw!";
    winner.classList.add("draw");
    isGameOver = true;
  }
  
}

const reset_board = () => {
  gameBoard = [["", "", ""], // [0][0], [0][1], [0][2]
               ["", "", ""], // [1][0], [1][1], [1][2]
              ["", "", ""]]; // [2][0], [2][1], [2][2]
  isGameOver = false;
  winner.classList.remove("playerWin");
  winner.classList.remove("computerWin");
  winner.classList.remove("draw");
  winner.innerText = "";
  log.innerText = "";
  mmCalls = 0;
  render_board(gameBoard);
}

const game_loop = () => {
  check_game()
  render_board(gameBoard)
}

/*
*
* GAME INITIALIZE
*
*/
render_board(gameBoard)
