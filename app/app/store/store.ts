import { create } from "zustand";
import { PositionWithIndex } from "../utils/types";

interface Store {
  balance: bigint;
  currentPrice: bigint;
  positions: PositionWithIndex[];
  setBalance: (balance: bigint) => void;
  setCurrentPrice: (entryPrice: bigint) => void;
  addPosition: (position: PositionWithIndex) => void;
  setPositions: (positions: PositionWithIndex[]) => void;
}

export const useStore = create<Store>((set) => ({
  balance: 0n,
  currentPrice: 0n,
  positions: [],
  setBalance: (balance) =>
    set(() => ({
      balance,
    })),
  setCurrentPrice: (currentPrice) =>
    set(() => ({
      currentPrice,
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
