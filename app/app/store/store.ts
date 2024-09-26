import { create } from "zustand";
import { PositionWithIndex } from "../utils/types";
import { Market } from "../enums/market";

export type SnackbarType = {
  id: number;
  message: string;
  txId?: string;
};

interface Store {
  balance: bigint;
  lpBalance: bigint;
  currentPrice: {
    [Market.BTC]: bigint;
    [Market.ETH]: bigint;
    [Market.ALPH]: bigint;
  };
  liquidity: bigint;
  lpTokenSupply: bigint;
  openInterest: {
    long: bigint;
    short: bigint;
    total: bigint;
  };
  positions: PositionWithIndex[];
  allPositions: PositionWithIndex[];
  market: Market;
  snackbars: SnackbarType[];
  setBalance: (balance: bigint) => void;
  setLpBalance: (lpBalance: bigint) => void;
  setCurrentPrice: (market: Market, entryPrice: bigint) => void;
  setLiquidity: (tvl: bigint) => void;
  setLpTokenSupply: (lpTokenSupply: bigint) => void;
  setOpenInterest: (openInterest: {
    long: bigint;
    short: bigint;
    total: bigint;
  }) => void;
  setPositions: (positions: PositionWithIndex[]) => void;
  setAllPositions: (positions: PositionWithIndex[]) => void;
  setMarket: (market: Market) => void;
  addSnackbar: (snackbar: SnackbarType) => void;
  removeSnackbar: (id: number) => void;
}

export const useStore = create<Store>((set) => ({
  balance: 0n,
  lpBalance: 0n,
  currentPrice: {
    [Market.BTC]: 0n,
    [Market.ETH]: 0n,
    [Market.ALPH]: 0n,
  },
  liquidity: 0n,
  lpTokenSupply: 0n,
  openInterest: {
    long: 0n,
    short: 0n,
    total: 0n,
  },
  positions: [],
  allPositions: [],
  market: Market.BTC,
  snackbars: [],
  setBalance: (balance) =>
    set(() => ({
      balance,
    })),
  setLpBalance: (lpBalance) =>
    set(() => ({
      lpBalance,
    })),
  setCurrentPrice: (coin, price) =>
    set(({ currentPrice }) => ({
      currentPrice: { ...currentPrice, [coin]: price },
    })),
  setLiquidity: (liquidity) =>
    set(() => ({
      liquidity,
    })),
  setLpTokenSupply: (lpTokenSupply) =>
    set(() => ({
      lpTokenSupply,
    })),
  setOpenInterest: (openInterest) =>
    set(() => ({
      openInterest,
    })),
  setPositions: (positions) =>
    set(() => ({
      positions,
    })),
  setAllPositions: (positions) =>
    set(() => ({
      allPositions: positions,
    })),
  setMarket: (market) =>
    set(() => ({
      market,
    })),
  addSnackbar: (snackbar) =>
    set(({ snackbars }) => ({
      snackbars: [...snackbars, snackbar],
    })),
  removeSnackbar: (id) =>
    set(({ snackbars }) => ({
      snackbars: snackbars.filter((snackbar) => snackbar.id !== id),
    })),
}));
