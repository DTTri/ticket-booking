import React from "react";
import { OrderCard } from "@/components";
export default function OrdersPage() {
  return (
    <div className="w-full py-4 px-2">
      <div className="mx-auto w-full max-w-[620px] flex flex-col items-center gap-8">
        <div className="w-full flex flex-col  gap-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <OrderCard key={index} />
            ))}
        </div>
      </div>
    </div>
  );
}
