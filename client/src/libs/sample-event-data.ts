import Event from "@/models/Event";
import { Venue, Section, Row, Seat } from "@/models/Venue";

// Sample venue with detailed seating structure
export const sampleVenueForEvent: Venue = {
  venueId: "venue-002",
  name: "MetLife Stadium",
  address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
  capacity: 82500,
  sections: [
    {
      sectionId: "VIP-A",
      sectionName: "VIP Section A",
      rows: [
        {
          rowId: "VIP-A-1",
          rowNumber: "1",
          seats: Array.from({ length: 20 }, (_, i) => ({
            seatId: `VIP-A-1-${i + 1}`,
            sectionId: "VIP-A",
            seatNumber: `${i + 1}`,
            rowNumber: "1",
            seatInRow: i + 1,
            status: i < 5 ? "sold" : "available" as const,
          })),
        },
        {
          rowId: "VIP-A-2",
          rowNumber: "2",
          seats: Array.from({ length: 20 }, (_, i) => ({
            seatId: `VIP-A-2-${i + 1}`,
            sectionId: "VIP-A",
            seatNumber: `${i + 1}`,
            rowNumber: "2",
            seatInRow: i + 1,
            status: i < 8 ? "sold" : "available" as const,
          })),
        },
      ],
    },
    {
      sectionId: "LOWER-101",
      sectionName: "Lower Level 101",
      rows: [
        {
          rowId: "LOWER-101-1",
          rowNumber: "1",
          seats: Array.from({ length: 25 }, (_, i) => ({
            seatId: `LOWER-101-1-${i + 1}`,
            sectionId: "LOWER-101",
            seatNumber: `${i + 1}`,
            rowNumber: "1",
            seatInRow: i + 1,
            status: i < 12 ? "sold" : "available" as const,
          })),
        },
        {
          rowId: "LOWER-101-2",
          rowNumber: "2",
          seats: Array.from({ length: 25 }, (_, i) => ({
            seatId: `LOWER-101-2-${i + 1}`,
            sectionId: "LOWER-101",
            seatNumber: `${i + 1}`,
            rowNumber: "2",
            seatInRow: i + 1,
            status: i < 15 ? "sold" : "available" as const,
          })),
        },
      ],
    },
    {
      sectionId: "UPPER-301",
      sectionName: "Upper Level 301",
      rows: [
        {
          rowId: "UPPER-301-1",
          rowNumber: "1",
          seats: Array.from({ length: 30 }, (_, i) => ({
            seatId: `UPPER-301-1-${i + 1}`,
            sectionId: "UPPER-301",
            seatNumber: `${i + 1}`,
            rowNumber: "1",
            seatInRow: i + 1,
            status: i < 20 ? "sold" : "available" as const,
          })),
        },
      ],
    },
  ],
};

// New sample event data
export const newSampleEvent: Event = {
  eventId: "evt-2024-002",
  name: "Super Bowl LVIII",
  description: "The biggest game of the year! Watch the championship unfold in the most exciting sporting event.",
  category: "MATCH" as const,
  startDateTime: new Date("2024-02-11T18:30:00Z"),
  endDateTime: new Date("2024-02-11T22:00:00Z"),
  venueId: "venue-002",
  venueName: "MetLife Stadium",
  venueAddress: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
  organizerUserId: "org-001",
  poster: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2070&auto=format&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2070&auto=format&fit=crop"
  ],
  details: `
    🏆 SUPER BOWL LVIII - THE ULTIMATE CHAMPIONSHIP EXPERIENCE

    Join us for the most anticipated sporting event of the year! Experience the thrill, excitement, and pageantry of the Super Bowl in one of the world's premier stadiums.

    🎯 What to Expect:
    • Pre-game festivities starting 3 hours before kickoff
    • Spectacular halftime show performance
    • Premium concessions and dining options
    • Official Super Bowl merchandise available
    • Post-game celebration activities

    🎫 Ticket Information:
    • VIP packages include premium seating and exclusive access
    • Lower level seats offer the best field views
    • Upper level provides great value with full stadium views
    • All tickets include access to pre-game activities

    🚗 Getting There:
    • Multiple parking options available (advance booking recommended)
    • Public transportation encouraged
    • Ride-share drop-off zones designated
    • Gates open 3 hours before game time

    📱 Important Notes:
    • Mobile tickets only - no paper tickets
    • Clear bag policy in effect
    • No outside food or beverages
    • Weather contingency plans in place

    Don't miss your chance to be part of history! Secure your seats now for the ultimate football experience.
  `,
  status: "Published" as const,
  sectionPricing: [
    {
      sectionId: "VIP-A",
      price: 2500.00,
    },
    {
      sectionId: "LOWER-101",
      price: 850.00,
    },
    {
      sectionId: "UPPER-301",
      price: 350.00,
    },
  ],
  createdAt: new Date("2024-01-15T10:00:00Z"),
  updatedAt: new Date("2024-01-20T14:30:00Z"),
};

// Concert event example
export const concertEvent: Event = {
  eventId: "evt-2024-003",
  name: "Taylor Swift | The Eras Tour",
  description: "Experience the musical journey through all of Taylor Swift's iconic eras in this spectacular concert event.",
  category: "CONCERT" as const,
  startDateTime: new Date("2024-07-15T19:00:00Z"),
  endDateTime: new Date("2024-07-15T23:00:00Z"),
  venueId: "venue-002",
  venueName: "MetLife Stadium",
  venueAddress: "1 MetLife Stadium Dr, East Rutherford, NJ 07073",
  organizerUserId: "org-002",
  poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop"
  ],
  details: `
    🎵 THE ERAS TOUR - A MUSICAL JOURNEY THROUGH TIME

    Join Taylor Swift for an unforgettable night celebrating her entire musical catalog. From country beginnings to pop anthems, experience every era in this spectacular production.

    ✨ Show Highlights:
    • 3+ hour performance spanning all albums
    • Stunning visual effects and stage production
    • Surprise acoustic songs each night
    • Special guest appearances possible
    • Exclusive tour merchandise

    🎤 Setlist Features Songs From:
    • Taylor Swift (2006) • Fearless (2008) • Speak Now (2010)
    • Red (2012) • 1989 (2014) • Reputation (2017)
    • Lover (2019) • Folklore (2020) • Evermore (2020)
    • Midnights (2022) • And more!

    🎫 Seating Options:
    • VIP packages with meet & greet opportunities
    • Floor seats for the closest experience
    • Stadium seating with excellent sightlines
    • Accessible seating available

    📱 Concert Guidelines:
    • Phones allowed for personal use
    • Professional cameras prohibited
    • Clear bag policy enforced
    • Doors open 2 hours before showtime
  `,
  status: "Published" as const,
  sectionPricing: [
    {
      sectionId: "VIP-A",
      price: 1200.00,
    },
    {
      sectionId: "LOWER-101",
      price: 450.00,
    },
    {
      sectionId: "UPPER-301",
      price: 180.00,
    },
  ],
  createdAt: new Date("2024-01-10T09:00:00Z"),
  updatedAt: new Date("2024-01-25T16:45:00Z"),
};

// Export array of all sample events
export const allSampleEvents = [newSampleEvent, concertEvent];
