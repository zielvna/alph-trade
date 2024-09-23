"use client";

import { web3 } from "@alephium/web3";
import { LiquiditySidePanel } from "../components/LiquiditySidePanel";
import { Stats } from "../components/Stats";
import { Liquidations } from "../components/Liquidations";

web3.setCurrentNodeProvider("http://127.0.0.1:22973");

export default function Earn() {
  return (
    <>
      <div className="h-full flex flex-col shrink-0 lg:flex-row">
        <Stats />
        <div className="lg:w-[360px]">
          <LiquiditySidePanel />
        </div>
      </div>
      <Liquidations />
    </>
  );
}
