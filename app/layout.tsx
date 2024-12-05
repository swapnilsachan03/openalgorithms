import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Navbar from "./components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenAlgorithms",
  description:
    "An open-source platform to learn and practice algorithms and data structures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased max-w-screen-2xl mx-auto transition ease-linear duration-200`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
