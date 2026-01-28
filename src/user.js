import Board from './board.js';


class User {
  constructor(userName) {
    this.userName = userName;
    this.boards = [];
  }

  createBoard(boardName, boardDescription, boardId = null, items = null) {
    const newBoard = Board(boardName, boardDescription, boardId, items);
    this.boards.unshift(newBoard);
    return newBoard
  }

  deleteBoard(board) {
    this.boards = this.boards.splice(this.boards.indexOf(board), 1);
  }

  resetBoards() {
    this.boards = [];
  }
}

export default new User();