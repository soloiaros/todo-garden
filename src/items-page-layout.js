import createModal from './item-interaction-modal.js';
import './static/styles/items-screen.css';
import { createNewItemPopover } from './popovers.js';

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
      console.log('rendering new dialog')
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