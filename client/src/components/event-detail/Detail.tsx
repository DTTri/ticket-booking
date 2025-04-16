import Event from "@/models/Event";
import React from "react";

interface Props {
  event: Event;
}

export default function Detail({ event }: Props) {

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-black mb-1">{event.Name}</h1>
      <p className="text-gray-500 text-sm mb-4">{event.Status}</p>


      <p className="text-gray-700 text-sm leading-6">
        {event.Description}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada
        ipsum sit amet nulla feugiat, vitae accumsan neque tincidunt. Morbi sit
        amet dapibus nisi. Nulla scelerisque, dolor eget cursus lobortis, dui
        massa ultricies dui, non blandit nibh ipsum ac diam. Aenean non
        ultricies urna, at sagittis ipsum. Morbi mattis sit amet ex ut bibendum.
        Sed viverra tortor metus, ac mattis ante efficitur eu. Sed semper
        faucibus justo, vel congue tortor sodales eget. Phasellus elementum est
        et pharetra elementum. Aliquam euismod, eros sit amet vulputate
        eleifend, turpis nibh semper velit, vel suscipit ligula metus id nisl.
        Duis rhoncus orci eget nisl accumsan, sed eleifend est egestas.
      </p>
    </div>
  );
}