// Venue model for the interactive seat map

export interface Seat {
  seatId: string;
  sectionId: string;
  seatNumber: string;
  rowNumber: string;
  seatInRow: number;
  status?: "available" | "sold" | "pending";
}

export interface Section {
  sectionId: string;
  venueId: string;
  name: string;
  capacity: number;
  seats: Seat[];
  price?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface Venue {
  venueId: string;
  name: string;
  address: string;
  city: string;
  ownerUserId: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}
