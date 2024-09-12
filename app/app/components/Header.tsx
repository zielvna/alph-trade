"use client";

import { useConnect, useWallet } from "@alephium/web3-react";
import { Color } from "../enums/color";
import { Button, ButtonSize } from "./Button";
import { formatAddress } from "../utils/ui";
import { useEffect, useState } from "react";

export const Header: React.FC = () => {
  const { account } = useWallet();
  const { connect, disconnect } = useConnect();
  const [isClient, setIsClient] = useState(false);

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="h-20 px-4 flex justify-between items-center">
      <h1 className="text-2xl">alph degen</h1>
      <div className="flex gap-4">
        <div className="w-[180px]">
          <Button scheme={Color.BLUE} size={ButtonSize.BIG}>
            airdrop
          </Button>
        </div>
        <div className="w-[180px]">
          <Button
            scheme={Color.BLACK}
            size={ButtonSize.BIG}
            onClick={() =>
              account?.address ? handleDisconnect() : handleConnect()
            }
          >
            {isClient && account?.address
              ? formatAddress(account.address)
              : "connect wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};
