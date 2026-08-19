export type Role = "ROLE_USER" | "ROLE_ADMIN" | "ROLE_CSKH" | "ROLE_WAREHOUSE";
export type UserStatus = "ACTIVE" | "LOCKED";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  skinType?: string;
  status: UserStatus;
  role?: {
    id: number;
    name: Role;
    description?: string;
  };
  createdAt?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  skinType?: string;
  roleId?: number;
  roleName?: Role;
  status: UserStatus;
  createdAt?: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
  skinType?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id?: number;
  username: string;
  email?: string;
  roles?: string[];
  role?: Role;
}

export interface UserFilterParams {
  keyword?: string;
  roleId?: number;
  role?: Role;
  roleName?: Role;
  status?: UserStatus;
  page?: number;
  size?: number;
  sort?: string;
}
