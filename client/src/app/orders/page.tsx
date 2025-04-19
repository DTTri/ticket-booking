import React from "react";
import { OrderCard } from "@/components";
export default function OrdersPage() {
  return (
    <div className="w-full pt-4">
      <div className="mx-auto w-full max-w-[620px] flex flex-col items-center gap-8">
        <div className="w-full flex flex-col  gap-4">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <OrderCard key={index} />
            ))}
        </div>
      </div>
    </div>
  );
}
