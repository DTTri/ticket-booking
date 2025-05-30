import BaseService from "./baseService";
import { UpdateVenueDTO } from "@/models/DTO/VenueDTO";
import { CreateSectionDTO, CreateVenueDTO, UpdateSectionDTO } from "@/models/DTO/VenueDTO";
import { Section, Venue } from "@/models/Venue";
import { ErrorHandler } from "@/utils/errorHandler";

class VenueService extends BaseService {
  constructor() {
    super("/Venues", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083/api",
    });
  }

  async getAllVenues(): Promise<Venue[]> {
    try {
      const response = await this.get<Venue[]>("");
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Fetch venues");
    }
  }

  async getVenueById(venueId: string): Promise<Venue> {
    try {
      const response = await this.get<Venue>(`/${venueId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Fetch venue by ID");
    }
  }

  async createVenue(venueData: CreateVenueDTO): Promise<Venue> {
    try {
      const response = await this.post<Venue>("", venueData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Create venue");
    }
  }

  async updateVenue(venueId: string, venueData: UpdateVenueDTO): Promise<Venue> {
    try {
      const response = await this.put<Venue>(`/${venueId}`, venueData);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Update venue (${venueId})`);
    }
  }

  async deleteVenue(venueId: string): Promise<void> {
    try {
      await this.delete(`/${venueId}`);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Delete venue (${venueId})`);
    }
  }

  async getAllSectionsForVenue(venueId: string): Promise<Section[]> {
    try {
      // Note: Using different path structure for sections
      const response = await this.get<Section[]>(`/../venues/${venueId}/sections`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Fetch sections for venue (${venueId})`);
    }
  }

  async getSectionById(venueId: string, sectionId: string): Promise<Section> {
    try {
      const response = await this.get<Section>(`/../venues/${venueId}/sections/${sectionId}`);
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
      const response = await this.post<Section>(`/../venues/${venueId}/sections`, sectionData);
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
      const response = await this.put<Section>(
        `/../venues/${venueId}/sections/${sectionId}`,
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
      await this.delete(`/../venues/${venueId}/sections/${sectionId}`);
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
