"use client";
import Image from "next/image";
import home_background from "../../public/Home_Background.png";
import pngguru from "../../public/pngguru.svg";
import { Button } from "@/components/ui/button";
import EventInfo from "@/components/home/EventInfo";
import { useEffect, useState, useMemo } from "react";
import { useEventList } from "@/hooks/useEvents";
import { EventStatus } from "@/models/Event";
import LoadingSpinner from "@/components/ui/loading";

export default function HomePage() {
  const [startIndex, setStartIndex] = useState(0);
  // const [location, setLocation] = useState("");
  // const [match, setMatch] = useState("");
  // const [date, setDate] = useState("");
  const itemsPerPage = 3;

  const { events, isLoadingList, loadEvents } = useEventList();

  // Filter events to show only upcoming published events
  const upcomingPublishedEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(
        event => event.status === EventStatus.PUBLISHED && new Date(event.startDateTime) > now
      )
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }, [events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await loadEvents();
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [loadEvents]);

  // Reset pagination when filtered events change
  useEffect(() => {
    setStartIndex(0);
  }, [upcomingPublishedEvents.length]);

  if (isLoadingList) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleNext = () => {
    if (startIndex + itemsPerPage < upcomingPublishedEvents.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrevious = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };
  return (
    <div className="w-full min-h-screen h-full pb-5">
      <div
        className="w-full h-[550px] flex flex-row justify-center gap-6 relative px-10 py-10 mb-[80px]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(46, 204, 113, 0.5), rgba(0, 0, 0, 0.9)), url(${home_background.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100%",
        }}
      >
        <div className="w-[45%] h-full flex justify-center items-center">
          <Image
            src={pngguru}
            alt="Home Background"
            className="w-full h-full object-cover object-center mb-7"
          />
        </div>
        <div className="w-[50%] h-full flex flex-col justify-center items-start gap-3 px-5 py-5">
          <h2 className="text-white text-[40px] font-semibold ">Welcome to Ticket Booking</h2>
          <p className="text-white text-[16px] font-normal">
            Buy your tickets online and enjoy the convenience of digital ticketing. No more waiting
            in line or worrying about losing your ticket.
          </p>
          <Button
            variant={"default"}
            className="text-white font-semibold text-[16px] bg-primary rounded-[50px] hover:bg-primary/70"
          >
            Get Started
          </Button>
        </div>
        <div
          className="w-[75%] h-[110px] bg-[#1D1D1D] rounded-[20px] absolute -bottom-1/10 flex flex-row items-center justify-center py-6"
          style={{ boxShadow: "0px 10px 50px 0px rgba(61, 55, 241, 0.25)" }}
        >
          <div className="w-[30%] flex flex-col items-start">
            <div className="text-[18px] text-white font-bold">Location</div>
            <input
              type="text"
              placeholder="Enter your location"
              className="w-[80%] h-[40px] bg-[#1D1D1D] text-white border-b border-gray-500 focus:border-white pt-2 outline-none"
            />
          </div>
          <div className="w-[30%] flex flex-col items-start">
            <div className="text-[18px] text-white font-bold">Match</div>
            <input
              type="text"
              placeholder="Search match"
              className="w-[80%] h-[40px] bg-[#1D1D1D] text-white border-b border-gray-500 focus:border-white pt-2 outline-none"
            />
          </div>
          <div className="w-[30%] flex flex-col items-start">
            <div className="text-[18px] text-white font-bold">Date</div>
            <input
              type="date"
              placeholder="Enter your location"
              className="w-[80%] h-[40px] bg-[#1D1D1D] text-white border-b border-gray-500 focus:border-white pt-2 outline-none"
            />
          </div>
        </div>
      </div>
      <div className="w-[75%] mx-auto searched-match py-5 px-6">
        <div className="text-[#242565] font-bold text-3xl mb-3">Upcoming Events</div>
        {upcomingPublishedEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No upcoming events available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new events!</p>
          </div>
        ) : (
          <div className="relative flex items-center">
            <button
              onClick={handlePrevious}
              disabled={startIndex === 0}
              className="absolute left-[-70px] top-1/2 transform -translate-y-1/2 bg-[#1D1D1D] text-white px-4 py-2 rounded-full disabled:opacity-50"
            >
              &lt;
            </button>

            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${startIndex * (100 / itemsPerPage)}%)`,
                }}
              >
                {upcomingPublishedEvents.map(event => (
                  <div
                    key={event.eventId}
                    className="w-[calc(100%/3)] h-full flex-shrink-0 py-2 px-4"
                  >
                    <EventInfo event={event} />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= upcomingPublishedEvents.length}
              className="absolute right-[-70px] top-1/2 transform -translate-y-1/2 bg-[#1D1D1D] text-white px-4 py-2 rounded-full disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
