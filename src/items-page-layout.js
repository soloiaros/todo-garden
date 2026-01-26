import './static/styles/items-screen.css';

export default function(board) {
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
    console.log(board.getItems())
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    const allItemFields = item.getItemObject();
    itemDiv.classList.add(allItemFields.type);
    for (let key in allItemFields) {
      const itemInfoField = document.createElement('span');
      itemInfoField.textContent = allItemFields[key];
      itemInfoField.classList.add(key);
      itemDiv.appendChild(itemInfoField);
    }

    // animation-related event listeners
    itemDiv.addEventListener('mouseenter', () => {
      if (!itemDiv.classList.contains('item-hovered')) {
        itemDiv.classList.add('item-hovered');
      }
    })
    itemDiv.addEventListener('animationend', () => {
      itemDiv.classList.remove('item-hovered');
    })

    itemsContainer.appendChild(itemDiv);
  }

  const trailingItem = document.createElement('div');
  trailingItem.classList.add('item', 'trailing-item');
  trailingItem.addEventListener('mouseenter', () => {
      if (!trailingItem.classList.contains('item-hovered')) {
        trailingItem.classList.add('item-hovered');
      }
    })
    trailingItem.addEventListener('animationend', () => {
      trailingItem.classList.remove('item-hovered');
    })
  itemsContainer.appendChild(trailingItem);

  mainSection.appendChild(itemsContainer);
}