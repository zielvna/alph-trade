"use client";

import { Header } from "./components/Header";
import { SidePanel } from "./components/SidePanel";
import Chart from "./components/Chart";
import { Positions } from "./components/Positions";
import { AlephiumWalletProvider } from "@alephium/web3-react";
import { web3 } from "@alephium/web3";

web3.setCurrentNodeProvider("http://127.0.0.1:22973");

export default function Home() {
  return (
    <AlephiumWalletProvider theme="retro" network="devnet">
      <Header />
      <div className="h-full flex">
        <Chart />
        <SidePanel />
      </div>
      <Positions />
    </AlephiumWalletProvider>
  );
}
