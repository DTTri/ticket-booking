import { Seat as VenueSeat } from "@/models/Venue";
import LegacySeat from "@/models/Seat";

/**
 * Convert from new Venue Seat model to legacy Seat model
 */
export function convertVenueSeatToLegacySeat(venueSeat: VenueSeat, sectionId: string): LegacySeat {
  return {
    SeatId: venueSeat.seatId,
    SectionId: sectionId,
    SeatNumber: venueSeat.seatNumber,
    RowNumber: venueSeat.rowNumber,
    SeatInRow: venueSeat.seatInRow,
  };
}

/**
 * Convert from legacy Seat model to new Venue Seat model
 */
export function convertLegacySeatToVenueSeat(legacySeat: LegacySeat): VenueSeat {
  return {
    seatId: legacySeat.SeatId,
    sectionId: legacySeat.SectionId,
    seatNumber: legacySeat.SeatNumber,
    rowNumber: legacySeat.RowNumber,
    seatInRow: legacySeat.SeatInRow,
    status: "available", // Default status
  };
}

/**
 * Convert array of venue seats to legacy seats
 */
export function convertVenueSeatsToLegacySeats(venueSeats: VenueSeat[], sectionId: string): LegacySeat[] {
  return venueSeats.map(seat => convertVenueSeatToLegacySeat(seat, sectionId));
}

/**
 * Convert array of legacy seats to venue seats
 */
export function convertLegacySeatsToVenueSeats(legacySeats: LegacySeat[]): VenueSeat[] {
  return legacySeats.map(seat => convertLegacySeatToVenueSeat(seat));
}
