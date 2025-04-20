"use client";
import { useState, useEffect } from "react";

interface TimeCountProps {
  intialTime?: number;
  onTimeEnd: () => void;
}

export default function TimeCount({ intialTime = 600, onTimeEnd }: TimeCountProps) {
  const [time, setTime] = useState(intialTime);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      onTimeEnd();
    }
  }, [time, onTimeEnd]);

  const handleFormatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return {
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  };

  const { minutes, seconds } = handleFormatTime(time);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center justify-center w-11 h-11 bg-transparent rounded-md border border-gray-400">
        <span className="text-[#1B5E20] font-bold text-lg">{minutes[0]}</span>
      </div>
      <div className="flex items-center justify-center w-11 h-11 bg-transparent rounded-md border border-gray-400">
        <span className="text-[#1B5E20] font-bold text-lg">{minutes[1]}</span>
      </div>

      <span className="text-[#1B5E20] font-bold text-lg">:</span>

      <div className="flex items-center justify-center w-11 h-11 bg-transparent rounded-md border border-gray-400">
        <span className="text-[#1B5E20] font-bold text-lg">{seconds[0]}</span>
      </div>
      <div className="flex items-center justify-center w-11 h-11 bg-transparent rounded-md border border-gray-400">
        <span className="text-[#1B5E20] font-bold text-lg">{seconds[1]}</span>
      </div>
    </div>
  );
}
