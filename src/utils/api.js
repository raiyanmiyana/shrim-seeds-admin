import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Export common functions
const get = (url, config = {}) => api.get(url, config);
const post = (url, data, config = {}) => api.post(url, data, config);
const put = (url, data, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);
const patch = (url, data, config = {}) => api.patch(url, data, config); // ✅ Added

export { get, post, put, del, patch }; // ✅ Exported
