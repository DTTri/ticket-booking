// Venue model for the interactive seat map

export interface Seat {
  id: string;
  number: string;
  status: "available" | "sold" | "pending" | "selected";
}

export interface Row {
  id: string;
  name: string;
  seats: Seat[];
}

export interface Section {
  id: string;
  name: string;
  price: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  rows: Row[];
}

export interface Venue {
  id: string;
  name: string;
  sections: Section[];
}
