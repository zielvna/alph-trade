"use client";

import { web3 } from "@alephium/web3";
import { LiquiditySidePanel } from "../components/LiquiditySidePanel";
import { Stats } from "../components/Stats";

web3.setCurrentNodeProvider("http://127.0.0.1:22973");

export default function Earn() {
  return (
    <>
      <div className="h-full flex">
        <Stats />
        <LiquiditySidePanel />
      </div>
    </>
  );
}
