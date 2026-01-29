import { SMALLBOARDITEMNUMBER, MEDIUMBOARDITENUMBER } from "./shared-values";

export default function Board(boardName, boardDescription, sortPreference, boardTexture, boardId = null, dateCreated = null) {

  boardId = !!(boardId) ? boardId : crypto.randomUUID();

  let items = [];

  let boardSize = '';

  const updateBoardSize = () => {
    boardSize = items.length <= SMALLBOARDITEMNUMBER ? 'small' 
      : items.length > MEDIUMBOARDITENUMBER ? 'large' : 'medium';
  }

  const getBoardSize = () => boardSize;

  const getName = () => boardName;
  
  const getDescription = () => boardDescription;

  const getItems = () => {
    return items;
  };

  const getboardTexture = () => boardTexture;

  const setboardTexture = (newboardTexture) => {
    boardTexture = newboardTexture;
    setLocalStorageBoardObject();
  }

  const getDateCreated = () => !!(dateCreated) ? dateCreated : new Date();

  const getBoardId = () => boardId;

  const getSortPreference = () => sortPreference;

  const setSortPreference = (newSortPreference) => {
    sortPreference = newSortPreference;
    setLocalStorageBoardObject();
  }

  const setName = (newName) => {
    boardName = newName;
    setLocalStorageBoardObject();
  }

  const setDescription = (newDescription) => {
    boardDescription = newDescription;
    setLocalStorageBoardObject();
  }

  const addItem = (item) => {
    items.unshift(item);
    item.subscribe(setLocalStorageBoardObject);
    updateBoardSize();
    setLocalStorageBoardObject();
  }

  const deleteItem = (item) => {
    const itemIndex = items.indexOf(item);
    if (itemIndex > -1) {
      items.splice(itemIndex, 1);
      setLocalStorageBoardObject();
    }
  }

  const createStorageObject = () => {
    const boardObj =  {
      name: boardName,
      description: boardDescription,
      items: [],
      dateCreated: getDateCreated(),
      sortPreference: getSortPreference(),
      boardTexture: getboardTexture(),
    };
    items.forEach((item) => {
      boardObj.items.unshift(item.getItemObject())
    });
    return boardObj;
  }

  const setLocalStorageBoardObject = () => {
    const boardObject = createStorageObject();
    localStorage.setItem(boardId, JSON.stringify(boardObject))
  }
  
  return {
    getName,
    getDescription,
    getBoardId,
    getItems,
    getDateCreated,
    getSortPreference,
    getBoardSize,
    getboardTexture,
    setboardTexture,
    setSortPreference,
    setName,
    setDescription,
    addItem,
    deleteItem,
    setLocalStorageBoardObject,
    updateBoardSize,
  }
}