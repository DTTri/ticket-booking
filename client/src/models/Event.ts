type Event = {
  eventId: string;
  name: string;
  description: string;
  category: string;
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

type EventSectionPricing = {
  id: string;
  eventId: string;
  sectionId: string;
  price: number;
}


export enum EventStatus {
  DRAFT = "Draft",
  SUBMIT_FOR_APPROVAL = "Submit for approval",
  PUBLISHED = "Published",
  POSTPONED = "Postponed",
  RESCHEDULED = "Rescheduled",
  CANCELED = "Canceled",
}

export default Event;
