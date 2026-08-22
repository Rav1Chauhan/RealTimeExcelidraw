import axios from "axios";

import { HTTP_BACKEND } from "@/config";

export const api = axios.create({
  baseURL: HTTP_BACKEND,
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