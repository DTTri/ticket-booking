"use client";
import React, { useState, useEffect, useRef } from "react";
import { OrderCard } from "@/components";
import { Search, SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderStatus = "Incoming" | "Cancelled" | "Passed";
type SortField = "price" | "date";
type SortDirection = "asc" | "desc";

interface Order {
  id: number;
  eventName: string;
  section: string;
  row: string;
  seats: string;
  location: string;
  date: string;
  price: number;
  status: OrderStatus;
}

const mockOrders: Order[] = Array(10)
  .fill(0)
  .map((_, index) => ({
    id: index + 1,
    eventName: "FC Barcelona vs Real Madrid",
    section: "214",
    row: "C",
    seats: "4,5,6",
    location: "America First Field, Sandy, Utah, USA",
    date: "Mar 22 • Sat • 7:30PM • 2025",
    price: 20,
    status: index % 3 === 0 ? "Incoming" : index % 3 === 1 ? "Cancelled" : "Passed",
  }));

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (status: OrderStatus | "All") => {
    setFilterStatus(status);
    setIsFilterDropdownOpen(false);
  };

  const handleSortChange = (field: SortField | null, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
    setIsSortDropdownOpen(false);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsFilterDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false);
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let result = [...mockOrders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        order =>
          order.eventName.toLowerCase().includes(query) ||
          order.location.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== "All") {
      result = result.filter(order => order.status === filterStatus);
    }

    if (sortField) {
      result.sort((a, b) => {
        if (sortField === "price") {
          return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
        } else if (sortField === "date") {
          return sortDirection === "asc"
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date);
        }
        return 0;
      });
    }

    setFilteredOrders(result);
  }, [searchQuery, filterStatus, sortField, sortDirection]);

  return (
    <div className="w-full py-4 px-2">
      <div className="mx-auto w-full max-w-[620px] flex flex-col items-center gap-8">
        <div className="w-full flex justify-between items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search tickets"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* Filter button */}
            <div ref={filterDropdownRef} className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-10 border-gray-300"
                onClick={toggleFilterDropdown}
              >
                <SlidersHorizontal size={16} />
                Filter
                {filterStatus !== "All" && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {filterStatus}
                  </span>
                )}
              </Button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="p-2 border-b border-gray-200">
                    <p className="text-sm font-medium">Filter by Status</p>
                  </div>
                  <div className="p-2">
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleFilterChange("All")}
                    >
                      <span className="text-sm">All</span>
                      {filterStatus === "All" && <Check size={16} className="text-primary" />}
                    </div>
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleFilterChange("Incoming")}
                    >
                      <span className="text-sm">Incoming</span>
                      {filterStatus === "Incoming" && <Check size={16} className="text-primary" />}
                    </div>
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleFilterChange("Passed")}
                    >
                      <span className="text-sm">Passed</span>
                      {filterStatus === "Passed" && <Check size={16} className="text-primary" />}
                    </div>
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleFilterChange("Cancelled")}
                    >
                      <span className="text-sm">Cancelled</span>
                      {filterStatus === "Cancelled" && <Check size={16} className="text-primary" />}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sort button */}
            <div ref={sortDropdownRef} className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-10 border-gray-300"
                onClick={toggleSortDropdown}
              >
                <ArrowUpDown size={16} />
                Sort by price
                {sortField && (
                  <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </Button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="p-2 border-b border-gray-200">
                    <p className="text-sm font-medium">Sort by</p>
                  </div>
                  <div className="p-2">
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleSortChange(null, "asc")}
                    >
                      <span className="text-sm">No sorting</span>
                      {sortField === null && <Check size={16} className="text-primary" />}
                    </div>
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleSortChange("price", "asc")}
                    >
                      <span className="text-sm">Price (Low to High)</span>
                      {sortField === "price" && sortDirection === "asc" && (
                        <Check size={16} className="text-primary" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                      onClick={() => handleSortChange("price", "desc")}
                    >
                      <span className="text-sm">Price (High to Low)</span>
                      {sortField === "price" && sortDirection === "desc" && (
                        <Check size={16} className="text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                id={order.id}
                eventName={order.eventName}
                section={order.section}
                row={order.row}
                seats={order.seats}
                location={order.location}
                date={order.date}
                price={order.price}
                status={order.status}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
