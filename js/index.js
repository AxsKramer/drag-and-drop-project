// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
let updatedOnLoad = false;

let draggedItem;
let dragging = false;
let currentColumn;

document.addEventListener('DOMContentLoaded', () => {
  updateDOM()
  box.listElements.forEach((element,i) => {
    element.setAttribute('ondrop', 'drop(event)');
    element.setAttribute('ondragover', 'allowDrop(event)');
    element.setAttribute('ondragenter', `dragEnter(${i})`);
  })
});

// Get Arrays from localStorage if available, set default values if not
function getDataFromLS() {
  if (localStorage.getItem('backlogItems')) {
    // listArrays.forEach((array,index) => array.push(JSON.parse(`localStorage.${boxNames[index]}Items`)))
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray ];
    // console.log(listArrays)
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray ];
  }
}

// Set localStorage Arrays
function setDataToLS() {
  const boxNames = ['backlog', 'progress', 'complete', 'onHold'];
  boxNames.forEach((name, i) => localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[i])));
}

// Create DOM Elements for each list item
function createListElement(ulElement, nbox, item, index) {
  const listElement = document.createElement('li');
  listElement.classList.add('drag-item');
  listElement.textContent = item;
  listElement.draggable = true;
  listElement.id = index;
  listElement.setAttribute("ondragstart", "drag(event)");
  // listElement.setAttribute('onfocusout', `updateItem(${index}, ${nbox})`);
  // listElement.contentEditable = true;
  ulElement.appendChild(listElement);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getDataFromLS();
  };

  box.listElements.forEach(element => element.textContent = '');

  // Backlog Column
  backlogListArray = backlogListArray.map((backlogItem, index) => {
    createListElement(box.listElements[0], 0, backlogItem, index)
  }).filter(item => item !== null);
  
  // Progress Column
  progressListArray = progressListArray.map((progressItem, index) => {
    createListElement(box.listElements[1], 1, progressItem, index)
  }).filter(item => item !== null);
  
  // Complete Column
  completeListArray = completeListArray.map((completeItem, index) => {
    createListElement(box.listElements[2], 2, completeItem, index)
  }).filter(item => item !== null);

  // On Hold Column
  onHoldListArray = onHoldListArray.map((onHoldItem, index) => {
    createListElement(box.listElements[3], 3, onHoldItem, index)
  }).filter(item => item !== null);
 
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  setDataToLS();
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();     
}

// When Item Enters Column Area
function dragEnter(ul_element) {
  box.listElements[ul_element].classList.add('over');
  currentColumn = ul_element;
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  box.listElements.forEach(ul_element => ul_element.classList.remove('over'));
  // Add item to Column
  const parent = box.listElements[currentColumn];
  parent.appendChild(draggedItem);  
  // // Dragging complete
  dragging = false;
  rebuildArrays();
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = Array.from(box.listElements[0].children).map(item => item.textContent);
  progressListArray = Array.from(box.listElements[1].children).map(item => item.textContent);
  completeListArray = Array.from(box.listElements[2].children).map(item => item.textContent);
  onHoldListArray = Array.from(box.listElements[3].children).map(item => item.textContent);
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray ];
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(column) {
  box.addBtns[column].style.visibility = 'hidden';
  box.saveItemBtns[column].style.display = 'flex';
  box.addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  box.addBtns[column].style.visibility = 'visible';
  box.saveItemBtns[column].style.display = 'none';
  box.addItemContainers[column].style.display = 'none';
  addToColumn(column);
  window.location.reload();
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = box.addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  box.addItems[column].textContent = '';
  updateDOM();
}

// // Update Item - Delete if necessary, or update Array value
// function updateItem(id, column) {
//   const selectedArray = listArrays[column];
//   const selectedColumn = box.listElement[column].children;
//   if (!dragging) {
//     !selectedColumn[id].textContent 
//       ? delete selectedArray[id] 
//       : selectedArray[id] = selectedColumn[id].textContent;
//     updateDOM();
//   }
// }

