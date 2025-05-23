import React from "react";
import { cn } from "@/libs/utils";

interface CircularProgressProps {
  size?: string | number; 
  color?: "primary" | "secondary" | "inherit" | string;
  thickness?: number;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = "2.5rem", // 40px
  color = "primary",
  thickness = 4,
  className,
}) => {
  const sizeInPx = typeof size === "number" ? size : parseFloat(size) * 16; 

  const circleStyle: React.CSSProperties = {
    strokeWidth: thickness,
  };

  let strokeColorClass = "stroke-blue-700";
  if (color === "primary") {
    strokeColorClass = "stroke-primary"; 
  } else if (color === "secondary") {
    strokeColorClass = "stroke-gray-500"; 
  } else if (color === "inherit") {
    strokeColorClass = "stroke-current";
  } else if (typeof color === 'string') {
    // Custom color
  }


  return (
    <svg
      className={cn("animate-spin", className)}
      style={{ width: size, height: size }}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={cn("opacity-25", strokeColorClass)}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        style={circleStyle}
      />
      <circle
        className={cn("opacity-75", strokeColorClass)}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeDasharray="31.415, 125.66" // Khoảng 1/4 chu vi (2*PI*R / 4)
        strokeLinecap="round"
        style={circleStyle}
      >
      </circle>
    </svg>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-600 bg-opacity-50 flex items-center justify-center">
      <CircularProgress size="3rem" color='primary'/>
    </div>
  )
}

export default LoadingSpinner;