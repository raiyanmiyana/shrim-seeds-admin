// src/services/loginService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Vite environment variable

export const loginApi = async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, payload);
    return response.data;
};
