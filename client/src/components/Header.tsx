"use client";
import React from "react";
import logo_app from "../../public/logo_app.png";
import Image from "next/image";
import Link from "next/link";
import { useAuthSession, useLogout } from "@/hooks/useUser";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuthSession();
  const { logout } = useLogout();
  const router = useRouter();

  return (
    <div className="w-full h-[70px] flex flex-row justify-between items-center px-8 border-b-1 border-b-gray-200">
      <div className="logo-img w-[11%]">
        <Link href={"/"}>
          <Image src={logo_app} alt="Logo" className="w-full h-full block cursor-pointer" />
        </Link>
      </div>
      <div className="flex flex-row items-center gap-6">
        <Link href="/" className="text-xl font-medium text-[16px] hover:bg-gray-100 rounded-xl p-2">
          Home
        </Link>
        <Link href="/" className="text-xl font-medium text-[16px] hover:bg-gray-100 rounded-xl p-2">
          My orders
        </Link>
        <Button
          variant={"default"}
          className="font-semibold text-[16px] hover:bg-gray-100 border-1 bg-background cursor-pointer rounded-[50px]"
          onClick={() => {
            if (user) {
              logout();
            } else {
              router.push("/auth/login");
            }
          }}
        >
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
}
