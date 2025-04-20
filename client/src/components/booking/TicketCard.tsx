import React from "react";

interface TicketCardProps {
  eventName: string;
  date: string;
  time: string;
  venue: string;
  section: string;
  row: string;
  seatNumber: number;
}

export default function TicketCard({
  eventName,
  date,
  time,
  venue,
  section,
  row,
  seatNumber,
}: TicketCardProps) {
  return (
    <div className="w-[300px] bg-[#1B5E20] text-white rounded-lg p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-semibold">TicketSelling</p>
        <p className="text-xs">Please show it on your phone when you arrive at the venue</p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-lg p-4 flex justify-center items-center">
        <img
          src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_1280.png" // Replace with actual QR code image
          alt="QR Code"
          className="w-full h-full object-cotain"
        />
      </div>

      {/* Event Details */}
      <div className="bg-white text-black rounded-lg p-4 flex flex-col gap-2">
        <div className="w-full pb-1 flex flex-col border-b border-[#02471F33] gap-1">
            <div>
                <p className="text-xs font-semibold">Event</p>
                <p className="text-[16px] font-bold">{eventName}</p>
            </div>
            <div>
                <p className="text-xs font-semibold">Time</p>
                <p className="text-[16px] font-bold">{date} - {time}</p>
            </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-semibold">Venue</p>
            <p className="text-[16px] font-bold">{venue}</p>
          </div>
          <div>
            <p className="text-xs font-semibold">Seat number</p>
            <p className="text-4xl font-bold text-[#1B5E20]">{seatNumber}</p>
          </div>
        </div>
        <div className="-mt-4">
          <p className="text-xs font-semibold">Section - Row</p>
          <p className="text-[16px] font-bold">{section} - {row}</p>
        </div>
      </div>
    </div>
  );
}