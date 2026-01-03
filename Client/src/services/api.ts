import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // ⏱ 30 seconds (Render cold start safe)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
