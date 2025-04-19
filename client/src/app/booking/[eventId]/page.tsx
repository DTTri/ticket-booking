'use client'
import ConfirmPopup from '@/components/booking/ConfirmPopup';
import SeatOrderCard from '@/components/booking/SeatOrderCard';
import { sampleEvents, sampleSeats } from '@/libs/place-holder.data';
import Event from '@/models/Event';
import Seat from '@/models/Seat';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function page() {
  const { eventId } = useParams();
  const [curEvent, setCurEvent] = useState<Event>();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>(sampleSeats);
  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(true);
  
  useEffect(() => {
    const event = sampleEvents.find(event => event.Guid === eventId);
    setCurEvent(event);
  }, [eventId]);
  return (
    <div className='w-full py-2 px-3 flex flex-row'>
      <div className="w-[40%] py-3 px-4">
        <div className="bookingInfo w-full flex flex-col gap-3 border-b-1 border-[#D0D0D0] pb-3 mb-3">
          <h2 className='text-2xl font-bold text-[#1D1D1D]'>{curEvent?.Name}</h2>
          <div className="flex flex-col">
            <p className='text-[#686868] text-[12px] font-medium'>{curEvent?.StartDateTime}</p>
            <p className='text-[#686868] text-[12px] font-medium'>{curEvent?.EndDateTime}</p>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between mb-2">
          <p className='text-[#1D1D1D] text-[14px] font-semibold'>{selectedSeats.length} Selected Seats</p>
          <p className='text-[#02471F] text-[16px] font-bold'>Total price: $40</p>
        </div>
        <div className="selectedSeats flex flex-col items-center gap-2">
          {selectedSeats.map((seat, index) => (
            <SeatOrderCard key={index} seatOrder={seat} onClick={() => {}} />
          ))}
        </div>
      </div>
      <div className="w-[60%]">
        {/* Seat Map Component will go here */}
      </div>
      {isOpenConfirmPopup && (
        <ConfirmPopup  eventName="FC Barcelona vs Real Madrid"
        stadium="My Dinh Stadium"
        location="Ha Noi, Vietnam"
        date="Mar 22 • Sat • 2025"
        time="19:30 - 23:30"
        section="99"
        row="C"
        seats="4-10"
        ticketPrice={10}
        quantity={7}
        onConfirm={() => {}}/>
      )}
    </div>
  )
}
