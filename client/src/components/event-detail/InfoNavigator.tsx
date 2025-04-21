import { CircleEllipsis, Info, Ticket } from "lucide-react";
import React from "react";

export default function InfoNavigator({
  infoState,
  handleClick,
}: {
  infoState: "details" | "about" | "tickets";
  handleClick: (type: "details" | "about" | "tickets") => void;
}) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* ABOUT */}
      <div
        onClick={() => handleClick("about")}
        className={`w-full h-[33.3%] flex flex-col justify-center items-center transition-transform duration-300 cursor-pointer ${
          infoState === "about"
            ? "bg-[#2ECC71] border-l-4 border-white"
            : "bg-[#28a65c] hover:scale-95 hover:bg-[#2ECC71]"
        }`}
      >
        <Info className="text-white" />
        <p className="text-[12px] font-bold text-white">ABOUT</p>
      </div>

      {/* DETAILS */}
      <div
        onClick={() => handleClick("details")}
        className={`w-full h-[33.3%] flex flex-col justify-center items-center transition-transform duration-300 cursor-pointer ${
          infoState === "details"
            ? "bg-[#045f2a] border-l-4 border-white"
            : "bg-[#034d22] hover:scale-95 hover:bg-[#045f2a]"
        }`}
      >
        <CircleEllipsis className="text-white" />
        <p className="text-[12px] font-bold text-white">DETAILS</p>
      </div>

      {/* TICKETS */}
      <div
        onClick={() => handleClick("tickets")}
        className={`w-full h-[33.3%] flex flex-col justify-center items-center transition-transform duration-300 cursor-pointer ${
          infoState === "tickets"
            ? "bg-[#01451d] border-l-4 border-white"
            : "bg-[#013a18] hover:scale-95 hover:bg-[#01451d]"
        }`}
      >
        <Ticket className="text-white block" />
        <p className="text-[12px] font-bold text-white">TICKETS</p>
      </div>
    </div>
  );
}
