import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format số tiền thành định dạng VNĐ (ví dụ: 350.000 ₫)
 */
export function formatVND(amount?: number | null): string {
  if (amount == null || isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format số tiền USD cho PayPal (ví dụ: $15.00)
 */
export function formatUSD(amount?: number | null): string {
  if (amount == null || isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format ngày tháng năm (ví dụ: 12/09/2026 14:30)
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "--";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Lấy nhãn và màu sắc hiển thị cho OrderStatus
 */
export function getOrderStatusInfo(status?: OrderStatus): {
  label: string;
  className: string;
  bgClass: string;
  textClass: string;
  bgClassName: string;
} {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ xác nhận",
        className: "text-amber-700 border-amber-300 bg-amber-50",
        bgClass: "bg-amber-50",
        textClass: "text-amber-700 border border-amber-200",
        bgClassName: "bg-amber-500",
      };
    case "CONFIRMED":
      return {
        label: "Đã xác nhận",
        className: "text-blue-700 border-blue-300 bg-blue-50",
        bgClass: "bg-blue-50",
        textClass: "text-blue-700 border border-blue-200",
        bgClassName: "bg-blue-500",
      };
    case "SHIPPING":
      return {
        label: "Đang giao hàng",
        className: "text-purple-700 border-purple-300 bg-purple-50",
        bgClass: "bg-purple-50",
        textClass: "text-purple-700 border border-purple-200",
        bgClassName: "bg-purple-500",
      };
    case "COMPLETED":
      return {
        label: "Đã giao thành công",
        className: "text-emerald-700 border-emerald-300 bg-emerald-50",
        bgClass: "bg-emerald-50",
        textClass: "text-emerald-700 border border-emerald-200",
        bgClassName: "bg-emerald-500",
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        className: "text-rose-700 border-rose-300 bg-rose-50",
        bgClass: "bg-rose-50",
        textClass: "text-rose-700 border border-rose-200",
        bgClassName: "bg-rose-500",
      };
    default:
      return {
        label: status || "Không xác định",
        className: "text-gray-700 border-gray-300 bg-gray-50",
        bgClass: "bg-gray-50",
        textClass: "text-gray-700 border border-gray-200",
        bgClassName: "bg-gray-400",
      };
  }
}

/**
 * Lấy nhãn và màu sắc cho PaymentStatus
 */
export function getPaymentStatusInfo(status?: PaymentStatus): {
  label: string;
  className: string;
  bgClass: string;
  textClass: string;
} {
  switch (status) {
    case "PAID":
      return {
        label: "Đã thanh toán",
        className: "text-emerald-700 border-emerald-300 bg-emerald-50",
        bgClass: "bg-emerald-50",
        textClass: "text-emerald-700 border border-emerald-200",
      };
    case "PENDING":
      return {
        label: "Chưa thanh toán",
        className: "text-amber-700 border-amber-300 bg-amber-50",
        bgClass: "bg-amber-50",
        textClass: "text-amber-700 border border-amber-200",
      };
    case "FAILED":
      return {
        label: "Thanh toán thất bại",
        className: "text-rose-700 border-rose-300 bg-rose-50",
        bgClass: "bg-rose-50",
        textClass: "text-rose-700 border border-rose-200",
      };
    case "REFUNDED":
      return {
        label: "Đã hoàn tiền",
        className: "text-gray-700 border-gray-300 bg-gray-50",
        bgClass: "bg-gray-50",
        textClass: "text-gray-700 border border-gray-200",
      };
    default:
      return {
        label: status || "Chưa xác định",
        className: "text-gray-700 border-gray-300 bg-gray-50",
        bgClass: "bg-gray-50",
        textClass: "text-gray-700 border border-gray-200",
      };
  }
}

/**
 * Lấy tên phương thức thanh toán
 */
export function getPaymentMethodLabel(method?: PaymentMethod): string {
  switch (method) {
    case "COD":
      return "Thanh toán khi nhận hàng (COD)";
    case "BANK_TRANSFER":
      return "Chuyển khoản ngân hàng (QR Code)";
    case "VNPAY":
      return "Cổng thanh toán VNPAY";
    case "PAYPAL":
      return "Cổng thanh toán quốc tế PayPal";
    default:
      return method || "COD";
  }
}
