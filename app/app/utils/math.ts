import { PositionType } from "../enums/position-type";
import { TOKEN_DENOMINATOR } from "./consts";

export const calculateLiquidationPrice = (
  positionType: PositionType,
  entryPrice: number,
  leverage: number
) => {
  if (positionType === PositionType.LONG) {
    return entryPrice - entryPrice / leverage;
  } else {
    return entryPrice + entryPrice / leverage;
  }
};

export const calculateValue = (
  positionType: PositionType,
  entryPrice: number,
  currentPrice: number,
  colateral: number,
  leverage: number
) => {
  if (positionType === PositionType.LONG) {
    return (
      colateral -
      (1 - (currentPrice * 0.995) / entryPrice) * colateral * leverage
    );
  } else {
    return (
      colateral -
      ((currentPrice * 1.005) / entryPrice - 1) * colateral * leverage
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
