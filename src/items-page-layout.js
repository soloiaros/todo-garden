import createModal from './item-interaction-modal.js';
import './static/styles/items-screen.css';
import { compareDesc, compareAsc } from 'date-fns';
import { createNewItemPopover } from './popovers.js';

const sortItems = (items, sortingOrderParam = null) => {
  const sortingSelect = document.querySelector('#sorting');
  const sortingOrder = sortingOrderParam || (sortingSelect ? sortingSelect.value : null);

  switch (sortingOrder) {
    case 'by-date-created-incr':
      items.sort((item1, item2) => compareDesc(item1.getDateCreated(), item2.getDateCreated()));
      return items;
    case 'by-date-created-dcr':
      items.sort((item1, item2) => compareAsc(item1.getDateCreated(), item2.getDateCreated()));
      return items;
    case 'by-date-changed-incr':
      items.sort((item1, item2) => compareDesc(item1.getDateChanged(), item2.getDateChanged()));
      return items;
    case 'by-date-changed-dcr':
      items.sort((item1, item2) => compareAsc(item1.getDateChanged(), item2.getDateChanged()));
      return items;
    case 'by-name-incr':
      items.sort((item1, item2) => item1.getTitle() > item2.getTitle());
      return items;
    case 'by-name-dcr':
      items.sort((item1, item2) => item2.getTitle() > item1.getTitle());
      return items;
  }
  return items;
}

export default function renderBoardScreen(board, sortPreference = null) {
  const mainSection = document.querySelector('main');
  mainSection.id = 'items';
  mainSection.innerText = '';

  const sortingOptions = {
    'by-date-created-incr': 'Date Added ↑',
    'by-date-created-dcr': 'Date Added ↓',
    'by-date-changed-incr': 'Date Changed ↑',
    'by-date-changed-dcr': 'Date Changed ↓',
    'by-name-incr': 'Title ↑',
    'by-name-dcr': 'Title ↓',
  }
  const screenManagement = document.createElement('div');
  screenManagement.classList.add('screen-management');
  const sortingLabel = document.createElement('label');
  sortingLabel.for = 'sorting';
  const sortingSelect = document.createElement('select');
  sortingSelect.id = 'sorting';
  for (let key in sortingOptions) {
    const sortBy = document.createElement('option');
    sortBy.setAttribute('value', key);
    sortBy.textContent = sortingOptions[key];
    if (key === sortPreference) {
      sortBy.setAttribute('selected', '');
    }
    sortingSelect.appendChild(sortBy);
  }
  sortingLabel.appendChild(sortingSelect);
  screenManagement.appendChild(sortingLabel);
  const hidePanelBtn = document.createElement('button');
  hidePanelBtn.classList.add('hide-upper-panel');
  screenManagement.appendChild(hidePanelBtn);
  sortingSelect.addEventListener('change', (event) => {
    renderBoardScreen(board, event.target.value);
  })
  mainSection.appendChild(screenManagement);
  
  
  const boardName = document.createElement('h1');
  boardName.classList.add('board-name');
  boardName.textContent = board.getName();
  mainSection.appendChild(boardName)

  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('items-container');

  const sortedItems = sortItems(board.getItems(), sortPreference);

  for (let item of sortedItems) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const itemDivInfoContainer = document.createElement('div');
    itemDivInfoContainer.classList.add('item-contents');
    const allItemFields = item.getItemObject();
    itemDiv.classList.add(allItemFields.type);
    for (let key in allItemFields) {
      if (!['type', 'dateCreated', 'dateChanged'].includes(key)) {
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
    // animate on-load
    setTimeout(() => {
      if (!itemDiv.classList.contains('item-hovered')) {
        itemDiv.classList.add('item-hovered');
      }
    }, Math.random() * 300);

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

    const renderItemDialog = () => {
      const itemDialog = createModal(board, item, itemDiv);
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
    }

    itemDiv.addEventListener('click', () => {
      renderItemDialog();
    })

    itemDiv.addEventListener('newlistentry', () => {
      const oldDialog = document.getElementById('item-dialog');
      if (oldDialog) {
        oldDialog.remove();
      }
      renderItemDialog();
    })

    itemsContainer.appendChild(itemDiv);
  }

  const popoverNewItem = createNewItemPopover(board, mainSection);
  mainSection.appendChild(popoverNewItem);

  const addItemBtnContainer = document.createElement('div');
  addItemBtnContainer.classList.add('add-item-btn-container');
  const addItemBtn = document.createElement('button');
  addItemBtnContainer.appendChild(addItemBtn);
  addItemBtn.setAttribute('popovertarget', popoverNewItem.id);
  addItemBtn.setAttribute('aria-label', 'add new item to the board');
  addItemBtn.id = 'add-item-div';
  popoverNewItem.setAttribute('anchor', 'add-item-div');
  itemsContainer.appendChild(addItemBtnContainer);
  mainSection.addEventListener('newemptyitem', () => {
    renderBoardScreen(board);
  })

  mainSection.appendChild(itemsContainer);
}