import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { paymentService } from "@/services/paymentService";
import {
  PaymentDTO,
  PaymentResponse,
  PaymentDetails,
  RefundDTO,
  RefundResponse,
} from "@/models/DTO/PaymentDTO";
import { ErrorHandler } from "@/utils/errorHandler";

interface PaymentState {
  payments: PaymentDetails[];
  currentPayment: PaymentDetails | null;
  currentPaymentResponse: PaymentResponse | null;
  refunds: RefundResponse[];
  currentRefund: RefundResponse | null;
  isLoadingList: boolean;
  isLoadingDetails: boolean;
  isLoadingMutation: boolean; // For process payment, refund
  errorList: string | null;
  errorDetails: string | null;
  errorMutation: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  currentPaymentResponse: null,
  refunds: [],
  currentRefund: null,
  isLoadingList: false,
  isLoadingDetails: false,
  isLoadingMutation: false,
  errorList: null,
  errorDetails: null,
  errorMutation: null,
};

// Async thunks
export const processPayment = createAsyncThunk<PaymentResponse, PaymentDTO>(
  "payment/processPayment",
  async (paymentData: PaymentDTO, { rejectWithValue }) => {
    try {
      const response = await paymentService.processPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const fetchPaymentById = createAsyncThunk<PaymentDetails, string>(
  "payment/fetchPaymentById",
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentById(paymentId);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const fetchMyPayments = createAsyncThunk<PaymentDetails[], void>(
  "payment/fetchMyPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.getMyPayments();
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const fetchPaymentByBookingId = createAsyncThunk<PaymentDetails, string>(
  "payment/fetchPaymentByBookingId",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentByBookingId(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const requestRefund = createAsyncThunk<RefundResponse, RefundDTO>(
  "payment/requestRefund",
  async (refundData: RefundDTO, { rejectWithValue }) => {
    try {
      const response = await paymentService.requestRefund(refundData);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const fetchEventPayments = createAsyncThunk<PaymentDetails[], string>(
  "payment/fetchEventPayments",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await paymentService.getEventPayments(eventId);
      return response;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearCurrentPayment: state => {
      state.currentPayment = null;
      state.currentPaymentResponse = null;
    },
    clearCurrentRefund: state => {
      state.currentRefund = null;
    },
    clearMutationError: state => {
      state.errorMutation = null;
    },
    clearListError: state => {
      state.errorList = null;
    },
    clearDetailsError: state => {
      state.errorDetails = null;
    },
  },
  extraReducers: builder => {
    builder
      // Process payment
      .addCase(processPayment.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(processPayment.fulfilled, (state, action: PayloadAction<PaymentResponse>) => {
        state.isLoadingMutation = false;
        state.currentPaymentResponse = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })

      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, state => {
        state.isLoadingDetails = true;
        state.errorDetails = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action: PayloadAction<PaymentDetails>) => {
        state.isLoadingDetails = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.errorDetails = action.payload as string;
      })

      // Fetch my payments
      .addCase(fetchMyPayments.pending, state => {
        state.isLoadingList = true;
        state.errorList = null;
      })
      .addCase(fetchMyPayments.fulfilled, (state, action: PayloadAction<PaymentDetails[]>) => {
        state.isLoadingList = false;
        state.payments = action.payload;
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.isLoadingList = false;
        state.errorList = action.payload as string;
      })

      // Fetch payment by booking ID
      .addCase(fetchPaymentByBookingId.pending, state => {
        state.isLoadingDetails = true;
        state.errorDetails = null;
      })
      .addCase(
        fetchPaymentByBookingId.fulfilled,
        (state, action: PayloadAction<PaymentDetails>) => {
          state.isLoadingDetails = false;
          state.currentPayment = action.payload;
        }
      )
      .addCase(fetchPaymentByBookingId.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.errorDetails = action.payload as string;
      })

      // Request refund
      .addCase(requestRefund.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(requestRefund.fulfilled, (state, action: PayloadAction<RefundResponse>) => {
        state.isLoadingMutation = false;
        state.currentRefund = action.payload;
        state.refunds.push(action.payload);
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })

      // Fetch event payments
      .addCase(fetchEventPayments.pending, state => {
        state.isLoadingList = true;
        state.errorList = null;
      })
      .addCase(fetchEventPayments.fulfilled, (state, action: PayloadAction<PaymentDetails[]>) => {
        state.isLoadingList = false;
        state.payments = action.payload;
      })
      .addCase(fetchEventPayments.rejected, (state, action) => {
        state.isLoadingList = false;
        state.errorList = action.payload as string;
      });
  },
});

export const {
  clearCurrentPayment,
  clearCurrentRefund,
  clearMutationError,
  clearListError,
  clearDetailsError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
