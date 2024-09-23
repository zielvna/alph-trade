import { useEffect, useState } from "react";
import { Color } from "../enums/color";
import { PositionType } from "../enums/position-type";
import { Button, ButtonSize } from "./Button";
import { Input } from "./Input";
import { Slider } from "./Slider";
import {
  calculateAvailableLiquidity,
  calculateLiquidationPrice,
  calculatePositionSize,
} from "../utils/math";
import { useWallet } from "@alephium/web3-react";
import {
  MIN_COLATERAL,
  PRICE_DECIMAL,
  TOKEN_DECIMAL,
  TOKEN_DENOMINATOR,
  USDC_CONTRACT_ID,
} from "../utils/consts";
import { waitForTxConfirmation } from "@alephium/web3";
import { useStore } from "../store/store";
import {
  balanceOf,
  getLiquidity,
  getOpenInterest,
  getPositions,
  openPosition,
} from "../utils/web3";
import { formatNumber } from "../utils/ui";
import { CoinIcon } from "./CoinIcon";
import { Coin } from "../enums/coin";

export const SidePanel: React.FC = () => {
  const { account, signer } = useWallet();
  const {
    balance,
    currentPrice,
    liquidity,
    openInterest,
    market,
    setBalance,
    setPositions,
    setLiquidity,
    setOpenInterest,
  } = useStore();
  const [positionType, setPositionType] = useState(PositionType.LONG);
  const [colateral, setColateral] = useState("0");
  const [leverage, setLeverage] = useState(2);

  const entryPrice =
    Number(currentPrice[market]) *
    (positionType === PositionType.LONG ? 1.005 : 0.995);
  const positionSize = calculatePositionSize(Number(colateral), leverage);
  const liquidationPrice = calculateLiquidationPrice(
    positionType,
    formatNumber(Number(entryPrice), Number(PRICE_DECIMAL)),
    leverage
  );

  const handleOpenPosition = async () => {
    if (signer && account) {
      const amount = BigInt(
        Math.round(Number(colateral) * Number(TOKEN_DENOMINATOR))
      );
      const result = await openPosition(
        market,
        positionType,
        amount,
        BigInt(leverage),
        signer
      );
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

  const handleChange = (value: string) => {
    const regex = /^\d*\.?\d{0,6}$/;

    if (regex.test(value) || value === "") {
      setColateral(value);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const liquidity = await getLiquidity();
      setLiquidity(liquidity);
    };

    loadData();
  }, [setLiquidity]);

  const availableLiquidity = calculateAvailableLiquidity(
    formatNumber(Number(liquidity), Number(TOKEN_DECIMAL)),
    formatNumber(
      Number(
        positionType === PositionType.LONG
          ? openInterest.long
          : openInterest.short
      ),
      Number(TOKEN_DECIMAL)
    )
  );

  const parsedColateral = BigInt(
    Math.round(Number(colateral) * Number(TOKEN_DENOMINATOR))
  );
  const isAmountCorrect =
    parsedColateral >= MIN_COLATERAL &&
    parsedColateral <= balance &&
    Number(colateral) * leverage <= availableLiquidity;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <Button
          scheme={positionType === PositionType.LONG ? Color.GREEN : Color.GRAY}
          size={ButtonSize.BIG}
          onClick={() => setPositionType(PositionType.LONG)}
        >
          long
        </Button>
        <Button
          scheme={positionType === PositionType.SHORT ? Color.RED : Color.GRAY}
          size={ButtonSize.BIG}
          onClick={() => setPositionType(PositionType.SHORT)}
        >
          short
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        entry price
        <Input
          value={`$${formatNumber(entryPrice, Number(PRICE_DECIMAL)).toFixed(
            2
          )}`}
          disabled={true}
        />
      </div>
      <div className="flex flex-col gap-1">
        colateral
        <div className="flex gap-2 items-center">
          <Input
            value={colateral}
            onChange={(e) => handleChange(e.target.value)}
          />
          <CoinIcon coin={Coin.USDC} />
        </div>
        balance:{" "}
        {(Number(balance) / Number(TOKEN_DENOMINATOR)).toFixed(
          Number(TOKEN_DECIMAL)
        )}
      </div>
      <div>
        leverage
        <div className="flex items-center gap-2">
          <Slider
            value={leverage}
            onChange={(leverage) => setLeverage(leverage)}
          />
          <div className="w-8 text-lg text-right">{leverage}x</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        position size
        <div className="flex gap-2 items-center">
          <Input value={positionSize.toFixed(2)} disabled={true} />
          <CoinIcon coin={Coin.USDC} />
        </div>
      </div>
      open/close fee: 0.5%
      <br />
      borrow rate: 0.005%/hour
      <br />
      liquidation price: ${liquidationPrice.toFixed(2)}
      <br />
      available liquidity: ${availableLiquidity.toFixed(2)}
      <Button
        scheme={isAmountCorrect ? Color.BLUE : Color.GRAY}
        size={ButtonSize.BIG}
        onClick={isAmountCorrect ? handleOpenPosition : () => {}}
      >
        open
      </Button>
    </div>
  );
};
