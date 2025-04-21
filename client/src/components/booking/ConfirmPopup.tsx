import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface PopupProps {
  eventName: string;
  stadium: string;
  location: string;
  date: string;
  time: string;
  section: string;
  row: string;
  seats: string;
  ticketPrice: number;
  quantity: number;
  onConfirm: () => void;
  onClose?: () => void;
}

export default function ConfirmPopup({
  eventName,
  stadium,
  location,
  date,
  time,
  section,
  row,
  seats,
  ticketPrice,
  quantity,
  onConfirm,
  onClose,
}: PopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className=" bg-white rounded-lg shadow-lg w-[450px]">
        <div className="relative w-full h-[200px] bg-gray-200 rounded-t-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Event"
            width={450}
            height={200}
            className="w-full h-full object-cover object-center"
          />
          <X
            color="#000"
            className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 rounded-full"
            onClick={onClose}
          />
        </div>

        <div className="p-4">
          <h2 className="text-xl font-bold text-center text-[#1D1D1D] mb-2">{eventName}</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <p>{stadium}</p>
            <p>{location}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <p>{date}</p>
            <p>{time}</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Section {section}</p>
              <p className="text-sm text-gray-600">Row {row}</p>
            </div>
            <p className="text-sm text-gray-600">Seats {seats}</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Ticket price: <span className="text-[#02471F] font-bold">${ticketPrice} each</span>
            </p>
            <p className="text-sm text-gray-600">
              Quantity: <span className="font-bold">{quantity} tickets</span>
            </p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full bg-[#2ECC71] text-white font-bold py-2 rounded-lg hover:bg-[#28a65c] transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
