import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // change to your Render URL after deployment
});

export default api;
