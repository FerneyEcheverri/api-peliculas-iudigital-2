import axios from 'axios';

const API = axios.create({
  baseURL: "https://api-peliculas-iudigital-2-backend.onrender.com/api",
});

export default API;
