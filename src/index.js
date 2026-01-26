import User from './user.js';
import { listEntry, NoteItem, TODOItem, ListItem, TODOListItem } from './items.js';
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

  const retrieveNoteItem = (storageObject) => {
    return NoteItem(storageObject['title'], storageObject['description']);
  }

  const retrieveTODOItem = (storageObject) => {
    return TODOItem(
          storageObject['title'],
          storageObject['description'],
          new Date(storageObject['dueDate']),
          storageObject['priority'],
        );
  }

  const retrieveListItem = (storageObject) => {
    const entries = [];
    storageObject.entries.forEach((entry) => {
      entries.unshift(listEntry(entry.contents, entry.checked));
    })
    return ListItem(
      storageObject['title'],
      storageObject['description'],
      entries,
    )
  }

  const retrieveTODOListItem = (storageObject) => {
    const entries = [];
    storageObject.entries.forEach((entry) => {
      entries.unshift(listEntry(entry.contents, entry.checked));
    })
    return TODOListItem(
      storageObject['title'],
      storageObject['description'],
      new Date(storageObject['dueDate']),
      storageObject['priority'],
      entries,
    )
  }

  const retrieveItem = (storageObject) => {
    let retrievedItem = '';
    switch (storageObject['type']) {
      case 'note':
        retrievedItem = retrieveNoteItem(storageObject);
      case 'todo':
        retrievedItem = retrieveTODOItem(storageObject);
      case 'list':
        retrievedItem = retrieveListItem(storageObject);
      case 'todolist':
        retrievedItem = retrieveTODOListItem(storageObject);
    }
    return retrievedItem;
  }

  const retrieveBoards = () => {
    for (let i = 0; i < localStorage.length; i++) {
      let boardId = localStorage.key(i);
      let boardObj = JSON.parse(localStorage.getItem(boardId));
      const boardsItems = [];
      for (let item of boardObj['items']) {
        const retrievedItem = retrieveItem(item);
        boardsItems.unshift(retrievedItem);
      }
      User.createBoard(boardObj.name, boardObj.description, boardId, boardsItems);
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

// const newBoard = LogicController.addBoard('board1', 'I contain a list');
// const newlist = ListItem('my list', 'something descriptive', [listEntry('do one thing'), listEntry('do another thing')]);
// LogicController.addBoardItem(newBoard, newlist);
