"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Upload, Plus, Trash2, MapPin, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const categories = [
  { value: "match", label: "Match" },
  { value: "concert", label: "Concert" },
  { value: "others", label: "Others" },
];

const statusOptions = {
  Draft: ["Submit for Approval"],
  "Submit for Approval": [], // Admin transitions this to "Published"
  Published: ["Cancelled", "Postponed"],
  Postponed: [],
  Cancelled: [],
  Rescheduled: ["Cancelled", "Postponed"],
};

const isUserAdmin = () => {
  return true;
};

const fetchEventData = async (id: string) => {
  return {
    id,
    name: "Bien Hoa FC vs. Dong Nai FC",
    category: "match",
    description: "A crucial match in the V.League",
    date: "2025-04-03",
    startTime: "19:30",
    endTime: "22:30",
    venueName: "Can Tho Stadium",
    venueLocation: "Can Tho, Vietnam",
    posterImage: null,
    galleryImages: [],
    details: "Additional details about the match...",
    status: "Submit for Approval",
    prices: [
      { section: 1, price: 49.0 },
      { section: 2, price: 59.0 },
      { section: 3, price: 69.0 },
      { section: 4, price: 79.0 },
      { section: 5, price: 89.0 },
      { section: 6, price: 99.0 },
      { section: 7, price: 109.0 },
      { section: 8, price: 119.0 },
    ],
  };
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const isEditMode = eventId && eventId !== "new";

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
  const [status, setStatus] = useState("Draft");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [isAdmin] = useState(isUserAdmin());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const loadEventData = async () => {
      if (isEditMode) {
        setIsLoading(true);
        try {
          const eventData = await fetchEventData(eventId);

          // Populate form with event data
          setEventName(eventData.name);
          setCategory(eventData.category);
          setDescription(eventData.description);
          setEventDate(eventData.date);
          setStartTime(eventData.startTime);
          setEndTime(eventData.endTime);
          setVenueName(eventData.venueName);
          setVenueLocation(eventData.venueLocation);
          setPosterImage(eventData.posterImage);
          setGalleryImages(eventData.galleryImages);
          setDetails(eventData.details);
          setStatus(eventData.status);
          setPrices(eventData.prices);

          setError("");
        } catch (err) {
          setError("Failed to load event data. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadEventData();
  }, [isEditMode, eventId]);

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

  const isDateTimeDisabled = status !== "Draft" && status !== "Postponed";

  const isPricingDisabled = status !== "Draft";

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Rejected" && isAdmin) {
      // Show rejection reason dialog for admins
      setShowRejectionDialog(true);
    } else {
      setStatus(newStatus);
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim() === "") {
      alert("Please provide a reason for rejection");
      return;
    }

    setStatus("Rejected");
    setShowRejectionDialog(false);
    // In a real app, you would save the rejection reason to the database
  };

  const handleApprove = async () => {
    setIsLoading(true);

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus("Published");
      alert("Event has been approved and published!");
    } catch (err) {
      setError("Failed to approve event. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [originalEventData, setOriginalEventData] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  }>({ date: "", startTime: "", endTime: "" });

  useEffect(() => {
    if (isEditMode && !isLoading) {
      setOriginalEventData({
        date: eventDate,
        startTime,
        endTime,
      });
    }
  }, [isEditMode, isLoading, eventDate, startTime, endTime]);

  const hasDateTimeChanged = () => {
    return (
      originalEventData.date !== eventDate ||
      originalEventData.startTime !== startTime ||
      originalEventData.endTime !== endTime
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedStatus = status;
    if (status === "Postponed" && hasDateTimeChanged()) {
      updatedStatus = "Rescheduled";
    }

    // const eventData = {
    //   id: isEditMode ? eventId : undefined,
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
    //   status: updatedStatus,
    //   prices,
    // };

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (updatedStatus !== status) {
        setStatus(updatedStatus);
      }

      if (status === "Postponed" && updatedStatus === "Rescheduled") {
        alert("Event has been rescheduled successfully!");
      } else {
        alert(`Event ${isEditMode ? "updated" : "created"} successfully!`);
      }

      router.push("/organizer");
    } catch (err) {
      setError("Failed to save event. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultStadiumImage =
    posterImage ||
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  if (isLoading && isEditMode) {
    return (
      <div className="max-w-[1200px] mx-auto px-20 py-10 flex justify-center items-center min-h-[50vh]">
        <p className="text-xl">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-20 py-10">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? "Edit Event" : "Create New Event"}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}

      {isEditMode && (
        <div className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Current Status: <span className="font-bold">{status}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {status === "Draft" && "Your event is in draft mode. You can edit all details."}
                {status === "Submit for Approval" &&
                  "Your event is awaiting approval from an admin."}
                {status === "Published" &&
                  "Your event is live. Some fields cannot be edited directly."}
                {status === "Postponed" && "Your event has been postponed. You can reschedule it."}
                {status === "Cancelled" && "Your event has been cancelled."}
                {status === "Rescheduled" && "Your event has been rescheduled."}
                {status === "Rejected" && "Your event has been rejected by an admin."}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Show admin-specific buttons if user is admin */}
              {isAdmin && status === "Submit for Approval" && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleApprove}
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center"
                  >
                    <CheckCircle className="mr-1" size={16} /> Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("Rejected")}
                    className="bg-red-500 hover:bg-red-600 text-white flex items-center"
                  >
                    <XCircle className="mr-1" size={16} /> Reject
                  </Button>
                </div>
              )}

              {/* Show regular status change buttons */}
              {statusOptions[status as keyof typeof statusOptions]?.map(option => (
                <Button
                  key={option}
                  onClick={() => handleStatusChange(option)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Admin-only section */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Admin Actions</h3>
                <Link href="/admin/payments" className="text-blue-500 hover:text-blue-700">
                  View Payment Transactions
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rejection Dialog */}
      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Event</h3>
            <p className="mb-4">Please provide a reason for rejecting this event:</p>
            <textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary mb-4"
              placeholder="Rejection reason..."
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setShowRejectionDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Reject Event
              </Button>
            </div>
          </div>
        </div>
      )}

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
              required
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
            required
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
                className={`w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${isDateTimeDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                disabled={isDateTimeDisabled}
                required
              />
            </div>
            {/* {status === "Postponed" ? (
              <p className="text-xs text-blue-600 mt-1">
                Changing the date will automatically update the event status to
                &quot;Rescheduled&quot;.
              </p>
            ) : (
              isDateTimeDisabled && (
                <p className="text-xs text-amber-600 mt-1">
                  Date cannot be changed directly when event is not in Draft status.
                </p>
              )
            )} */}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start time</label>
            <div className="relative">
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className={`w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none ${isDateTimeDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                disabled={isDateTimeDisabled}
                required
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
            {/* {status === "Postponed" ? (
              <p className="text-xs text-blue-600 mt-1">
                Changing the start time will automatically update the event status to
                &quot;Rescheduled&quot;.
              </p>
            ) : (
              isDateTimeDisabled && (
                <p className="text-xs text-amber-600 mt-1">
                  Start time cannot be changed directly when event is not in Draft status.
                </p>
              )
            )} */}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End time</label>
            <div className="relative">
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className={`w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none ${isDateTimeDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                disabled={isDateTimeDisabled}
                required
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
            {/* {status === "Postponed" ? (
              <p className="text-xs text-blue-600 mt-1">
                Changing the end time will automatically update the event status to
                &quot;Rescheduled&quot;.
              </p>
            ) : (
              isDateTimeDisabled && (
                <p className="text-xs text-amber-600 mt-1">
                  End time cannot be changed directly when event is not in Draft status.
                </p>
              )
            )} */}
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
              required
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
                required
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Price</label>
            {/* {isPricingDisabled && (
              <span className="text-xs text-amber-600">
                Pricing cannot be changed when event is not in Draft status.
              </span>
            )} */}
          </div>
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
                        className={`w-full h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${isPricingDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        disabled={isPricingDisabled}
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
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.push("/organizer")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6"
            disabled={isLoading || status === "Cancelled"}
          >
            {isLoading ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
