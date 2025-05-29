// Venue DTOs
export interface CreateVenueDTO {
  name: string;
  address: string;
  city: string;
  ownerUserId: string;
}

export interface UpdateVenueDTO {
  name?: string;
  address?: string;
  city?: string;
  ownerUserId: string;
}

// Section DTOs
export interface CreateSectionDTO {
  name: string;
  capacity: number;
  seats: CreateSeatDTO[];
  // Seats might be created separately or as part of section creation.
  // For simplicity, assuming seats are part of section data returned by GET,
  // but not necessarily part of CreateSectionDTO unless API supports it.
}

export interface UpdateSectionDTO {
  name?: string;
  capacity?: number;
}

export interface CreateSeatDTO {
  seatNumber: string;
  rowNumber: string;
  seatInRow: number;
}
