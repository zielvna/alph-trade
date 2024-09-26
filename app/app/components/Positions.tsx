"use client";

import { useEffect } from "react";
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
import {
  balanceOf,
  closePosition,
  getLiquidity,
  getOpenInterest,
  getPositions,
} from "../utils/web3";
import { PositionDetailsType } from "../enums/position-details-type";
import { byteVecToMarket, handleSnackbar } from "../utils/functions";
import { Market } from "../enums/market";

export const Positions: React.FC = () => {
  const {
    currentPrice,
    positions,
    setBalance,
    setPositions,
    setLiquidity,
    setOpenInterest,
  } = useStore();
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

      handleSnackbar("closing position", result.txId);

      await waitForTxConfirmation(result.txId, 1, 1000);

      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);

      const positions = await getPositions(account.address);
      setPositions(positions);

      const liquidity = await getLiquidity();
      setLiquidity(liquidity);

      const openInterest = await getOpenInterest();
      setOpenInterest(openInterest);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const liquidity = await getLiquidity();
      setLiquidity(liquidity);

      const openInterest = await getOpenInterest();
      setOpenInterest(openInterest);
    };

    fetchData();
  }, [setLiquidity, setOpenInterest]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="w-fit h-[40px] px-4 flex shrink-0 items-center justify-between lg:w-full">
        <div className="w-[140px] lg:grow">position</div>
        <div className="w-[100px] lg:grow">colateral</div>
        <div className="w-[100px] lg:grow">leverage</div>
        <div className="w-[100px] lg:grow">size</div>
        <div className="w-[120px] lg:grow">entry price</div>
        <div className="w-[140px] lg:grow">liquidation price</div>
        <div className="w-[80px] lg:grow">value</div>
        <div className="w-[140px] lg:grow">p&l</div>
        <div className="w-[100px] lg:grow">close</div>
      </div>
      {positions.map((position) => (
        <PositionDetails
          market={byteVecToMarket(position.market) ?? Market.BTC}
          type={PositionDetailsType.CLOSE}
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
            Number(
              currentPrice[byteVecToMarket(position.market) ?? Market.BTC]
            ),
            Number(PRICE_DECIMAL)
          )}
          key={position.entryTimestamp}
          onClose={() => handleClosePosition(position.index)}
        />
      ))}
    </div>
  );
};
