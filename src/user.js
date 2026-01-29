import Board from './board.js';


class User {
  constructor(userName) {
    this.userName = userName;
    this.boards = [];
  }

  createBoard(boardName, boardDescription, boardId = null, dateCreated = new Date()) {
    const newBoard = Board(boardName, boardDescription, boardId, dateCreated = dateCreated);
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