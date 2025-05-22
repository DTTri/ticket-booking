import { UpdateEventDTO } from "@/models/DTO/EventDTO";
import { CreateSectionDTO, CreateVenueDTO, UpdateSectionDTO } from "@/models/DTO/VenueDTO";
import { Section, Venue } from "@/models/Venue";
import axios from "axios";

class VenueService {
  API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8083/api"; // Replace with your actual backend URL

  async getAllVenues() {
    try {
      const response = await axios.get(`${this.API_URL}/venues`);
      return response.data;
    } catch (error: any) {
      console.error("Fetch venues error:", error.response?.data?.message || error.message);
      throw error;
    }
  }

  async getVenueById(venueId: string) {
    try {
      const response = await axios.get(`${this.API_URL}/venues/${venueId}`);
      return response.data;
    } catch (error: any) {
      console.error("Fetch venue by ID error:", error.response?.data?.message || error.message);
      throw error;
    }
  }

  async createVenue(venueData: CreateVenueDTO): Promise<Venue> {
    try {
      const response = await axios.post<any>(`${this.API_URL}`, venueData);
      return response.data;
    } catch (error: any) {
      console.error("Create venue error:", error.response?.data?.message || error.message);
      throw error;
    }
  }

  async updateVenue(venueId: string, venueData: UpdateEventDTO): Promise<Venue> {
    try {
      const response = await axios.put<any>(`${this.API_URL}/${venueId}`, venueData);
      return response.data;
    } catch (error: any) {
      console.error(`Update venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  async deleteVenue(venueId: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/${venueId}`);
    } catch (error: any) {
      console.error(`Delete venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  async getAllSectionsForVenue(venueId: string): Promise<Section[]> {
    try {
      const response = await axios.get<any[]>(`${this.API_URL}/venues}/${venueId}/sections`);
      return response.data;
    } catch (error: any) {
      console.error(`Fetch sections for venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  async getSectionById(venueId: string, sectionId: string): Promise<Section> {
    try {
      const response = await axios.get<any>(`${this.API_URL}/venues/${venueId}/sections/${sectionId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Fetch section (${sectionId}) for venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  async createSection(venueId: string, sectionData: CreateSectionDTO): Promise<Section> {
    try {
      const response = await axios.post<any>(`${this.API_URL}/venues/${venueId}/sections`, sectionData);
      return response.data;
    } catch (error: any) {
      console.error(`Create section for venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  async updateSection(venueId: string, sectionId: string, sectionData: UpdateSectionDTO): Promise<Section> {
    try {
      const response = await axios.put<any>(`${this.API_URL}/venues/${venueId}/sections/${sectionId}`, sectionData);
      return response.data;
    } catch (error: any) {
      console.error(`Update section (${sectionId}) for venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  async deleteSection(venueId: string, sectionId: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/venues/${venueId}/sections/${sectionId}`);
    } catch (error: any) {
      console.error(`Delete section (${sectionId}) for venue (${venueId}) error:`, error.response?.data?.message || error.message);
      throw error;
    }
  }
}

const venueService = new VenueService();
export default venueService;