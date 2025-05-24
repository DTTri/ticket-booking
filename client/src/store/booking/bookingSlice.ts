import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Seat } from "@/models/Venue";

interface BookingState {
  selectedSeats: Seat[];
  eventId: string | null;
  totalPrice: number;
}

const initialState: BookingState = {
  selectedSeats: [],
  eventId: null,
  totalPrice: 0,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setEventId: (state, action: PayloadAction<string>) => {
      state.eventId = action.payload;
    },
    addSeat: (state, action: PayloadAction<{ seat: Seat; price: number }>) => {
      const { seat, price } = action.payload;
      const existingSeat = state.selectedSeats.find(s => s.seatId === seat.seatId);
      if (!existingSeat) {
        state.selectedSeats.push(seat);
        state.totalPrice += price;
      }
    },
    removeSeat: (state, action: PayloadAction<{ seatId: string; price: number }>) => {
      const { seatId, price } = action.payload;
      state.selectedSeats = state.selectedSeats.filter(seat => seat.seatId !== seatId);
      state.totalPrice -= price;
    },
    toggleSeat: (state, action: PayloadAction<{ seat: Seat; price: number }>) => {
      const { seat, price } = action.payload;
      const existingSeatIndex = state.selectedSeats.findIndex(s => s.seatId === seat.seatId);
      
      if (existingSeatIndex !== -1) {
        // Remove seat
        state.selectedSeats.splice(existingSeatIndex, 1);
        state.totalPrice -= price;
      } else {
        // Add seat
        state.selectedSeats.push(seat);
        state.totalPrice += price;
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
      state.totalPrice = 0;
    },
    clearBooking: (state) => {
      state.selectedSeats = [];
      state.eventId = null;
      state.totalPrice = 0;
    },
  },
});

export const {
  setEventId,
  addSeat,
  removeSeat,
  toggleSeat,
  clearSelectedSeats,
  clearBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
