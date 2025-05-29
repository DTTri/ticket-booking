"use client";

import { useState } from "react";
import { sampleVenue } from "./venue-data";
import VenueMapSVG from "./VenueMapSVG";
import Seat from "@/models/Seat";

interface SeatMapProps {
  onSeatSelect?: (_seat: Seat) => void;
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
        venue={sampleVenue}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
    </div>
  );
}

export default SeatMap;
