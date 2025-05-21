import type { Metadata } from "next";
import "./globals.css";
import { fontSans } from "@/libs/fonts";
import Header from "@/components/Header";
import { Provider } from "react-redux";
import { store } from "@/store/store";

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
      <Provider store={store}>
        <body className="w-full min-h-screen">
          <Header />
          <main className={`${fontSans}`}>{children}</main>
        </body>
      </Provider>
    </html>
  );
}
