import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Initialize auth token from localStorage if available
const savedToken = localStorage.getItem("auth_token");
if (savedToken) {
  setAuthToken(savedToken);
}
