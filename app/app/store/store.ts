import { create } from "zustand";
import { PositionWithIndex } from "../utils/types";

interface Store {
  balance: bigint;
  lpBalance: bigint;
  currentPrice: bigint;
  liquidity: bigint;
  lpTokenSupply: bigint;
  openInterest: {
    long: bigint;
    short: bigint;
    total: bigint;
  };
  positions: PositionWithIndex[];
  setBalance: (balance: bigint) => void;
  setLpBalance: (lpBalance: bigint) => void;
  setCurrentPrice: (entryPrice: bigint) => void;
  setLiquidity: (tvl: bigint) => void;
  setLpTokenSupply: (lpTokenSupply: bigint) => void;
  setOpenInterest: (openInterest: {
    long: bigint;
    short: bigint;
    total: bigint;
  }) => void;
  addPosition: (position: PositionWithIndex) => void;
  setPositions: (positions: PositionWithIndex[]) => void;
}

export const useStore = create<Store>((set) => ({
  balance: 0n,
  lpBalance: 0n,
  currentPrice: 0n,
  liquidity: 0n,
  lpTokenSupply: 0n,
  openInterest: {
    long: 0n,
    short: 0n,
    total: 0n,
  },
  positions: [],
  setBalance: (balance) =>
    set(() => ({
      balance,
    })),
  setLpBalance: (lpBalance) =>
    set(() => ({
      lpBalance,
    })),
  setCurrentPrice: (currentPrice) =>
    set(() => ({
      currentPrice,
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
  addPosition: (position) =>
    set((state) => ({
      positions: [...state.positions, position],
    })),
  setPositions: (positions) =>
    set(() => ({
      positions,
    })),
}));
