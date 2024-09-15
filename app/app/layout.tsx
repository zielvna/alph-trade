import type { Metadata } from "next";
import "./globals.css";
import { Comic_Neue } from "next/font/google";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { web3 } from "@alephium/web3";
import { Header } from "./components/Header";

const comicNeue = Comic_Neue({ weight: ["700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "alph trade",
  description: "Crypto trading with leverage",
};

web3.setCurrentNodeProvider("http://127.0.0.1:22973");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comicNeue.className} antialiased`}>
        <AlephiumWalletProvider theme="retro" network="devnet">
          <Header />
          {children}
        </AlephiumWalletProvider>
      </body>
    </html>
  );
}
