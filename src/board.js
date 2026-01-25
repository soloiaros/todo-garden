export default function Board(boardName, boardDescription, boardId = crypto.randomUUID()) {

  const items = [];

  const getName = () => boardName;
  
  const getDescription = () => boardDescription;

  const getBoardId = () => boardId;

  const setName = (newName) => boardName = newName;

  const setDescription = (newDescription) => boardDescription = newDescription;

  const addItem = (item) => items.unshift(item);

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
      boardObj.items.unshift(item.getStorageObj())
    });
    return boardObj;
  }
  
  return {
    getName,
    getDescription,
    getBoardId,
    setName,
    setDescription,
    addItem,
    deleteItem,
    createStorageObject,
  }
}