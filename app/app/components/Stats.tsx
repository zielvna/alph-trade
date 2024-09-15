import { useEffect } from "react";
import { getLiquidity, getLpTokenSupply, getOpenInterest } from "../utils/web3";
import { TOKEN_DECIMAL } from "../utils/consts";
import { formatNumber } from "../utils/ui";
import {
  calculateLpTokenPrice,
  calculateOpenInterestPercentage,
} from "../utils/math";
import { ProgressBar } from "./ProgressBar";
import { useStore } from "../store/store";

export const Stats: React.FC = () => {
  const {
    lpTokenSupply,
    liquidity,
    openInterest,
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
      </div>
      <div className="flex flex-col gap-4 p-4">
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
