"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  User,
  Tag,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Define types for the payment data
interface Ticket {
  section: string;
  row: string;
  seat: string;
  price: number;
  quantity: number;
}

interface PaymentDetails {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventLocation: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  transactionDate: string;
  amount: number;
  fees: number;
  total: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  method: string;
  cardType?: string;
  cardLast4?: string;

  tickets: Ticket[];

  refundable: boolean;
  refundDeadline: string;
  notes: string;

  // Optional fields that may be added after a refund
  refundAmount?: number;
  refundReason?: string;
  refundDate?: string;
}

const mockPaymentDetails: PaymentDetails = {
  id: "PAY-001",
  eventId: "EVT-001",
  eventName: "Bien Hoa FC vs. Dong Nai FC",
  eventDate: "2025-04-03",
  eventTime: "19:30",
  eventVenue: "Can Tho Stadium",
  eventLocation: "Can Tho, Vietnam",

  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "+84 123 456 789",

  transactionDate: "2023-12-15T14:30:00Z",
  amount: 149.0,
  fees: 5.0,
  total: 154.0,
  status: "Completed",
  method: "Credit Card",
  cardType: "Visa",
  cardLast4: "4242",

  tickets: [
    { section: "Section 1", row: "A", seat: "12", price: 49.0, quantity: 1 },
    { section: "Section 2", row: "B", seat: "15-16", price: 50.0, quantity: 2 },
  ],

  refundable: true,
  refundDeadline: "2025-03-03",
  notes: "",
};

export default function PaymentDetailsPage() {
  const params = useParams();
  const paymentId = params?.id as string;
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState<number | string>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setPayment(mockPaymentDetails);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      alert("Please provide a reason for the refund");
      return;
    }

    if (!refundAmount || parseFloat(refundAmount.toString()) <= 0) {
      alert("Please enter a valid refund amount");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (payment) {
        setPayment({
          ...payment,
          status: "Refunded" as const,
          refundAmount: parseFloat(refundAmount.toString()),
          refundReason,
          refundDate: new Date().toISOString(),
        });
      }

      setShowRefundDialog(false);
      alert("Refund processed successfully");
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Failed to process refund. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusInfo = (status: PaymentDetails["status"]) => {
    switch (status) {
      case "Completed":
        return {
          style: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-5 h-5 mr-2 text-green-600" />,
        };
      case "Pending":
        return {
          style: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="w-5 h-5 mr-2 text-yellow-600" />,
        };
      case "Failed":
        return {
          style: "bg-red-100 text-red-800",
          icon: <XCircle className="w-5 h-5 mr-2 text-red-600" />,
        };
      case "Refunded":
        return {
          style: "bg-blue-100 text-blue-800",
          icon: <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />,
        };
      default:
        return {
          style: "bg-gray-100 text-gray-800",
          icon: <AlertTriangle className="w-5 h-5 mr-2 text-gray-600" />,
        };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex justify-center items-center min-h-[50vh]">
        <p className="text-xl">Loading payment details...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center mb-6">
          <Link href="/admin/payments">
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Back to Payments
            </Button>
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Payment not found or an error occurred.</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(payment.status);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/payments">
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center mr-4">
              <ArrowLeft className="mr-2" size={16} />
              Back to Payments
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Payment #{payment.id}</h1>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center">
            <Download className="mr-2" size={16} />
            Download Receipt
          </Button>
          {payment.status === "Completed" && payment.refundable && (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                setRefundAmount(payment.total);
                setShowRefundDialog(true);
              }}
            >
              Process Refund
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Payment Summary</h2>
            <div
              className="flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: statusInfo.style }}
            >
              {statusInfo.icon}
              {payment.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Payment ID</p>
              <p className="font-medium">{payment.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction Date</p>
              <p className="font-medium">{new Date(payment.transactionDate).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-1 text-gray-500" />
                <p className="font-medium">
                  {payment.method}{" "}
                  {payment.cardType && `(${payment.cardType} **** ${payment.cardLast4})`}
                </p>
              </div>
            </div>
            {payment.status === "Refunded" && (
              <div>
                <p className="text-sm text-gray-500">Refund Date</p>
                <p className="font-medium">
                  {payment.refundDate ? new Date(payment.refundDate).toLocaleString() : "-"}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-semibold mb-3">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p>${payment.amount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Service Fee</p>
                <p>${payment.fees.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>${payment.total.toFixed(2)}</p>
              </div>
              {payment.status === "Refunded" && payment.refundAmount && (
                <div className="flex justify-between text-blue-600 font-semibold">
                  <p>Refunded Amount</p>
                  <p>-${payment.refundAmount.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {payment.status === "Refunded" && payment.refundReason && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Refund Information</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Reason:</span> {payment.refundReason}
              </p>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-1">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <p className="font-medium">{payment.customerName}</p>
              </div>
              <div className="flex items-center mb-1">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-600">{payment.customerEmail}</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-600">{payment.customerPhone}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">Event Information</h3>
              <div className="flex items-start mb-1">
                <Tag className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium">{payment.eventName}</p>
                  <p className="text-sm text-gray-500">Event ID: {payment.eventId}</p>
                </div>
              </div>
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-600">{new Date(payment.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-gray-600">{payment.eventTime}</p>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-600">{payment.eventVenue}</p>
                  <p className="text-sm text-gray-500">{payment.eventLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Section
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Row
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Seat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payment.tickets.map((ticket: Ticket, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.row}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.seat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${ticket.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(ticket.price * ticket.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Add notes about this transaction..."
          value={payment.notes}
          onChange={e => setPayment({ ...payment, notes: e.target.value })}
        />
        <div className="flex justify-end mt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Save Notes</Button>
        </div>
      </div>

      {showRefundDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Process Refund</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Refund Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  max={payment.total}
                  step="0.01"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Maximum refund amount: ${payment.total.toFixed(2)}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Reason for Refund</label>
              <textarea
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Provide a reason for the refund..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setShowRefundDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRefund}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Process Refund"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
