import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5251/api',
});

export const getTest = () => api.get('/test');


export const apiCreateBoard = () => api.post('/board');

export default api;
