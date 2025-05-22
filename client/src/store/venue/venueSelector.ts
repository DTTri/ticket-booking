import { RootState } from "../store";
import { createSelector } from "@reduxjs/toolkit";

export const selectAllVenues = (state: RootState) => state.venues.venues;
export const selectCurrentVenue = (state: RootState) => state.venues.currentVenue;

export const selectCurrentVenueSections = createSelector(
  [selectCurrentVenue],
  (currentVenue) => currentVenue?.sections || []
);

export const selectIsLoadingVenuesList = (state: RootState) => state.venues.isLoadingList;
export const selectIsLoadingVenueDetails = (state: RootState) => state.venues.isLoadingDetails;
export const selectIsLoadingVenueSections = (state: RootState) => state.venues.isLoadingSections;
export const selectIsLoadingVenueMutation = (state: RootState) => state.venues.isLoadingMutation;

export const selectVenuesListError = (state: RootState) => state.venues.errorList;
export const selectVenueDetailsError = (state: RootState) => state.venues.errorDetails;
export const selectVenueSectionsError = (state: RootState) => state.venues.errorSections;
export const selectVenueMutationError = (state: RootState) => state.venues.errorMutation;