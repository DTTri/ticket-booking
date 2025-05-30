"use client";

import { useEffect, useState } from "react";
import VenueMapSVG from "./VenueMapSVG";
import Seat from "@/models/Seat";
import { Venue } from "@/models/Venue";
import { useVenueDetails } from "@/hooks/useVenue";
import { useBookingDetails } from "@/hooks/useBooking";
import { useEventDetails } from "@/hooks/useEvents";

interface SeatMapProps {
  eventId: string;
  onSeatSelect?: (_seat: Seat) => void;
  selectedSeats?: Seat[];
}

function SeatMap({ eventId, onSeatSelect, selectedSeats: externalSelectedSeats }: SeatMapProps) {
  const [venueData, setVenueData] = useState<Venue>({
    venueId: "venue-1",
    name: "America First Field",
    address: "123 Main St",
    city: "Sandy, Utah, USA",
    ownerUserId: "user-1",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-10T12:00:00Z",
    sections: [
      {
        sectionId: "section-1",
        venueId: "venue-1",
        name: "1",
        price: 50,
        x: 70,
        y: 0,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-2",
        name: "2",
        venueId: "venue-1",
        price: 50,
        x: 160,
        y: 0,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-3",
        name: "3",
        venueId: "venue-1",
        price: 50,
        x: 250,
        y: 0,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-4",
        name: "4",
        venueId: "venue-1",
        price: 60,
        x: 340,
        y: 0,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-5",
        name: "5",
        venueId: "venue-1",
        price: 70,
        x: 430,
        y: 0,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      // right sections
      {
        sectionId: "section-6",
        name: "6",
        venueId: "venue-1",
        price: 75,
        x: 600,
        y: 180,
        width: 80,
        height: 160,
        rotation: 90,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-7",
        name: "7",
        venueId: "venue-1",
        price: 80,
        x: 600,
        y: 280,
        width: 80,
        height: 160,
        rotation: 90,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-8",
        name: "8",
        venueId: "venue-1",
        price: 80,
        x: 600,
        y: 380,
        width: 80,
        height: 160,
        rotation: 90,
        capacity: 14 * 8,
        seats: [],
      },
      // bottom sections
      {
        sectionId: "section-9",
        name: "9",
        venueId: "venue-1",
        price: 50,
        x: 70,
        y: 570,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-10",
        name: "10",
        venueId: "venue-1",
        price: 50,
        x: 160,
        y: 570,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-11",
        name: "11",
        venueId: "venue-1",
        price: 50,
        x: 250,
        y: 570,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-12",
        name: "12",
        venueId: "venue-1",
        price: 60,
        x: 340,
        y: 570,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-13",
        name: "13",
        venueId: "venue-1",
        price: 70,
        x: 430,
        y: 570,
        width: 80,
        height: 160,
        capacity: 14 * 8,
        seats: [],
      },
      // left sections
      {
        sectionId: "section-14",
        name: "14",
        venueId: "venue-1",
        price: 75,
        x: -100,
        y: 180,
        width: 80,
        height: 160,
        rotation: 90,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-15",
        name: "15",
        venueId: "venue-1",
        price: 80,
        x: -100,
        y: 280,
        width: 80,
        height: 160,
        rotation: 90,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-16",
        name: "16",
        venueId: "venue-1",
        price: 80,
        x: -100,
        y: 380,
        width: 80,
        height: 160,
        rotation: 90,
        capacity: 14 * 8,
        seats: [],
      },
      // corner sections
      {
        sectionId: "section-17",
        name: "17",
        venueId: "venue-1",
        price: 80,
        x: -80,
        y: 30,
        width: 120,
        height: 160,
        rotation: 315,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-18",
        name: "18",
        venueId: "venue-1",
        price: 75,
        x: 580,
        y: 30,
        width: 120,
        height: 160,
        rotation: 45,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-19",
        name: "19",
        venueId: "venue-1",
        price: 75,
        x: 580,
        y: 530,
        width: 120,
        height: 160,
        rotation: 135,
        capacity: 14 * 8,
        seats: [],
      },
      {
        sectionId: "section-20",
        name: "20",
        venueId: "venue-1",
        price: 80,
        x: -80,
        y: 530,
        width: 120,
        height: 160,
        rotation: 225,
        capacity: 14 * 8,
        seats: [],
      },
    ],
  });
  const [internalSelectedSeats, setInternalSelectedSeats] = useState<string[]>([]);
  const { event } = useEventDetails();
  const { venue } = useVenueDetails();
  const { loadBookingById, currentEventBookingSeats } = useBookingDetails();
  useEffect(() => {
    if (eventId) {
      loadBookingById(eventId);
    }
  }, [eventId, loadBookingById]);
  useEffect(() => {
    if (venue) {
      console.log("currentEventBookingSeats:", currentEventBookingSeats);
      console.log("venue:", venue);
      setVenueData(prev => ({
        ...venue,
        sections: venue.sections.map((section, index) => ({
          ...section,
          price:
            event?.sectionPricing.find(s => s.sectionId === section.sectionId)?.price ||
            section.price,
          capacity: section.seats.length,
          x: prev.sections[index].x,
          y: prev.sections[index].y,
          width: prev.sections[index].width,
          height: prev.sections[index].height,
          rotation: prev.sections[index].rotation,
          seats: section.seats.map(seat => {
            const bookingSeat = currentEventBookingSeats?.find(s => s.seatId === seat.seatId);
            return {
              ...seat,
              status: bookingSeat
                ? bookingSeat.status === "Available"
                  ? "available"
                  : bookingSeat.status === "Sold"
                    ? "sold"
                    : bookingSeat.status === "Reserved"
                      ? "pending"
                      : "available"
                : seat.status || "available",
            };
          }),
        })),
      }));
    }
  }, [eventId, venue, currentEventBookingSeats]);

  useEffect(() => {
    console.log(venueData);
  }, [venueData]);
  const selectedSeats = externalSelectedSeats
    ? externalSelectedSeats.map(s => s.SeatId)
    : internalSelectedSeats;

  const handleSeatSelect = (seatId: string) => {
    if (onSeatSelect) {
      for (const section of venueData.sections) {
        const seat = section.seats.find(s => s.seatId === seatId);
        if (seat) {
          const appSeat: Seat = {
            SeatId: seat.seatId,
            SectionId: section.sectionId,
            SeatNumber: seat.seatNumber,
            RowNumber: seat.rowNumber,
            SeatInRow: parseInt(seat.seatNumber),
          };
          onSeatSelect(appSeat);
          return;
        }
      }
    } else {
      setInternalSelectedSeats(prev => {
        if (prev.includes(seatId)) {
          return prev.filter(id => id !== seatId);
        } else {
          return [...prev, seatId];
        }
      });
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-md shadow-md overflow-hidden">
      <VenueMapSVG
        venue={venueData}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
    </div>
  );
}

export default SeatMap;
