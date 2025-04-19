"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Upload, Plus, Trash2, MapPin } from "lucide-react";
import Image from "next/image";

const categories = [
  { value: "match", label: "Match" },
  { value: "concert", label: "Concert" },
  { value: "others", label: "Others" },
];

export default function EventPage() {
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  const [prices, setPrices] = useState([
    { section: 1, price: 49.0 },
    { section: 2, price: 59.0 },
    { section: 3, price: 69.0 },
    { section: 4, price: 79.0 },
    { section: 5, price: 89.0 },
    { section: 6, price: 99.0 },
    { section: 7, price: 109.0 },
    { section: 8, price: 119.0 },
  ]);

  const posterInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setPosterImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setGalleryImages([...galleryImages, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // const eventData = {
    //   name: eventName,
    //   category,
    //   description,
    //   date: eventDate,
    //   startTime,
    //   endTime,
    //   venueName,
    //   venueLocation,
    //   posterImage,
    //   galleryImages,
    //   details,
    //   prices,
    // };

    alert("Event saved successfully!");
  };

  // Default stadium image for poster preview
  const defaultStadiumImage =
    posterImage ||
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="max-w-[1200px] mx-auto px-20 py-10">
      <h1 className="text-3xl font-bold mb-12">Bum bum ciao! New super event!</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Event name"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Dropdown
              options={categories}
              value={category}
              onChange={setCategory}
              placeholder="Select category"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            placeholder="Event description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start time</label>
            <div className="relative">
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="">Select time</option>
                {Array.from({ length: 24 }).map((_, hour) =>
                  Array.from({ length: 4 }).map((_, quarterIdx) => {
                    const minute = quarterIdx * 15;
                    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                    return (
                      <option key={timeStr} value={timeStr}>
                        {timeStr}
                      </option>
                    );
                  })
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End time</label>
            <div className="relative">
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="">Select time</option>
                {Array.from({ length: 24 }).map((_, hour) =>
                  Array.from({ length: 4 }).map((_, quarterIdx) => {
                    const minute = quarterIdx * 15;
                    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                    return (
                      <option key={timeStr} value={timeStr}>
                        {timeStr}
                      </option>
                    );
                  })
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Venue name</label>
            <input
              type="text"
              placeholder="Venue name"
              value={venueName}
              onChange={e => setVenueName(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Venue location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Venue location"
                value={venueLocation}
                onChange={e => setVenueLocation(e.target.value)}
                className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Poster */}
        <div>
          <label className="block text-sm font-medium mb-2">Poster</label>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              {posterImage ? (
                <div className="relative">
                  <Image
                    src={posterImage}
                    alt="Event poster"
                    width={400}
                    height={250}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setPosterImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => posterInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary bg-gray-50"
                >
                  <Image
                    src={defaultStadiumImage}
                    alt="Default stadium"
                    width={400}
                    height={250}
                    className="w-full h-full object-cover rounded-md opacity-30"
                  />
                  <div className="absolute flex flex-col items-center justify-center">
                    <Upload size={48} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload poster image</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={posterInputRef}
                onChange={handlePosterUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stadium Map */}
            <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/009/384/331/original/stadium-seating-plan-template-free-vector.jpg"
                alt="Stadium seating map"
                width={500}
                height={300}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Price Table */}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="flex justify-around bg-primary p-3 font-medium">
                <div>Section</div>
                <div>Price ($)</div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {prices.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 p-3 border-t border-gray-200">
                    <p className="text-center">{item.section}</p>
                    <div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={e => {
                          const newPrices = [...prices];
                          newPrices[index].price = parseFloat(e.target.value);
                          setPrices(newPrices);
                        }}
                        className="w-full h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea
            placeholder="Event details"
            value={details}
            onChange={e => setDetails(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <div className="flex flex-wrap gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <div
              onClick={() => galleryInputRef.current?.click()}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary"
            >
              <Plus size={24} className="text-gray-400" />
              <p className="text-xs text-gray-500 mt-1">Add image</p>
            </div>
            <input
              type="file"
              ref={galleryInputRef}
              onChange={handleGalleryUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
