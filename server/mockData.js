import BoardModel from "./models/BoardModel.js";
import WorkspaceModel from "./models/WorkspaceModel.js";


export const Data = {
    workspace: [
        {
            boards: [

            ]
        }
    ],

};

export const workspace = [
    new WorkspaceModel({ id: '0', title: 'w0', description: '', userId: '0' }),
    new WorkspaceModel({ id: '1', title: 'w1', description: '', userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1' }),
    new WorkspaceModel({ id: '2', title: 'w2', description: '', userId: '0' }),
    new WorkspaceModel({ id: '3', title: 'w3', description: '', userId: '0' }),
    new WorkspaceModel({ id: '4', title: 'w4', description: '', userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1' }),
    new WorkspaceModel({ id: '5', title: 'w5', description: '', userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1' }),
    new WorkspaceModel({ id: '6', title: 'w6', description: '', userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1' }),
];

export const boards = [
    new BoardModel({ userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1', boardId: '0', title: 'B1', visibility: true, workspace: '1' }),
    new BoardModel({ userId: '0', boardId: '1', title: 'B1', visibility: true, workspace: '1' }),
    new BoardModel({ userId: '0', boardId: '2', title: 'B2', visibility: true, workspace: '4' }),
    new BoardModel({ userId: '0', boardId: '3', title: 'B3', visibility: true, workspace: '4' }),
    new BoardModel({ userId: '0', boardId: '4', title: 'B4', visibility: true, workspace: '5' }),
    new BoardModel({ userId: '0', boardId: '5', title: 'B5', visibility: true, workspace: '5' }),
    new BoardModel({ userId: '0', boardId: '6', title: 'B6', visibility: false, workspace: '5' }),
    new BoardModel({ userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1', boardId: '7', title: 'B7', visibility: false, workspace: '6' }),
    new BoardModel({ userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1', boardId: '8', title: 'B8', visibility: false, workspace: '6' }),
    new BoardModel({ userId: 'KZPH7SlC2ANj8A8rQyqWyhBbRBh1', boardId: '0', title: 'B9', visibility: false, workspace: '6' }),
];