"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import InfoNavigator from "@/components/event-detail/InfoNavigator";
import { useCallback, useState } from "react";
import { sampleEvents } from "@/libs/place-holder.data";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Event from "@/models/Event";
import { Clock, MapPinned } from "lucide-react";

type InfoSelect = "details" | "about" | "tickets";

const fetchEventDetail = async (eventId: string) => {
  // const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch event detail");
  // }
  // return response.json();
  console.log(eventId);
  return sampleEvents[0]; // Mocked data for now
};

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [infoSelect, setInfoSelect] = useState<InfoSelect>("about");
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedStartTime, setFormattedStartTime] = useState<string>("");
  const [formattedEndTime, setFormattedEndTime] = useState<string>("");

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

  useEffect(() => {
    if (selectedEvent) {
      const startDate = new Date(selectedEvent.StartDateTime);
      const endDate = new Date(selectedEvent.EndDateTime);

      const formattedDate = startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const formattedStartTime = startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const formattedEndTime = endDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setFormattedDate(formattedDate);
      setFormattedStartTime(formattedStartTime);
      setFormattedEndTime(formattedEndTime);
    }
  }, [selectedEvent]);

  const handleClick = useCallback((type: InfoSelect) => {
    setInfoSelect(type);
  }, []);

  const handleBookClick = () => {
    router.push(`/booking/${id}`);
  };

  if (!selectedEvent) {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  }

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
            {infoSelect === "about" && selectedEvent && (
              <div className="w-full max-w-[800px] mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-black mb-1">{selectedEvent.Name}</h1>
                <p className="text-gray-500 text-sm mb-4">{selectedEvent.Status}</p>

                <div className="flex items-center gap-3 mb-4">
                  <MapPinned className="text-black" />
                  <div>
                    <h3 className="text-black font-semibold text-lg">Location</h3>
                    <p className="text-gray-600 text-sm">
                      Av. de Concha Espina, 1, Chamartín, 28036 Madrid, Tây Ban Nha
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-black" />
                  <div>
                    <h3 className="text-black font-semibold text-lg">{formattedDate}</h3>
                    <p className="text-gray-600 text-sm">
                      {formattedStartTime} - {formattedEndTime}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada ipsum sit
                  amet nulla feugiat, vitae accumsan neque tincidunt. Morbi sit amet dapibus nisi.
                  Nulla scelerisque, dolor eget cursus lobortis, dui massa ultricies dui, non
                  blandit nibh ipsum ac diam. Aenean non ultricies urna, at sagittis ipsum. Morbi
                  mattis sit amet ex ut bibendum. Sed viverra tortor metus, ac mattis ante efficitur
                  eu. Sed semper faucibus justo, vel congue tortor sodales eget. Phasellus elementum
                  est et pharetra elementum. Aliquam euismod, eros sit amet vulputate eleifend,
                  turpis nibh semper velit, vel suscipit ligula metus id nisl. Duis rhoncus orci
                  eget nisl accumsan, sed eleifend est egestas.
                </p>
              </div>
            )}
            {infoSelect === "details" && selectedEvent && (
              <div className="w-full max-w-[800px] mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-black mb-1">{selectedEvent.Name}</h1>
                <p className="text-gray-500 text-sm mb-4">{selectedEvent.Status}</p>

                <p className="text-gray-700 text-sm leading-6">
                  {selectedEvent.Description}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada ipsum sit
                  amet nulla feugiat, vitae accumsan neque tincidunt. Morbi sit amet dapibus nisi.
                  Nulla scelerisque, dolor eget cursus lobortis, dui massa ultricies dui, non
                  blandit nibh ipsum ac diam. Aenean non ultricies urna, at sagittis ipsum. Morbi
                  mattis sit amet ex ut bibendum. Sed viverra tortor metus, ac mattis ante efficitur
                  eu. Sed semper faucibus justo, vel congue tortor sodales eget. Phasellus elementum
                  est et pharetra elementum. Aliquam euismod, eros sit amet vulputate eleifend,
                  turpis nibh semper velit, vel suscipit ligula metus id nisl. Duis rhoncus orci
                  eget nisl accumsan, sed eleifend est egestas.
                </p>
              </div>
            )}
            {infoSelect === "tickets" && (
              //TODO: Add event layout
              <div className="w-full max-w-[800px] mx-auto px-4 py-6">Ticket</div>
            )}
          </div>
          <div className="w-full h-[5%] flex flex-row-reverse">
            <Button
              onClick={handleBookClick}
              variant={"default"}
              className="font-semibold px-6 py-4 text-[16px]"
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
