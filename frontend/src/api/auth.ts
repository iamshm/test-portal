import axios from "axios";
import type {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  User,
} from "../types/auth";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data.user;
  },
};
