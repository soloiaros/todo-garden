import Board from './board.js';


class User {
  constructor(userName) {
    this.userName = userName;
    this.boards = [];
    this.defaultSortPreference = 'by-date-created-incr';
  }

  createBoard(boardName, boardDescription, textureIndex, boardId = null, dateCreated = new Date(), sortPreference = this.defaultSortPreference) {
    const newBoard = Board(boardName, boardDescription, sortPreference, textureIndex, boardId, dateCreated = dateCreated);
    newBoard.updateBoardSize();
    this.boards.unshift(newBoard);
    return newBoard;
  }

  deleteBoard(board) {
    this.boards = this.boards.splice(this.boards.indexOf(board), 1);
  }

  resetBoards() {
    this.boards = [];
  }
}

export default new User();
