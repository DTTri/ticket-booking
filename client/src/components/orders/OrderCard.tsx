import Image from "next/image";
import React from "react";

const AddressIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
      <g clipPath="url(#clip0_72_279)">
        <path
          d="M7 13.8638C10.5899 13.8638 13.5 10.9537 13.5 7.36377C13.5 3.77392 10.5899 0.86377 7 0.86377C3.41015 0.86377 0.5 3.77392 0.5 7.36377C0.5 10.9537 3.41015 13.8638 7 13.8638Z"
          stroke="#686868"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 10.8638L9.5 4.86377L3.5 6.86377L6 8.36377L7.5 10.8638Z"
          stroke="#686868"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_72_279">
          <rect width="14" height="14" fill="white" transform="translate(0 0.36377)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const TimeIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
      <g clipPath="url(#clip0_72_290)">
        <path
          d="M7 14.2881C10.0376 14.2881 12.5 11.8257 12.5 8.78809C12.5 5.75052 10.0376 3.28809 7 3.28809C3.96243 3.28809 1.5 5.75052 1.5 8.78809C1.5 11.8257 3.96243 14.2881 7 14.2881Z"
          stroke="#686868"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.5 3.28809C1.20228 2.47234 2.04999 1.79417 3 1.28809"
          stroke="#686868"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 3.28809C12.7977 2.47234 11.95 1.79417 11 1.28809"
          stroke="#686868"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 5.78809V8.78809H9.5"
          stroke="#686868"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_72_290">
          <rect width="14" height="14" fill="white" transform="translate(0 0.788086)" />
        </clipPath>
      </defs>
    </svg>
  );
};

type OrderStatus = "Incoming" | "Cancelled" | "Passed";

interface OrderCardProps {
  id?: number;
  eventName?: string;
  section?: string;
  row?: string;
  seats?: string;
  location?: string;
  date?: string;
  price?: number;
  status?: OrderStatus;
}

export default function OrderCard({
  eventName = "FC Barcelona vs Real Madrid",
  section = "214",
  row = "C",
  seats = "4,5,6",
  location = "America First Field, Sandy, Utah, USA",
  date = "Mar 22 • Sat • 7:30PM • 2025",
  price = 20,
  status = "Incoming",
}: OrderCardProps = {}) {
  return (
    <div className="w-full min-w-[400px] h-[104px] flex items-center justify-between rounded-lg border border-darkStroke">
      <Image
        width={140}
        height={104}
        src="https://s3-alpha-sig.figma.com/img/5e1d/cca4/1d465015292bd6a0807ef9dd78185596?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=AkC17HOXjOVt9K7k~v5jlmEsdSYkUobM946rVYtxFRFEqJH5Jxx9Adt-rti~K9TWlEnaMuGQNB-Fxlz2-rr~PtUfP5Jinp3nJLgpBlqylxsy75xdmrnod5Zm5LYlZf9FsEJGtyJDZIbyvjJpeNzVJwLc8aPKPghqb-TgTQkDuywR10rOcd4kEdKTT19NJrFI4hzJtKwLyTNoBxQenc0VU2LaFcSK8f2sAn3pGQaLzIjRC1cIrdEtQlfLFWwB88fuojghLClR234gALI3GYLMUVWkuJDew62JT5FSuLZGbqkmcpmexmuaxUmHohcj3e4KcAYN7AUHmo66PhzJ2nt5QQ__"
        alt="Event"
        className="rounded-sm h-full"
      />
      <div className="px-2 py-1 flex justify-between w-full h-full">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-darkText text-lg">{eventName}</h3>
            <p className="font-medium text-darkText text-base -mt-1">
              Section {section} • Row {row} • Seats {seats}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <AddressIcon />
              <p className="text-xs text-grayText">{location}</p>
            </div>
            <div className="flex gap-1 items-center">
              <TimeIcon />
              <p className="text-xs text-grayText">{date}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col h-[45px] justify-between items-end">
            {/* price */}
            <p className="font-semibold text-base text-darkText text-end">${price}</p>
            <p
              className={`font-semibold text-sm px-2 py-0.5 text-center ${status === "Incoming" ? "text-green-500" : status === "Cancelled" ? "text-red-500" : "text-gray-500"}`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
