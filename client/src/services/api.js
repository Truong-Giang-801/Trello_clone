import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5251/api',
});

export const getTest = () => api.get('/test');

export const apiWorkspaceCreateBoard = (board) => api.post(`/workspace`, board);
export const apiWorkspaceGetAllBoardByUser = (userId) => api.get(`/workspace/${userId}`);

export default api;
