export class BoardModel {
  constructor({
    userId = '',
    boardId = '',
    title = '',
    visibility = false,
  } = {}) {
    this.userId = userId;
    this.boardId = boardId;
    this.title = title;
    this.visibility = visibility;
  }

  createList () {

  }

  editBoard () {

  }
}

export default BoardModel;