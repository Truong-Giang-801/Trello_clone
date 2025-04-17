export class BoardModel {
  constructor({
    userId = '',
    boardId = '',
    title = '',
    visiblity = false,
  } = {}) {
    this.userId = userId;
    this.boardId = boardId;
    this.title = title;
    this.visiblity = visiblity;
  }

  createList () {

  }

  editBoard () {

  }
}

export default BoardModel;