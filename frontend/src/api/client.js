import axios from "axios";

// Falls back to the current page's hostname with the backend's default dev
// port, so the app works automatically whether you're on localhost or a LAN
// IP (e.g. testing on a phone) without setting VITE_API_URL. Set
// VITE_API_URL explicitly for production, where the API typically lives on
// a different host entirely.
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:4000`;
  }
  return "http://localhost:4000";
}

const client = axios.create({ baseURL: getApiBaseUrl() });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiErrorMessage(error) {
  return error?.response?.data?.error || error?.message || "Something went wrong";
}

export default client;
