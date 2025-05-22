export type CreateEventDTO = {
  title: string;
  description: string;
  category: EventCategory;
  startDateTime: string;
  endDateTime: string;
  venueId: string;
  venueName: string;
  venueAddress: string;
  poster: string;
  images: string[];
  details?: string;
  sectionPricing: SectionPricingDTO[];
};

export type UpdateEventDTO = {
  name?: string;
  description?: string;
  category?: EventCategory;
  venueId?: string;
  venueName?: string;
  venueAddress?: string;
  poster?: string;
  images?: string[];
  details?: string;
};

export type RescheduleEventDTO = {
  newStartDateTime: string;
  newEndDateTime: string;
};


export type SectionPricingDTO = {
    sectionId: string;
    price: number;
};

export enum EventCategory{
    CONCERT = "CONCERT",
    MATCH = "MATCH",
    OTHERS = "OTHERS"
}