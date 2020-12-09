class Box {
  constructor(){
    this.addBtns = document.querySelectorAll('.add-btn:not(.solid)');
    this.saveItemBtns = document.querySelectorAll('.solid');
    this.addItemContainers = document.querySelectorAll('.add-container');
    this.addItems = document.querySelectorAll('.add-item');
    this.listElements = document.querySelectorAll('.drag-item-list');
  }
}

const box = new Box();