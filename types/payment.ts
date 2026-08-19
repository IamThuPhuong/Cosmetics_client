import { OrderStatus, PaymentStatus } from "./order";

export interface PayPalPaymentRequest {
  orderId?: number;
  orderCode?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PayPalPaymentResponse {
  orderCode: string;
  paypalOrderId: string;
  approvalUrl: string;
  amountVnd: number;
  amountUsd: number;
  currency: string;
  status: string;
}

export interface PayPalCaptureRequest {
  paypalOrderId: string;
}

export interface PayPalCaptureResponse {
  orderCode: string;
  paypalOrderId: string;
  captureId: string;
  payerEmail?: string;
  payerName?: string;
  amountUsd: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  message: string;
}

export interface PaymentTransactionResponse {
  id: number;
  orderCode: string;
  paymentMethod: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}
