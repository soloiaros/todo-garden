import Board from './board.js';


class User {
  constructor(userName) {
    this.userName = userName;
    this.boards = {};
  }

  createBoard(boardName, boardDescription) {
    const boardId = crypto.randomUUID();
    const newBoard = Board(boardName, boardDescription, boardId);
    this.boards[boardId] = newBoard;
  }

  deleteBoard(boardId) {
    delete this.boards[boardId];
  }
}

export default new User();