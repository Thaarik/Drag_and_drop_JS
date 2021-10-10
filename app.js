const searchbar = document.querySelector("#searchBar");
const langlist = document.querySelector("#language-list");
const selectedlist = document.querySelector("#selected-list");
const lists = document.querySelectorAll(".list");
const displayList = document.querySelector(".display-list");
const listitems = document.querySelectorAll(".list-item");
const selected = document.querySelector("#selected-list");
const icon = document.querySelector(".icon");
searchbar.addEventListener("keyup", (e) => {
  let searchlist = langlist.getElementsByTagName("div");
  for (let search of searchlist) {
    console.log(search.innerText);
    if (search.innerText.toLowerCase().indexOf(e.target.value) > -1) {
      search.style.display = "";
    } else {
      search.style.display = "none";
    }
  }
});

listitems.forEach((item) => {
  registerEventsOnList(item);
});

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
    langlist.addEventListener("drop", (e) => {
      e.preventDefault();
      console.log(e.target.classList[1]);
      if (e.target.classList[1] === "selected") {
        displayList.appendChild(draggingCard);
      }
    });

    langlist.appendChild(draggingCard);
  }
});
selectedlist.addEventListener("dragover", (e) => {
  e.preventDefault();
  let draggingCard = document.querySelector(".dragging");
  if (
    e.target.classList[1] === "selected" ||
    e.target.classList[1] === "dragging"
  ) {
    displayList.appendChild(draggingCard);
  }
  //
});

displayList.addEventListener("dragover", (e) => {
  e.preventDefault();
  console.log(e.target);
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
function registerEventsOnList(item) {
  item.addEventListener("dragstart", (e) => {
    item.classList.add("dragging");
  });

  item.addEventListener("dragend", (e) => {
    openDisplay(displayList);
    closeDisplay(displayList);
    item.classList.remove("dragging");
  });
}
function openDisplay(displayList) {
  console.log(selectedlist);
  if (displayList.hasChildNodes()) {
    displayList.classList.add("visibile");
    selectedlist.classList.add("short");
    icon.classList.add("short");
  }
}
function closeDisplay(displayList) {
  console.log(displayList);
  console.log(displayList.children.length === 1);
  if (displayList.children.length === 0) {
    displayList.classList.remove("visibile");
    selectedlist.classList.remove("short");
    icon.classList.remove("short");
  }
}
