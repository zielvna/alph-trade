import type { Metadata } from "next";
import "./globals.css";
import { Comic_Neue } from "next/font/google";

const comicNeue = Comic_Neue({ weight: ["700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "alph trade",
  description: "Crypto trading with leverage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comicNeue.className} antialiased`}>{children}</body>
    </html>
  );
}
