import type { Metadata } from "next";
import "./globals.css";
import { fontSans } from "@/libs/fonts";
import Header from "@/components/Header";

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
      <Header />
      <body className={`${fontSans}`}>{children}</body>
    </html>
  );
}
