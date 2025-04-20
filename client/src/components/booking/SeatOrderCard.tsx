import Image from "next/image";
import React from "react";
import homeBackground from "../../../public/Home_Background.png";
import Seat from "@/models/Seat";

export default function SeatOrderCard({
  seatOrder,
  onClick,
}: {
  seatOrder: Seat;
  onClick: () => void;
}) {
  return (
    <div className="w-[90%] relative h-[80px] border-1 border-[#000000] rounded-[4px] flex flex-row">
      <div className="aspect-[1/2] w-[24%] overflow-hidden rounded-[4px]">
        <Image
          src={homeBackground}
          alt="homeBackground"
          className="w-full h-full object-cover object-center rounded-[4px]"
        />
      </div>
      <div className="w-[75%] px-2 flex flex-col items-start justify-between">
        <div className="w-full flex flex-col">
          <p className="text-[#1D1D1D] text-[16px] font-bold">{seatOrder.SectionId}</p>
          <p className="text-[#686868] text-[14px] font-medium">
            {seatOrder.SeatInRow} | {seatOrder.SeatNumber}
          </p>
        </div>
        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-[#686868] text-[14px] font-medium">Viewed By 9 People</p>
          <p className="text-[#02471F] text-[16px] font-bold">$10</p>
        </div>
      </div>
      <div
        className="absolute top-1 right-1 w-[15px] h-[15px] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
        onClick={onClick}
      >
        x
      </div>
    </div>
  );
}
