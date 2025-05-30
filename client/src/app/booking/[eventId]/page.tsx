"use client";
import ConfirmPopup from "@/components/booking/ConfirmPopup";
import SeatMap from "@/components/booking/SeatMap";
import SeatOrderCard from "@/components/booking/SeatOrderCard";
import { Button } from "@/components/ui/button";
import { useBookingMutations } from "@/hooks/useBooking";
import { useEventDetails } from "@/hooks/useEvents";
import { useVenueDetails } from "@/hooks/useVenue";
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
  const { loadVenue, venue } = useVenueDetails();
  const { bookSeats } = useBookingMutations();
  useEffect(() => {
    if (eventId) {
      loadEvent(eventId as string);
    }
    return () => {
      clearDetails();
    };
  }, [eventId, loadEvent, clearDetails]);
  useEffect(() => {
    if (curEvent) {
      loadVenue(curEvent.venueId);
    }
  }, [curEvent]);
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
    if (!eventId) return;
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    // if (selectedSeats.length > 1) {
    //   const rowNumbers = selectedSeats.map(seat => Number(seat.RowNumber));
    //   const minRow = Math.min(...rowNumbers);
    //   const maxRow = Math.max(...rowNumbers);
    //   if (
    //     maxRow - minRow > 1 ||
    //     selectedSeats.sort((a, b) => a.SeatInRow - b.SeatInRow)[0].SeatInRow -
    //       selectedSeats.sort((a, b) => a.SeatInRow - b.SeatInRow)[0].SeatInRow >
    //       1
    //   ) {
    //     alert("Please select continuous seats.");
    //     return;
    //   }
    // }
    setIsOpenConfirmPopup(true);
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
        <SeatMap
          eventId={eventId as string}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
        />
      </div>
      {isOpenConfirmPopup && (
        <ConfirmPopup
          eventName={curEvent?.name}
          stadium={curEvent?.venueName}
          location={curEvent?.venueAddress}
          date={
            curEvent?.startDateTime
              ? new Date(curEvent.startDateTime).toLocaleString()
              : "Date not available"
          }
          time={
            curEvent?.startDateTime
              ? new Date(curEvent.startDateTime).toLocaleTimeString()
              : "Time not available"
          }
          section={
            venue?.sections.find(s => s.sectionId === selectedSeats[0]?.SectionId)?.name || ""
          }
          row={selectedSeats[0]?.RowNumber}
          seats={selectedSeats.map(seat => seat.SeatNumber).join(", ")}
          ticketPrice={
            venue?.sections.find(s => s.sectionId === selectedSeats[0]?.SectionId)?.price || 0
          }
          quantity={selectedSeats.length}
          onConfirm={() => {
            setIsOpenConfirmPopup(false);
            if (!eventId) return;
            bookSeats({
              eventId: Array.isArray(eventId) ? eventId[0] : eventId,
              seatIds: selectedSeats.map(seat => seat.SeatId),
            });
            router.push(`/booking/payment/${eventId}`);
          }}
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
