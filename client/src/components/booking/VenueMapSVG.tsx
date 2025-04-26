"use client";

import { useState, useEffect, useRef } from "react";
import { Venue, Section } from "@/models/Venue";
import { Button } from "@/components/ui/button";
import VenueSectionSVG from "./VenueSectionSVG";

interface VenueMapSVGProps {
  venue: Venue;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

function VenueMapSVG({ venue, selectedSeats, onSeatSelect }: VenueMapSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 400, y: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [detailLevel, setDetailLevel] = useState<"section" | "row" | "seat">("section");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 800,
          height: clientHeight || 600,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (scale < 1.5) {
      setDetailLevel("section");
    } else if (scale < 3) {
      setDetailLevel("row");
    } else {
      setDetailLevel("seat");
    }
  }, [scale]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const newScale = delta > 0 ? scale * 0.9 : scale * 1.1;

    const limitedScale = Math.min(Math.max(newScale, 0.5), 5);

    // calculate cursor position relative to SVG
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // calculate new position to zoom towards cursor
    const newX = cursorX - (cursorX - position.x) * (limitedScale / scale);
    const newY = cursorY - (cursorY - position.y) * (limitedScale / scale);

    setScale(limitedScale);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPosition({
      x: position.x + dx,
      y: position.y + dy,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);

    if (detailLevel === "section") {
      setScale(2);

      // Center on the section
      const newX = dimensions.width / 2 - section.x * scale;
      const newY = dimensions.height / 2 - section.y * scale;

      setPosition({ x: newX, y: newY });
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(scale * 1.2, 5);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale * 0.8, 0.5);
    setScale(newScale);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: dimensions.width / 2, y: dimensions.height / 2 });
    setSelectedSection(null);
    setDetailLevel("section");
  };

  useEffect(() => {
    setPosition({ x: dimensions.width / 2, y: dimensions.height / 2 });
  }, [dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={zoomIn}
          className="w-10 h-10 p-0 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold"
        >
          +
        </Button>
        <Button
          onClick={zoomOut}
          className="w-10 h-10 p-0 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold"
        >
          -
        </Button>
        <Button
          onClick={resetView}
          className="w-10 h-10 p-0 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold"
        >
          ↺
        </Button>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="touch-none"
        style={{ background: "#f8f9fa" }}
      >
        <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
          {/* background */}
          <rect x={0} y={100} width={500} height={367} fill="#4CAF50" />
          {/* grass stripes */}
          {Array.from({ length: 10 }).map((_, i) => (
            <rect
              key={i}
              x={i * 50}
              y={100}
              width={50}
              height={367}
              fill={i % 2 === 0 ? "#43A047" : "#4CAF50"}
            />
          ))}

          {/* field */}
          <rect
            x={50}
            y={150}
            width={400}
            height={267}
            fill="none"
            stroke="#fff"
            strokeWidth={2 / scale}
          />

          {/* markings */}
          <g stroke="#fff" strokeWidth={1 / scale} fill="none">
            <line x1={250} y1={150} x2={250} y2={417} />
            <circle cx={250} cy={283.5} r={45} />
            <rect x={50} y={208} width={80} height={150} />

            <rect x={370} y={208} width={80} height={150} />

            <rect x={50} y={245} width={30} height={75} />

            <rect x={420} y={245} width={30} height={75} />

            <rect x={40} y={258} width={10} height={50} />

            <rect x={450} y={258} width={10} height={50} />

            <path d="M 130 283.5 A 45 45 0 0 1 130 283.5" />
            <path d="M 370 283.5 A 45 45 0 0 O 370 283.5" />
          </g>

          {venue.sections.map(section => (
            <VenueSectionSVG
              key={section.id}
              section={section}
              detailLevel={detailLevel}
              isSelected={selectedSection?.id === section.id}
              selectedSeats={selectedSeats}
              onSectionClick={() => handleSectionClick(section)}
              onSeatSelect={onSeatSelect}
              scale={scale}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default VenueMapSVG;
