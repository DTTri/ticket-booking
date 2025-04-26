"use client";

import { useState, useEffect } from "react";
import { Section } from "@/models/Venue";

interface VenueSectionSVGProps {
  section: Section;
  detailLevel: "section" | "row" | "seat";
  isSelected: boolean;
  selectedSeats: string[];
  onSectionClick: () => void;
  onSeatSelect: (seatId: string) => void;
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
    const totalSeats = section.rows.reduce((total, row) => total + row.seats.length, 0);
    const unavailableSeats = section.rows.reduce(
      (total, row) =>
        total +
        row.seats.filter(seat => seat.status === "sold" || seat.status === "pending").length,
      0
    );
    const availabilityPercentage = 1 - unavailableSeats / totalSeats;

    const colorIntensity = Math.max(0.4, availabilityPercentage);

    const adjustedColor = applyIntensity(baseColor, colorIntensity);
    setSectionColor(adjustedColor);

    const newRowColors: Record<string, string> = {};
    section.rows.forEach(row => {
      const totalRowSeats = row.seats.length;
      const unavailableRowSeats = row.seats.filter(
        seat => seat.status === "sold" || seat.status === "pending"
      ).length;
      const rowAvailability = 1 - unavailableRowSeats / totalRowSeats;
      const rowIntensity = Math.max(0.4, rowAvailability);
      newRowColors[row.id] = applyIntensity(baseColor, rowIntensity);
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
          x={-section.width / 2}
          y={-section.height / 2}
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
          transform={`translate(0, ${section.height / 2 + 10}) ${section.rotation ? `rotate(${-section.rotation})` : ""}`}
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
    const rowHeight = section.height / section.rows.length;

    return (
      <g
        transform={`translate(${section.x}, ${section.y}) ${section.rotation ? `rotate(${section.rotation})` : ""}`}
      >
        <rect
          x={-section.width / 2}
          y={-section.height / 2}
          width={section.width}
          height={section.height}
          fill={sectionColor}
          opacity={0.3}
          stroke="#000"
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />

        {section.rows.map((row, rowIndex) => {
          const yOffset = -section.height / 2 + rowIndex * rowHeight;

          const rowColor = rowColors[row.id] || sectionColor;

          return (
            <g key={row.id} onClick={onSectionClick} style={{ cursor: "pointer" }}>
              <rect
                x={-section.width / 2}
                y={yOffset}
                width={section.width}
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
                Row {row.name}
              </text>
            </g>
          );
        })}
        {/* section title */}
        <g transform={`${section.rotation ? `rotate(${-section.rotation})` : ""}`}>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18 / scale}
            fontWeight="bold"
            fill="#000"
          >
            {section.name}
          </text>
        </g>

        {/* price tag*/}
        <g
          transform={`translate(0, ${section.height / 2 + 15}) ${section.rotation ? `rotate(${-section.rotation})` : ""}`}
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
    const rowHeight = section.height / section.rows.length;

    return (
      <g
        transform={`translate(${section.x}, ${section.y}) ${section.rotation ? `rotate(${section.rotation})` : ""}`}
      >
        <rect
          x={-section.width / 2}
          y={-section.height / 2}
          width={section.width}
          height={section.height}
          fill={sectionColor}
          opacity={0.3}
          stroke="#000"
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />

        {/* section title */}
        <g transform={`${section.rotation ? `rotate(${-section.rotation})` : ""}`}>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={18 / scale}
            fontWeight="bold"
            fill="#000"
          >
            {section.name}
          </text>
        </g>

        {/* price tag*/}
        <g
          transform={`translate(0, ${section.height / 2 + 15}) ${section.rotation ? `rotate(${-section.rotation})` : ""}`}
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
        {section.rows.map((row, rowIndex) => {
          const yOffset = -section.height / 2 + rowIndex * rowHeight;
          const seatWidth = section.width / row.seats.length;
          const seatSize = Math.min(seatWidth * 0.8, rowHeight * 0.8);
          const seatRadius = seatSize / 2;

          return (
            <g key={row.id}>
              {/* Row label */}
              <text
                rotate={`${section.rotation ? `${-section.rotation}` : ""}`}
                x={-section.width / 2 - 5}
                y={yOffset + rowHeight / 2}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize={14 / scale}
                fontWeight="bold"
                fill="#000"
              >
                {row.name}
              </text>

              {/* seats */}
              {row.seats.map((seat, seatIndex) => {
                let seatColor = "#ccc";

                if (seat.status === "available") {
                  seatColor = "#4CAF50";
                } else if (seat.status === "sold") {
                  seatColor = "#F44336";
                } else if (seat.status === "pending") {
                  seatColor = "#FFC107";
                }

                const isSelected = selectedSeats.includes(seat.id);
                if (isSelected) {
                  seatColor = "#2196F3";
                }

                const xOffset = -section.width / 2 + seatIndex * seatWidth + seatWidth / 2;

                return (
                  <g
                    key={seat.id}
                    transform={`translate(${xOffset}, ${yOffset + rowHeight / 2})`}
                    onClick={() => {
                      if (seat.status === "available" || isSelected) {
                        onSeatSelect(seat.id);
                      }
                    }}
                    style={{
                      cursor: seat.status === "available" || isSelected ? "pointer" : "not-allowed",
                    }}
                  >
                    <circle
                      r={seatRadius}
                      fill={seatColor}
                      stroke="#000"
                      strokeWidth={0.5 / scale}
                      opacity={seat.status === "sold" ? 0.7 : 1}
                    />

                    <text
                      transform={`${section.rotation ? `rotate(${-section.rotation})` : ""}`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10 / scale}
                      fontWeight="bold"
                      fill={isSelected || seat.status === "available" ? "#fff" : "#000"}
                    >
                      {seat.number}
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
