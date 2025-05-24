import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  setEventId,
  addSeat,
  removeSeat,
  toggleSeat,
  clearSelectedSeats,
  clearBooking,
} from "../store/booking/bookingSlice";
import {
  selectSelectedSeats,
  selectBookingEventId,
  selectTotalPrice,
  selectSelectedSeatsCount,
} from "../store/booking/bookingSelector";
import { Seat } from "@/models/Venue";

/**
 * Hook for managing booking state and seat selection
 */
export const useBooking = () => {
  const dispatch = useAppDispatch();
  const selectedSeats = useAppSelector(selectSelectedSeats);
  const eventId = useAppSelector(selectBookingEventId);
  const totalPrice = useAppSelector(selectTotalPrice);
  const selectedSeatsCount = useAppSelector(selectSelectedSeatsCount);

  const setBookingEventId = useCallback(
    (eventId: string) => {
      dispatch(setEventId(eventId));
    },
    [dispatch]
  );

  const addSeatToBooking = useCallback(
    (seat: Seat, price: number) => {
      dispatch(addSeat({ seat, price }));
    },
    [dispatch]
  );

  const removeSeatFromBooking = useCallback(
    (seatId: string, price: number) => {
      dispatch(removeSeat({ seatId, price }));
    },
    [dispatch]
  );

  const toggleSeatSelection = useCallback(
    (seat: Seat, price: number) => {
      dispatch(toggleSeat({ seat, price }));
    },
    [dispatch]
  );

  const clearAllSelectedSeats = useCallback(() => {
    dispatch(clearSelectedSeats());
  }, [dispatch]);

  const clearAllBookingData = useCallback(() => {
    dispatch(clearBooking());
  }, [dispatch]);

  const isSeatSelected = useCallback(
    (seatId: string) => {
      return selectedSeats.some(seat => seat.seatId === seatId);
    },
    [selectedSeats]
  );

  return {
    selectedSeats,
    eventId,
    totalPrice,
    selectedSeatsCount,
    setEventId: setBookingEventId,
    addSeat: addSeatToBooking,
    removeSeat: removeSeatFromBooking,
    toggleSeat: toggleSeatSelection,
    clearSelectedSeats: clearAllSelectedSeats,
    clearBooking: clearAllBookingData,
    isSeatSelected,
  };
};
