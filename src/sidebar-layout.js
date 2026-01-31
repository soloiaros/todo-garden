import createItemsPageLayout from "./items-page-layout.js";
import { boardPopover } from "./popovers.js";
import { compareDesc } from "date-fns";

export default function (LogicController, renderBoardScreenFunc) {
  const sidebar = document.querySelector(".sidebar-content");

  const mainSection = document.querySelector("main .content");
  const newBoardBtn = document.querySelector(".sidebar button");
  newBoardBtn.addEventListener("click", () => {
    const newBoardPopover = boardPopover(LogicController.user, newBoardBtn);
    mainSection.appendChild(newBoardPopover);
    newBoardPopover.togglePopover();
  });
  newBoardBtn.addEventListener("newboardcreated", () => {
    renderBoardScreenFunc(LogicController);
  });

  const existingBoardsList = sidebar.querySelector(".boards-list");
  if (existingBoardsList) {
    existingBoardsList.remove();
  }

  const sidebarLogo = document.querySelector(".sidebar .logo");
  if (!sidebarLogo.hasAttribute("data-listener-added")) {
    sidebarLogo.addEventListener("click", () => {
      renderBoardScreenFunc(LogicController);
    });
    sidebarLogo.setAttribute("data-listener-added", "true");
  }

  const boardsListSection = document.createElement("ul");
  boardsListSection.classList.add("boards-list");

  const allBoards = LogicController.retrieveBoards();
  allBoards.sort((board1, board2) => {
    return compareDesc(board1.getDateCreated(), board2.getDateCreated());
  });

  for (let board of allBoards) {
    const boardLink = document.createElement("li");
    boardLink.addEventListener("click", () => {
      createItemsPageLayout(board);
    });
    boardLink.textContent = board.getName();
    const boardLastEdited = document.createElement("span");
    boardLastEdited.textContent = board.getDateCreatedReadable();
    boardLink.appendChild(boardLastEdited);

    boardsListSection.appendChild(boardLink);
  }
  sidebar.appendChild(boardsListSection);
}
