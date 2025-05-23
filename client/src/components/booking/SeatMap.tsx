"use client";

import { useState } from "react";
import { sampleVenue } from "./venue-data";
import VenueMapSVG from "./VenueMapSVG";
import Seat from "@/models/Seat";

interface SeatMapProps {
  onSeatSelect?: (seat: Seat) => void;
  selectedSeats?: Seat[];
}

function SeatMap({ onSeatSelect, selectedSeats: externalSelectedSeats }: SeatMapProps) {
  const [internalSelectedSeats, setInternalSelectedSeats] = useState<string[]>([]);

  const selectedSeats = externalSelectedSeats
    ? externalSelectedSeats.map(s => s.SeatId)
    : internalSelectedSeats;

  const handleSeatSelect = (seatId: string) => {
    if (onSeatSelect) {
      for (const section of sampleVenue.sections) {
        for (const row of section.rows) {
          const seat = row.seats.find(s => s.id === seatId);
          if (seat) {
            const appSeat: Seat = {
              SeatId: seat.id,
              SectionId: section.id,
              SeatNumber: seat.number,
              RowNumber: row.name,
              SeatInRow: parseInt(seat.number),
            };
            onSeatSelect(appSeat);
            return;
          }
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
        venue={sampleVenue}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
    </div>
  );
}

export default SeatMap;
