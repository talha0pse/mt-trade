import axios from 'axios';

const api = axios.create({
    baseURL: 'https://copy-trading-backend-ksfs.onrender.com',
});

export default api;
