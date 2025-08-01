"use client";
import TimeCount from "@/components/booking/TimeCount";
import TimeInfoConfirmPopup from "@/components/booking/TimeInfoConfirmPopup";
import { sampleEvents } from "@/libs/place-holder.data";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TextField } from "@/components/ui/textinput";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { CreditCard } from "lucide-react";
import TicketCard from "@/components/booking/TicketCard";
import Image from "next/image";
import { useProcessPayment } from "@/hooks/usePayment";
import { useBookingDetails } from "@/hooks/useBooking";
import { useAuthSession } from "@/hooks/useUser";
import { PaymentDTO } from "@/models/DTO/PaymentDTO";
import LoadingSpinner from "@/components/ui/loading";
import { useEventDetails } from "@/hooks/useEvents";

// const fetchBookingEvent = async (eventId: string) => {
//   // const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
//   // if (!response.ok) {
//   //   throw new Error("Failed to fetch event detail");
//   // }
//   // return response.json();
//   console.warn("event id" + eventId);
//   return sampleEvents[0]; // Mocked data for now
// };

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
  const router = useRouter();

  // Redux hooks
  const { currentBooking } = useBookingDetails();
  const { user } = useAuthSession();
  const {
    processPayment,
    paymentResponse,
    isLoading: isProcessingPayment,
    error: paymentError,
    clearError: clearPaymentError,
  } = useProcessPayment();

  const { event: curEvent, loadEvent } = useEventDetails();
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
    if (eventId) {
      loadEvent(eventId as string);
    }
  }, [eventId, loadEvent]);
  useEffect(() => {
    if (curEvent) {
      setIsOpenInfoTimePopup(true);
      setSelectedSeats(sampleQRCodeData);
    }
  }, [curEvent]);

  // Handle successful payment
  useEffect(() => {
    if (paymentResponse && paymentState === "payment") {
      setPaymentState("confirm");
    }
  }, [paymentResponse, paymentState]);

  // Clear payment error when user starts typing
  useEffect(() => {
    if (paymentError && (cardNumber || cardHolder || expiryDate || cvv)) {
      clearPaymentError();
    }
  }, [cardNumber, cardHolder, expiryDate, cvv, paymentError, clearPaymentError]);

  const handleTimeEnd = useCallback(
    () => () => {
      console.warn("Time is up!");
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

  const handlePaymentContinue = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      alert("Please fill in all payment fields.");
      return;
    }

    if (!currentBooking?.bookingId) {
      alert("No booking found. Please try again.");
      return;
    }

    if (!user?.userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      // Parse expiry date (MM/YY format)
      const [month, year] = expiryDate.split("/");

      const paymentData: PaymentDTO = {
        bookingId: currentBooking.bookingId,
        userId: user.userId,
        fullName: fullName,
        email: email,
        phoneNumber: phone,
        cardNumber: cardNumber,
        cardHolderName: cardHolder,
        expiryMonth: month.padStart(2, "0"),
        expiryYear: `20${year}`, // Convert YY to YYYY
        cvv: cvv,
      };

      await processPayment(paymentData);
      // State will be changed automatically in useEffect when paymentResponse is received
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
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

              {paymentError && (
                <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {paymentError}
                </div>
              )}

              <Button
                className="w-full py-5"
                onClick={handlePaymentContinue}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    Processing Payment...
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          )}

          {paymentState === "confirm" && (
            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col items-start">
                <p className="text-[24px] font-bold text-[#000]">Payment Successful!</p>
                <p className="text-[16px] font-semibold text-[#686868]">
                  Tickets will be delivered within minutes to your email also.
                </p>
                {paymentResponse && (
                  <div className="w-full mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <p className="font-semibold">Payment ID: {paymentResponse.paymentId}</p>
                    <p>Transaction ID: {paymentResponse.transactionId}</p>
                    <p>Status: {paymentResponse.status}</p>
                    <p>Amount: ${paymentResponse.amount}</p>
                  </div>
                )}
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
              <div className="w-full flex gap-4">
                <Button className="flex-1 py-3" onClick={() => router.push("/orders")}>
                  View My Orders
                </Button>
                <Button className="flex-1 py-3" variant="outline" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-[28%] rounded-lg p-2 flex flex-col gap-3">
        {/* Match Image */}
        <div className="w-full h-[200px] bg-gray-200 rounded-[6px] overflow-hidden">
          <Image
            src={sampleEvents[0].poster} // Replace with actual match image
            alt="Match"
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Match Details */}
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-row justify-between items-center gap-1">
            <p className="text-sm text-gray-500">Match</p>
            <p className="text-lg font-bold">{curEvent?.name}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Seats</p>
            <p className="text-base font-semibold">{sampleQRCodeData[0].seatNumber}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-semibold">{curEvent?.venueAddress.slice(0, 20)}</p>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-base font-semibold">{curEvent?.startDateTime.toLocaleString()}</p>
          </div>
        </div>

        {/* <div className="border-t border-gray-300 py-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Tickets</p>
            <p className="text-sm font-semibold">${sampleQRCodeData.length} x $10</p>
          </div>
          <div className="flex justify-between border-t border-gray-300 py-3">
            <p className="text-base font-bold">Total</p>
            <p className="text-base font-bold">${currentBooking?.totalPrice}</p>
          </div>
        </div> */}
      </div>
      {isOpenInfoTimePopup && (
        <TimeInfoConfirmPopup minutes={10} onStart={() => setIsOpenInfoTimePopup(false)} />
      )}
    </div>
  );
}
