import { useCallback } from "react";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rescheduleEvent,
  postponeEvent,
  cancelEvent,
  submitEvent,
  clearCurrentEvent,
  clearMutationError,
} from "../store/event/eventSlice";
import {
  selectAllEvents,
  selectCurrentEvent,
  selectIsLoadingEventsList,
  selectIsLoadingEventDetails,
  selectIsLoadingEventMutation,
  selectEventsListError,
  selectEventDetailsError,
  selectEventMutationError,
} from "../store/event/eventSelector";
import { CreateEventDTO, RescheduleEventDTO, UpdateEventDTO } from "@/models/DTO/EventDTO";
import { useAppDispatch, useAppSelector } from "./redux";

/**
 * Hook for managing and accessing the list of events.
 */
export const useEventList = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectAllEvents);
  const isLoadingList = useAppSelector(selectIsLoadingEventsList);
  const errorList = useAppSelector(selectEventsListError);

  const loadAllEvents = useCallback(() => {
    return dispatch(fetchAllEvents());
  }, [dispatch]);

  return {
    events,
    isLoadingList,
    error: errorList,
    loadEvents: loadAllEvents,
  };
};

/**
 * Hook for managing and accessing details of a single event.
 */
export const useEventDetails = () => {
  const dispatch = useAppDispatch();
  const currentEvent = useAppSelector(selectCurrentEvent);
  const isLoadingDetails = useAppSelector(selectIsLoadingEventDetails);
  const errorDetails = useAppSelector(selectEventDetailsError);

  const loadEventById = useCallback(
    (eventId: string) => {
      return dispatch(fetchEventById(eventId));
    },
    [dispatch]
  );

  const clearEventDetails = useCallback(() => {
    dispatch(clearCurrentEvent());
  }, [dispatch]);

  return {
    event: currentEvent,
    isLoading: isLoadingDetails,
    error: errorDetails,
    loadEvent: loadEventById,
    clearDetails: clearEventDetails,
  };
};

/**
 * Hook for handling event creation, updates, deletion, and other mutations.
 */
export const useEventMutations = () => {
  const dispatch = useAppDispatch();
  const isLoadingMutation = useAppSelector(selectIsLoadingEventMutation);
  const errorMutation = useAppSelector(selectEventMutationError);

  const createNewEvent = useCallback(
    (eventData: CreateEventDTO) => {
      return dispatch(createEvent(eventData)).unwrap();
    },
    [dispatch]
  );

  const updateExistingEvent = useCallback(
    (eventId: string, eventData: UpdateEventDTO) => {
      return dispatch(updateEvent({ eventId, eventData })).unwrap();
    },
    [dispatch]
  );

  const removeExistingEvent = useCallback(
    (eventId: string) => {
      return dispatch(deleteEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const rescheduleExistingEvent = useCallback(
    (eventId: string, rescheduleData: RescheduleEventDTO) => {
      return dispatch(rescheduleEvent({ eventId, rescheduleData })).unwrap();
    },
    [dispatch]
  );

  const postponeExistingEvent = useCallback(
    (eventId: string) => {
      return dispatch(postponeEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const cancelExistingEvent = useCallback(
    (eventId: string) => {
      return dispatch(cancelEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const submitExistingEvent = useCallback(
    (eventId: string) => {
      return dispatch(submitEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const clearErrorMutation = useCallback(() => {
    dispatch(clearMutationError());
  }, [dispatch]);

  return {
    isLoading: isLoadingMutation,
    error: errorMutation,
    createEvent: createNewEvent,
    updateEvent: updateExistingEvent,
    removeEvent: removeExistingEvent,
    rescheduleEvent: rescheduleExistingEvent,
    postponeEvent: postponeExistingEvent,
    cancelEvent: cancelExistingEvent,
    submitEvent: submitExistingEvent,
    clearError: clearErrorMutation,
  };
};
