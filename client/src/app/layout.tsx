import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticket Selling",
  description: "Where you can buy tickets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
