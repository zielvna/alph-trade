import type { Metadata } from "next";
import "./globals.css";
import { Comic_Neue } from "next/font/google";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { Header } from "./components/Header";
import { Snackbars } from "./components/Snackbars";
import { NETWORK } from "./utils/consts";

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
      <body className={`${comicNeue.className} antialiased`}>
        <AlephiumWalletProvider
          theme="retro"
          network={NETWORK}
          addressGroup={0}
        >
          <Header />
          {children}
          <Snackbars />
        </AlephiumWalletProvider>
      </body>
    </html>
  );
}
