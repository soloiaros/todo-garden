import User from './user.js';
import { listEntry, TODOItem, ListItem, TODOListItem } from './items.js';
import './static/styles/common.css';

import createBoardsPageLayout from './boards-page-layout.js';

const LogicController = (() => {

  const addBoard = (name, description) => {
    if (validateBoardName(name) && validateBoardDescription(description)) {
      const newBoard = User.createBoard(name, description);
      setLocalStorageBoardObject(newBoard);
      return newBoard;
    }
    return false;
  }

  const deleteBoard = (board) => {
    User.deleteBoard(board);
    localStorage.removeItem(board.getBoardId);
  }

  const addBoardItem = (board, item) => {
    board.addItem(item);
    setLocalStorageBoardObject(board);
  }

  const removeBoardItem = (board, item) => {
    board.deleteItem(item);
    setLocalStorageBoardObject(board);
  }

  const setLocalStorageBoardObject = (board) => {
    const boardObject = board.createStorageObject();
    localStorage.setItem(board.getBoardId(), JSON.stringify(boardObject))
  }

  const retrieveBoards = () => {
    for (let i = 0; i < localStorage.length; i++) {
      let boardId = localStorage.key(i);
      let boardObj = JSON.parse(localStorage.getItem(boardId));
      User.createBoard(boardObj.name, boardObj.description, boardId)
    }
    return User.boards;
  }

  const validateBoardName = (text) => {
    const MINLENGTH = 1;
    const MAXLENGTH = 32;
    return !!(text.length >= MINLENGTH && text.length <= MAXLENGTH)
  }

  const validateBoardDescription = (text) => {
    const MAXLENGTH = 256;
    return !!(text.length <= MAXLENGTH)
  }

  return {
    addBoard,
    deleteBoard,
    addBoardItem,
    removeBoardItem,
    retrieveBoards,
  }

})();


const ScreenController = (() => {

  createBoardsPageLayout(LogicController);

})();

const newBoard = LogicController.addBoard('board1', 'I contain a list');
const newlist = ListItem('my list', 'something descriptive', [listEntry('do one thing'), listEntry('do another thing')]);
LogicController.addBoardItem(newBoard, newlist);

console.log(localStorage)