"use client";
import TimeCount from "@/components/booking/TimeCount";
import TimeInfoConfirmPopup from "@/components/booking/TimeInfoConfirmPopup";
import { sampleEvents } from "@/libs/place-holder.data";
import Event from "@/models/event/Event";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TextField } from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CreditCard } from "lucide-react";
import TicketCard from "@/components/booking/TicketCard";

const fetchBookingEvent = async (eventId: string) => {
  // const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
  // if (!response.ok) {
  //   throw new Error("Failed to fetch event detail");
  // }
  // return response.json();
  console.log("event id" + eventId);
  return sampleEvents[0]; // Mocked data for now
};

type paymetState = "delivery" | "payment" | "confirm";

type QRCodeType = {
  eventName: string;
  date: string;
  time: string;
  venue: string;
  section: string;
  row: string;
  seatNumber: number;
};

const sampleQRCodeData: QRCodeType[] = Array.from({ length: 5 }, (_, index) => ({
  eventName: `Event ${index + 1}`,
  date: `2023-10-${index + 1}`,
  time: "19:00",
  venue: `Venue ${index + 1}`,
  section: `Section ${index + 1}`,
  row: `Row ${index + 1}`,
  seatNumber: index + 1,
}));

export default function PaymentPage() {
  const { eventId } = useParams();

  const [curEvent, setCurEvent] = useState<Event>();
  const [paymentState, setPaymentState] = useState<paymetState>("delivery");
  const [isOpenInfoTimePopup, setIsOpenInfoTimePopup] = useState(false);

  //States for delivery information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  //States for payment information
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  //States for selected seats
  const [selectedSeats, setSelectedSeats] = useState<QRCodeType[]>();

  useEffect(() => {
    const loadEventDataDetail = async () => {
      try {
        const event = await fetchBookingEvent(eventId as string);
        setCurEvent(event);
        setIsOpenInfoTimePopup(true);
        setSelectedSeats(sampleQRCodeData);
      } catch (error) {
        console.error("Error fetching event detail:", error);
      }
    };
    loadEventDataDetail();
  }, [eventId]);

  const handleTimeEnd = useCallback(
    () => () => {
      console.log("Time is up!");
    },
    []
  );

  const handleChangePaymentState = (state: paymetState) => {
    switch (state) {
      case "delivery":
        if (paymentState === "delivery") {
          alert("You are already on the delivery step.");
          return;
        }
        setPaymentState("delivery");
        break;
      case "payment":
        if (paymentState === "payment") {
          alert("You are already on the payment step.");
          return;
        } else if (paymentState === "delivery") {
          handleDeliveryContinue();
          return;
        }
        setPaymentState("payment");
        break;
      case "confirm":
        if (paymentState === "confirm") {
          alert("You are already on the confirm step.");
          return;
        } else if (paymentState === "payment") {
          handlePaymentContinue();
          return;
        } else if (paymentState === "delivery") {
          alert("Please complete the delivery step first.");
          return;
        }
        setPaymentState("confirm");
        break;
      default:
        break;
    }
  };

  const handleDeliveryContinue = () => {
    if (!fullName || !email || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    setPaymentState("payment");
  };

  const handlePaymentContinue = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      alert("Please fill in all payment fields.");
      return;
    }
    setPaymentState("confirm");
  };

  return (
    <div className="w-full min-h-screen py-6 px-12 flex flex-row">
      <div className="w-[70%] flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <TimeCount intialTime={600} onTimeEnd={handleTimeEnd} />
          <p className="font-semibold text-[16px] text-[#000]">
            Your tickets are guaranteed for this time!
          </p>
        </div>

        <div className="w-[80%] p-2 border-b border-t border-gray-400 flex flex-row items-center justify-center gap-2">
          <div
            onClick={() => handleChangePaymentState("delivery")}
            className={`px-3 py-1 cursor-pointer rounded-[6px] ${paymentState === "delivery" ? "bg-[#2ECC7166]" : "bg-[#6868681A]"}`}
          >
            <span
              className={`text-[16px] font-bold ${paymentState === "delivery" ? "text-black" : "text-gray-400"}`}
            >
              1. Delivery
            </span>
          </div>
          <ChevronRight
            color={`${paymentState === "delivery" ? "#2ECC71" : "#99a1af"}`}
            className={`w-5 h-5 font-bold`}
          />
          <div
            onClick={() => handleChangePaymentState("payment")}
            className={`px-3 py-1 cursor-pointer rounded-[6px] ${paymentState === "payment" ? "bg-[#2ECC7166]" : "bg-[#6868681A]"}`}
          >
            <span
              className={`text-[16px] font-bold ${paymentState === "payment" ? "text-black" : "text-gray-400"}`}
            >
              2. Payment
            </span>
          </div>
          <ChevronRight
            color={`${paymentState === "confirm" ? "#2ECC71" : "#99a1af"}`}
            className={`w-5 h-5 font-bold`}
          />
          <div
            onClick={() => handleChangePaymentState("confirm")}
            className={`px-3 py-1 cursor-pointer rounded-[6px] ${paymentState === "confirm" ? "bg-[#2ECC7166]" : "bg-[#6868681A]"}`}
          >
            <span
              className={`text-[16px] font-bold ${paymentState === "confirm" ? "text-black" : "text-gray-400"}`}
            >
              3. Confirm
            </span>
          </div>
        </div>

        <div className="w-[80%]">
          {paymentState === "delivery" && (
            <div className="w-full flex flex-col items-start gap-6">
              <div className="w-full flex flex-col items-start gap-2">
                <div className="w-full flex flex-col items-start">
                  <p className="text-[24px] font-bold text-[#000]">How do we contact you?</p>
                  <p className="text-[16px] font-semibold text-[#686868]">
                    Where do you want your tickets and receipt emailed?
                  </p>
                </div>
                <TextField
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value);
                  }}
                  placeholder="Full name"
                />
                <div className="w-full flex flex-row gap-1">
                  <TextField
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Email"
                  />
                  <TextField
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value);
                    }}
                    placeholder="Phone"
                  />
                </div>
              </div>
              <Button className="w-full py-5" onClick={handleDeliveryContinue}>
                Continue
              </Button>
            </div>
          )}

          {paymentState === "payment" && (
            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-start">
                <p className="text-[24px] font-bold text-[#000]">How would you like to pay?</p>
                <p className="text-[16px] font-semibold text-[#686868]">
                  All your information is always secured and encrypted.
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                <label className="flex items-center gap-1 py-2 px-3 border border-gray-300 rounded-md cursor-pointer">
                  <input type="radio" name="paymentMethod" value="creditCard" />
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    Credit Card
                  </span>
                </label>
                <label className="flex items-center gap-1 py-2 px-3 border border-gray-300 rounded-md cursor-pointer">
                  <input type="radio" name="paymentMethod" value="others" />
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    Others
                  </span>
                </label>
              </div>

              <div className="w-full flex flex-col gap-2">
                <TextField
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="Card number"
                />
                <TextField
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value)}
                  placeholder="Card holder"
                />
                <div className="w-full flex flex-row gap-2">
                  <TextField
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    placeholder="MM / YY"
                  />
                  <TextField value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" />
                </div>
              </div>

              <Button className="w-full py-5" onClick={handlePaymentContinue}>
                Continue
              </Button>
            </div>
          )}

          {paymentState === "confirm" && (
            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-start">
                <p className="text-[24px] font-bold text-[#000]">Enjoy the event</p>
                <p className="text-[16px] font-semibold text-[#686868]">
                  Tickets will be delivered within minutes to your email also.
                </p>
              </div>
              <div className="w-full px-4 grid grid-cols-2 gap-4">
                {selectedSeats?.map((ticket, index) => (
                  <TicketCard
                    date={ticket.date}
                    eventName={ticket.eventName}
                    key={index}
                    row={ticket.row}
                    section={ticket.section}
                    seatNumber={ticket.seatNumber}
                    time={ticket.time}
                    venue={ticket.venue}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-[28%] rounded-lg p-2 flex flex-col gap-3">
        {/* Match Image */}
        <div className="w-full h-[200px] bg-gray-200 rounded-[6px] overflow-hidden">
          <img
            src={sampleEvents[0].Image} // Replace with actual match image
            alt="Match"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Match Details */}
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-row justify-between items-center gap-1">
            <p className="text-sm text-gray-500">Match</p>
            <p className="text-lg font-bold">{curEvent?.Name}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Seats</p>
            <p className="text-base font-semibold">{sampleQRCodeData[0].seatNumber}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-semibold">{curEvent?.VenueId}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-base font-semibold">{curEvent?.StartDateTime}</p>
          </div>
        </div>

        <div className="border-t border-gray-300 py-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Tickets</p>
            <p className="text-sm font-semibold">$5 x 4</p>
          </div>
          <div className="flex justify-between border-t border-gray-300 py-3">
            <p className="text-base font-bold">Total</p>
            <p className="text-base font-bold">${300}</p>
          </div>
        </div>
      </div>
      {isOpenInfoTimePopup && (
        <TimeInfoConfirmPopup minutes={10} onStart={() => setIsOpenInfoTimePopup(false)} />
      )}
    </div>
  );
}
