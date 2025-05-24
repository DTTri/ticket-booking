"use client";
import { sampleEvents } from "@/libs/place-holder.data";
import Event from "@/models/Event";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TicketCard from "@/components/booking/TicketCard";
import Image from "next/image";

const fetchBookingEvent = async (eventId: string) => {
  // const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch event detail");
  // }
  // return response.json();
  console.warn("event id" + eventId);
  return sampleEvents[0]; // Mocked data for now
};

type QRCodeType = {
  eventName: string;
  date: string;
  time: string;
  venue: string;
  section: string;
  row: string;
  seatNumber: number;
};

const sampleQRCodeData: QRCodeType[] = Array.from({ length: 5 }, (_, index) => ({
  eventName: `Event ${index + 1}`,
  date: `2023-10-${index + 1}`,
  time: "19:00",
  venue: `Venue ${index + 1}`,
  section: `Section ${index + 1}`,
  row: `Row ${index + 1}`,
  seatNumber: index + 1,
}));

export default function OrderDetailsPage() {
  const { eventId } = useParams();

  const [curEvent, setCurEvent] = useState<Event>();

  //States for selected seats
  const [selectedSeats, setSelectedSeats] = useState<QRCodeType[]>();

  useEffect(() => {
    const loadEventDataDetail = async () => {
      try {
        const event = await fetchBookingEvent(eventId as string);
        setCurEvent(event);
        setSelectedSeats(sampleQRCodeData);
      } catch (error) {
        console.error("Error fetching event detail:", error);
      }
    };
    loadEventDataDetail();
  }, [eventId]);

  return (
    <div className="w-full min-h-screen py-6 px-12 flex flex-row">
      <div className="w-[70%] flex flex-col items-center gap-6">
        <div className="w-[80%]">
          <div className="w-full flex flex-col items-start gap-5">
            <div className="w-full flex flex-col items-start">
              <p className="text-[24px] font-bold text-[#000]">Enjoy the event</p>
              <p className="text-[16px] font-semibold text-[#686868]">
                Tickets will be delivered within minutes to your email also.
              </p>
            </div>
            <div className="w-full px-4 grid grid-cols-2 gap-4">
              {selectedSeats?.map((ticket, index) => (
                <TicketCard
                  date={ticket.date}
                  eventName={ticket.eventName}
                  key={index}
                  row={ticket.row}
                  section={ticket.section}
                  seatNumber={ticket.seatNumber}
                  time={ticket.time}
                  venue={ticket.venue}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[28%] rounded-lg p-2 flex flex-col gap-3">
        {/* Match Image */}
        <div className="w-full h-[200px] bg-gray-200 rounded-[6px] overflow-hidden">
          <Image
            src={sampleEvents[0].Image} // Replace with actual match image
            alt="Match"
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Match Details */}
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-row justify-between items-center gap-1">
            <p className="text-sm text-gray-500">Match</p>
            <p className="text-lg font-bold">{curEvent?.name}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Seats</p>
            <p className="text-base font-semibold">{sampleQRCodeData[0].seatNumber}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-semibold">{curEvent?.venueId}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-base font-semibold">{curEvent?.startDateTime.toISOString()}</p>
          </div>
        </div>

        <div className="border-t border-gray-300 py-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Tickets</p>
            <p className="text-sm font-semibold">$5 x 4</p>
          </div>
          <div className="flex justify-between border-t border-gray-300 py-3">
            <p className="text-base font-bold">Total</p>
            <p className="text-base font-bold">${300}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
