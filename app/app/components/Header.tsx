"use client";

import { useConnect, useWallet } from "@alephium/web3-react";
import { Color } from "../enums/color";
import { Button, ButtonSize } from "./Button";
import { formatAddress } from "../utils/ui";
import { waitForTxConfirmation } from "@alephium/web3";
import { TOKEN_DENOMINATOR, USDC_CONTRACT_ID } from "../utils/consts";
import { balanceOf, getBTCPrice, mint } from "../utils/web3";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";

export const Header: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { setBalance, setCurrentPrice } = useStore();
  const { connect, disconnect } = useConnect();
  const { account, signer } = useWallet();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateBalance = async () => {
      if (account) {
        const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
        setBalance(balance);
      }
    };

    updateBalance();
  }, [account, setBalance]);

  useEffect(() => {
    const updateCurrentPrice = async () => {
      if (account) {
        const price = await getBTCPrice();
        setCurrentPrice(price);
      }
    };

    updateCurrentPrice();
    setInterval(() => {
      updateCurrentPrice();
    }, 15000);
  }, [account, setCurrentPrice]);

  const handleAirdrop = async () => {
    if (signer) {
      const result = await mint(10n * TOKEN_DENOMINATOR, signer);
      await waitForTxConfirmation(result.txId, 1, 1000);

      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);
    }
  };

  const handleConnect = async () => {
    const account = await connect();

    if (account) {
      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();

    setBalance(0n);
  };

  return (
    <header className="h-20 px-4 flex justify-between items-center">
      <h1 className="text-2xl">alph trade</h1>
      <div className="flex gap-4">
        <div className="w-[180px]">
          <Button
            scheme={Color.BLUE}
            size={ButtonSize.BIG}
            onClick={() => handleAirdrop()}
          >
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
