import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "CNM Events",
  description: "Upcoming events at Creation Nation Makerspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.variable} font-sans min-h-screen relative`}>
        <div className="fixed inset-0 bg-[url('/backdrop.jpg')] bg-cover bg-center -z-10"></div>
        <div className="fixed inset-0 bg-white/50 -z-10"></div>
        {children}
      </body>
    </html>
  );
}
