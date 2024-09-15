"use client";

import Chart from "./components/Chart";
import { SidePanel } from "./components/SidePanel";
import { Positions } from "./components/Positions";
import { web3 } from "@alephium/web3";

web3.setCurrentNodeProvider("http://127.0.0.1:22973");

export default function Home() {
  return (
    <>
      <div className="h-full flex shrink-0">
        <Chart />
        <SidePanel />
      </div>
      <Positions />
    </>
  );
}
