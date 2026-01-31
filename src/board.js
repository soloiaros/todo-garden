import { SMALLBOARDITEMNUMBER, MEDIUMBOARDITENUMBER } from "./shared-values";
import { format, getDate } from "date-fns";

export default function Board(
  boardName,
  boardDescription,
  sortPreference,
  boardTexture,
  boardId = null,
  dateCreated = null,
) {
  boardId = !!boardId ? boardId : crypto.randomUUID();

  let items = [];

  let boardSize = "";

  const updateBoardSize = () => {
    boardSize =
      items.length <= SMALLBOARDITEMNUMBER
        ? "small"
        : items.length > MEDIUMBOARDITENUMBER
          ? "large"
          : "medium";
  };

  const getBoardSize = () => boardSize;

  const getName = () => boardName;

  const getDescription = () => boardDescription;

  const getItems = () => {
    return items;
  };

  const getBoardTexture = () => boardTexture;

  const setBoardTexture = (newboardTexture) => {
    boardTexture = newboardTexture;
    setLocalStorageBoardObject();
  };

  const getDateCreated = () => (!!dateCreated ? dateCreated : new Date());

  const getDateCreatedReadable = () => {
    let formattedDate = "";
    try {
      formattedDate = format(getDateCreated(), "MMM do");
    } catch {
      formattedDate = "could not fetch date";
    }
    return formattedDate;
  };

  const getBoardId = () => boardId;

  const getSortPreference = () => sortPreference;

  const setSortPreference = (newSortPreference) => {
    sortPreference = newSortPreference;
    setLocalStorageBoardObject();
  };

  const setName = (newName) => {
    boardName = newName;
    setLocalStorageBoardObject();
  };

  const setDescription = (newDescription) => {
    boardDescription = newDescription;
    setLocalStorageBoardObject();
  };

  const addItem = (item) => {
    items.unshift(item);
    item.subscribe(setLocalStorageBoardObject);
    updateBoardSize();
    setLocalStorageBoardObject();
  };

  const deleteItem = (item) => {
    const itemIndex = items.indexOf(item);
    if (itemIndex > -1) {
      items.splice(itemIndex, 1);
      setLocalStorageBoardObject();
    }
  };

  const createStorageObject = () => {
    const boardObj = {
      name: boardName,
      description: boardDescription,
      items: [],
      dateCreated: getDateCreated(),
      sortPreference: getSortPreference(),
      boardTexture: getBoardTexture(),
    };
    items.forEach((item) => {
      boardObj.items.unshift(item.getItemObject());
    });
    return boardObj;
  };

  const setLocalStorageBoardObject = () => {
    const boardObject = createStorageObject();
    localStorage.setItem(boardId, JSON.stringify(boardObject));
  };

  return {
    getName,
    getDescription,
    getBoardId,
    getItems,
    getDateCreated,
    getSortPreference,
    getBoardSize,
    getBoardTexture,
    getDateCreatedReadable,
    setBoardTexture,
    setSortPreference,
    setName,
    setDescription,
    addItem,
    deleteItem,
    setLocalStorageBoardObject,
    updateBoardSize,
  };
}
