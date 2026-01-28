import { listEntry, NoteItem, TODOItem, ListItem, TODOListItem } from './items.js';

export const createNewItemPopover = (board, eventFireLocation) => {
  const itemTypes = {
      'note': NoteItem,
      'todo': TODOItem,
      'list': ListItem,
      'todolist': TODOListItem,
  }
  const popoverCreate = document.createElement('div');
  popoverCreate.id = 'popover-create-item';
  popoverCreate.setAttribute('popover', '');

  const itemCreated = new CustomEvent('newemptyitem');

  const popoverHeading = document.createElement('h4');
  popoverHeading.textContent = 'Select the kind of element:';
  popoverCreate.appendChild(popoverHeading);
  for (let [itemType, itemTypeName] of Object.entries({'note': 'Note', 'todo': 'TODO', 'list': 'List', 'todolist': 'TODO List'})) {
    const itemTypeBtn = document.createElement('button');
    itemTypeBtn.classList.add('item-type-btn');
    itemTypeBtn.setAttribute('data-item-type', itemType);
    itemTypeBtn.textContent = itemTypeName;
    itemTypeBtn.setAttribute('popovertargetaction', 'hide');
    itemTypeBtn.addEventListener('click', () => {
      const createdItem = itemTypes[itemType]();
      board.addItem(createdItem);
      eventFireLocation.dispatchEvent(itemCreated);
    })
    popoverCreate.appendChild(itemTypeBtn);
  }
  return popoverCreate;
}