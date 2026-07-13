import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

const cloverDisplay = localFont({
  variable: "--font-clover-display",
  src: [
    {
      path: "../../public/assets/fonts/CloverDisplay-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../../public/assets/fonts/CloverDisplay-Bold.woff2",
      weight: "700",
    },
  ],
});

export const metadata: Metadata = {
  title: "Growthpad",
  description: "Growthpad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${questrial.variable} ${cloverDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
