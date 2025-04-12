class ListModel {
  constructor({
    id = '',
    title = '',
    position = 0,
  } = {}) {
    this.id = id;
    this.title = title;
    this.position = position;
  }

  createCard() {

  }

  moveList() {

  }
}

module.exports = { ListModel };