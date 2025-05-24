"use client";
import ConfirmPopup from "@/components/booking/ConfirmPopup";
import SeatMap from "@/components/booking/SeatMap";
import SeatOrderCard from "@/components/booking/SeatOrderCard";
import { Button } from "@/components/ui/button";
import { useEventDetails } from "@/hooks/useEvents";
import Seat from "@/models/Seat";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false);

  // Use Redux store to get event details
  const {
    event: curEvent,
    isLoadingEventDetails,
    errorEventDetails,
    loadEvent,
    clearDetails,
  } = useEventDetails();

  useEffect(() => {
    if (eventId) {
      loadEvent(eventId as string);
    }

    return () => {
      clearDetails();
    };
  }, [eventId, loadEvent, clearDetails]);

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats(prevSeats => prevSeats.filter(seat => seat.SeatId !== seatId));
  };

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats(prevSeats => {
      const existingSeat = prevSeats.find(s => s.SeatId === seat.SeatId);
      if (existingSeat) {
        return prevSeats.filter(s => s.SeatId !== seat.SeatId);
      } else {
        return [...prevSeats, seat];
      }
    });
  };

  const handleBookClick = () => {
    router.push(`/booking/payment/${eventId}`);
  };

  // Show loading state
  if (isLoadingEventDetails) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-lg">Loading event details...</div>
      </div>
    );
  }

  // Show error state
  if (errorEventDetails) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {errorEventDetails}</div>
      </div>
    );
  }

  // Show not found state
  if (!curEvent) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-lg">Event not found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] py-3 px-5 flex flex-row">
      <div className="w-[40%] h-full py-3 px-4 overflow-y-auto">
        <div className="bookingInfo w-full flex flex-col gap-3 border-b-1 border-[#D0D0D0] pb-3 mb-3">
          <h2 className="text-2xl font-bold text-[#1D1D1D]">{curEvent?.name}</h2>
          <div className="flex flex-col">
            <p className="text-[#686868] text-[12px] font-medium">
              {curEvent?.startDateTime
                ? new Date(curEvent.startDateTime).toLocaleString()
                : "Start time not available"}
            </p>
            <p className="text-[#686868] text-[12px] font-medium">
              {curEvent?.endDateTime
                ? new Date(curEvent.endDateTime).toLocaleString()
                : "End time not available"}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between mb-2">
          <p className="text-[#1D1D1D] text-[14px] font-semibold">
            {selectedSeats.length} Selected Seats
          </p>
          <p className="text-[#02471F] text-[16px] font-bold">
            Total price: ${selectedSeats.length * 10}
          </p>
        </div>
        <div className="selectedSeats flex flex-col items-center gap-3">
          {selectedSeats.map((seat, index) => (
            <SeatOrderCard key={index} seatOrder={seat} onRemove={handleRemoveSeat} />
          ))}
        </div>
      </div>
      <div className="w-[60%] h-full">
        <SeatMap selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
      </div>
      {isOpenConfirmPopup && (
        <ConfirmPopup
          eventName="FC Barcelona vs Real Madrid"
          stadium="My Dinh Stadium"
          location="Ha Noi, Vietnam"
          date="Mar 22 • Sat • 2025"
          time="19:30 - 23:30"
          section="99"
          row="C"
          seats="4-10"
          ticketPrice={10}
          quantity={7}
          onConfirm={() => {}}
          onClose={() => setIsOpenConfirmPopup(false)}
        />
      )}
      <Button
        className="fixed bottom-4 left-1/6 py-3 px-8 text-xl font-bold rounded-4xl"
        onClick={handleBookClick}
      >
        Book
      </Button>
    </div>
  );
}
