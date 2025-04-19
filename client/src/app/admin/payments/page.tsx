"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown, Calendar, Download, Eye } from "lucide-react";
import Link from "next/link";

// Define types for payment data
interface Payment {
  id: string;
  eventId: string;
  eventName: string;
  customerName: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  method: string;
}

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    eventId: "EVT-001",
    eventName: "Bien Hoa FC vs. Dong Nai FC",
    customerName: "John Doe",
    amount: 149.0,
    date: "2023-12-15",
    status: "Completed",
    method: "Credit Card",
  },
  {
    id: "PAY-002",
    eventId: "EVT-001",
    eventName: "Bien Hoa FC vs. Dong Nai FC",
    customerName: "Jane Smith",
    amount: 298.0,
    date: "2023-12-14",
    status: "Completed",
    method: "PayPal",
  },
  {
    id: "PAY-003",
    eventId: "EVT-002",
    eventName: "Music Festival 2024",
    customerName: "Mike Johnson",
    amount: 75.0,
    date: "2023-12-10",
    status: "Refunded",
    method: "Credit Card",
  },
  {
    id: "PAY-004",
    eventId: "EVT-003",
    eventName: "Tech Conference 2024",
    customerName: "Sarah Williams",
    amount: 199.0,
    date: "2023-12-05",
    status: "Failed",
    method: "Bank Transfer",
  },
  {
    id: "PAY-005",
    eventId: "EVT-002",
    eventName: "Music Festival 2024",
    customerName: "Robert Brown",
    amount: 150.0,
    date: "2023-12-01",
    status: "Pending",
    method: "Credit Card",
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [sortBy, setSortBy] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "date",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filteredPayments = [...mockPayments];

    if (searchTerm) {
      filteredPayments = filteredPayments.filter(
        payment =>
          payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredPayments = filteredPayments.filter(payment => payment.status === statusFilter);
    }

    if (dateRange.start && dateRange.end) {
      filteredPayments = filteredPayments.filter(
        payment => payment.date >= dateRange.start && payment.date <= dateRange.end
      );
    }

    filteredPayments.sort((a, b) => {
      const aValue = a[sortBy.field as keyof Payment];
      const bValue = b[sortBy.field as keyof Payment];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortBy.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortBy.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    setPayments(filteredPayments);
  }, [searchTerm, statusFilter, dateRange, sortBy]);

  const handleSort = (field: string) => {
    setSortBy({
      field,
      direction: sortBy.field === field && sortBy.direction === "asc" ? "desc" : "asc",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Transactions</h1>
        <div className="flex gap-2">
          <Link href="/organizer">
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Back to Events</Button>
          </Link>
          <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center">
            <Download className="mr-2" size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by ID, event name, or customer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center"
          >
            <Filter className="mr-2" size={16} />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 border border-gray-300 rounded-md bg-gray-50 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={statusFilter || ""}
                  onChange={e => setStatusFilter(e.target.value || null)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  setStatusFilter(null);
                  setDateRange({ start: "", end: "" });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-2"
              >
                Reset Filters
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Payment ID
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("eventName")}
                >
                  <div className="flex items-center">
                    Event
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("customerName")}
                >
                  <div className="flex items-center">
                    Customer
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("method")}
                >
                  <div className="flex items-center">
                    Method
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.eventName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center">
                        <Eye size={14} className="mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No payment transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {payments.length} of {mockPayments.length} transactions
        </div>
        <div className="flex gap-2">
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Previous</Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Next</Button>
        </div>
      </div>
    </div>
  );
}
