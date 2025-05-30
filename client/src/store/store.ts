import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import eventReducer from "./event/eventSlice";
import venueReducer from "./venue/venueSlice";
import bookingReducer from "./booking/bookingSlice";
import paymentReducer from "./payment/paymentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventReducer,
    venues: venueReducer,
    booking: bookingReducer,
    payment: paymentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
        // Allow Date objects in specific paths
        isSerializable: (value: unknown) => {
          // Allow Date objects
          if (value instanceof Date) {
            return true;
          }
          // Use default serialization check for other values
          return (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value) ||
            Object.prototype.toString.call(value) === "[object Object]"
          );
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
