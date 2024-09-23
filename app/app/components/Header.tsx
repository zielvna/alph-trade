"use client";

import { useConnect, useWallet } from "@alephium/web3-react";
import { Color } from "../enums/color";
import { Button, ButtonSize } from "./Button";
import { formatAddress } from "../utils/ui";
import { waitForTxConfirmation } from "@alephium/web3";
import {
  ALPH_TRADE_CONTRACT_ID,
  TOKEN_DENOMINATOR,
  USDC_CONTRACT_ID,
} from "../utils/consts";
import { balanceOf, getPrice, mint } from "../utils/web3";
import { useStore } from "../store/store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Market } from "../enums/market";

export const Header: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { market, setBalance, setLpBalance, setPositions, setCurrentPrice } =
    useStore();
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
        const lpBalance = await balanceOf(
          ALPH_TRADE_CONTRACT_ID,
          account.address
        );
        setLpBalance(lpBalance);
      }
    };

    updateBalance();
  }, [account, setBalance, setLpBalance]);

  useEffect(() => {
    const updateCurrentPrice = async () => {
      const [btcPrice, ethPrice, alphPrice] = await Promise.all([
        getPrice(Market.BTC),
        getPrice(Market.ETH),
        getPrice(Market.ALPH),
      ]);

      setCurrentPrice(Market.BTC, btcPrice);
      setCurrentPrice(Market.ETH, ethPrice);
      setCurrentPrice(Market.ALPH, alphPrice);
    };

    updateCurrentPrice();
    const interval = setInterval(() => {
      updateCurrentPrice();
    }, 30000);

    return () => clearInterval(interval);
  }, [market, setCurrentPrice]);

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

    setPositions([]);

    setBalance(0n);
  };

  return (
    <header className="h-20 px-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl">
          <Link href="/">alph trade</Link>
        </h1>
        <div className="text-lg">
          <Link href="/earn">earn</Link>
        </div>
      </div>
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
