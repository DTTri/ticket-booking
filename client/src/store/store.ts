import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import eventReducer from "./event/eventSlice";
import venueReducer from "./venue/venueSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventReducer,
    venues: venueReducer,
  },
  //   middleware: getDefaultMiddleware =>
  //     getDefaultMiddleware({
  //       serializableCheck: false,
  //     }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
