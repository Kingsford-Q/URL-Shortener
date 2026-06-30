import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiErrorMessage(error) {
  return error?.response?.data?.error || error?.message || "Something went wrong";
}

export default client;
