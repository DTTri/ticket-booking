import { ErrorHandler } from "@/utils/errorHandler";
import BaseService from "./BaseService";
import { BookDTO, Booking, BookingSeat } from "./types/bookingTypes";

class BookingService extends BaseService {
  constructor() {
    super("/Bookings", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    });
  }

  async bookSeats(bookingData: BookDTO): Promise<Booking> {
    try {
      const response = await this.post<Booking>("", bookingData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Book seats");
    }
  }
  async getMyBookings(): Promise<Booking[]> {
    try {
      const response = await this.get<Booking[]>("");
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Get my bookings");
    }
  }
  async getBookingById(eventId: string): Promise<BookingSeat[]> {
    try {
      const response = await this.get<BookingSeat[]>(`/status/${eventId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Get booking by event ID (${eventId})`);
    }
  }
}
export const bookingService = new BookingService();
