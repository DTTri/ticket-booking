"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/libs/utils";
import { Check, ChevronDown } from "lucide-react";

interface DropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (_value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  buttonClassName,
  menuClassName,
  optionClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn("relative inline-block w-full", className)}>
      <button
        type="button"
        className={cn(
          "flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          buttonClassName
        )}
        onClick={toggleDropdown}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg",
            menuClassName
          )}
        >
          <ul className="py-1 overflow-auto text-base max-h-60">
            {options.map(option => (
              <li key={option.value}>
                <button
                  type="button"
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-gray-100",
                    value === option.value && "bg-primary/10 text-primary",
                    optionClassName
                  )}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                  {value === option.value && <Check className="w-4 h-4 ml-2" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
