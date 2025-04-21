"use client";
import { useState, useEffect } from "react";
import bg_auth1 from "../../../../public/bg_auth_1.jpg";
import bg_auth2 from "../../../../public/bg_auth_2.jpg";
import bg_auth3 from "../../../../public/bg_auth_3.jpg";
import logo_app from "../../../../public/logo_app2.svg";
import Image from "next/image";
import { useParams } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import LoginForm from "@/components/auth/LoginForm";

type Content = {
  title: string;
  description: string;
};

const content: Content[] = [
  {
    title: "One Platform. Unlimited Cheers.",
    description:
      "Join thousands of fans and organizers connecting through unforgettable sports experiences.",
  },
  {
    title: "Book your seat. Live the moment.",
    description:
      "Find, book, and secure your seats for your favorite sports events — all in just a few clicks!",
  },
  {
    title: "Organize Smarter. Sell Faster.",
    description:
      "Create and manage sports events seamlessly. Boost your ticket sales with real-time analytics and fair distribution.",
  },
];

const backgroundImages = [bg_auth1, bg_auth2, bg_auth3];

export default function SignupPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { slug } = useParams();


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slug]);

  return (
    <div className="w-full h-screen flex relative">
     <div className="absolute inset-0 w-full h-full">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            //Load all images at once, but only show the current one
            // This is a performance optimization to avoid flickering
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image.src})`,
            }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative w-[50%] h-full z-10 px-14 py-10">
        <div className="w-full h-full flex flex-col items-start justify-center ml-12 mb-8 text-white">
          <Image style={{ animation: "fade-in 1s forwards" }} src={logo_app} alt="Logo" width={200} height={200} className="mb-2 transition-opacity duration-1000 ease-in-out opacity-0" />
          <p
            key={currentIndex} // Key ensures re-render for animation
            className="text-[40px] font-bold text-[#fff] transition-opacity duration-1000 ease-in-out opacity-0"
            style={{ animation: "fade-in 1s forwards" }}
          >
            {content[currentIndex].title}
          </p>
          <div
            key={`${currentIndex}-desc`} // Unique key for description
            className="text-[16px] font-light text-[#fff] transition-opacity duration-1000 ease-in-out opacity-0 mb-4"
            style={{ animation: "fade-in 1s forwards" }}
          >
            {content[currentIndex].description}
          </div>
          <div className="flex flex-row items-center gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className={`w-15 h-2 rounded-4xl transition-all duration-300 ${
                  index === currentIndex ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ animation: "fade-in 1s forwards" }} className="relative w-[50%] h-full flex justify-center items-center z-10 pb-4 transition-opacity duration-1000 ease-in-out opacity-0">
        {slug === "signup" && (
          <SignUpForm
            onSignUp={() => {}} />
        )}
        {slug === "login" && (
          <LoginForm
            onLogin={() => {}}
            onForgotPassword={() => {}}
          />
        )}
      </div>
    </div>
  );
}