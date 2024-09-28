import { Coin } from "../enums/coin";
import { Color } from "../enums/color";
import { Market } from "../enums/market";
import { PositionDetailsType } from "../enums/position-details-type";
import { PositionType } from "../enums/position-type";
import { PNL_LIQUIDATION_TRESHOLD } from "../utils/consts";
import { marketToCoin } from "../utils/functions";
import {
  calculateLiquidationPrice,
  calculatePnl,
  calculatePnlPercentage,
  calculateValue,
} from "../utils/math";
import { Button, ButtonSize } from "./Button";
import { CoinIcon } from "./CoinIcon";

interface Props {
  market: Market;
  type: PositionDetailsType;
  positionType: PositionType;
  colateral: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  entryTimestamp: number;
  onClose: () => void;
}

export const PositionDetails: React.FC<Props> = ({
  market,
  type,
  positionType,
  colateral,
  leverage,
  entryPrice,
  currentPrice,
  entryTimestamp,
  onClose,
}) => {
  const positionClass =
    positionType === PositionType.LONG ? "text-green" : "text-red";
  const value = calculateValue(
    positionType,
    entryPrice,
    currentPrice,
    colateral,
    leverage,
    entryTimestamp,
    Date.now()
  );
  const liquidationPrice = calculateLiquidationPrice(
    positionType,
    entryPrice,
    leverage,
    value,
    colateral
  );
  const pnl = calculatePnl(colateral, value);
  const pnlPercentage = calculatePnlPercentage(colateral, value);
  const pnlClass = pnl < 0 ? "text-red" : "text-green";

  const disabled =
    type === PositionDetailsType.LIQUIDATE
      ? pnlPercentage > PNL_LIQUIDATION_TRESHOLD
      : false;

  return (
    <div className="w-full">
      <div className="w-fit h-[40px] px-4 flex items-center justify-between lg:w-full">
        <div className={`w-[140px] flex gap-2 lg:grow ${positionClass}`}>
          <CoinIcon coin={marketToCoin(market) ?? Coin.USDC} />{" "}
          {marketToCoin(market)?.toUpperCase()} {positionType}
        </div>
        <div className="w-[100px] lg:grow">${colateral.toFixed(2)}</div>
        <div className="w-[100px] lg:grow">x{leverage}</div>
        <div className="w-[100px] lg:grow">
          ${(colateral * leverage).toFixed(2)}
        </div>
        <div className="w-[120px] lg:grow">${entryPrice.toFixed(2)}</div>
        <div className="w-[140px] lg:grow">${liquidationPrice.toFixed(2)}</div>
        <div className="w-[80px] lg:grow">${value.toFixed(2)}</div>
        <div className={`w-[140px] lg:grow ${pnlClass}`}>
          {pnl >= 0 ? "+" : "-"}${Math.abs(pnl).toFixed(2)} (
          {pnlPercentage >= 0 && "+"}
          {pnlPercentage.toFixed(2)}%)
        </div>
        <div className="w-[100px] lg:grow">
          <div className="w-[80px]">
            <Button
              scheme={disabled ? Color.GRAY : Color.BLUE}
              size={ButtonSize.SMALL}
              onClick={() => onClose()}
              disabled={disabled}
            >
              {type === PositionDetailsType.CLOSE ? "close" : "liquidate"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
