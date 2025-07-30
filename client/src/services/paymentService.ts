import { ErrorHandler } from "@/utils/errorHandler";
import BaseService from "./baseService";
import {
  PaymentDTO,
  PaymentResponse,
  PaymentDetails,
  RefundDTO,
  RefundResponse,
} from "@/models/DTO/PaymentDTO";

class PaymentService extends BaseService {
  constructor() {
    super("/Payments", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    });
  }

  /**
   * Process a payment for a booking
   * @param paymentData Payment information
   * @returns Payment response
   */
  async processPayment(paymentData: PaymentDTO): Promise<PaymentResponse> {
    try {
      const response = await this.post<PaymentResponse>("", paymentData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Process payment");
    }
  }

  /**
   * Get payment details by payment ID
   * @param paymentId Payment ID
   * @returns Payment details
   */
  async getPaymentById(paymentId: string): Promise<PaymentDetails> {
    try {
      const response = await this.get<PaymentDetails>(`/${paymentId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get payment details");
    }
  }

  /**
   * Get all payments for the current user
   * @returns Array of payment details
   */
  async getMyPayments(): Promise<PaymentDetails[]> {
    try {
      const response = await this.get<PaymentDetails[]>("/my-payments");
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get my payments");
    }
  }

  /**
   * Get payments by booking ID
   * @param bookingId Booking ID
   * @returns Payment details
   */
  async getPaymentByBookingId(bookingId: string): Promise<PaymentDetails> {
    try {
      const response = await this.get<PaymentDetails>(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get payment by booking ID");
    }
  }

  /**
   * Request a refund for a payment
   * @param refundData Refund information
   * @returns Refund response
   */
  async requestRefund(refundData: RefundDTO): Promise<RefundResponse> {
    try {
      const response = await this.post<RefundResponse>("/refund", refundData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Request refund");
    }
  }

  /**
   * Get refund details by refund ID
   * @param refundId Refund ID
   * @returns Refund response
   */
  async getRefundById(refundId: string): Promise<RefundResponse> {
    try {
      const response = await this.get<RefundResponse>(`/refund/${refundId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get refund details");
    }
  }

  /**
   * Get payment history for an event (admin only)
   * @param eventId Event ID
   * @returns Array of payment details
   */
  async getEventPayments(eventId: string): Promise<PaymentDetails[]> {
    try {
      const response = await this.get<PaymentDetails[]>(`/event/${eventId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get event payments");
    }
  }
}

const paymentService = new PaymentService();
export { paymentService };
export default PaymentService;
