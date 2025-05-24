import axios from "axios";
import Event, { EventStatus } from "../models/Event";
import { CreateEventDTO, RescheduleEventDTO, UpdateEventDTO } from "../models/DTO/EventDTO";

class EventService {
  API_URL = process.env.EVENT_API_URL || "http://localhost:8081";

  parseEventDates(eventData: any): Event {
    return {
      ...eventData,
      // Đảm bảo createdAt và updatedAt cũng được parse nếu chúng tồn tại và là string date
      createdAt: eventData.createdAt ? new Date(eventData.createdAt) : undefined,
      updatedAt: eventData.updatedAt ? new Date(eventData.updatedAt) : undefined,
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
    };
  }

  async getAllEvents() {
    try {
      const response = await axios.get<Event[]>(`${this.API_URL}/events`);
      return response.data.map(event => this.parseEventDates(event));
    } catch (error: any) {
      console.log("Fetch event error: " + error.response?.data?.message || error.message);

      // Fallback to sample data for development
      const { sampleEvents } = await import("@/libs/place-holder.data");
      console.log("Using sample events data");
      return sampleEvents;
    }
  }

  async createEvent(eventData: CreateEventDTO) {
    try {
      const response = await axios.post<Event>(`${this.API_URL}/events`, eventData);
      return this.parseEventDates(response.data);
    } catch (error: any) {
      console.error("Create event error:", error.response?.data?.message || error.message);
      throw error;
    }
  }

  async getEventById(eventId: string) {
    try {
      const response = await axios.get<Event>(`${this.API_URL}/events/${eventId}`);
      if (response.data) {
        return this.parseEventDates(response.data);
      }
      return null;
    } catch (error: any) {
      console.error(
        `Fetch event by ID (${eventId}) error:`,
        error.response?.data?.message || error.message
      );

      // Fallback to sample data for development
      const { sampleEvents } = await import("@/libs/place-holder.data");
      const sampleEvent = sampleEvents.find(event => event.eventId === eventId);
      if (sampleEvent) {
        console.log(`Using sample data for event ${eventId}`);
        return sampleEvent;
      }

      throw error;
    }
  }

  updateEvent = async (eventId: string, eventData: UpdateEventDTO) => {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}`, eventData);
      return this.parseEventDates(response.data);
    } catch (error: any) {
      console.error(
        `Update event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  async rescheduleEvent(eventId: string, rescheduleEventDTO: RescheduleEventDTO) {
    try {
      const response = await axios.patch<Event>(
        `${this.API_URL}/events/${eventId}/reschedule`,
        rescheduleEventDTO
      );
      return this.parseEventDates(response.data); // Giả sử API trả về Event object
    } catch (error: any) {
      console.error(
        `Reschedule event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const response = await axios.delete(`${this.API_URL}/events/${eventId}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `Delete event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  async cancelEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}/cancel`);
      return this.parseEventDates(response.data);
    } catch (error: any) {
      console.error(
        `Cancel event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  async approveEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}/approve`);
      return this.parseEventDates(response.data);
    } catch (error: any) {
      console.error(
        `Approve event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  async postponeEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}/postpone`);
      return this.parseEventDates(response.data);
    } catch (error: any) {
      console.error(
        `Postpone event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }

  async submitEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(
        `${this.API_URL}/events/${eventId}/submit-for-approval`
      );
      return this.parseEventDates(response.data);
    } catch (error: any) {
      console.error(
        `Submit event (${eventId}) error:`,
        error.response?.data?.message || error.message
      );
      throw error;
    }
  }
}

const eventService = new EventService();

export default eventService;
