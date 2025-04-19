import Event from "@/models/Event";
import React from "react";

interface Props {
  event: Event;
}

export default function About({ event }: Props) {
  const startDate = new Date(event.StartDateTime);
  const endDate = new Date(event.EndDateTime);

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

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-black mb-1">{event.Name}</h1>
      <p className="text-gray-500 text-sm mb-4">{event.Status}</p>

      {/* Venue */}
      <div className="flex items-start gap-3 mb-4">
        {/* Thieu logo <FaMapMarkerAlt className="text-primary mt-1" /> */}
        <div>
          <h3 className="text-black font-semibold text-lg">Location</h3>
          <p className="text-gray-600 text-sm">
            Av. de Concha Espina, 1, Chamartín, 28036 Madrid, Tây Ban Nha
          </p>
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex items-start gap-3 mb-6">
        {/* Thieu logo <FaClock className="text-primary mt-1" /> */}
        <div>
          <h3 className="text-black font-semibold text-lg">{formattedDate}</h3>
          <p className="text-gray-600 text-sm">
            {formattedStartTime} - {formattedEndTime}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada ipsum sit amet
        nulla feugiat, vitae accumsan neque tincidunt. Morbi sit amet dapibus nisi. Nulla
        scelerisque, dolor eget cursus lobortis, dui massa ultricies dui, non blandit nibh ipsum ac
        diam. Aenean non ultricies urna, at sagittis ipsum. Morbi mattis sit amet ex ut bibendum.
        Sed viverra tortor metus, ac mattis ante efficitur eu. Sed semper faucibus justo, vel congue
        tortor sodales eget. Phasellus elementum est et pharetra elementum. Aliquam euismod, eros
        sit amet vulputate eleifend, turpis nibh semper velit, vel suscipit ligula metus id nisl.
        Duis rhoncus orci eget nisl accumsan, sed eleifend est egestas.
      </p>
    </div>
  );
}
