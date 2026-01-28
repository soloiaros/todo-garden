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

export const listEntryPopover = (listItem, eventFireLocation, inputEntry = null) => {
  const popoverCreate = document.createElement('div');
  popoverCreate.id = 'popover-create-entry';
  popoverCreate.setAttribute('popover', '');

  const entryAdded = new CustomEvent('newlistentry');

  const popoverHeader = document.createElement('h4');
  popoverHeader.textContent = !!(inputEntry) ? "Change the entry" : "Let's add new entry!";
  const popoverContents = document.createElement('input');
  popoverContents.type = 'text';
  popoverContents.value = inputEntry ? inputEntry.contents : '';
  const popoverSubmit = document.createElement('button');
  popoverSubmit.textContent = !!(inputEntry) ? 'Apply' : 'Add';
  popoverSubmit.setAttribute('popovertargetaction', 'hide');
  popoverSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    const checkedState = !!(inputEntry) ? inputEntry.checked : false;
    if (!!(inputEntry)) {
      listItem.removeEntry(inputEntry);
    }
    const newEntry = listEntry(popoverContents.value, checkedState);
    listItem.addEntry(newEntry);
    eventFireLocation.dispatchEvent(entryAdded);
  })

  popoverCreate.appendChild(popoverHeader);
  popoverCreate.appendChild(popoverContents);
  popoverCreate.appendChild(popoverSubmit);

  return popoverCreate;
}

export const boardPopover = (user, eventFireLocation, board = null) => {
  const popoverCreate = document.createElement('div');
  popoverCreate.id = 'popover-create-board';
  popoverCreate.setAttribute('popover', '');

  const boardCreated = new CustomEvent('newboardcreated');

  const popoverHeader = document.createElement('h4');
  popoverHeader.textContent = !!(board) ? "Renovate" : "Are we expecting someone? 👀";
  
  const popoverTitleSection = document.createElement('div');
  const boardTitlePara = document.createElement('p');
  boardTitlePara.textContent = 'Title';
  const boardTitle = document.createElement('input');
  boardTitle.type = 'text';
  boardTitle.value = board ? board.getName() : '';
  popoverTitleSection.appendChild(boardTitlePara);
  popoverTitleSection.appendChild(boardTitle);
  
  const popoverDescriptionSection = document.createElement('div');
  const boardDescriptionPara = document.createElement('p');
  boardDescriptionPara.textContent = 'Description';
  const boardDescription = document.createElement('input');
  boardDescription.type = 'text';
  boardDescription.value = !!(board) ? board.getDescription() : '';
  popoverDescriptionSection.appendChild(boardDescriptionPara)
  popoverDescriptionSection.appendChild(boardDescription)
  
  const popoverSubmit = document.createElement('button');
  popoverSubmit.textContent = !!(board) ? 'Apply' : 'Add';
  popoverSubmit.setAttribute('popovertargetaction', 'hide');
  popoverSubmit.addEventListener('click', (event) => {
    if (!!(board)) {
      board.setName(boardTitle.value);
      board.setDescription(boardDescription.value);
      board.setLocalStorageBoardObject();
    } else {
      const newBoard = user.createBoard(boardTitle.value, boardDescription.value);
      newBoard.setLocalStorageBoardObject();
    }
    eventFireLocation.dispatchEvent(boardCreated);
  })

  popoverCreate.appendChild(popoverHeader);
  popoverCreate.appendChild(popoverTitleSection);
  popoverCreate.appendChild(popoverDescriptionSection);
  popoverCreate.appendChild(popoverSubmit);

  return popoverCreate;
}