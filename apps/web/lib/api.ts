import axios from "axios";

export const BACKEND_URL = "http://localhost:3003";

export const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});