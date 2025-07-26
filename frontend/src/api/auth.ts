import type {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  User,
} from "../types/auth";
import { apiClient, setAuthToken } from "./client";

export { setAuthToken };

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    return response.data.user;
  },
};
