/* TIC TAC TOE BY CHASE ZISKA
*
* INITIALIZE VARIABLES
*
*/
let gameBoard = [["", "", ""],  // [0][0], [0][1], [0][2]
                 ["", "", ""],  // [1][0], [1][1], [1][2]
                 ["", "", ""]]; // [2][0], [2][1], [2][2]
let isGameOver = false;
let pWins = 0, cWins = 0, draws = 0
let mmCallsTotal = 0, mmCalls = 0;
let difficulty = 'normal';

const player = 'X', computer = 'O';
const boardContainer = document.querySelector(".grid");
const winnerStatement = document.getElementById("winner");
const logStatement = document.getElementById("log");
/*
*
* BOARD DISPLAY
*
*/
function render_board(board) {
  boardContainer.innerHTML = "";
  var cellIndex = 0;  
  const rows = board.length, cols = board[0].length;
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      boardContainer.innerHTML += `<div id='cell_${cellIndex}' class='cell' onclick='make_move(${cellIndex}, "${player}")'>${board[i][j]}</div>`;
      if (board[i][j] == player || board[i][j] == computer) {
        document.querySelector(`#cell_${cellIndex}`).classList.add("occupied");
      }
      cellIndex++;
    }
  }
}

function make_move(move, mark) {
  // Updates global gameBoard variable to visualize change to user
  if (valid_move(gameBoard, move)) {
    var cellIndex = 0;
    const rows = gameBoard.length, cols = gameBoard[0].length;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (cellIndex === move) {
          gameBoard[i][j] = mark;
          game_loop()
          if (mark === player) {
            play_computer();
          }
          return;
        }
        cellIndex++;
      }
    }
  }
}

function valid_move(board, move) {
    var moves = get_remaining_moves(board);
    for (var i = 0; i < moves.length; i++) {
        if (move === moves[i]) {
            return true;
        }
    }
    return false;
}

