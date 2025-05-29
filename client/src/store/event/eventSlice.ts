import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import eventService from "@/services/eventService";
import Event from "@/models/Event";
import { CreateEventDTO, RescheduleEventDTO, UpdateEventDTO } from "@/models/DTO/EventDTO";
import { ErrorHandler } from "@/utils/errorHandler";

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  isLoadingList: boolean;
  isLoadingDetails: boolean;
  isLoadingMutation: boolean; // For create, update, delete
  errorList: string | null;
  errorDetails: string | null;
  errorMutation: string | null;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  isLoadingList: false,
  isLoadingDetails: false,
  isLoadingMutation: false,
  errorList: null,
  errorDetails: null,
  errorMutation: null,
};

// Async Thunks
export const fetchAllEvents = createAsyncThunk<Event[]>(
  "events/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getAllEvents();
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const fetchEventById = createAsyncThunk<Event | null, string>(
  "events/fetchById",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const event = await eventService.getEventById(eventId);
      return event;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const createEvent = createAsyncThunk<Event, CreateEventDTO>(
  "events/addNew",
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventService.createEvent(eventData);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const updateEvent = createAsyncThunk<Event, { eventId: string; eventData: UpdateEventDTO }>(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      return await eventService.updateEvent(eventId, eventData);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const deleteEvent = createAsyncThunk<string, string>( // Returns eventId on success for easier removal from state
  "events/remove",
  async (eventId, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const rescheduleEvent = createAsyncThunk<
  Event,
  { eventId: string; rescheduleData: RescheduleEventDTO }
>("events/reschedule", async ({ eventId, rescheduleData }, { rejectWithValue }) => {
  try {
    return await eventService.rescheduleEvent(eventId, rescheduleData);
  } catch (error) {
    return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
  }
});

export const postponeEvent = createAsyncThunk<Event, string>(
  "events/postpone",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventService.postponeEvent(eventId);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const cancelEvent = createAsyncThunk<Event, string>(
  "events/cancel",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventService.cancelEvent(eventId);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const approveEvent = createAsyncThunk<Event, string>(
  "events/approve",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventService.approveEvent(eventId);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

export const submitEvent = createAsyncThunk<Event, string>(
  "events/submit",
  async (eventId, { rejectWithValue }) => {
    try {
      return await eventService.submitEvent(eventId);
    } catch (error) {
      return rejectWithValue(ErrorHandler.handleAsyncThunkErrorFromCatch(error));
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearCurrentEvent: state => {
      state.currentEvent = null;
      state.errorDetails = null;
    },
    clearMutationError: state => {
      state.errorMutation = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchAllEvents
      .addCase(fetchAllEvents.pending, state => {
        state.isLoadingList = true;
        state.errorList = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.isLoadingList = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.isLoadingList = false;
        state.errorList = action.payload as string;
      })
      // fetchEventById
      .addCase(fetchEventById.pending, state => {
        state.isLoadingDetails = true;
        state.errorDetails = null;
        state.currentEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event | null>) => {
        state.isLoadingDetails = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.errorDetails = action.payload as string;
      })
      // createEvent
      .addCase(createEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        state.events.push(action.payload); // Add to the list
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // updateExistingEvent
      .addCase(updateEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // deleteEvent
      .addCase(deleteEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoadingMutation = false;
        state.events = state.events.filter(event => event.eventId !== action.payload);
        if (state.currentEvent?.eventId === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // rescheduleEvent
      .addCase(rescheduleEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(rescheduleEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(rescheduleEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // postponeEvent
      .addCase(postponeEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(postponeEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(postponeEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // cancelEvent
      .addCase(cancelEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(cancelEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(cancelEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // approveEvent
      .addCase(approveEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(approveEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(approveEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      })
      // submitEvent
      .addCase(submitEvent.pending, state => {
        state.isLoadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(submitEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoadingMutation = false;
        const index = state.events.findIndex(event => event.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(submitEvent.rejected, (state, action) => {
        state.isLoadingMutation = false;
        state.errorMutation = action.payload as string;
      });
  },
});

export const { clearCurrentEvent, clearMutationError } = eventSlice.actions;

export default eventSlice.reducer;
