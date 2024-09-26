"use client";

import Chart from "./components/Chart";
import { SidePanel } from "./components/SidePanel";
import { Positions } from "./components/Positions";
import { web3 } from "@alephium/web3";
import { NODE_PROVIDER } from "./utils/consts";

web3.setCurrentNodeProvider(NODE_PROVIDER);

export default function Home() {
  return (
    <>
      <div className="h-full flex flex-col shrink-0 lg:flex-row">
        <div className="grow mx-4 lg:mr-0">
          <Chart />
        </div>
        <div className="lg:w-[360px]">
          <SidePanel />
        </div>
      </div>
      <Positions />
    </>
  );
}
