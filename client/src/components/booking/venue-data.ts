import { Venue, Row, Seat } from "@/models/Venue";

const generateRows = (sectionId: string, numRows: number, seatsPerRow: number): Row[] => {
  const rows: Row[] = [];
  const rowNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < numRows; i++) {
    const rowName = rowNames[i];
    const seats: Seat[] = [];

    for (let j = 1; j <= seatsPerRow; j++) {
      const randomStatus = Math.random();
      let status: "available" | "sold" | "pending" = "available";

      if (randomStatus < 0.2) {
        status = "sold";
      } else if (randomStatus < 0.3) {
        status = "pending";
      }

      seats.push({
        id: `${sectionId}-${rowName}-${j}`,
        number: j.toString(),
        status,
      });
    }

    rows.push({
      id: `${sectionId}-${rowName}`,
      name: rowName,
      seats,
    });
  }

  return rows;
};

export const sampleVenue: Venue = {
  id: "venue-1",
  name: "America First Field",
  sections: [
    // top sections
    {
      id: "section-1",
      name: "1",
      price: 50,
      x: 70,
      y: 0,
      width: 80,
      height: 160,
      rows: generateRows("section-1", 14, 8),
    },
    {
      id: "section-2",
      name: "2",
      price: 50,
      x: 160,
      y: 0,
      width: 80,
      height: 160,
      rows: generateRows("section-2", 14, 8),
    },
    {
      id: "section-3",
      name: "3",
      price: 50,
      x: 250,
      y: 0,
      width: 80,
      height: 160,
      rows: generateRows("section-3", 14, 8),
    },
    {
      id: "section-4",
      name: "4",
      price: 60,
      x: 340,
      y: 0,
      width: 80,
      height: 160,
      rows: generateRows("section-4", 14, 8),
    },
    {
      id: "section-5",
      name: "5",
      price: 70,
      x: 430,
      y: 0,
      width: 80,
      height: 160,
      rows: generateRows("section-5", 14, 8),
    },
    // right sections
    {
      id: "section-6",
      name: "6",
      price: 75,
      x: 600,
      y: 180,
      width: 80,
      height: 160,
      rotation: 90,
      rows: generateRows("section-6", 14, 8),
    },
    {
      id: "section-7",
      name: "7",
      price: 80,
      x: 600,
      y: 280,
      width: 80,
      height: 160,
      rotation: 90,
      rows: generateRows("section-7", 14, 8),
    },
    {
      id: "section-8",
      name: "8",
      price: 80,
      x: 600,
      y: 380,
      width: 80,
      height: 160,
      rotation: 90,
      rows: generateRows("section-8", 14, 8),
    },
    // bottom sections
    {
      id: "section-9",
      name: "9",
      price: 50,
      x: 70,
      y: 570,
      width: 80,
      height: 160,
      rows: generateRows("section-9", 14, 8),
    },
    {
      id: "section-10",
      name: "10",
      price: 50,
      x: 160,
      y: 570,
      width: 80,
      height: 160,
      rows: generateRows("section-10", 14, 8),
    },
    {
      id: "section-11",
      name: "11",
      price: 50,
      x: 250,
      y: 570,
      width: 80,
      height: 160,
      rows: generateRows("section-11", 14, 8),
    },
    {
      id: "section-12",
      name: "12",
      price: 60,
      x: 340,
      y: 570,
      width: 80,
      height: 160,
      rows: generateRows("section-12", 14, 8),
    },
    {
      id: "section-13",
      name: "13",
      price: 70,
      x: 430,
      y: 570,
      width: 80,
      height: 160,
      rows: generateRows("section-13", 14, 8),
    },
    // left sections
    {
      id: "section-14",
      name: "14",
      price: 75,
      x: -100,
      y: 180,
      width: 80,
      height: 160,
      rotation: 90,
      rows: generateRows("section-14", 14, 8),
    },
    {
      id: "section-15",
      name: "15",
      price: 80,
      x: -100,
      y: 280,
      width: 80,
      height: 160,
      rotation: 90,
      rows: generateRows("section-15", 14, 8),
    },
    {
      id: "section-16",
      name: "16",
      price: 80,
      x: -100,
      y: 380,
      width: 80,
      height: 160,
      rotation: 90,
      rows: generateRows("section-16", 14, 8),
    },
    // corner sections
    {
      id: "section-17",
      name: "17",
      price: 80,
      x: -80,
      y: 30,
      width: 120,
      height: 160,
      rotation: 315,
      rows: generateRows("section-17", 14, 8),
    },
    {
      id: "section-18",
      name: "18",
      price: 75,
      x: 580,
      y: 30,
      width: 120,
      height: 160,
      rotation: 45,
      rows: generateRows("section-18", 14, 8),
    },
    {
      id: "section-19",
      name: "19",
      price: 75,
      x: 580,
      y: 530,
      width: 120,
      height: 160,
      rotation: 135,
      rows: generateRows("section-19", 14, 8),
    },
    {
      id: "section-20",
      name: "20",
      price: 80,
      x: -80,
      y: 530,
      width: 120,
      height: 160,
      rotation: 225,
      rows: generateRows("section-20", 14, 8),
    },
  ],
};
