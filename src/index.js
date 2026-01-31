import User from "./user.js";
import {
  listEntry,
  NoteItem,
  TODOItem,
  ListItem,
  TODOListItem,
} from "./items.js";
import { classifiedBoardTextures } from "./shared-values.js";
import "./static/styles/common.css";

import createBoardsPageLayout from "./boards-page-layout.js";

const LogicController = (() => {
  const user = User;

  const addBoard = (name, description) => {
    const newBoard = User.createBoard(name, description);
    newBoard.setLocalStorageBoardObject();
    return newBoard;
  };

  const deleteBoard = (board) => {
    User.deleteBoard(board);
    localStorage.removeItem(board.getBoardId);
  };

  const addBoardItem = (board, item) => {
    board.addItem(item);
    board.setLocalStorageBoardObject();
  };

  const removeBoardItem = (board, item) => {
    board.deleteItem(item);
    board.setLocalStorageBoardObject();
  };

  const retrieveNoteItem = (storageObject) => {
    return NoteItem(
      storageObject["title"],
      storageObject["description"],
      storageObject["dateCreated"],
      storageObject["dateChanged"],
    );
  };

  const retrieveTODOItem = (storageObject) => {
    return TODOItem(
      storageObject["title"],
      storageObject["description"],
      Date.parse(storageObject["dueDate"]),
      storageObject["priority"],
      storageObject["dateCreated"],
      storageObject["dateChanged"],
    );
  };

  const retrieveListItem = (storageObject) => {
    const entries = [];
    storageObject.entries.forEach((entry) => {
      entries.unshift(listEntry(entry.contents, entry.checked));
    });
    return ListItem(
      storageObject["title"],
      storageObject["description"],
      entries,
      storageObject["dateCreated"],
      storageObject["dateChanged"],
    );
  };

  const retrieveTODOListItem = (storageObject) => {
    const entries = [];
    storageObject.entries.forEach((entry) => {
      entries.unshift(listEntry(entry.contents, entry.checked));
    });
    return TODOListItem(
      storageObject["title"],
      storageObject["description"],
      new Date(storageObject["dueDate"]),
      storageObject["priority"],
      entries,
      storageObject["dateCreated"],
      storageObject["dateChanged"],
    );
  };

  const retrieveItem = (storageObject) => {
    let retrievedItem = "";
    switch (storageObject["type"]) {
      case "note":
        retrievedItem = retrieveNoteItem(storageObject);
        break;
      case "todo":
        retrievedItem = retrieveTODOItem(storageObject);
        break;
      case "list":
        retrievedItem = retrieveListItem(storageObject);
        break;
      case "todolist":
        retrievedItem = retrieveTODOListItem(storageObject);
        break;
    }
    return retrievedItem;
  };

  const retrieveBoards = () => {
    user.resetBoards();
    for (let i = 0; i < localStorage.length; i++) {
      let boardId = localStorage.key(i);
      let boardObj = JSON.parse(localStorage.getItem(boardId));
      const boardsItems = [];
      for (let item of boardObj["items"]) {
        const retrievedItem = retrieveItem(item);
        boardsItems.unshift(retrievedItem);
      }
      const retrievedBoard = User.createBoard(
        boardObj.name,
        boardObj.description,
        boardObj.boardTexture,
        boardId,
        new Date(boardObj.dateCreated),
        boardObj.sortPreference,
      );
      for (let item of boardsItems) {
        retrievedBoard.addItem(item);
      }
      const boardSize = retrievedBoard.getBoardSize();
      const currentBoardTexture = retrievedBoard.getBoardTexture();
      if (!classifiedBoardTextures[boardSize].includes(currentBoardTexture)) {
        const newBoardTexture =
          classifiedBoardTextures[boardSize][
            Math.floor(
              Math.random() * classifiedBoardTextures[boardSize].length,
            )
          ];
        retrievedBoard.setBoardTexture(newBoardTexture);
      }
    }
    return User.boards;
  };

  return {
    user,
    addBoard,
    deleteBoard,
    addBoardItem,
    removeBoardItem,
    retrieveBoards,
  };
})();

const ScreenController = (() => {
  createBoardsPageLayout(LogicController);
})();

// const newBoard = LogicController.addBoard('board1', 'I contain a list');
// const newlist = ListItem('my list', 'something descriptive', [listEntry('do one thing'), listEntry('do another thing')]);
// LogicController.addBoardItem(newBoard, newlist);
// const newnote = NoteItem('my note', 'bla bla important');
// LogicController.addBoardItem(newBoard, newnote);
// const newtodo = TODOItem('FINISH THE TODO SITE', 'seriously, for a mini project it is taking too long', new Date('2026-01-27'), 'important');
// LogicController.addBoardItem(newBoard, newtodo);
