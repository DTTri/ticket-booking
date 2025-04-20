"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import InfoNavigator from "@/components/event-detail/InfoNavigator";
import { useCallback, useState } from "react";
import About from "@/components/event-detail/About";
import { sampleEvents } from "@/libs/place-holder.data";
import { Button } from "@/components/ui/button";
import Detail from "@/components/event-detail/Detail";
import Ticket from "@/components/event-detail/Ticket";
import { useParams } from "next/navigation";
import Event from "@/models/Event";

type InfoSelect = "details" | "about" | "tickets";

const fetchEventDetail = async (eventId: string) => {
  // const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch event detail");
  // }
  // return response.json();
  return sampleEvents[0]; // Mocked data for now
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [infoSelect, setInfoSelect] = useState<InfoSelect>("about");
  const [selectedEvent, setSelectedEvent] = useState<Event>();

  useEffect(() => {
    const loadEventDataDetail = async () => {
      try {
        const event = await fetchEventDetail(id as string);
        setSelectedEvent(event);
      } catch (error) {
        console.error("Error fetching event detail:", error);
      }
    };
    loadEventDataDetail();
  }, [id]);

  console.log("Selected Event:", selectedEvent?.Image);

  const handleClick = useCallback((type: InfoSelect) => {
    setInfoSelect(type);
  }, []);
  return (
    <div style={{ height: "calc(100vh - 70px)" }} className="w-full overflow-hidden">
      <div className="w-full h-full flex flex-row">
        <div className="w-[38%] h-full overflow-hidden">
          <Image
            src={selectedEvent?.Image || ""}
            width={500}
            height={500}
            alt="Event"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="w-[6%] h-full">
          {selectedEvent && <InfoNavigator infoState={infoSelect} handleClick={handleClick} />}
        </div>
        <div className="w-[55%] h-full flex flex-col items-start gap-4 px-8 py-5">
          <div className="w-full h-[95%]">
            {infoSelect === "about" && selectedEvent && <About event={selectedEvent} />}
            {infoSelect === "details" && selectedEvent && <Detail event={selectedEvent} />}
            {infoSelect === "tickets" && <Ticket />}
          </div>
          <div className="w-full h-[5%] flex flex-row-reverse">
            <Button variant={"default"} className="font-semibold px-6 py-4 text-[16px]">
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
