import { Coin } from "../enums/coin";
import { Color } from "../enums/color";
import { PositionType } from "../enums/position-type";
import {
  calculateLiquidationPrice,
  calculatePnl,
  calculatePnlPercentage,
  calculateValue,
} from "../utils/math";
import { Button, ButtonSize } from "./Button";
import { CoinIcon } from "./CoinIcon";

interface Props {
  coin: Coin;
  positionType: PositionType;
  colateral: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  onClose: () => void;
}

export const PositionDetails: React.FC<Props> = ({
  coin,
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
  console.log(colateral, value, pnl);
  const pnlPercentage = calculatePnlPercentage(colateral, value);
  const pnlClass = pnl < 0 ? "text-red" : "text-green";

  return (
    <div className="w-full">
      <div className="h-[40px] px-4 flex items-center justify-between">
        <div className={`w-[180px] flex gap-2 ${positionClass}`}>
          <CoinIcon coin={coin} /> {coin.toUpperCase()} {positionType}
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
              scheme={Color.BLUE}
              size={ButtonSize.SMALL}
              onClick={() => onClose()}
            >
              close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
