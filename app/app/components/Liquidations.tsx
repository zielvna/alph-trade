import { useEffect } from "react";
import { PositionDetailsType } from "../enums/position-details-type";
import { PositionType } from "../enums/position-type";
import { useStore } from "../store/store";
import {
  PRICE_DECIMAL,
  TOKEN_DECIMAL,
  USDC_CONTRACT_ID,
} from "../utils/consts";
import { formatNumber } from "../utils/ui";
import { PositionDetails } from "./PositionDetails";
import {
  balanceOf,
  getAllPositions,
  getOpenInterest,
  liquidate,
} from "../utils/web3";
import { useWallet } from "@alephium/web3-react";
import { waitForTxConfirmation } from "@alephium/web3";
import { byteVecToMarket } from "../utils/functions";
import { Market } from "../enums/market";

export const Liquidations: React.FC = () => {
  const { signer, account } = useWallet();
  const {
    currentPrice,
    allPositions,
    setAllPositions,
    setBalance,
    setOpenInterest,
  } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const allPositions = await getAllPositions();
      setAllPositions(allPositions);
    };

    fetchData();
  }, [setAllPositions]);

  const handleLiquidatePosition = async (positionIndex: bigint) => {
    if (signer && account) {
      const result = await liquidate(positionIndex, signer);
      await waitForTxConfirmation(result.txId, 1, 1000);

      const allPositions = await getAllPositions();
      setAllPositions(allPositions);

      const balance = await balanceOf(USDC_CONTRACT_ID, account.address);
      setBalance(balance);

      const openInterest = await getOpenInterest();
      setOpenInterest(openInterest);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="w-fit h-[40px] px-4 flex items-center justify-between lg:w-full">
        <div className="w-[140px] lg:grow">position</div>
        <div className="w-[100px] lg:grow">colateral</div>
        <div className="w-[100px] lg:grow">leverage</div>
        <div className="w-[100px] lg:grow">size</div>
        <div className="w-[120px] lg:grow">entry price</div>
        <div className="w-[140px] lg:grow">liquidation price</div>
        <div className="w-[80px] lg:grow">value</div>
        <div className="w-[140px] lg:grow">p&l</div>
        <div className="w-[100px] lg:grow">liquidate</div>
      </div>
      {allPositions.map((position) => (
        <PositionDetails
          market={byteVecToMarket(position.market) ?? Market.BTC}
          type={PositionDetailsType.LIQUIDATE}
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
          onClose={() => handleLiquidatePosition(position.index)}
        />
      ))}
    </div>
  );
};
