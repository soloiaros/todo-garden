import createItemsPageLayout from './items-page-layout.js';
import './static/styles/boards-screen.css';

export default function(LogicController) {
  const mainSection = document.querySelector('main');
  mainSection.id = 'boards';
  mainSection.innerText = '';

  const skyDiv = document.createElement('div');
    
  const allBoards = LogicController.retrieveBoards();
  for (let board of allBoards) {
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('board-tile');
    boardDiv.addEventListener('click', () => {
      createItemsPageLayout(board);
    })

    mainSection.appendChild(boardDiv);
  }
  const trailingTile = document.createElement('div');
  trailingTile.classList.add('board-tile', 'trailing-tile');
  const trailingTileIndex = Math.ceil(Math.random() * 4);
  mainSection.style.setProperty('--trailing-tile-bg', `url(/images/ground-tiles/tile${trailingTileIndex}.png)`);
  mainSection.appendChild(trailingTile);
}
