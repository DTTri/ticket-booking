type Event = {
  eventId: string;
  name: string;
  description: string;
  category: EventCategory;
  startDateTime: Date;
  endDateTime: Date;
  status: EventStatus;
  venueId: string;
  venueName: string;
  venueAddress: string;
  organizerUserId: string;
  poster: string;
  images: string[];
  details: string;
  createdAt: Date;
  updatedAt: Date;
  sectionPricing: EventSectionPricing[];
};

export type EventSectionPricing = {
  eventId: string;
  sectionId: string;
  price: number;
}

export enum EventCategory{
    CONCERT = "CONCERT",
    MATCH = "MATCH",
    OTHERS = "OTHERS"
}

export enum EventStatus {
  DRAFT = "Draft",
  SUBMIT_FOR_APPROVAL = "Submit for approval",
  PUBLISHED = "Published",
  POSTPONED = "Postponed",
  RESCHEDULED = "Rescheduled",
  CANCELED = "Canceled",
  REJECTED = "Rejected"
}

export default Event;
