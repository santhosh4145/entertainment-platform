import axios from 'axios';

const API_URL = 'https://hotbox-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL
});

export default API_URL;