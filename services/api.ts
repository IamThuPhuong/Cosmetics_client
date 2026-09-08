export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data: T;
}

export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null" || token.trim() === "") {
    return null;
  }
  return token;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const method = (config.method || "GET").toUpperCase();
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    console.log(
      `%c[API Request] %c${method} %c${url}`,
      "color: #f43f5e; font-weight: bold;",
      "color: #2563eb; font-weight: bold;",
      "color: #4b5563;",
      config.body ? { body: config.body } : ""
    );
  }

  try {
    const res = await fetch(url, config);
    let json: any = null;

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      json = await res.json();
    } else {
      const text = await res.text();
      json = { status: res.ok ? "success" : "error", message: text, data: null };
    }

    if (isDev) {
      const statusColor = res.ok ? "color: #10b981; font-weight: bold;" : "color: #ef4444; font-weight: bold;";
      console.log(
        `%c[API Response ${res.status}] %c${method} %c${url}`,
        statusColor,
        "color: #2563eb; font-weight: bold;",
        "color: #4b5563;",
        json
      );
    }

    if (!res.ok) {
      const errorMessage =
        json?.message || `Yêu cầu thất bại với mã lỗi HTTP ${res.status}`;
      throw new ApiError(errorMessage, res.status, json?.data);
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    if (isDev && !(error instanceof ApiError)) {
      console.error(
        `%c[API Network Error] %c${method} %c${url}`,
        "color: #ef4444; font-weight: bold;",
        "color: #2563eb; font-weight: bold;",
        "color: #4b5563;",
        error
      );
    }

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error?.message || "Không thể kết nối tới máy chủ backend. Vui lòng kiểm tra lại!"
    );
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>, options?: RequestInit) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const query = searchParams.toString();
      if (query) {
        url += (url.includes("?") ? "&" : "?") + query;
      }
    }
    return request<T>(url, { ...options, method: "GET" });
  },

  post: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch: <T>(
    endpoint: string,
    body?: any,
    params?: Record<string, any>,
    options?: RequestInit
  ) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const query = searchParams.toString();
      if (query) {
        url += (url.includes("?") ? "&" : "?") + query;
      }
    }
    return request<T>(url, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete: <T>(endpoint: string, params?: Record<string, any>, options?: RequestInit) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const query = searchParams.toString();
      if (query) {
        url += (url.includes("?") ? "&" : "?") + query;
      }
    }
    return request<T>(url, { ...options, method: "DELETE" });
  },
};
