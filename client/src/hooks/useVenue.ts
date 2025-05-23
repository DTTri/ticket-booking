import {
  fetchAllVenues,
  fetchVenueById,
  createNewVenue,
  updateExistingVenue,
  deleteExistingVenue,
  fetchSectionsForVenue,
  createNewSection,
  updateExistingSection,
  deleteExistingSection,
  clearCurrentVenue,
  clearVenueMutationError,
} from "../store/venue/venueSlice";
import {
  selectAllVenues,
  selectCurrentVenue,
  selectCurrentVenueSections,
  selectIsLoadingVenuesList,
  selectIsLoadingVenueDetails,
  selectIsLoadingVenueSections,
  selectIsLoadingVenueMutation,
  selectVenuesListError,
  selectVenueDetailsError,
  selectVenueSectionsError,
  selectVenueMutationError,
} from "../store/venue/venueSelector";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { CreateSectionDTO, CreateVenueDTO, UpdateSectionDTO } from "@/models/DTO/VenueDTO";

export const useVenueList = () => {
  const dispatch = useAppDispatch();
  const venues = useAppSelector(selectAllVenues);
  const isLoadingList = useAppSelector(selectIsLoadingVenuesList);
  const error = useAppSelector(selectVenuesListError);
  const loadVenues = useCallback(() => {
    return dispatch(fetchAllVenues());
  }, [dispatch]);

  return { venues, isLoadingList, error, loadVenues };
};

export const useVenueDetails = () => {
  const dispatch = useAppDispatch();
  const currentVenue = useAppSelector(selectCurrentVenue);
  const sections = useAppSelector(selectCurrentVenueSections);
  const isLoadingDetails = useAppSelector(selectIsLoadingVenueDetails);
  const isLoadingSections = useAppSelector(selectIsLoadingVenueSections);
  const errorDetails = useAppSelector(selectVenueDetailsError);
  const errorSections = useAppSelector(selectVenueSectionsError);

  const loadVenueById = useCallback(
    (venueId: string) => dispatch(fetchVenueById(venueId)),
    [dispatch]
  );
  const loadSectionsForCurrentVenue = useCallback(
    (venueId: string) => dispatch(fetchSectionsForVenue(venueId)),
    [dispatch]
  );
  const clearVenueDetails = useCallback(() => dispatch(clearCurrentVenue()), [dispatch]);

  return {
    venue: currentVenue,
    sections,
    isLoadingDetails,
    isLoadingSections,
    errorDetails,
    errorSections,
    loadVenue: loadVenueById,
    loadSections: loadSectionsForCurrentVenue,
    clearDetails: clearVenueDetails,
  };
};

export const useVenueMutations = () => {
  const dispatch = useAppDispatch();
  const isLoadingMutation = useAppSelector(selectIsLoadingVenueMutation);
  const error = useAppSelector(selectVenueMutationError);

  const createVenue = useCallback(
    (venueData: CreateVenueDTO) => {
      dispatch(createNewVenue(venueData));
    },
    [dispatch]
  );

  const updateVenue = useCallback(
    (venueId: string, venueData: CreateVenueDTO) => {
      dispatch(updateExistingVenue({ venueId, venueData }));
    },
    [dispatch]
  );

  const deleteVenue = useCallback(
    (venueId: string) => {
      dispatch(deleteExistingVenue(venueId));
    },
    [dispatch]
  );

  const createSection = useCallback(
    (venueId: string, sectionData: CreateSectionDTO) => {
      dispatch(createNewSection({ venueId, sectionData }));
    },
    [dispatch]
  );

  const updateSection = useCallback(
    (venueId: string, sectionId: string, sectionData: UpdateSectionDTO) =>
      dispatch(updateExistingSection({ venueId, sectionId, sectionData })).unwrap(),
    [dispatch]
  );
  const removeSection = useCallback(
    (venueId: string, sectionId: string) =>
      dispatch(deleteExistingSection({ venueId, sectionId })).unwrap(),
    [dispatch]
  );
  const clearError = useCallback(() => dispatch(clearVenueMutationError()), [dispatch]);

  return {
    isLoadingMutation,
    error,
    createVenue,
    updateVenue,
    deleteVenue,
    createSection,
    updateSection,
    removeSection,
    clearError,
  };
};
