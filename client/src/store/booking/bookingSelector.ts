import { RootState } from "../store";

// Selectors
export const selectMyBookings = (state: RootState) => state.booking.myBookings;
export const selectCurrentBooking = (state: RootState) => state.booking.currentBooking;
export const selectCurrentEventBookingSeats = (state: RootState) =>
  state.booking.currentEventBookingSeats;
export const selectIsLoadingBookingsList = (state: RootState) => state.booking.isLoadingList;
export const selectIsLoadingBookingDetails = (state: RootState) => state.booking.isLoadingDetails;
export const selectIsLoadingBookingMutation = (state: RootState) => state.booking.isLoadingMutation;
export const selectBookingsListError = (state: RootState) => state.booking.errorList;
export const selectBookingDetailsError = (state: RootState) => state.booking.errorDetails;
export const selectBookingMutationError = (state: RootState) => state.booking.errorMutation;
