import { paymentService } from "../paymentService";
import { PaymentDTO, PaymentStatus } from "@/models/DTO/PaymentDTO";

// Mock the base service
jest.mock("../baseService");

describe("PaymentService", () => {
  const mockPaymentData: PaymentDTO = {
    bookingId: "booking-123",
    userId: "user-123",
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    cardNumber: "4242424242424242",
    cardHolderName: "John Doe",
    expiryMonth: "12",
    expiryYear: "2025",
    cvv: "123",
  };

  const mockPaymentResponse = {
    paymentId: "payment-123",
    bookingId: "booking-123",
    amount: 100.0,
    status: PaymentStatus.COMPLETED,
    transactionId: "txn-123",
    paymentMethod: "Credit Card",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("processPayment", () => {
    it("should process payment successfully", async () => {
      // Mock the post method
      const mockPost = jest.fn().mockResolvedValue({ data: mockPaymentResponse });
      (paymentService as any).post = mockPost;

      const result = await paymentService.processPayment(mockPaymentData);

      expect(mockPost).toHaveBeenCalledWith("", mockPaymentData);
      expect(result).toEqual(mockPaymentResponse);
    });

    it("should handle payment processing errors", async () => {
      const mockError = new Error("Payment failed");
      const mockPost = jest.fn().mockRejectedValue(mockError);
      (paymentService as any).post = mockPost;

      await expect(paymentService.processPayment(mockPaymentData)).rejects.toThrow();
    });
  });

  describe("getPaymentById", () => {
    it("should fetch payment details successfully", async () => {
      const mockPaymentDetails = {
        ...mockPaymentResponse,
        eventName: "Test Event",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        tickets: [],
      };

      const mockGet = jest.fn().mockResolvedValue({ data: mockPaymentDetails });
      (paymentService as any).get = mockGet;

      const result = await paymentService.getPaymentById("payment-123");

      expect(mockGet).toHaveBeenCalledWith("/payment-123");
      expect(result).toEqual(mockPaymentDetails);
    });
  });

  describe("getMyPayments", () => {
    it("should fetch user payments successfully", async () => {
      const mockPayments = [mockPaymentResponse];
      const mockGet = jest.fn().mockResolvedValue({ data: mockPayments });
      (paymentService as any).get = mockGet;

      const result = await paymentService.getMyPayments();

      expect(mockGet).toHaveBeenCalledWith("/my-payments");
      expect(result).toEqual(mockPayments);
    });
  });

  describe("requestRefund", () => {
    it("should request refund successfully", async () => {
      const refundData = {
        paymentId: "payment-123",
        reason: "Customer request",
      };

      const mockRefundResponse = {
        refundId: "refund-123",
        paymentId: "payment-123",
        amount: 100.0,
        reason: "Customer request",
        status: "Pending",
        processedAt: "2023-12-01T10:00:00Z",
      };

      const mockPost = jest.fn().mockResolvedValue({ data: mockRefundResponse });
      (paymentService as any).post = mockPost;

      const result = await paymentService.requestRefund(refundData);

      expect(mockPost).toHaveBeenCalledWith("/refund", refundData);
      expect(result).toEqual(mockRefundResponse);
    });
  });
});
