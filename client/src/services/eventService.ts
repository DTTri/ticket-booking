import axios from "axios";
import Event from "../models/Event";
import { CreateEventDTO, RescheduleEventDTO, UpdateEventDTO } from "../models/DTO/EventDTO";
import { ErrorHandler } from "@/utils/errorHandler";

class EventService {
  API_URL = process.env.EVENT_API_URL || "http://localhost:8081";

  parseEventDates(
    eventData: Partial<Event> & { startDateTime: string | Date; endDateTime: string | Date }
  ): Event {
    return {
      ...eventData,
      // Đảm bảo createdAt và updatedAt cũng được parse nếu chúng tồn tại và là string date
      createdAt: eventData.createdAt ? new Date(eventData.createdAt) : new Date(),
      updatedAt: eventData.updatedAt ? new Date(eventData.updatedAt) : new Date(),
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
    } as Event;
  }

  async getAllEvents() {
    try {
      const response = await axios.get<Event[]>(`${this.API_URL}/events`);
      return response.data.map(event => this.parseEventDates(event));
    } catch {
      console.warn("Failed to fetch events from API, using sample data");

      // Fallback to sample data for development
      const { sampleEvents } = await import("@/libs/place-holder.data");
      return sampleEvents;
    }
  }

  async createEvent(eventData: CreateEventDTO) {
    try {
      const response = await axios.post<Event>(`${this.API_URL}/events`, eventData);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Create event");
    }
  }

  async getEventById(eventId: string) {
    try {
      const response = await axios.get<Event>(`${this.API_URL}/events/${eventId}`);
      if (response.data) {
        return this.parseEventDates(response.data);
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch event ${eventId} from API, trying sample data`);

      // Fallback to sample data for development
      const { sampleEvents } = await import("@/libs/place-holder.data");
      const sampleEvent = sampleEvents.find(event => event.eventId === eventId);
      if (sampleEvent) {
        return sampleEvent;
      }

      ErrorHandler.handleServiceErrorFromCatch(error, `Fetch event by ID (${eventId})`);
    }
  }

  updateEvent = async (eventId: string, eventData: UpdateEventDTO) => {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}`, eventData);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Update event (${eventId})`);
    }
  };

  async rescheduleEvent(eventId: string, rescheduleEventDTO: RescheduleEventDTO) {
    try {
      const response = await axios.patch<Event>(
        `${this.API_URL}/events/${eventId}/reschedule`,
        rescheduleEventDTO
      );
      return this.parseEventDates(response.data); // Giả sử API trả về Event object
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Reschedule event (${eventId})`);
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const response = await axios.delete(`${this.API_URL}/events/${eventId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Delete event (${eventId})`);
    }
  }

  async cancelEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}/cancel`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Cancel event (${eventId})`);
    }
  }

  async approveEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}/approve`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Approve event (${eventId})`);
    }
  }

  async postponeEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(`${this.API_URL}/events/${eventId}/postpone`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Postpone event (${eventId})`);
    }
  }

  async submitEvent(eventId: string) {
    try {
      const response = await axios.patch<Event>(
        `${this.API_URL}/events/${eventId}/submit-for-approval`
      );
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Submit event (${eventId})`);
    }
  }
}

const eventService = new EventService();

export default eventService;
