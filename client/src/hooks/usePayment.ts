import { useCallback } from "react";
import {
  processPayment,
  fetchPaymentById,
  fetchMyPayments,
  fetchPaymentByBookingId,
  requestRefund,
  fetchEventPayments,
  clearCurrentPayment,
  clearCurrentRefund,
  clearMutationError,
  clearListError,
  clearDetailsError,
} from "../store/payment/paymentSlice";
import {
  selectAllPayments,
  selectCurrentPayment,
  selectCurrentPaymentResponse,
  selectAllRefunds,
  selectCurrentRefund,
  selectIsLoadingPaymentsList,
  selectIsLoadingPaymentDetails,
  selectIsLoadingPaymentMutation,
  selectPaymentsListError,
  selectPaymentDetailsError,
  selectPaymentMutationError,
} from "../store/payment/paymentSelector";
import { PaymentDTO, RefundDTO } from "@/models/DTO/PaymentDTO";
import { useAppDispatch, useAppSelector } from "./redux";

/**
 * Hook for processing payments
 */
export const useProcessPayment = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoadingPaymentMutation);
  const error = useAppSelector(selectPaymentMutationError);
  const paymentResponse = useAppSelector(selectCurrentPaymentResponse);

  const processPaymentAction = useCallback(
    async (paymentData: PaymentDTO) => {
      return dispatch(processPayment(paymentData)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearMutationError());
  }, [dispatch]);

  const clearPaymentResponse = useCallback(() => {
    dispatch(clearCurrentPayment());
  }, [dispatch]);

  return {
    processPayment: processPaymentAction,
    paymentResponse,
    isLoading,
    error,
    clearError,
    clearPaymentResponse,
  };
};

/**
 * Hook for fetching payment details
 */
export const usePaymentDetails = () => {
  const dispatch = useAppDispatch();
  const currentPayment = useAppSelector(selectCurrentPayment);
  const isLoading = useAppSelector(selectIsLoadingPaymentDetails);
  const error = useAppSelector(selectPaymentDetailsError);

  const fetchPayment = useCallback(
    async (paymentId: string) => {
      return dispatch(fetchPaymentById(paymentId)).unwrap();
    },
    [dispatch]
  );

  const fetchPaymentByBooking = useCallback(
    async (bookingId: string) => {
      return dispatch(fetchPaymentByBookingId(bookingId)).unwrap();
    },
    [dispatch]
  );

  const clearPayment = useCallback(() => {
    dispatch(clearCurrentPayment());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearDetailsError());
  }, [dispatch]);

  return {
    currentPayment,
    fetchPayment,
    fetchPaymentByBooking,
    isLoading,
    error,
    clearPayment,
    clearError,
  };
};

/**
 * Hook for fetching payment lists
 */
export const usePaymentList = () => {
  const dispatch = useAppDispatch();
  const payments = useAppSelector(selectAllPayments);
  const isLoading = useAppSelector(selectIsLoadingPaymentsList);
  const error = useAppSelector(selectPaymentsListError);

  // const fetchMyPayments = useCallback(async () => {
  //   return dispatch(fetchMyPayments()).unwrap();
  // }, [dispatch]);

  // const fetchEventPayments = useCallback(
  //   async (eventId: string) => {
  //     return dispatch(fetchEventPayments(eventId)).unwrap();
  //   },
  //   [dispatch]
  // );

  const clearError = useCallback(() => {
    dispatch(clearListError());
  }, [dispatch]);

  return {
    payments,
    fetchMyPayments,
    fetchEventPayments,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Hook for refund operations
 */
export const useRefund = () => {
  const dispatch = useAppDispatch();
  const refunds = useAppSelector(selectAllRefunds);
  const currentRefund = useAppSelector(selectCurrentRefund);
  const isLoading = useAppSelector(selectIsLoadingPaymentMutation);
  const error = useAppSelector(selectPaymentMutationError);

  const requestRefundAction = useCallback(
    async (refundData: RefundDTO) => {
      return dispatch(requestRefund(refundData)).unwrap();
    },
    [dispatch]
  );

  const clearRefund = useCallback(() => {
    dispatch(clearCurrentRefund());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearMutationError());
  }, [dispatch]);

  return {
    refunds,
    currentRefund,
    requestRefund: requestRefundAction,
    isLoading,
    error,
    clearRefund,
    clearError,
  };
};

/**
 * Combined hook for all payment operations
 */
export const usePayment = () => {
  const processPaymentHook = useProcessPayment();
  const paymentDetailsHook = usePaymentDetails();
  const paymentListHook = usePaymentList();
  const refundHook = useRefund();

  return {
    ...processPaymentHook,
    ...paymentDetailsHook,
    ...paymentListHook,
    ...refundHook,
  };
};
