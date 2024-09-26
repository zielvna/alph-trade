import { Coin } from "../enums/coin";
import { Market } from "../enums/market";
import { useStore } from "../store/store";

export const marketToCoin = (market: Market) => {
  switch (market) {
    case Market.BTC:
      return Coin.BTC;
    case Market.ETH:
      return Coin.ETH;
    case Market.ALPH:
      return Coin.ALPH;
    default:
      return null;
  }
};

export const byteVecToMarket = (byteVec: string) => {
  switch (byteVec) {
    case Buffer.from(Market.BTC).toString("hex"):
      return Market.BTC;
    case Buffer.from(Market.ETH).toString("hex"):
      return Market.ETH;
    case Buffer.from(Market.ALPH).toString("hex"):
      return Market.ALPH;
    default:
      return null;
  }
};

export const generateSnackbarId = () => {
  return Math.round(Math.random() * 1000000000);
};

export const handleSnackbar = (message: string, txId?: string) => {
  const id = generateSnackbarId();
  useStore.getState().addSnackbar({ id, message, txId });
};
