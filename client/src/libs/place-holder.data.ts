import Event, { EventCategory, EventStatus } from "@/models/Event";
import Seat from "@/models/Seat";

export const sampleEvents: Event[] = [
  {
    eventId: "1a2b3c4d5e6f7g8h9i0j",
    name: "Music Festival 2025",
    description: "A grand music festival featuring top artists from around the world.",
    category: EventCategory.CONCERT,
    startDateTime: new Date("2025-05-01T18:00:00Z"),
    endDateTime: new Date("2025-05-01T23:00:00Z"),
    status: EventStatus.PUBLISHED,
    venueId: "venue123",
    venueName: "Madison Square Garden",
    venueAddress: "4 Pennsylvania Plaza, New York, NY 10001",
    organizerUserId: "user456",
    poster:
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
    ],
    details:
      "Join us for an unforgettable night of music featuring world-renowned artists. This festival will showcase diverse musical genres and provide an amazing experience for all attendees.",
    createdAt: new Date("2025-04-01T10:00:00Z"),
    updatedAt: new Date("2025-04-10T12:00:00Z"),
    sectionPricing: [
      { eventId: "1a2b3c4d5e6f7g8h9i0j", sectionId: "section-1", price: 50 },
      { eventId: "1a2b3c4d5e6f7g8h9i0j", sectionId: "section-2", price: 75 },
      { eventId: "1a2b3c4d5e6f7g8h9i0j", sectionId: "section-3", price: 100 },
    ],
  },
  {
    eventId: "2b3c4d5e6f7g8h9i0j1a",
    name: "Tech Conference 2025",
    description: "An annual conference showcasing the latest in technology and innovation.",
    category: EventCategory.OTHERS,
    startDateTime: new Date("2025-06-15T09:00:00Z"),
    endDateTime: new Date("2025-06-15T17:00:00Z"),
    status: EventStatus.PUBLISHED,
    venueId: "venue456",
    venueName: "Convention Center",
    venueAddress: "123 Tech Street, San Francisco, CA 94102",
    organizerUserId: "user789",
    poster:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    ],
    details:
      "Discover the latest trends in technology, network with industry leaders, and attend workshops on cutting-edge innovations.",
    createdAt: new Date("2025-03-20T14:00:00Z"),
    updatedAt: new Date("2025-04-05T16:00:00Z"),
    sectionPricing: [
      { eventId: "2b3c4d5e6f7g8h9i0j1a", sectionId: "section-1", price: 150 },
      { eventId: "2b3c4d5e6f7g8h9i0j1a", sectionId: "section-2", price: 200 },
    ],
  },
  {
    eventId: "3c4d5e6f7g8h9i0j1a2b",
    name: "Art Exhibition 2025",
    description: "A showcase of contemporary art from renowned artists.",
    category: EventCategory.OTHERS,
    startDateTime: new Date("2025-07-10T10:00:00Z"),
    endDateTime: new Date("2025-07-20T18:00:00Z"),
    status: EventStatus.PUBLISHED,
    venueId: "venue789",
    venueName: "Metropolitan Art Gallery",
    venueAddress: "456 Art Avenue, New York, NY 10021",
    organizerUserId: "user123",
    poster:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop",
    ],
    details:
      "Experience contemporary art from around the world. This exhibition features paintings, sculptures, and digital art from emerging and established artists.",
    createdAt: new Date("2025-02-15T09:00:00Z"),
    updatedAt: new Date("2025-03-01T11:00:00Z"),
    sectionPricing: [
      { eventId: "3c4d5e6f7g8h9i0j1a2b", sectionId: "section-1", price: 25 },
      { eventId: "3c4d5e6f7g8h9i0j1a2b", sectionId: "section-2", price: 35 },
    ],
  },
  {
    eventId: "4d5e6f7g8h9i0j1a2b3c",
    name: "Championship Football Match",
    description: "The ultimate showdown between two legendary teams.",
    category: EventCategory.MATCH,
    startDateTime: new Date("2025-08-05T19:30:00Z"),
    endDateTime: new Date("2025-08-05T22:00:00Z"),
    status: EventStatus.PUBLISHED,
    venueId: "venue321",
    venueName: "America First Field",
    venueAddress: "9256 S State St, Sandy, UT 84070",
    organizerUserId: "user654",
    poster:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070&auto=format&fit=crop",
    ],
    details:
      "Don't miss this epic championship match! Watch as two powerhouse teams battle it out for the ultimate prize in this season-defining game.",
    createdAt: new Date("2025-04-05T08:00:00Z"),
    updatedAt: new Date("2025-04-12T10:00:00Z"),
    sectionPricing: [
      { eventId: "4d5e6f7g8h9i0j1a2b3c", sectionId: "section-1", price: 80 },
      { eventId: "4d5e6f7g8h9i0j1a2b3c", sectionId: "section-2", price: 120 },
      { eventId: "4d5e6f7g8h9i0j1a2b3c", sectionId: "section-3", price: 150 },
    ],
  },
  {
    eventId: "5e6f7g8h9i0j1a2b3c4d",
    name: "Charity Run 2025",
    description: "A charity run event to raise funds for local communities.",
    category: EventCategory.OTHERS,
    startDateTime: new Date("2025-09-10T06:00:00Z"),
    endDateTime: new Date("2025-09-10T12:00:00Z"),
    status: EventStatus.DRAFT,
    venueId: "venue654",
    venueName: "Central Park",
    venueAddress: "Central Park, New York, NY 10024",
    organizerUserId: "user987",
    poster:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2070&auto=format&fit=crop",
    ],
    details:
      "Join us for a meaningful charity run to support local communities. All proceeds will go towards education and healthcare initiatives.",
    createdAt: new Date("2025-01-10T07:00:00Z"),
    updatedAt: new Date("2025-02-20T09:00:00Z"),
    sectionPricing: [{ eventId: "5e6f7g8h9i0j1a2b3c4d", sectionId: "section-1", price: 30 }],
  },
];

export const sampleSeats: Seat[] = [
  {
    SeatId: "Seat 1",
    SectionId: "Section A1",
    SeatNumber: "Seat 1",
    RowNumber: "Row 1",
    SeatInRow: 10,
  },
  {
    SeatId: "Seat 2",
    SectionId: "Section A2",
    SeatNumber: "Seat 2",
    RowNumber: "Row 2",
    SeatInRow: 20,
  },
  {
    SeatId: "Seat 3",
    SectionId: "Section A3",
    SeatNumber: "Seat 3",
    RowNumber: "Row 3",
    SeatInRow: 30,
  },
];
