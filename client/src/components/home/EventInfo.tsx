import Event from "@/models/Event";
import Image from "next/image";

interface MatchProps {
  event: Event;
}

export default function EventInfo({ event }: MatchProps) {
  // Lấy ngày và tháng từ StartDateTime
  const startDate = new Date(event.StartDateTime);
  const month = startDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = startDate.getDate();

  return (
    <div className="min-w-[324px] h-[210px] rounded-[20px] overflow-hidden bg-[#f6f3f3] flex flex-col">
      <div className="img w-full h-[55%] round-lr-[20px] overflow-hidden">
        <Image
          src={event.Image}
          alt="Event"
          width={350}
          height={300}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="w-full h-[45%] flex flex-row items-start justify-start gap-1 px-3 py-1">
        <div className="flex flex-col w-[15%]">
          <div className="month text-[#3D37F1] font-semibold text-[13px]">{month}</div>
          <div className="day text-black font-bold text-[22px] -mt-1">{day}</div>
        </div>
        <div className="w-[85%] flex gap-[2px] flex-col items-start">
          <div className="text-black font-bold text-[16px]">{event.Name}</div>
          <div className="text-[#7672FF] font-semibold text-[14px]">{event.Status}</div>
          <div className="text-[#6A6A6A] font-normal text-[12px]">{event.Description}</div>
        </div>
      </div>
    </div>
  );
}
