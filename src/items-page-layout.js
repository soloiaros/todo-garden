import createModal from './item-interaction-modal.js';
import { listEntry, NoteItem, TODOItem, ListItem, TODOListItem } from './items.js';
import './static/styles/items-screen.css';

export default function renderBoardScreen(board) {
  const mainSection = document.querySelector('main');
  mainSection.id = 'items';
  mainSection.innerText = '';
  
  const boardName = document.createElement('div');
  boardName.classList.add('board-name');
  boardName.textContent = board.getName();
  mainSection.appendChild(boardName)

  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('items-container');

  for (let item of board.getItems()) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const itemDivInfoContainer = document.createElement('div');
    itemDivInfoContainer.classList.add('item-contents');
    const allItemFields = item.getItemObject();
    itemDiv.classList.add(allItemFields.type);
    for (let key in allItemFields) {
      if (key !== 'type') {
        const itemInfoField = document.createElement('span');
        if (key === 'dueDate') {
          itemInfoField.innerText = 'Deadline is on ' + item.getDueDateReadable();
          itemInfoField.innerHTML += '<span>';
          itemInfoField.innerText += item.getTimeToDueDate();
          itemInfoField.innerHTML += '</span>';
        } else if (key === 'entries') {
          for (let entry of allItemFields[key]) {
            const entryPara = document.createElement('p');
            entryPara.textContent = entry.checked ? '☑️ ' : '⏺ ';
            entryPara.textContent += entry.contents;
            itemInfoField.appendChild(entryPara);
          }
        } else {
          itemInfoField.textContent = allItemFields[key];
        }
        itemInfoField.classList.add(key);
        itemDivInfoContainer.appendChild(itemInfoField);
      }
    }

    const decorativeDiv = document.createElement('div');
    decorativeDiv.classList.add('decorative-div');
    itemDiv.appendChild(decorativeDiv);
    itemDiv.appendChild(itemDivInfoContainer);

    // animation-related event listeners
    itemDiv.addEventListener('mouseenter', () => {
      if (!itemDiv.classList.contains('item-hovered')) {
        itemDiv.classList.add('item-hovered');
      }
    });
    itemDiv.addEventListener('animationend', () => {
      itemDiv.classList.remove('item-hovered');
    });

    itemDiv.addEventListener('click', () => {
      const itemDialog = createModal(board, item);
      mainSection.appendChild(itemDialog);
      itemDialog.showModal();
      itemDialog.addEventListener(
        'close',
        () => {
          if (itemDialog.returnValue) {
            const submittedValue = JSON.parse(itemDialog.returnValue);
            item.updateSelf(submittedValue);
          }
          renderBoardScreen(board);
        }
      )
    })

    itemsContainer.appendChild(itemDiv);
  }

  const popoverCreateId = 'create-item-popover';

  const addItemBtnContainer = document.createElement('div');
  addItemBtnContainer.classList.add('add-item-btn-container');
  const addItemBtn = document.createElement('button');
  addItemBtnContainer.appendChild(addItemBtn);
  addItemBtn.setAttribute('popovertarget', popoverCreateId);
  addItemBtn.setAttribute('aria-label', 'add new item to the board');
  itemsContainer.appendChild(addItemBtnContainer);

  // popover for creating new items
  const itemTypes = {
    'note': NoteItem,
    'todo': TODOItem,
    'list': ListItem,
    'todolist': TODOListItem,
  }
  const popoverCreate = document.createElement('div');
  popoverCreate.id = popoverCreateId;
  popoverCreate.setAttribute('popover', '');

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
      renderBoardScreen(board);
    })
    popoverCreate.appendChild(itemTypeBtn);
  }
  mainSection.appendChild(popoverCreate);

  mainSection.appendChild(itemsContainer);
}