import { bookingService } from "@/services/bookingService";
import { BookDTO, Booking, BookingSeat } from "@/services/types/bookingTypes";
import { ErrorHandler } from "@/utils/errorHandler";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface BookingState {
  myBookings: Booking[];
  currentBooking: Booking | null;
  currentEventBookingSeats: BookingSeat[];
  isLoadingList: boolean;
  isLoadingDetails: boolean;
  isLoadingMutation: boolean;
  errorList: string | null;
  errorDetails: string | null;
  errorMutation: string | null;
}

const initialState: BookingState = {
  myBookings: [],
  currentBooking: null,
  currentEventBookingSeats: [],
  isLoadingList: false,
  isLoadingDetails: false,
  isLoadingMutation: false,
  errorList: null,
  errorDetails: null,
  errorMutation: null,
};

// Async Thunks
export const fetchMyBookings = createAsyncThunk<Booking[]>(
  "bookings/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getMyBookings();
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const fetchBookingById = createAsyncThunk<BookingSeat[], string>(
  "bookings/fetchById",
  async (eventId, { rejectWithValue }) => {
    try {
      return await bookingService.getBookingById(eventId);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const bookSeats = createAsyncThunk<Booking, BookDTO>(
  "bookings/bookSeats",
  async (bookingData, { rejectWithValue }) => {
    try {
      return await bookingService.bookSeats(bookingData);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);
export const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearCurrentBooking: state => {
      state.currentBooking = null;
      state.errorDetails = null;
    },
    clearMutationError: state => {
      state.errorMutation = null;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchMyBookings.pending, state => {
        state.isLoadingList = true;
        state.errorList = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoadingList = false;
        state.errorList = action.payload as string;
      })
      .addCase(fetchBookingById.pending, state => {
        state.isLoadingDetails = true;
        state.errorDetails = null;
        state.currentEventBookingSeats = [];
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.currentEventBookingSeats = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.errorDetails = action.payload as string;
      })
      .addCase(bookSeats.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(bookSeats.fulfilled, (state, action) => {
        state.isLoadingMutation = false;
        state.currentBooking = action.payload;
        state.myBookings.push(action.payload);
      })
      .addCase(bookSeats.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      }),
});

export const { clearCurrentBooking, clearMutationError } = bookingSlice.actions;
export default bookingSlice.reducer;
