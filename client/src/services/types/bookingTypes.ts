import { SeatStatus } from "@/constants/SeatStatus";

export type BookDTO = {
  eventId: string;
  seatIds: string[];
};

// booking response
// {
//   "bookingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "status": "string",
//   "totalPrice": 0,
//   "bookingInitiatedAt": "2025-05-29T14:58:44.896Z",
//   "paymentDeadline": "2025-05-29T14:58:44.896Z"
// }
export type Booking = {
  bookingId: string;
  status: string;
  totalPrice: number;
  bookingInitiatedAt: string;
  paymentDeadline: string;
};

export type BookingSeat = {
  seatId: string;
  status: SeatStatus;
  price: number;
};
