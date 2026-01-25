import Board from './board.js';


class User {
  constructor(userName) {
    this.userName = userName;
    this.boards = [];
  }

  createBoard(boardName, boardDescription, boardId = null) {
    const newBoard = Board(boardName, boardDescription, boardId);
    this.boards.unshift(newBoard);
    return newBoard
  }

  deleteBoard(board) {
    this.boards = this.boards.splice(this.boards.indexOf(board), 1);
  }
}

export default new User();