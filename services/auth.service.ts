import { api } from "./api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserResponse,
} from "@/types/auth";

export const authService = {
  /**
   * Đăng ký tài khoản người dùng mới (POST /api/v1/auth/register)
   */
  register: async (request: RegisterRequest) => {
    const res = await api.post<UserResponse>("/auth/register", request);
    return res.data;
  },

  /**
   * Đăng nhập lấy JWT Token (POST /api/v1/auth/login)
   */
  login: async (request: LoginRequest) => {
    const res = await api.post<AuthResponse>("/auth/login", request);
    return res.data;
  },

  /**
   * Lấy thông tin người dùng hiện tại theo Token (GET /api/v1/auth/me)
   */
  getCurrentUser: async () => {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },
};
