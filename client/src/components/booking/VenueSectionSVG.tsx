"use client";

import { useState, useEffect } from "react";
import { Section, Seat } from "@/models/Venue";

interface VenueSectionSVGProps {
  section: Section;
  detailLevel: "section" | "row" | "seat";
  isSelected: boolean;
  selectedSeats: string[];
  onSectionClick: () => void;
  onSeatSelect: (_seatId: string) => void;
  scale: number;
}

function VenueSectionSVG({
  section,
  detailLevel,
  isSelected,
  selectedSeats,
  onSectionClick,
  onSeatSelect,
  scale,
}: VenueSectionSVGProps) {
  const baseColor = "#6dfe4a";
  const [sectionColor, setSectionColor] = useState(baseColor);
  const [rowColors, setRowColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const totalSeats = section.seats.length;
    const unavailableSeats = section.seats.filter(
      seat => seat.status === "sold" || seat.status === "pending"
    ).length;
    const availabilityPercentage = totalSeats > 0 ? 1 - unavailableSeats / totalSeats : 1;

    const colorIntensity = Math.max(0.4, availabilityPercentage);

    const adjustedColor = applyIntensity(baseColor, colorIntensity);
    setSectionColor(adjustedColor);

    // Group seats by row and calculate row colors
    const newRowColors: Record<string, string> = {};
    const rowGroups = section.seats.reduce(
      (groups, seat) => {
        if (!groups[seat.rowNumber]) {
          groups[seat.rowNumber] = [];
        }
        groups[seat.rowNumber].push(seat);
        return groups;
      },
      {} as Record<string, Seat[]>
    );

    Object.entries(rowGroups).forEach(([rowNumber, rowSeats]) => {
      const totalRowSeats = rowSeats.length;
      const unavailableRowSeats = rowSeats.filter(
        seat => seat.status === "sold" || seat.status === "pending"
      ).length;
      const rowAvailability = totalRowSeats > 0 ? 1 - unavailableRowSeats / totalRowSeats : 1;
      const rowIntensity = Math.max(0.4, rowAvailability);
      newRowColors[rowNumber] = applyIntensity(baseColor, rowIntensity);
    });
    setRowColors(newRowColors);
  }, [section]);

  const opacity = isSelected ? 1 : 0.9;

  const strokeWidth = (isSelected ? 2 : 1) / scale;

  const applyIntensity = (hexColor: string, intensity: number) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const adjustedR = Math.floor(r * intensity);
    const adjustedG = Math.floor(g * intensity);
    const adjustedB = Math.floor(b * intensity);

    return `#${adjustedR.toString(16).padStart(2, "0")}${adjustedG.toString(16).padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`;
  };

  if (detailLevel === "section") {
    return (
      <g
        transform={`translate(${section.x}, ${section.y}) ${section.rotation ? `rotate(${section.rotation})` : ""}`}
        onClick={onSectionClick}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={-(section.width || 40) / 2}
          y={-(section.height || 40) / 2}
          width={section.width}
          height={section.height}
          fill={sectionColor}
          opacity={opacity}
          stroke="#000"
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />
        {/* Section number - always vertical */}
        <g transform={`${section.rotation ? `rotate(${-section.rotation})` : ""}`}>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12 / scale}
            fontWeight="bold"
            fill="#fff"
          >
            {section.name}
          </text>
        </g>

        {/* Price tag - always vertical and at bottom */}
        <g
          transform={`translate(0, ${(section.height ?? 40) / 2 + 10}) ${section.rotation ? `rotate(${-section.rotation})` : ""}`}
        >
          <rect
            x={-20 / scale}
            y={-10 / scale}
            width={40 / scale}
            height={20 / scale}
            rx={5 / scale}
            fill="black"
            stroke="#000"
            strokeWidth={0.5 / scale}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10 / scale}
            fontWeight="bold"
            fill="white"
          >
            ${section.price}
          </text>
        </g>
      </g>
    );
  }

  if (detailLevel === "row") {
    // Group seats by row
    const rowGroups = section.seats.reduce(
      (groups, seat) => {
        if (!groups[seat.rowNumber]) {
          groups[seat.rowNumber] = [];
        }
        groups[seat.rowNumber].push(seat);
        return groups;
      },
      {} as Record<string, Seat[]>
    );

    const rowNumbers = Object.keys(rowGroups).sort();
    const rowHeight = (section.height || 100) / rowNumbers.length;

    return (
      <g
        transform={`translate(${section.x}, ${section.y}) ${section.rotation ? `rotate(${section.rotation})` : ""}`}
      >
        <rect
          x={-(section.width || 100) / 2}
          y={-(section.height || 100) / 2}
          width={section.width || 100}
          height={section.height || 100}
          fill={sectionColor}
          opacity={0.3}
          stroke="#000"
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />

        {rowNumbers.map((rowNumber, rowIndex) => {
          const yOffset = -(section.height || 100) / 2 + rowIndex * rowHeight;
          const rowColor = rowColors[rowNumber] || sectionColor;

          return (
            <g key={rowNumber} onClick={onSectionClick} style={{ cursor: "pointer" }}>
              <rect
                x={-(section.width || 100) / 2}
                y={yOffset}
                width={section.width || 100}
                height={rowHeight}
                fill={rowColor}
                opacity={opacity}
                stroke="#000"
                strokeWidth={0.5 / scale}
              />
              <text
                x={0}
                y={yOffset + rowHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12 / scale}
                fill="#fff"
              >
                Row {rowNumber}
              </text>
            </g>
          );
        })}

        {/* Section title - always vertical */}
        <g transform={`${section.rotation ? `rotate(${-section.rotation})` : ""}`}>
          <text
            x={0}
            y={-(section.height || 100) / 2 - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14 / scale}
            fontWeight="bold"
            fill="#000"
          >
            {section.name}
          </text>
        </g>

        {/* Price tag - always vertical and at bottom */}
        <g
          transform={`translate(0, ${(section.height || 100) / 2 + 15}) ${section.rotation ? `rotate(${-section.rotation})` : ""}`}
        >
          <rect
            x={-20 / scale}
            y={-10 / scale}
            width={40 / scale}
            height={20 / scale}
            rx={5 / scale}
            fill="black"
            stroke="#000"
            strokeWidth={0.5 / scale}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10 / scale}
            fontWeight="bold"
            fill="white"
          >
            ${section.price}
          </text>
        </g>
      </g>
    );
  }

  if (detailLevel === "seat") {
    // Group seats by row
    const rowGroups = section.seats.reduce(
      (groups, seat) => {
        if (!groups[seat.rowNumber]) {
          groups[seat.rowNumber] = [];
        }
        groups[seat.rowNumber].push(seat);
        return groups;
      },
      {} as Record<string, Seat[]>
    );

    const rowNumbers = Object.keys(rowGroups).sort();
    const rowHeight = (section.height || 100) / rowNumbers.length;

    return (
      <g
        transform={`translate(${section.x}, ${section.y}) ${section.rotation ? `rotate(${section.rotation})` : ""}`}
      >
        <rect
          x={-(section.width || 100) / 2}
          y={-(section.height || 100) / 2}
          width={section.width || 100}
          height={section.height || 100}
          fill={sectionColor}
          opacity={0.3}
          stroke="#000"
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />

        {/* Section title - always vertical */}
        <g transform={`${section.rotation ? `rotate(${-section.rotation})` : ""}`}>
          <text
            x={0}
            y={-(section.height || 100) / 2 - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16 / scale}
            fontWeight="bold"
            fill="#000"
          >
            {section.name}
          </text>
        </g>

        {/* Price tag - always vertical and at bottom */}
        <g
          transform={`translate(0, ${(section.height || 100) / 2 + 15}) ${section.rotation ? `rotate(${-section.rotation})` : ""}`}
        >
          <rect
            x={-20 / scale}
            y={-10 / scale}
            width={40 / scale}
            height={20 / scale}
            rx={5 / scale}
            fill="black"
            stroke="#000"
            strokeWidth={0.5 / scale}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10 / scale}
            fontWeight="bold"
            fill="white"
          >
            ${section.price}
          </text>
        </g>

        {/* Rows and seats */}
        {rowNumbers.map((rowNumber, rowIndex) => {
          const yOffset = -(section.height || 100) / 2 + rowIndex * rowHeight;
          const rowSeats = rowGroups[rowNumber].sort((a, b) => a.seatInRow - b.seatInRow);
          const seatWidth = (section.width || 100) / rowSeats.length;
          const seatSize = Math.min(seatWidth * 0.8, rowHeight * 0.8);
          const seatRadius = seatSize / 2;

          return (
            <g key={rowNumber}>
              {/* Row label */}
              <text
                x={-(section.width || 100) / 2 - 10}
                y={yOffset + rowHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12 / scale}
                fontWeight="bold"
                fill="#000"
              >
                {rowNumber}
              </text>

              {/* Seats */}
              {rowSeats.map((seat, seatIndex) => {
                let seatColor = "#ccc";

                if (seat.status === "available") {
                  seatColor = "#4CAF50";
                } else if (seat.status === "sold") {
                  seatColor = "#F44336";
                } else if (seat.status === "pending") {
                  seatColor = "#FFC107";
                }

                const isSelected = selectedSeats.includes(seat.seatId);
                if (isSelected) {
                  seatColor = "#2196F3";
                }

                const xOffset = -(section.width || 100) / 2 + seatIndex * seatWidth + seatWidth / 2;

                return (
                  <g
                    key={seat.seatId}
                    transform={`translate(${xOffset}, ${yOffset + rowHeight / 2})`}
                    onClick={() => {
                      if (seat.status === "available" || isSelected) {
                        onSeatSelect(seat.seatId);
                      }
                    }}
                    style={{
                      cursor: seat.status === "available" || isSelected ? "pointer" : "not-allowed",
                    }}
                  >
                    {/* Seat circle */}
                    <circle
                      r={seatRadius}
                      fill={seatColor}
                      stroke="#000"
                      strokeWidth={0.5 / scale}
                      opacity={seat.status === "sold" ? 0.7 : 1}
                    />

                    {/* Seat number */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10 / scale}
                      fontWeight="bold"
                      fill={isSelected || seat.status === "available" ? "#fff" : "#000"}
                    >
                      {seat.seatNumber}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
    );
  }

  return null;
}

export default VenueSectionSVG;
