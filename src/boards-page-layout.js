import createItemsPageLayout from "./items-page-layout.js";
import createSidebarLayout from "./sidebar-layout.js";
import { boardPopover } from "./popovers.js";
import { compareDesc } from "date-fns";
import { TILEIMAGEROOT } from "./shared-values.js";
import "./static/styles/boards-screen.css";

export default function renderBoardScreen(LogicController) {
  document.startViewTransition(() => {
    createSidebarLayout(LogicController, renderBoardScreen);

    const mainSection = document.querySelector("main .content");
    mainSection.id = "boards";
    mainSection.innerText = "";

    const tilesContainer = document.createElement("div");
    tilesContainer.classList.add("tiles-container");

    // animation related event listeners
    const addAnimationTracking = (tile) => {
      tile.addEventListener("mouseenter", () => {
        if (!tile.classList.contains("tile-hovered")) {
          tile.classList.add("tile-hovered");
        } else if (tile.classList.contains("last-iteration")) {
          tile.classList.remove("last-iteration");
        }
      });
      tile.addEventListener("mouseleave", () => {
        if (!tile.classList.contains("last-iteration")) {
          tile.classList.add("last-iteration");
        }
      });
      tile.addEventListener("animationiteration", () => {
        if (tile.classList.contains("last-iteration")) {
          tile.classList.remove("tile-hovered");
          tile.classList.remove("last-iteration");
        }
      });
    };

    const trailingTile = document.createElement("div");
    trailingTile.id = "trailing-tile";
    trailingTile.classList.add("board-tile", "trailing-tile");
    const trailingTileIndex = Math.ceil(Math.random() * 4);
    trailingTile.addEventListener("click", () => {
      const newBoardPopover = boardPopover(LogicController.user, trailingTile);
      newBoardPopover.setAttribute("anchor", "trailing-tile");
      mainSection.appendChild(newBoardPopover);
      newBoardPopover.togglePopover();
    });
    trailingTile.addEventListener("newboardcreated", () => {
      renderBoardScreen(LogicController);
    });
    addAnimationTracking(trailingTile);
    mainSection.style.setProperty(
      "--trailing-tile-bg",
      `url(./images/ground-tiles/tile${trailingTileIndex}.png)`,
    );
    tilesContainer.appendChild(trailingTile);
    mainSection.appendChild(tilesContainer);

    const allBoards = LogicController.retrieveBoards();
    // Sort the boards list, so that the newest board is always the first
    allBoards.sort((board1, board2) => {
      return compareDesc(board1.getDateCreated(), board2.getDateCreated());
    });

    for (let board of allBoards) {
      const boardDiv = document.createElement("div");
      boardDiv.classList.add("board-tile");
      boardDiv.addEventListener("click", () => {
        createItemsPageLayout(board);
      });
      boardDiv.style.setProperty(
        "--board-bg-image",
        `url(${TILEIMAGEROOT}${board.getBoardTexture()})`,
      );
      const boardTitle = document.createElement("div");
      boardTitle.classList.add("board-name");
      boardTitle.textContent = board.getName();
      boardDiv.appendChild(boardTitle);

      addAnimationTracking(boardDiv);

      tilesContainer.appendChild(boardDiv);
    }
  });
}
