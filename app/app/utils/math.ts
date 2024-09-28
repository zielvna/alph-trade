import { PositionType } from "../enums/position-type";
import { HOUR_IN_MS, TOKEN_DENOMINATOR } from "./consts";

export const calculateLiquidationPrice = (
  positionType: PositionType,
  entryPrice: number,
  leverage: number,
  value: number,
  colateral: number
) => {
  if (positionType === PositionType.LONG) {
    return entryPrice - ((entryPrice / leverage) * value) / colateral;
  } else {
    return entryPrice + ((entryPrice / leverage) * value) / colateral;
  }
};

export const calculateValue = (
  positionType: PositionType,
  entryPrice: number,
  currentPrice: number,
  colateral: number,
  leverage: number,
  entryTimestamp: number,
  closeTimestamp: number
) => {
  const positionSize = colateral * leverage;
  const borrowCost =
    ((closeTimestamp - entryTimestamp) / HOUR_IN_MS) * 0.00005 * positionSize;

  if (positionType === PositionType.LONG) {
    return (
      colateral +
      ((currentPrice * 0.995) / entryPrice - 1) * positionSize -
      borrowCost
    );
  } else {
    return (
      colateral +
      (1 - (currentPrice * 1.005) / entryPrice) * positionSize -
      borrowCost
    );
  }
};

export const calculatePnl = (colateral: number, value: number) => {
  return -(colateral - value);
};

export const calculatePnlPercentage = (colateral: number, value: number) => {
  return -(1 - value / colateral) * 100;
};

export const calculatePositionSize = (colateral: number, leverage: number) => {
  return colateral * leverage;
};

export const calculateLpTokens = (
  amount: number,
  liquidity: number,
  totalSupply: number
) => {
  if (totalSupply === 0) {
    return amount * Number(TOKEN_DENOMINATOR);
  } else {
    return (amount / liquidity) * totalSupply;
  }
};

export const calculateAmount = (
  lpTokens: number,
  liquidity: number,
  totalSupply: number
) => {
  if (totalSupply === 0) {
    return 0;
  } else {
    return (lpTokens / totalSupply) * liquidity;
  }
};

export const calculateLpTokenPrice = (
  lpTokenSupply: number,
  liquidity: number
) => {
  return liquidity / lpTokenSupply;
};

export const calculateOpenInterestPercentage = (
  openInterest: number,
  total: number
) => {
  return (openInterest / total) * 100;
};

export const calculateAvailableLiquidity = (
  liquidity: number,
  openInterest: number
) => {
  return liquidity / 2 - openInterest;
};
