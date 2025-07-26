import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  AuthContextType,
  User,
  LoginFormData,
  RegisterFormData,
} from "../types/auth";
import { authApi, setAuthToken } from "../api/auth";

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      setAuthToken(savedToken);
      return savedToken;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(data);
      setToken(response.token);
      setUser(response.user);
      setAuthToken(response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.register(data);
      setToken(response.token);
      setUser(response.user);
      setAuthToken(response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
