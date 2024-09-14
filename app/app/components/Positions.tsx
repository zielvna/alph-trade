"use client";

import { useEffect } from "react";
import { Coin } from "../enums/coin";
import { PositionType } from "../enums/position-type";
import { PositionDetails } from "./PositionDetails";
import {
  PRICE_DECIMAL,
  TOKEN_DECIMAL,
  USDC_CONTRACT_ID,
} from "../utils/consts";
import { formatNumber } from "../utils/ui";
import { useStore } from "../store/store";
import { useWallet } from "@alephium/web3-react";
import { waitForTxConfirmation } from "@alephium/web3";
import { balanceOf, closePosition, getPositions } from "../utils/web3";

export const Positions: React.FC = () => {
  const { currentPrice, positions, setBalance, setPositions } = useStore();
  const { account, signer } = useWallet();

  useEffect(() => {
    const loadPositions = async () => {
      if (account) {
        const positions = await getPositions(account.address);
        setPositions(positions);
      }
    };

    loadPositions();
  }, [account, setPositions]);

  const handleClosePosition = async (positionIndex: bigint) => {
    if (signer) {
      const result = await closePosition(positionIndex, signer);
      await waitForTxConfirmation(result.txId, 1, 1000);

      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);

      const positions = await getPositions(account.address);
      setPositions(positions);
    }
  };

  return (
    <div className="w-full">
      <div className="h-[40px] px-4 flex items-center justify-between">
        <div className="w-[180px]">position</div>
        <div className="w-[180px]">colateral</div>
        <div className="w-[180px]">leverage</div>
        <div className="w-[180px]">size</div>
        <div className="w-[180px]">entry price</div>
        <div className="w-[180px]">liquidation price</div>
        <div className="w-[180px]">value</div>
        <div className="w-[180px]">p&l</div>
        <div className="w-[180px]">close</div>
      </div>
      {positions.map((position) => (
        <PositionDetails
          coin={Coin.BTC}
          positionType={
            position.type === 0n ? PositionType.LONG : PositionType.SHORT
          }
          colateral={formatNumber(
            Number(position.colateral),
            Number(TOKEN_DECIMAL)
          )}
          leverage={Number(position.leverage)}
          entryPrice={formatNumber(
            Number(position.entryPrice),
            Number(PRICE_DECIMAL)
          )}
          currentPrice={formatNumber(
            Number(currentPrice),
            Number(PRICE_DECIMAL)
          )}
          key={position.entryTimestamp}
          onClose={() => handleClosePosition(position.index)}
        />
      ))}
    </div>
  );
};
