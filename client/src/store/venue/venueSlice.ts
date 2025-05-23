import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import venueService from "@/services/venueService";
import { Venue, Section } from "@/models/Venue";
import { CreateVenueDTO, UpdateVenueDTO, CreateSectionDTO, UpdateSectionDTO } from "@/models/DTO/VenueDTO";

interface VenueState {
  venues: Venue[];
  currentVenue: Venue | null;
  isLoadingList: boolean;
  isLoadingDetails: boolean;
  isLoadingSections: boolean;
  isLoadingMutation: boolean;
  errorList: string | null;
  errorDetails: string | null;
  errorSections: string | null;
  errorMutation: string | null;
}

const initialState: VenueState = {
  venues: [],
  currentVenue: null,
  isLoadingList: false,
  isLoadingDetails: false,
  isLoadingSections: false,
  isLoadingMutation: false,
  errorList: null,
  errorDetails: null,
  errorSections: null,
  errorMutation: null,
};

// Venue Thunks
export const fetchAllVenues = createAsyncThunk<Venue[]>("venues/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await venueService.getAllVenues();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch venues");
  }
});

export const fetchVenueById = createAsyncThunk<Venue | null, string>("venues/fetchById", async (venueId, { rejectWithValue }) => {
  try {
    return await venueService.getVenueById(venueId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch venue details");
  }
});

export const createNewVenue = createAsyncThunk<Venue, CreateVenueDTO>("venues/create", async (venueData, { rejectWithValue }) => {
  try {
    return await venueService.createVenue(venueData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to create venue");
  }
});

export const updateExistingVenue = createAsyncThunk<Venue, { venueId: string; venueData: UpdateVenueDTO }>("venues/update", async ({ venueId, venueData }, { rejectWithValue }) => {
  try {
    return await venueService.updateVenue(venueId, venueData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to update venue");
  }
});

export const deleteExistingVenue = createAsyncThunk<string, string>("venues/delete", async (venueId, { rejectWithValue }) => {
  try {
    await venueService.deleteVenue(venueId);
    return venueId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete venue");
  }
});

// Section Thunks
export const fetchSectionsForVenue = createAsyncThunk<{ venueId: string; sections: Section[] }, string>("venues/sections/fetchAll", async (venueId, { rejectWithValue }) => {
  try {
    const sections = await venueService.getAllSectionsForVenue(venueId);
    return { venueId, sections };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch sections");
  }
});

export const createNewSection = createAsyncThunk<Section, { venueId: string; sectionData: CreateSectionDTO }>("venues/sections/create", async ({ venueId, sectionData }, { rejectWithValue }) => {
  try {
    return await venueService.createSection(venueId, sectionData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to create section");
  }
});

export const updateExistingSection = createAsyncThunk<Section, { venueId: string; sectionId: string; sectionData: UpdateSectionDTO }>("venues/sections/update", async ({ venueId, sectionId, sectionData }, { rejectWithValue }) => {
  try {
    return await venueService.updateSection(venueId, sectionId, sectionData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to update section");
  }
});

export const deleteExistingSection = createAsyncThunk<{ venueId: string; sectionId: string }, { venueId: string; sectionId: string }>("venues/sections/delete", async ({ venueId, sectionId }, { rejectWithValue }) => {
  try {
    await venueService.deleteSection(venueId, sectionId);
    return { venueId, sectionId };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete section");
  }
});

const venueSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {
    clearCurrentVenue: state => {
      state.currentVenue = null;
      state.errorDetails = null;
      state.errorSections = null;
    },
    clearVenueMutationError: state => {
      state.errorMutation = null;
    },
  },
  extraReducers: builder => {
    builder
      // Venues
      .addCase(fetchAllVenues.pending, state => { state.isLoadingList = true; state.errorList = null; })
      .addCase(fetchAllVenues.fulfilled, (state, action) => { state.isLoadingList = false; state.venues = action.payload; })
      .addCase(fetchAllVenues.rejected, (state, action) => { state.isLoadingList = false; state.errorList = action.payload as string; })

      .addCase(fetchVenueById.pending, state => { state.isLoadingDetails = true; state.errorDetails = null; state.currentVenue = null; })
      .addCase(fetchVenueById.fulfilled, (state, action) => {
        state.isLoadingDetails = false; state.currentVenue = action.payload;
        if (state.currentVenue && typeof state.currentVenue.sections === 'undefined') {
            // Fetch sections if they are not already loaded
            // Currently, this is a placeholder. Could be a more efficient way to check if sections are already loaded.
            fetchSectionsForVenue(state.currentVenue.venueId);
        }
      })
      .addCase(fetchVenueById.rejected, (state, action) => { state.isLoadingDetails = false; state.errorDetails = action.payload as string; })

      .addCase(createNewVenue.pending, state => { state.isLoadingMutation = true; state.errorMutation = null; })
      .addCase(createNewVenue.fulfilled, (state, action) => { state.isLoadingMutation = false; state.venues.push(action.payload); })
      .addCase(createNewVenue.rejected, (state, action) => { state.isLoadingMutation = false; state.errorMutation = action.payload as string; })

      .addCase(updateExistingVenue.pending, state => { state.isLoadingMutation = true; state.errorMutation = null; })
      .addCase(updateExistingVenue.fulfilled, (state, action) => {
        state.isLoadingMutation = false;
        const index = state.venues.findIndex(v => v.venueId === action.payload.venueId);
        if (index !== -1) state.venues[index] = action.payload;
        if (state.currentVenue?.venueId === action.payload.venueId) state.currentVenue = action.payload;
      })
      .addCase(updateExistingVenue.rejected, (state, action) => { state.isLoadingMutation = false; state.errorMutation = action.payload as string; })

      .addCase(deleteExistingVenue.pending, state => { state.isLoadingMutation = true; state.errorMutation = null; })
      .addCase(deleteExistingVenue.fulfilled, (state, action) => {
        state.isLoadingMutation = false;
        state.venues = state.venues.filter(v => v.venueId !== action.payload);
        if (state.currentVenue?.venueId === action.payload) state.currentVenue = null;
      })
      .addCase(deleteExistingVenue.rejected, (state, action) => { state.isLoadingMutation = false; state.errorMutation = action.payload as string; })

      // Sections
      .addCase(fetchSectionsForVenue.pending, state => { state.isLoadingSections = true; state.errorSections = null; })
      .addCase(fetchSectionsForVenue.fulfilled, (state, action) => {
        state.isLoadingSections = false;
        if (state.currentVenue?.venueId === action.payload.venueId) {
          state.currentVenue.sections = action.payload.sections;
        }
        const venueInList = state.venues.find(v => v.venueId === action.payload.venueId);
        if (venueInList) venueInList.sections = action.payload.sections;
      })
      .addCase(fetchSectionsForVenue.rejected, (state, action) => { state.isLoadingSections = false; state.errorSections = action.payload as string; })

      .addCase(createNewSection.pending, state => { state.isLoadingMutation = true; state.errorMutation = null; })
      .addCase(createNewSection.fulfilled, (state, action) => {
        state.isLoadingMutation = false;
        if (state.currentVenue?.venueId === action.payload.venueId) {
          state.currentVenue.sections = [...(state.currentVenue.sections || []), action.payload];
        }
        const venueInList = state.venues.find(v => v.venueId === action.payload.venueId);
        if (venueInList) venueInList.sections = [...(venueInList.sections || []), action.payload];
      })
      .addCase(createNewSection.rejected, (state, action) => { state.isLoadingMutation = false; state.errorMutation = action.payload as string; })

      .addCase(updateExistingSection.pending, state => { state.isLoadingMutation = true; state.errorMutation = null; })
      .addCase(updateExistingSection.fulfilled, (state, action) => {
        state.isLoadingMutation = false;
        const { venueId, sectionId } = action.payload;
        const update = (sections: Section[]) => sections?.map(s => s.sectionId === sectionId ? action.payload : s);
        if (state.currentVenue?.venueId === venueId) state.currentVenue.sections = update(state.currentVenue.sections);
        const venueInList = state.venues.find(v => v.venueId === venueId);
        if (venueInList) venueInList.sections = update(venueInList.sections);
      })
      .addCase(updateExistingSection.rejected, (state, action) => { state.isLoadingMutation = false; state.errorMutation = action.payload as string; })

      .addCase(deleteExistingSection.pending, state => { state.isLoadingMutation = true; state.errorMutation = null; })
      .addCase(deleteExistingSection.fulfilled, (state, action) => {
        state.isLoadingMutation = false;
        const { venueId, sectionId } = action.payload;
        const filterOut = (sections: Section[]) => sections?.filter(s => s.sectionId !== sectionId) || [];
        if (state.currentVenue?.venueId === venueId) state.currentVenue.sections = filterOut(state.currentVenue.sections);
        const venueInList = state.venues.find(v => v.venueId === venueId);
        if (venueInList) venueInList.sections = filterOut(venueInList.sections);
      })
      .addCase(deleteExistingSection.rejected, (state, action) => { state.isLoadingMutation = false; state.errorMutation = action.payload as string; });
  },
});

export const { clearCurrentVenue, clearVenueMutationError } = venueSlice.actions;
export default venueSlice.reducer;