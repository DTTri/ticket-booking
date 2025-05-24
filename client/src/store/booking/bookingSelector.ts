import { RootState } from "../store";

// Selectors
export const selectSelectedSeats = (state: RootState) => state.booking.selectedSeats;
export const selectBookingEventId = (state: RootState) => state.booking.eventId;
export const selectTotalPrice = (state: RootState) => state.booking.totalPrice;
export const selectSelectedSeatsCount = (state: RootState) => state.booking.selectedSeats.length;
