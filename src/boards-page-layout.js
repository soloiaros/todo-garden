import createItemsPageLayout from './items-page-layout.js';
import { boardPopover } from './popovers.js';
import './static/styles/boards-screen.css';

export default function renderBoardScreen(LogicController) {
  const mainSection = document.querySelector('main');
  mainSection.id = 'boards';
  mainSection.innerText = '';

  const tilesContainer = document.createElement('div');
  tilesContainer.classList.add('tiles-container');

  // animation related event listeners
  const addAnimationTracking = (tile) => {
    tile.addEventListener('mouseenter', () => {
      if (!tile.classList.contains('tile-hovered')) {
        tile.classList.add('tile-hovered');
      } else if (tile.classList.contains('last-iteration')) {
        tile.classList.remove('last-iteration');
      }
    });
    tile.addEventListener('mouseleave', () => {
      if (!tile.classList.contains('last-iteration')) {
        tile.classList.add('last-iteration');
      }
    });
    tile.addEventListener('animationiteration', () => {
      if (tile.classList.contains('last-iteration')) {
        tile.classList.remove('tile-hovered');
        tile.classList.remove('last-iteration');
      }
    });
  }
  
  const allBoards = LogicController.retrieveBoards();
  for (let board of allBoards) {
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('board-tile');
    boardDiv.addEventListener('click', () => {
      createItemsPageLayout(board);
    });
    const boardTitle = document.createElement('div');
    boardTitle.classList.add('board-name');
    boardTitle.textContent = board.getName();
    boardDiv.appendChild(boardTitle);

    addAnimationTracking(boardDiv);

    tilesContainer.appendChild(boardDiv);
  }
  const trailingTile = document.createElement('div');
  trailingTile.id = 'trailing-tile';
  trailingTile.classList.add('board-tile', 'trailing-tile');
  const trailingTileIndex = Math.ceil(Math.random() * 4);
  trailingTile.addEventListener('click', () => {
    const newBoardPopover = boardPopover(LogicController.user, trailingTile);
    newBoardPopover.setAttribute('anchor', 'trailing-tile');
    mainSection.appendChild(newBoardPopover);
    newBoardPopover.togglePopover();
  })
  trailingTile.addEventListener('newboardcreated', () => {
    renderBoardScreen(LogicController);
  })
  addAnimationTracking(trailingTile);
  mainSection.style.setProperty('--trailing-tile-bg', `url(/images/ground-tiles/tile${trailingTileIndex}.png)`);
  tilesContainer.appendChild(trailingTile);
  mainSection.appendChild(tilesContainer);
}
