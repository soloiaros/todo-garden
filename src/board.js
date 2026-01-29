export default function Board(boardName, boardDescription, boardId = null, dateCreated = null) {

  boardId = !!(boardId) ? boardId : crypto.randomUUID();

  let items = [];

  const getName = () => boardName;
  
  const getDescription = () => boardDescription;

  const getItems = () => {
    return items;
  };

  const getDateCreated = () => !!(dateCreated) ? dateCreated : new Date();

  const getBoardId = () => boardId;

  const setName = (newName) => {
    boardName = newName;
  }

  const setDescription = (newDescription) => {
    boardDescription = newDescription;
  }

  const addItem = (item) => {
    items.unshift(item);
    item.subscribe(setLocalStorageBoardObject);
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
    setName,
    setDescription,
    addItem,
    deleteItem,
    setLocalStorageBoardObject,
  }
}