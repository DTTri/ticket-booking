import { RootState } from "../store";

// Payment selectors
export const selectAllPayments = (state: RootState) => state.payment.payments;
export const selectCurrentPayment = (state: RootState) => state.payment.currentPayment;
export const selectCurrentPaymentResponse = (state: RootState) =>
  state.payment.currentPaymentResponse;

// Refund selectors
export const selectAllRefunds = (state: RootState) => state.payment.refunds;
export const selectCurrentRefund = (state: RootState) => state.payment.currentRefund;

// Loading selectors
export const selectIsLoadingPaymentsList = (state: RootState) => state.payment.isLoadingList;
export const selectIsLoadingPaymentDetails = (state: RootState) => state.payment.isLoadingDetails;
export const selectIsLoadingPaymentMutation = (state: RootState) => state.payment.isLoadingMutation;

// Error selectors
export const selectPaymentsListError = (state: RootState) => state.payment.errorList;
export const selectPaymentDetailsError = (state: RootState) => state.payment.errorDetails;
export const selectPaymentMutationError = (state: RootState) => state.payment.errorMutation;
