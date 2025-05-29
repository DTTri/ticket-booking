import { RootState } from "../store";

// Selectors
export const selectAllEvents = (state: RootState) => state.events.events;
export const selectCurrentEvent = (state: RootState) => state.events.currentEvent;
export const selectIsLoadingEventsList = (state: RootState) => state.events.isLoadingList;
export const selectIsLoadingEventDetails = (state: RootState) => state.events.isLoadingDetails;
export const selectIsLoadingEventMutation = (state: RootState) => state.events.isLoadingMutation;
export const selectEventsListError = (state: RootState) => state.events.errorList;
export const selectEventDetailsError = (state: RootState) => state.events.errorDetails;
export const selectEventMutationError = (state: RootState) => state.events.errorMutation;
