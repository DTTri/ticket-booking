// Payment DTOs based on API documentation

export interface PaymentDTO {
  bookingId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentResponse {
  paymentId: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  paymentId: string;
  bookingId: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  transactionDate: string;
  amount: number;
  fees: number;
  total: number;
  status: PaymentStatus;
  method: string;
  cardType?: string;
  cardLast4?: string;
  tickets: PaymentTicket[];
  refundable: boolean;
  refundDeadline: string;
  notes: string;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: string;
}

export interface PaymentTicket {
  section: string;
  row: string;
  seat: string;
  price: number;
  quantity: number;
}

export enum PaymentStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  FAILED = "Failed",
  REFUNDED = "Refunded",
}

export interface RefundDTO {
  paymentId: string;
  reason: string;
  amount?: number;
}

export interface RefundResponse {
  refundId: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
  processedAt: string;
}
