const searchbar = document.querySelector("#searchBar");
const langlist = document.querySelector("#language-list");
const selectedlist = document.querySelector("#selected-list");
const lists = document.querySelectorAll(".list");
const displayList = document.querySelector(".display-list");
const listitems = document.querySelectorAll(".list-item");
const selected = document.querySelector("#selected-list");
const icon = document.querySelector(".icon");
const trash = document.querySelector(".trash");

//search bar function in language list
searchbar.addEventListener("keyup", (e) => {
  let searchlist = langlist.querySelectorAll(".list-item");
  for (let search of searchlist) {
    if (
      search.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    ) {
      search.style.display = "";
      search.classList.remove("hidden");
    } else {
      search.style.display = "none";
      search.classList.add("hidden");
    }
  }
});

//to make all lists draggable and functio as per their event
listitems.forEach((item) => {
  registerEventsOnList(item);
});

//lists response when dragged over language list section (arrangament and shifting)
langlist.addEventListener("dragover", (e) => {
  e.preventDefault();
  let draggingCard = document.querySelector(".dragging");
  let cardAfterDraggingCard = getCardAfterDraggingCard(langlist, e.clientY);
  if (cardAfterDraggingCard) {
    cardAfterDraggingCard.parentNode.insertBefore(
      draggingCard,
      cardAfterDraggingCard
    );
  } else {
    langlist.addEventListener("drop", (event) => {
      event.preventDefault();
      if (event.target.classList[1] === "selected") {
        displayList.appendChild(draggingCard);
      }
    });
    langlist.appendChild(draggingCard);
  }
});

//lists response when dragged over selection list section (dropping area for all lists)
selectedlist.addEventListener("dragover", (e) => {
  e.preventDefault();
  let draggingCard = document.querySelector(".dragging");
  if (
    e.target.classList[1] === "selected" ||
    e.target.classList[1] === "dragging"
  ) {
    displayList.appendChild(draggingCard);
  }
});

//lists response when dragged inside display list (Arrangement and delete function)
displayList.addEventListener("dragover", (e) => {
  e.preventDefault();
  let drag = displayList.querySelector(".dragging");
  let cc = getCardAfterDraggingCard(displayList, e.clientY);
  if (cc) {
    try {
      cc.parentNode.insertBefore(drag, cc);
    } catch {
      console.log("Cannot add directly on display box");
    }
  } else {
    displayList.appendChild(drag);
  }
});
displayList.addEventListener("drop", (e) => {
  openDisplay(displayList);
});

//function for arrangement of lists inside language list and display list box
function getCardAfterDraggingCard(list, yDraggingCard) {
  let listItem = [...list.querySelectorAll(".list-item:not(.dragging)")];
  return listItem.reduce(
    (closestCard, nextCard) => {
      let nextCardRect = nextCard.getBoundingClientRect();
      let offset = yDraggingCard - nextCardRect.top - nextCardRect.height / 2;
      if (offset < 0 && offset > closestCard.offset) {
        return { offset, element: nextCard };
      } else {
        return closestCard;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//to add functionality when list starts to drag
function registerEventsOnList(item) {
  item.addEventListener("dragstart", (e) => {
    item.classList.add("dragging");
  });
  item.addEventListener("dragend", (e) => {
    openDisplay(displayList);
    closeDisplay(displayList);
    if (e.path[1].classList[0] === "display-list") {
      e.path[0].children[1].children[1].classList.add("visibileTrash");
    } else {
      e.path[0].children[1].children[1].classList.remove("visibileTrash");
    }
    item.classList.remove("dragging");
  });
}

//to make display list appear when we add list
function openDisplay(display) {
  if (display.hasChildNodes()) {
    display.classList.add("visibile");
    selectedlist.classList.add("short");
    icon.classList.add("short");
  }
}

//to make empty display list disappear
function closeDisplay(display) {
  if (display.children.length === 0) {
    display.classList.remove("visibile");
    selectedlist.classList.remove("short");
    icon.classList.remove("short");
  }
}

//delete button functionality
function back(event) {
  if (event.path[4].classList[0] === "display-list") {
    event.path[1].classList.remove("visibileTrash");
    langlist.appendChild(event.path[3]);
  } else if (event.path[3].classList[0] === "display-list") {
    event.path[1].classList.remove("visibileTrash");
    langlist.appendChild(event.path[2]);
  }
  closeDisplay(displayList);
}
