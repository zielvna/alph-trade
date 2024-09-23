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
  onClose,
}) => {
  const positionClass =
    positionType === PositionType.LONG ? "text-green" : "text-red";
  const liquidationPrice = calculateLiquidationPrice(
    positionType,
    entryPrice,
    leverage
  );
  const value = calculateValue(
    positionType,
    entryPrice,
    currentPrice,
    colateral,
    leverage
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
      <div className="h-[40px] px-4 flex items-center justify-between">
        <div className={`w-[180px] flex gap-2 ${positionClass}`}>
          <CoinIcon coin={marketToCoin(market) ?? Coin.USDC} />{" "}
          {marketToCoin(market)?.toUpperCase()} {positionType}
        </div>
        <div className="w-[180px]">${colateral.toFixed(2)}</div>
        <div className="w-[180px]">x{leverage}</div>
        <div className="w-[180px]">${(colateral * leverage).toFixed(2)}</div>
        <div className="w-[180px]">${entryPrice.toFixed(2)}</div>
        <div className="w-[180px]">${liquidationPrice.toFixed(2)}</div>
        <div className="w-[180px]">${value.toFixed(2)}</div>
        <div className={`w-[180px] ${pnlClass}`}>
          {pnl >= 0 ? "+" : "-"}${Math.abs(pnl).toFixed(2)} (
          {pnlPercentage >= 0 && "+"}
          {pnlPercentage.toFixed(2)}%)
        </div>
        <div className="w-[180px]">
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
