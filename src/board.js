export function Board(boardName, boardDescription, boardId) {

  const items = [];

  const getName = () => boardName;
  
  const getDescription = () => boardDescription;

  const getId = () => boardId;

  const addItem = (item) => items.push(item);

  const deleteItem = (item) => {
    const itemIndex = items.indexOf(item);
    if (itemIndex > -1) {
      items.splice(itemIndex, 1);
    }
  }
  
  return {
    getName,
    getDescription,
    getId,
    addItem,
    deleteItem
  }
}