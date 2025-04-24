import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5251/api',
});

export const getTest = () => api.get('/test');

export const apiWorkspaceCreateBoard = (board) => api.post(`/board`, board);
// export const apiWorkspaceDeleteBoard = (boardId) => api.delete(`/workspace/${boardId}`);

export const apiBoardGetById = (boardId) => api.get(`/board/${boardId}`);
export const apiBoardGetAllBoardPublic = () => api.get(`/board`);
export const apiBoardGetAllBoardByWorkspace = (workspaceId) => api.get(`/board/all/${workspaceId}`);

export const apiUserCreateWorkspace = (workspace) => api.post(`/workspace`, workspace);
export const apiGetWorkspace = (workspaceId) => api.get(`/workspace/${workspaceId}`);
export const apiUpdateWorkspace = (workspace, workspaceId) => api.put(`/workspace/${workspaceId}`, workspace);
export const apiUserAllWorkspaceByUser = (userId) => api.get(`/workspace/all/${userId}`);
export const apiGetCard = 0;


export default api;
