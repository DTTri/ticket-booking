import { DM_Sans } from "next/font/google";

//Config for the font using DM_Sans from Google Fonts
const DmSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-dm-sans",
  weight: ["600"],
});
export const fontSans = DmSans.className;
