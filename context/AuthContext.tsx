"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginRequest, RegisterRequest } from "@/types/auth";
// [Mock Phase 1: Pure UI Template]
const authService = {
  login: async (req: any) => ({ token: "mock-token", username: req.username, role: "ROLE_USER" }),
  getCurrentUser: async () => null,
  register: async (req: any) => ({}),
  logout: async () => {},
};


interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<boolean>;
  register: (request: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo phiên đăng nhập từ localStorage khi app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken?: string) => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.warn("Phiên đăng nhập hết hạn hoặc không hợp lệ:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (request: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authRes = await authService.login(request);
      if (authRes && authRes.token) {
        localStorage.setItem("token", authRes.token);
        setToken(authRes.token);
        // Sau khi có token, lấy thông tin đầy đủ của user
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          // Fallback nếu /me lỗi thì dùng thông tin cơ bản từ authRes
          setUser({
            id: authRes.id || 0,
            username: authRes.username,
            email: authRes.email || "",
            fullName: authRes.username,
            status: "ACTIVE",
            role: {
              id: 1,
              name: authRes.role || (authRes.roles?.[0] as any) || "ROLE_USER",
            },
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (request: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authService.register(request);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  const isAdmin =
    user?.role?.name === "ROLE_ADMIN" ||
    (user as any)?.roles?.includes?.("ROLE_ADMIN");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: !!isAdmin,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
