"use client";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { useEventList } from "@/hooks/useEvents";
import { EventStatus } from "@/models/Event";
import Link from "next/link";
import { useEffect, useState } from "react";

const customStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

// // Use a deterministic pattern for status to avoid hydration mismatch
// const getStatusForIndex = (index: number): EventStatus => {
//   const statuses: EventStatus[] = [
//     "Draft",
//     "Published",
//     "Submit for Approval",
//     "Postponed",
//     "Scheduled",
//   ];
//   return statuses[index % statuses.length];
// };

// const sampleEvents: Event[] = Array(10)
//   .fill(null)
//   .map((_, index) => ({
//     id: index + 1,
//     name: "FC Barcelona vs Real Madrid",
//     date: "Apr 1 2025 7:00pm",
//     sold: 60,
//     available: 240,
//     revenue: 8900,
//     status: getStatusForIndex(index),
//   }));

export default function OrganizerPage() {
  const { events, errorEventList, isLoadingList, loadEvents } = useEventList();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  if (isLoadingList) {
    return <LoadingSpinner />;
  }

  const getStatusStyle = (status: EventStatus) => {
    switch (status) {
      case "Draft":
        return "text-gray-700";
      case "Published":
        return "text-blue-700";
      case "Submit for approval":
        return "text-yellow-700";
      case "Postponed":
        return "text-red-700";
      case "Rescheduled":
        return "text-green-700";
      default:
        return "";
    }
  };

  return (
    <>
      <style jsx global>
        {customStyles}
      </style>
      <div
        className="max-w-[1600px] container mx-auto px-20 py-6 flex flex-col gap-6 overflow-hidden"
        style={{ height: "calc(100vh - 70px)", maxHeight: "calc(100vh - 70px)" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-darkText">Hi organizer! Your events are here</h1>
            <p className="text-grayText">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <Link href="/organizer/event/new">
            <Button className="bg-secondary hover:bg-secondary/80 text-whiteText px-5 font-bold py-2 rounded-md">
              Create event
            </Button>
          </Link>
        </div>

        <div
          className="border border-darkStroke rounded-lg flex-grow flex flex-col overflow-hidden"
          style={{
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead className="bg-secondary text-whiteText">
                <tr>
                  <th scope="col" className="py-4 text-center font-bold w-[3%]">
                    #
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[25%]">
                    Name
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[15%]">
                    Date
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[10%]">
                    Sold
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[10%]">
                    Available
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[10%]">
                    Revenue
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[10%]">
                    Status
                  </th>
                  <th scope="col" className="py-4 text-center font-bold w-[7%]">
                    Action
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="overflow-y-auto flex-grow hide-scrollbar">
            <table className="w-full table-fixed">
              <tbody className="bg-white divide-y divide-darkStroke">
                {events.map((event, index) => (
                  <tr key={event.eventId} className="hover:bg-gray-50">
                    <td className="w-[3%] py-3 text-center whitespace-nowrap text-sm text-darkText">
                      {index + 1}
                    </td>
                    <td className="w-[25%] py-3 text-center whitespace-nowrap text-sm font-medium text-darkText">
                      {event.name}
                    </td>
                    <td className="w-[15%] py-3 text-center whitespace-nowrap text-sm text-darkText">
                      {event.startDateTime.toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="w-[10%] py-3 text-center whitespace-nowrap text-sm text-darkText">
                      {}
                    </td>
                    <td className="w-[10%] py-3 text-center whitespace-nowrap text-sm text-darkText">
                      {}
                    </td>
                    <td className="w-[10%] py-3 text-center whitespace-nowrap text-sm text-darkText">
                      ${}
                    </td>
                    <td className="w-[10%] py-3 text-center whitespace-nowrap">
                      <span className={`text-sm ${getStatusStyle(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="w-[7%] py-3 text-center whitespace-nowrap text-sm text-darkText">
                      <Link href={`/organizer/event/${event.eventId}`}>
                        <button className="text-secondary hover:text-secondary/70">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              d="M9.9551 3.17518H3.0561C2.53332 3.17518 2.03196 3.38286 1.66229 3.75252C1.29263 4.12218 1.08496 4.62355 1.08496 5.14633V18.9443C1.08496 19.4671 1.29263 19.9685 1.66229 20.3381C2.03196 20.7078 2.53332 20.9155 3.0561 20.9155H16.8541C17.3769 20.9155 17.8782 20.7078 18.2479 20.3381C18.6176 19.9685 18.8252 19.4671 18.8252 18.9443V12.0453M17.3469 1.69683C17.739 1.30474 18.2707 1.08447 18.8252 1.08447C19.3797 1.08447 19.9115 1.30474 20.3036 1.69683C20.6957 2.08891 20.9159 2.62069 20.9159 3.17518C20.9159 3.72968 20.6957 4.26146 20.3036 4.65354L10.9407 14.0165L6.99839 15.002L7.98396 11.0598L17.3469 1.69683Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
