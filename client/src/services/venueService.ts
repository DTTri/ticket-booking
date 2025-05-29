import { UpdateEventDTO } from "@/models/DTO/EventDTO";
import { CreateSectionDTO, CreateVenueDTO, UpdateSectionDTO } from "@/models/DTO/VenueDTO";
import { Section, Venue } from "@/models/Venue";
import axios from "axios";
import { ErrorHandler } from "@/utils/errorHandler";

class VenueService {
  API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8083/api"; // Replace with your actual backend URL

  async getAllVenues() {
    try {
      const response = await axios.get(`${this.API_URL}/Venues`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Fetch venues");
    }
  }

  async getVenueById(venueId: string) {
    try {
      const response = await axios.get(`${this.API_URL}/Venues/${venueId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Fetch venue by ID");
    }
  }

  async createVenue(venueData: CreateVenueDTO): Promise<Venue> {
    try {
      const response = await axios.post<Venue>(`${this.API_URL}/Venues`, venueData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Create venue");
    }
  }

  async updateVenue(venueId: string, venueData: UpdateEventDTO): Promise<Venue> {
    try {
      const response = await axios.put<Venue>(`${this.API_URL}/Venues/${venueId}`, venueData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Update venue (${venueId})`);
    }
  }

  async deleteVenue(venueId: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/Venues/${venueId}`);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Delete venue (${venueId})`);
    }
  }

  async getAllSectionsForVenue(venueId: string): Promise<Section[]> {
    try {
      const response = await axios.get<Section[]>(`${this.API_URL}/venues/${venueId}/sections`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Fetch sections for venue (${venueId})`);
    }
  }

  async getSectionById(venueId: string, sectionId: string): Promise<Section> {
    try {
      const response = await axios.get<Section>(
        `${this.API_URL}/venues/${venueId}/sections/${sectionId}`
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(
        error,
        `Fetch section (${sectionId}) for venue (${venueId})`
      );
    }
  }

  async createSection(venueId: string, sectionData: CreateSectionDTO): Promise<Section> {
    try {
      const response = await axios.post<Section>(
        `${this.API_URL}/venues/${venueId}/sections`,
        sectionData
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Create section for venue (${venueId})`);
    }
  }

  async updateSection(
    venueId: string,
    sectionId: string,
    sectionData: UpdateSectionDTO
  ): Promise<Section> {
    try {
      const response = await axios.put<Section>(
        `${this.API_URL}/venues/${venueId}/sections/${sectionId}`,
        sectionData
      );
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(
        error,
        `Update section (${sectionId}) for venue (${venueId})`
      );
    }
  }

  async deleteSection(venueId: string, sectionId: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/venues/${venueId}/sections/${sectionId}`);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(
        error,
        `Delete section (${sectionId}) for venue (${venueId})`
      );
    }
  }
}

const venueService = new VenueService();
export default venueService;
