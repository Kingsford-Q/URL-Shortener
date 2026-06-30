import axios from "axios";

// The deployed backend, used as the default when VITE_API_URL isn't set --
// e.g. if it's missing or misconfigured in the hosting dashboard, the app
// still knows where to find the API instead of failing silently.
const DEPLOYED_API_URL = "https://url-shortener-backend-tj9v.onrender.com";
const LOCAL_HOSTNAME_RE = /^(localhost|127\.0\.0\.1|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;

export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  if (typeof window !== "undefined" && LOCAL_HOSTNAME_RE.test(window.location.hostname)) {
    // Dev convenience: assume the backend runs on the same host (localhost
    // or a LAN IP, e.g. testing on a phone), just on its default port --
    // works without setting anything.
    return `${window.location.protocol}//${window.location.hostname}:4000`;
  }

  return DEPLOYED_API_URL;
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
