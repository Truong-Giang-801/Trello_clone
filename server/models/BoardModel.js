class BoardModel {
  constructor({
    id = '',
    title = '',
    visiblity = false,
  } = {}) {
    this.id = id;
    this.title = title;
    this.visiblity = visiblity;
  }

  createList() {

  }

  editBoard() {

  }
}

module.exports = { BoardModel };