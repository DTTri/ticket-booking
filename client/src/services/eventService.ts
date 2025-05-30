import BaseService from "./baseService";
import Event from "../models/Event";
import { CreateEventDTO, RescheduleEventDTO, UpdateEventDTO } from "../models/DTO/EventDTO";
import { ErrorHandler } from "@/utils/errorHandler";

class EventService extends BaseService {
  constructor() {
    super("/events", {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081",
    });
  }

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

  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await this.get<Event[]>("");
      return response.data.map(event => this.parseEventDates(event));
    } catch {
      console.warn("Failed to fetch events from API, using sample data");
      return [];
    }
  }

  async createEvent(eventData: CreateEventDTO): Promise<Event> {
    try {
      const response = await this.post<Event>("", eventData);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, "Create event");
    }
  }

  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const response = await this.get<Event>(`/${eventId}`);
      if (response.data) {
        return this.parseEventDates(response.data);
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch event ${eventId} from API, trying sample data`);
      ErrorHandler.handleServiceErrorFromCatch(error, `Fetch event by ID (${eventId})`);
    }
  }

  updateEvent = async (eventId: string, eventData: UpdateEventDTO): Promise<Event> => {
    try {
      const response = await this.patch<Event>(`/${eventId}`, eventData);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Update event (${eventId})`);
    }
  };

  async rescheduleEvent(eventId: string, rescheduleEventDTO: RescheduleEventDTO): Promise<Event> {
    try {
      const response = await this.patch<Event>(`/${eventId}/reschedule`, rescheduleEventDTO);
      return this.parseEventDates(response.data); // Giả sử API trả về Event object
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Reschedule event (${eventId})`);
    }
  }

  async deleteEvent(eventId: string): Promise<unknown> {
    try {
      const response = await this.delete(`/${eventId}`);
      return response.data;
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Delete event (${eventId})`);
    }
  }

  async cancelEvent(eventId: string): Promise<Event> {
    try {
      const response = await this.patch<Event>(`/${eventId}/cancel`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Cancel event (${eventId})`);
    }
  }

  async approveEvent(eventId: string): Promise<Event> {
    try {
      const response = await this.patch<Event>(`/${eventId}/approve`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Approve event (${eventId})`);
    }
  }

  async postponeEvent(eventId: string): Promise<Event> {
    try {
      const response = await this.patch<Event>(`/${eventId}/postpone`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Postpone event (${eventId})`);
    }
  }

  async submitEvent(eventId: string): Promise<Event> {
    try {
      const response = await this.patch<Event>(`/${eventId}/submit-for-approval`);
      return this.parseEventDates(response.data);
    } catch (error) {
      ErrorHandler.handleServiceErrorFromCatch(error, `Submit event (${eventId})`);
    }
  }
}

const eventService = new EventService();

export default eventService;
