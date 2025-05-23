import type { Metadata } from "next";
import "./globals.css";
import { fontSans } from "@/libs/fonts";
import Header from "@/components/Header";
import AppProvider from "./provider";

export const metadata: Metadata = {
  title: "Ticket Booking",
  description: "Where you can buy tickets",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  
  return (
    <html lang="en" suppressHydrationWarning>
      <AppProvider>
        <body className="w-full min-h-screen">
          <Header />
          <main className={`${fontSans}`}>{children}</main>
        </body>
      </AppProvider>
    </html>
  );
}
