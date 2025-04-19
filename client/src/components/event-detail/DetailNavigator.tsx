"use client";
import Image from "next/image";
import InfoNavigator from "./InfoNavigator";
import { useCallback, useState } from "react";
import About from "./About";
import { sampleEvents } from "@/libs/place-holder.data";
import { Button } from "../ui/button";
import Detail from "./Detail";
import Ticket from "./Ticket";
import { TextField } from "../ui/text-input";

export default function DetailNavigator() {
  const [infoSelect, setInfoSelect] = useState<"details" | "about" | "tickets">("about");

  const handleClick = useCallback((type: "details" | "about" | "tickets") => {
    setInfoSelect(type);
  }, []);

  return (
    <div className="w-full h-full flex flex-row">
      <div className="w-[38%] h-full overflow-hidden">
        <Image
          src={sampleEvents[0].Image}
          width={500}
          height={500}
          alt="Event"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="w-[6%] h-full">
        <InfoNavigator infoState={infoSelect} handleClick={handleClick} />
      </div>
      <div className="w-[55%] h-full flex flex-col items-start gap-4 px-8 py-5">
        <div className="w-full h-[95%]">
          {infoSelect === "about" && <About event={sampleEvents[0]} />}
          {infoSelect === "details" && <Detail event={sampleEvents[0]} />}
          {infoSelect === "tickets" && <Ticket />}
        </div>
        <div className="w-full h-[5%] flex flex-row-reverse">
          <Button
            variant={"default"}
            className="font-semibold px-6 py-4 text-[16px]"
          >
            Book
          </Button>
        </div>
      </div>
    </div>
  );
}
