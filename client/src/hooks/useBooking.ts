import {
  selectBookingsListError,
  selectBookingDetailsError,
  selectBookingMutationError,
  selectCurrentBooking,
  selectCurrentEventBookingSeats,
  selectIsLoadingBookingsList,
  selectIsLoadingBookingDetails,
  selectIsLoadingBookingMutation,
  selectMyBookings,
} from "@/store/booking/bookingSelector";
import {
  bookSeats,
  clearCurrentBooking,
  clearMutationError,
  fetchBookingById,
  fetchMyBookings,
} from "@/store/booking/bookingSlice";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { BookDTO } from "@/services/types/bookingTypes";

export const useBookingList = () => {
  const dispatch = useAppDispatch();
  const myBookings = useAppSelector(selectMyBookings);
  const isLoadingList = useAppSelector(selectIsLoadingBookingsList);
  const errorList = useAppSelector(selectBookingsListError);

  const loadMyBookings = useCallback(() => {
    return dispatch(fetchMyBookings());
  }, [dispatch]);

  return {
    myBookings,
    isLoadingList,
    errorList,
    loadMyBookings,
  };
};

export const useBookingDetails = () => {
  const dispatch = useAppDispatch();
  const currentBooking = useAppSelector(selectCurrentBooking);
  const currentEventBookingSeats = useAppSelector(selectCurrentEventBookingSeats);
  const isLoadingDetails = useAppSelector(selectIsLoadingBookingDetails);
  const errorDetails = useAppSelector(selectBookingDetailsError);

  const loadBookingById = useCallback(
    (bookingId: string) => {
      return dispatch(fetchBookingById(bookingId));
    },
    [dispatch]
  );

  const clearBookingDetails = useCallback(() => {
    dispatch(clearCurrentBooking());
  }, [dispatch]);

  return {
    currentBooking,
    currentEventBookingSeats,
    isLoadingDetails,
    errorDetails,
    loadBookingById,
    clearDetails: clearBookingDetails,
  };
};

export const useBookingMutations = () => {
  const dispatch = useAppDispatch();
  const isLoadingMutation = useAppSelector(selectIsLoadingBookingMutation);
  const error = useAppSelector(selectBookingMutationError);

  const bookSeatsForEvent = useCallback(
    (bookingData: BookDTO) => {
      return dispatch(bookSeats(bookingData)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearMutationError());
  }, [dispatch]);

  return {
    isLoadingMutation,
    error,
    bookSeats: bookSeatsForEvent,
    clearError,
  };
};