function get_remaining_moves(board) {
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

/*
*
* AI MINIMAX
*
*/
function play_computer() {
  if (!isGameOver) {
    var selected;
    do {
        if (difficulty === 'random') {
            selected = Math.floor(Math.random() * 9);
        }
        else if (difficulty === 'normal') {
            selected = minimax(gameBoard, 2, false, -Infinity, Infinity, true)[0]
        }
        else if (difficulty === 'hard') {
            selected = minimax(gameBoard, 4, false, -Infinity, Infinity, true)[0]
        }
        else if (difficulty === 'impossible') {
            selected = minimax(gameBoard, 10, false, -Infinity, Infinity, true)[0]
        }
    } while(!valid_move(gameBoard, selected));
    make_move(selected, computer);
    mmCalls = 0;
  }
}

function minimax(board, depth, isMax, alpha, beta, useAB) {
    mmCalls++;
    mmCallsTotal++;
    const moves = get_remaining_moves(board);
    const offset = moves.length;
    const winner = check_winner(board);
    
    if (winner === player) {
        return [NaN, 100+offset];
    }
    else if (winner === computer) {
        return [NaN, -100-offset];
    }
    else if (depth === 0 || offset === 0) {
        if (isMax) {
            return [NaN, offset];
        }
        else {
            return [NaN, -offset];
        } 
    }
    var bestMove;
    var bestScore;
    
    if (isMax) {
        bestScore = -Infinity;
    }
    else {
        bestScore = Infinity;
    }
    
    for (var i = 0; i < offset; i++) {
        var move = moves[i];
        var nBoard;
        var moveScore;
        if (isMax) {
            nBoard = simulate_move(board, move, player);
            moveScore = minimax(nBoard, depth-1, isMax, alpha, beta, useAB)[1];
            if (moveScore > bestScore) {
                bestScore = moveScore;
                bestMove = move
            }
            if (useAB && bestScore > alpha) {
                alpha = bestScore;
            }
        }
        else {
            nBoard = simulate_move(board, move, computer);
            moveScore = minimax(nBoard, depth-1, true, alpha, beta, useAB)[1];
            if (moveScore < bestScore) {
                bestScore = moveScore;
                bestMove = move;
            }
            if (useAB && bestScore < beta) {
                beta = bestScore;
            }
        }
        if (useAB && beta <= alpha) {
            break;
        }
    }
    return [bestMove, bestScore];
}

function simulate_move(board, move, mark) {
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
 
function select_difficulty(newDiffuculty) {
    if (newDiffuculty === 'random' || newDiffuculty === 'normal' ||
        newDiffuculty === 'hard' || newDiffuculty === 'impossible') {
        
        document.getElementById(difficulty).classList.remove('inUse')
        difficulty = newDiffuculty;
        reset_board()
        document.getElementById(newDiffuculty).classList.add('inUse')
    }
    
}

/*
*
* CONDITION CHECKS + RESET
*
*/
function transpose(matrix) {
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
  
function check_line(a, b, c) {
  return (a === b && b === c && 
          (a === player || a === computer));
}

function check_winner(board) {
    
  if (check_line(board[0][0], board[1][1], board[2][2]) && (board[1][1] === player || board[1][1] === computer)) {
    return board[1][1];//[true, '00', '11', '22'];
  }
  if (check_line(board[0][2], board[1][1], board[2][0]) && (board[1][1] === player || board[1][1] === computer)) {
    return board[0][2];//[true, board[0][2], board[1][1], board[2][0]];
  }
  for (var i = 0; i < board.length; i++) {
      var row = board[i];
      if (check_line(row[0], row[1], row[2])) {
          return row[0];//[true, row[0], row[1], row[2]]
      }
  }
  var nBoard = transpose(board);
  for (var i = 0; i < board.length; i++) {
      var row = nBoard[i];
      if (check_line(row[0], row[1], row[2])) {
          return row[0];//[true, row[0], row[1], row[2]]
      }
  }
  return false;//[false];
}

function check_draw(board) {
  return (!check_winner(board)[0] && 
          get_remaining_moves(board).length == 0)
}

function check_game() {
  var result = check_winner(gameBoard);
  if (result === computer) {
    winner.innerText = "Winner is computer";
    winner.classList.add("computerWin");
    isGameOver = true;
    cWins++;
  }
  else if (result === player) {
    winner.innerText = "Winner is player!!";
    winner.classList.add("playerWin");
    isGameOver = true;
    pWins++;
  }
  else if (check_draw(gameBoard)) {
    winner.innerText = "Draw!";
    winner.classList.add("draw");
    isGameOver = true;
    draws++;
  }
  if (isGameOver) {
      boardContainer.innerHTML = "";
      var cellIndex = 0;  
      const rows = gameBoard.length, cols = gameBoard[0].length;
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          boardContainer.innerHTML += `<div id='cell_${cellIndex}' class='cell'>${gameBoard[i][j]}</div>`;
          if (gameBoard[i][j] == player || gameBoard[i][j] == computer) {
            document.querySelector(`#cell_${cellIndex}`).classList.add("occupied");
          }
          cellIndex++;
        }
      }
  }
}

function reset_board() {
  gameBoard = [["", "", ""], // [0][0], [0][1], [0][2]
               ["", "", ""], // [1][0], [1][1], [1][2]
              ["", "", ""]]; // [2][0], [2][1], [2][2]
  isGameOver = false;
  winner.classList.remove("playerWin");
  winner.classList.remove("computerWin");
  winner.classList.remove("draw");
  winner.innerText = "";
  game_loop();
  mmCallsTotal = 0;
  mmCalls = 0;
}

function game_loop() {
  render_board(gameBoard)
  logStatement.innerText = `Computer: ${cWins} | Player: ${pWins} | Draws: ${draws}`
  check_game()
}

/*
*
* GAME INITIALIZE
*
*/

document.getElementById(difficulty).classList.add('inUse');
render_board(gameBoard)