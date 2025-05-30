"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Upload, Plus, Trash2, MapPin, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Venue } from "@/models/Venue";
import { useEventDetails, useEventMutations } from "@/hooks/useEvents";
import { useVenueDetails, useVenueList } from "@/hooks/useVenue";
import { EventCategory, EventSectionPricing, EventStatus } from "@/models/Event";
import LoadingSpinner from "@/components/ui/loading";
import {
  CreateEventDTO,
  RescheduleEventDTO,
  SectionPricingDTO,
  UpdateEventDTO,
} from "@/models/DTO/EventDTO";
const categories = [
  { value: "MATCH", label: "Match" },
  { value: "CONCERT", label: "Concert" },
  { value: "OTHERS", label: "Others" },
];

const statusOptions = {
  Draft: ["Submit for approval"],
  Published: ["Cancel", "Postpone"],
  Postponed: ["Cancel"],
  Cancelled: [],
  Rescheduled: ["Cancel", "Postpone"],
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const isEditMode = eventId && eventId !== "new";

  //TODO: replace with actual admin check
  const isAdmin = true;
  const {
    createEvent: createNewEvent,
    updateEvent: updateExistingEvent,
    rescheduleEvent: rescheduleExistingEvent,
    cancelEvent: cancelExistingEvent,
    approveEvent: approveExistingEvent,
    submitEvent: submitExistingEvent,
    postponeEvent: postponeExistingEvent,
    isLoadingEventMuatation,
    clearError: clearMutationError,
  } = useEventMutations();
  const {
    loadEvent,
    isLoadingEventDetails,
    event,
    clearDetails: clearEventDetailsStore,
  } = useEventDetails();
  const { isLoadingDetails: isLoadingVenueDetails } = useVenueDetails();
  const { venues, isLoadingList: isLoadingVenuesList, loadVenues } = useVenueList();

  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [description, setDescription] = useState("");
  const [eventDateForm, setEventDateForm] = useState("");
  const [startTimeForm, setStartTimeForm] = useState("");
  const [endTimeForm, setEndTimeForm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<EventStatus>(EventStatus.DRAFT);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  const [sectionPricing, setSectionPricing] = useState<SectionPricingDTO[]>([]);
  const [prices, setPrices] = useState<EventSectionPricing[]>([]);
  const [originalEventData, setOriginalEventData] = useState<{
    startDateTime: string;
    endDateTime: string;
  }>({ startDateTime: "", endDateTime: "" });

  const posterInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVenues();
    if (isEditMode && eventId) {
      loadEvent(eventId);
    } else {
      clearEventDetailsStore();
      setEventName("");
      setCategory(null);
      setDescription("");
      setEventDateForm("");
      setStartTimeForm("");
      setEndTimeForm("");
      setSelectedVenue(null);
      setPosterImage(null);
      setGalleryImages([]);
      setDetails("");
      setStatus(EventStatus.DRAFT);
      setPrices([]);
      setOriginalEventData({ startDateTime: "", endDateTime: "" });
    }
  }, [loadEvent, eventId, isEditMode, clearEventDetailsStore, loadVenues]);

  useEffect(() => {
    if (event && isEditMode) {
      setEventName(event.name);
      setCategory(event.category);
      setDescription(event.description);
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);
      setEventDateForm(startDate.toISOString().split("T")[0]);
      setStartTimeForm(
        `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`
      );
      setEndTimeForm(
        `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
      );
      setOriginalEventData({
        startDateTime: event.startDateTime.toISOString(),
        endDateTime: event.endDateTime.toISOString(),
      });
      setPosterImage(event.poster);
      setGalleryImages(event.images);
      setDetails(event.details);
      setStatus(event.status);
      setPrices(event.sectionPricing);
    }
  }, [event, isEditMode]);

  useEffect(() => {
    if (event && isEditMode) {
      setSelectedVenue(venues.find(v => v.venueId === event.venueId) || null);
    }
  }, [venues, event, isEditMode]);

  if (isLoadingEventDetails || isLoadingVenueDetails || isLoadingVenuesList) {
    return <LoadingSpinner />;
  }

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setPosterImage(
            "https://cdn-images.vtv.vn/zoom/640_400/2015/liga-bbva-2014-2015-thumb-690-1432537493846.jpg"
          );
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
          setGalleryImages([
            ...galleryImages,
            "https://shineboutique.vn/wp-content/uploads/2024/10/nhung-cau-thu-tre-trien-vong-nhat-la-liga.webp",
          ]);
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

  const handleStatusAction = async (action: string) => {
    if (action === "Reject" && isAdmin) {
      setShowRejectionDialog(true);
      return;
    }
    try {
      let updatedEvent;
      switch (action) {
        case "Submit for approval":
          if (!eventId) {
            alert("Please save the draft event first.");
            return;
          }
          updatedEvent = await submitExistingEvent(eventId);
          break;
        case "Cancel":
          if (!eventId) return;
          updatedEvent = await cancelExistingEvent(eventId);
          break;
        case "Postpone":
          if (!eventId) return;
          updatedEvent = await postponeExistingEvent(eventId);
          break;
        default:
          console.warn("Unknown status action:", action);
          return;
      }
      if (updatedEvent) {
        setStatus(updatedEvent.status);
        alert(`Event status changed to ${updatedEvent.status}`);
        await loadEvent(eventId);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`Failed to ${action} event:`, err);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleRejectWithReason = async () => {
    if (!eventId) return;
    if (rejectionReason.trim() === "") {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      const updatedEvent = await cancelExistingEvent(eventId /*, rejectionReason */);
      setStatus(updatedEvent.status);
      setShowRejectionDialog(false);
      setRejectionReason("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to reject event:", err);
      alert(`Error rejecting event: ${errorMessage}`);
    }
  };

  const handleApproveAction = async () => {
    if (!eventId) return;
    try {
      await approveExistingEvent(eventId);
      await loadEvent(eventId);
      setStatus(EventStatus.PUBLISHED);
      alert("Event approved successfully");
    } catch (err) {
      console.error("Failed to approve event:", err);
      alert("Error approving event");
    }
  };

  const hasDateTimeChanged = () => {
    if (!eventDateForm || !startTimeForm || !endTimeForm || !originalEventData.startDateTime)
      return false;
    const currentStartISO = new Date(`${eventDateForm}T${startTimeForm}:00Z`).toISOString();
    const currentEndISO = new Date(`${eventDateForm}T${endTimeForm}:00Z`).toISOString();

    return (
      originalEventData.startDateTime !== currentStartISO ||
      originalEventData.endDateTime !== currentEndISO
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMutationError();

    if (!category || !selectedVenue?.venueId) {
      alert("Please fill in all required fields, including category and selecting a venue.");
      return;
    }

    const combinedStartDateTime = new Date(`${eventDateForm}T${startTimeForm}:00Z`).toISOString();
    const combinedEndDateTime = new Date(`${eventDateForm}T${endTimeForm}:00Z`).toISOString();

    if (isEditMode && eventId) {
      if (status === "Postponed" && hasDateTimeChanged()) {
        const rescheduleData: RescheduleEventDTO = {
          newStartDateTime: startTimeForm,
          newEndDateTime: endTimeForm,
        };
        try {
          const rescheduledEvent = await rescheduleExistingEvent(eventId, rescheduleData);
          setStatus(rescheduledEvent.status);
          alert("Event has been rescheduled successfully!");
          router.push("/organizer/event");
        } catch (err: unknown) {
          console.error("Failed to reschedule event:", err);
        }
      } else {
        const eventData: UpdateEventDTO = {
          name: eventName,
          category,
          description,
          venueId: selectedVenue.venueId,
          poster: posterImage || "",
          images: galleryImages,
          details,
        };
        try {
          await updateExistingEvent(eventId, eventData);
          alert("Event updated successfully!");
          router.push("/organizer");
        } catch (err: unknown) {
          console.error("Failed to update event:", err);
        }
      }
    } else {
      if (sectionPricing.length !== selectedVenue?.sections.length) {
        alert("Please set prices for all sections before creating the event.");
        return;
      }
      const eventData: CreateEventDTO = {
        name: eventName,
        category,
        description,
        startDateTime: combinedStartDateTime,
        endDateTime: combinedEndDateTime,
        venueId: selectedVenue.venueId,
        venueName: selectedVenue.name,
        venueAddress: selectedVenue.address,
        poster: posterImage || "",
        images: galleryImages,
        details,
        sectionPricing: sectionPricing,
      };
      try {
        await createNewEvent(eventData);
        alert("Event created successfully!");
        router.push(`/organizer`); // Navigate to the new event's page
      } catch (err: unknown) {
        console.error("Failed to create event:", err);
      }
    }
  };

  const defaultStadiumImage =
    posterImage ||
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="max-w-[1200px] mx-auto px-20 py-10">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? "Edit Event" : "Create New Event"}</h1>

      {/* {displayError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
          <span>{typeof displayError === 'string' ? displayError : JSON.stringify(displayError)}</span>
        </div>
      )} */}

      {isEditMode && (
        <div className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Current Status: <span className="font-bold">{status}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {status === "Draft" && "Your event is in draft mode. You can edit all details."}
                {status === "Submit for approval" &&
                  "Your event is awaiting approval from an admin."}
                {status === "Published" &&
                  "Your event is live. Some fields cannot be edited directly."}
                {status === "Postponed" && "Your event has been postponed. You can reschedule it."}
                {status === "Canceled" && "Your event has been cancelled."}
                {status === "Rescheduled" && "Your event has been rescheduled."}
                {status === "Rejected" && "Your event has been rejected by an admin."}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Show admin-specific buttons if user is admin */}
              {isAdmin && status === "Submit for approval" && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleApproveAction}
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center"
                  >
                    <CheckCircle className="mr-1" size={16} /> Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusAction("Reject")}
                    className="bg-red-500 hover:bg-red-600 text-white flex items-center"
                  >
                    <XCircle className="mr-1" size={16} /> Reject
                  </Button>
                </div>
              )}

              {status &&
                statusOptions[status as keyof typeof statusOptions]?.map(option => (
                  <Button
                    key={option}
                    onClick={() => handleStatusAction(option as EventStatus)}
                    className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
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
                onClick={handleRejectWithReason}
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
              value={category || ""}
              onChange={e => setCategory(e as EventCategory)}
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
                value={eventDateForm}
                onChange={e => setEventDateForm(e.target.value)}
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
                value={startTimeForm}
                onChange={e => setStartTimeForm(e.target.value)}
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
                value={endTimeForm}
                onChange={e => setEndTimeForm(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Venue</label>
            <Dropdown
              options={venues.map(v => ({ label: v.name, value: v.venueId }))}
              value={selectedVenue?.venueId || ""}
              onChange={venueId => {
                setSelectedVenue(venues.find(v => v.venueId === venueId) || null);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Venue name</label>
            <input
              type="text"
              placeholder="Venue name"
              value={selectedVenue?.name || ""}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-gray-100"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Venue location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Venue location"
                value={selectedVenue?.address || ""}
                readOnly
                className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-gray-100"
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
                {selectedVenue?.sections.map((section, index) => (
                  <div key={index} className="grid grid-cols-2 p-3 border-t border-gray-200">
                    <p className="text-center">{section.name}</p>
                    <div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={sectionPricing[index]?.price || ""}
                        onChange={e => {
                          const newSectionPricing = [...sectionPricing];
                          newSectionPricing[index] = {
                            sectionId: section.sectionId,
                            price: parseFloat(e.target.value),
                          };
                          setSectionPricing(newSectionPricing);
                        }}
                        className={`w-full h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${isPricingDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        disabled={isEditMode || isPricingDisabled}
                        required
                      />
                    </div>
                  </div>
                ))}
                {!eventId &&
                  selectedVenue?.sections.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 p-3 border-t border-gray-200">
                      <p className="text-center">{item.sectionId}</p>
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
            disabled={isLoadingEventMuatation || status === "Canceled"}
          >
            {isLoadingEventMuatation ? "Saving..." : isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
