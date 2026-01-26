export default function Board(boardName, boardDescription, boardId = null, passedItems = null) {

  boardId = !!(boardId) ? boardId : crypto.randomUUID();

  let items = [];
  if (!!(passedItems)) {
    items = passedItems;
  }

  const getName = () => boardName;
  
  const getDescription = () => boardDescription;

  const getItems = () => {
    return items;
  };

  const getBoardId = () => boardId;

  const setName = (newName) => {
    boardName = newName;
  }

  const setDescription = (newDescription) => {
    boardDescription = newDescription;
  }

  const addItem = (item) => {
    items.unshift(item);
  }

  const deleteItem = (item) => {
    const itemIndex = items.indexOf(item);
    if (itemIndex > -1) {
      items.splice(itemIndex, 1);
    }
  }

  const createStorageObject = () => {
    const boardObj =  {
      name: boardName,
      description: boardDescription,
      items: []
    };
    items.forEach((item) => {
      boardObj.items.unshift(item.getItemObject())
    });
    return boardObj;
  }
  
  return {
    getName,
    getDescription,
    getBoardId,
    getItems,
    setName,
    setDescription,
    addItem,
    deleteItem,
    createStorageObject,
  }
}