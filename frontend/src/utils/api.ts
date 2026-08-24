import axios from "axios";
import { getToken, setAuthToken } from "./auth";

/**
 * Single axios instance for every API call.
 * - baseURL comes from VITE_DOMAIN so call sites stop hand-concatenating URLs
 * - request interceptor attaches the raw token exactly as the backend's
 *   auth middleware expects (no "Bearer " prefix — that's its contract)
 * - response interceptor centralizes 401 recovery: an expired/invalid token
 *   clears auth state, and the route guards react to the auth event by
 *   redirecting to /login instead of every page showing scattered errors
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_DOMAIN,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

export default api;
