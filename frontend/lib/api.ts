import axios from "axios";

// Single Axios instance used across the app. `withCredentials` lets the
// httpOnly JWT cookie set by the backend travel with every request.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
