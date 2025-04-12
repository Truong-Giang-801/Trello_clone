class CardModel {
  constructor({
    id = '',
    title = '',
    position = 0,
    dueDate = { _seconds: 0, _nanoseconds: 0 },
  } = {}) {
    this.id = id;
    this.title = title;
    this.position = position;
    this.dueDate = dueDate;
  }

  editCard() {

  }

  assignMember() {

  }
}

module.exports = { CardModel };