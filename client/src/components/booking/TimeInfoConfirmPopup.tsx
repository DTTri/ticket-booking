import React from "react";
import { LockKeyholeOpen } from "lucide-react";

interface TimeInfoConfirmPopupProps {
  minutes: number;
  onStart: () => void;
}

export default function TimeInfoConfirmPopup({ minutes, onStart }: TimeInfoConfirmPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-5 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <LockKeyholeOpen className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#1D1D1D] mb-2">
          You have {minutes} minutes to complete your purchase
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          The price of your tickets will be locked during this time
        </p>

        <button
          onClick={onStart}
          className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
}
