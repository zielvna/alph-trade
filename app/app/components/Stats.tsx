import { useEffect } from "react";
import { getLiquidity, getLpTokenSupply, getOpenInterest } from "../utils/web3";
import { PRICE_DECIMAL, TOKEN_DECIMAL } from "../utils/consts";
import { formatNumber } from "../utils/ui";
import {
  calculateLpTokenPrice,
  calculateOpenInterestPercentage,
  calculateValue,
} from "../utils/math";
import { ProgressBar } from "./ProgressBar";
import { useStore } from "../store/store";
import { PositionType } from "../enums/position-type";
import { byteVecToMarket } from "../utils/functions";
import { Market } from "../enums/market";

export const Stats: React.FC = () => {
  const {
    lpTokenSupply,
    liquidity,
    openInterest,
    currentPrice,
    allPositions,
    setLpTokenSupply,
    setLiquidity,
    setOpenInterest,
  } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const lpTokenSupply = await getLpTokenSupply();
      const liquidity = await getLiquidity();
      const openInterest = await getOpenInterest();
      setLpTokenSupply(lpTokenSupply);
      setLiquidity(liquidity);
      setOpenInterest(openInterest);
    };

    fetchData();
  }, [setLpTokenSupply, setLiquidity, setOpenInterest]);

  const longOpenInterestPercentage = calculateOpenInterestPercentage(
    Number(openInterest.long),
    Number(openInterest.total)
  );
  const shortOpenInterestPercentage = 100 - longOpenInterestPercentage;

  const totalUnrealizedPnl = allPositions.reduce(
    (acc, position) =>
      acc -
      formatNumber(Number(position.colateral), Number(TOKEN_DECIMAL)) +
      calculateValue(
        position.type === 0n ? PositionType.LONG : PositionType.SHORT,
        formatNumber(Number(position.entryPrice), Number(PRICE_DECIMAL)),
        formatNumber(
          Number(currentPrice[byteVecToMarket(position.market) ?? Market.BTC]),
          Number(PRICE_DECIMAL)
        ),
        formatNumber(Number(position.colateral), Number(TOKEN_DECIMAL)),
        Number(position.leverage)
      ),
    0
  );

  return (
    <div className="grow">
      <div className="flex">
        <div className="basis-full p-4 h-fit">
          <p className="text-lg">total value locked</p>
          <p className="text-xl">
            ${formatNumber(Number(liquidity), Number(TOKEN_DECIMAL)).toFixed(2)}
          </p>
        </div>
        <div className="basis-full p-4 h-fit">
          <p className="text-lg">lp token supply</p>
          <p className="text-xl">
            {formatNumber(Number(lpTokenSupply), Number(TOKEN_DECIMAL)).toFixed(
              6
            )}
          </p>
        </div>
        <div className="basis-full p-4 h-fit">
          <p className="text-lg">lp token price</p>
          <p className="text-xl">
            $
            {(
              calculateLpTokenPrice(Number(lpTokenSupply), Number(liquidity)) ||
              0
            ).toFixed(2)}
          </p>
        </div>
        <div className="basis-full p-4 h-fit">
          <p className="text-lg">open interest</p>
          <p className="text-xl">
            $
            {formatNumber(
              Number(openInterest.total),
              Number(TOKEN_DECIMAL)
            ).toFixed(2)}
          </p>
        </div>
        <div className="basis-full p-4 h-fit">
          <p className="text-lg">unrealized p&l</p>
          <p className="text-xl">
            {totalUnrealizedPnl >= 0 ? "+" : "-"}$
            {Math.abs(totalUnrealizedPnl).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="text-lg">market sentiment</p>
        <ProgressBar
          number={longOpenInterestPercentage}
          disabled={openInterest.total === 0n}
        />
        <div className="flex justify-between">
          <div>
            <p className="text-lg">long</p>
            <p>
              open interest: $
              {formatNumber(
                Number(openInterest.long),
                Number(TOKEN_DECIMAL)
              ).toFixed(2)}
            </p>
            <p>share: {(longOpenInterestPercentage || 0).toFixed(2)}%</p>
          </div>
          <div className="text-right">
            <p className="text-lg">short</p>
            <p>
              open interest: $
              {formatNumber(
                Number(openInterest.short),
                Number(TOKEN_DECIMAL)
              ).toFixed(2)}
            </p>
            <p>share: {(shortOpenInterestPercentage || 0).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
