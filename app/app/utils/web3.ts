import {
  ALPH_TOKEN_ID,
  DUST_AMOUNT,
  ExecuteScriptResult,
  MAP_ENTRY_DEPOSIT,
  SignerProvider,
  web3,
} from "@alephium/web3";
import {
  ALPH_TRADE,
  ALPH_TRADE_CONTRACT_ID,
  MAX_VALUE,
  ORACLE,
  USDC_CONTRACT_ID,
} from "./consts";
import { PositionWithIndex } from "./types";
import {
  ClosePosition,
  Deposit,
  Liquidate,
  Mint,
  OpenPosition,
  Withdraw,
} from "../artifacts/ts";
import { PositionType } from "../enums/position-type";

export const balanceOf = async (
  tokenId: string,
  address: string
): Promise<bigint> => {
  const balances = await web3
    .getCurrentNodeProvider()
    .addresses.getAddressesAddressBalance(address);
  if (tokenId == ALPH_TOKEN_ID) {
    return BigInt(balances.balance);
  }
  const balance = balances.tokenBalances?.find((t) => t.id === tokenId);
  return balance === undefined ? 0n : BigInt(balance.amount);
};

export const getPositions = async (
  address: string
): Promise<PositionWithIndex[]> => {
  const [positions, indexes] = (
    await ALPH_TRADE.view.getPositions({
      args: { address: address },
    })
  ).returns;

  const parsedPositions = positions
    .map((position, index) => ({ ...position, index: indexes[index] }))
    .filter((position) => position.colateral !== 0n);

  return parsedPositions;
};

export const mint = async (
  amount: bigint,
  signer: SignerProvider
): Promise<ExecuteScriptResult> => {
  return await Mint.execute(signer, {
    initialFields: {
      token: USDC_CONTRACT_ID,
      amount,
    },
    attoAlphAmount: DUST_AMOUNT,
  });
};

export const closePosition = async (
  positionIndex: bigint,
  signer: SignerProvider
) => {
  return await ClosePosition.execute(signer, {
    initialFields: {
      alphTrade: ALPH_TRADE_CONTRACT_ID,
      positionIndex,
    },
  });
};

export const openPosition = async (
  positionType: PositionType,
  colateral: bigint,
  leverage: bigint,
  signer: SignerProvider
) => {
  return await OpenPosition.execute(signer, {
    initialFields: {
      alphTrade: ALPH_TRADE_CONTRACT_ID,
      type: positionType === PositionType.LONG ? 0n : 1n,
      colateral,
      leverage,
    },
    attoAlphAmount: MAP_ENTRY_DEPOSIT,
    tokens: [{ id: USDC_CONTRACT_ID, amount: colateral }],
  });
};

export const getBTCPrice = async () => {
  const result = await getValue("BTC/USDC");
  return result.value;
};

export const getValue = async (key: string) => {
  const result = (
    await ORACLE.view.getValue({
      args: { key: Buffer.from(key, "utf8").toString("hex") },
    })
  ).returns;
  return result;
};

export const deposit = async (amount: bigint, signer: SignerProvider) => {
  return await Deposit.execute(signer, {
    initialFields: { alphTrade: ALPH_TRADE_CONTRACT_ID, amount },
    tokens: [{ id: USDC_CONTRACT_ID, amount }],
  });
};

export const withdraw = async (amount: bigint, signer: SignerProvider) => {
  return await Withdraw.execute(signer, {
    initialFields: { alphTrade: ALPH_TRADE_CONTRACT_ID, amount },
    tokens: [{ id: ALPH_TRADE_CONTRACT_ID, amount }],
  });
};

export const getLpTokenSupply = async () => {
  const state = await ALPH_TRADE.fetchState();
  return MAX_VALUE - state.fields.balance;
};

export const getLiquidity = async () => {
  return (await ALPH_TRADE.fetchState()).fields.liquidity;
};

export const getOpenInterest = async () => {
  const state = await ALPH_TRADE.fetchState();
  return {
    long: state.fields.longPositionsSize,
    short: state.fields.shortPositionsSize,
    total: state.fields.longPositionsSize + state.fields.shortPositionsSize,
  };
};

export const getAllPositions = async () => {
  const [positions, indexes, count] = (
    await ALPH_TRADE.view.getAllPositions({
      args: { offset: 0n },
    })
  ).returns;

  const parsedPositions = positions
    .map((position, index) => ({ ...position, index: indexes[index] }))
    .filter((position) => position.colateral !== 0n);

  for (let i = 35n; i < count; i++) {
    const [positions, indexes] = (
      await ALPH_TRADE.view.getAllPositions({
        args: { offset: i },
      })
    ).returns;

    parsedPositions.push(
      ...positions.map((position, index) => ({
        ...position,
        index: indexes[index],
      }))
    );
  }

  return parsedPositions;
};

export const liquidate = async (
  positionIndex: bigint,
  signer: SignerProvider
) => {
  return await Liquidate.execute(signer, {
    initialFields: {
      alphTrade: ALPH_TRADE_CONTRACT_ID,
      positionIndex,
    },
  });
};
