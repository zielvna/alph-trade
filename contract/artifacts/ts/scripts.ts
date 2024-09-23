/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { getContractByCodeHash } from "./contracts";
import { default as AddMarketScriptJson } from "../scripts/AddMarket.ral.json";
import { default as ClosePositionScriptJson } from "../scripts/ClosePosition.ral.json";
import { default as DepositScriptJson } from "../scripts/Deposit.ral.json";
import { default as LiquidateScriptJson } from "../scripts/Liquidate.ral.json";
import { default as MintScriptJson } from "../scripts/Mint.ral.json";
import { default as OpenPositionScriptJson } from "../scripts/OpenPosition.ral.json";
import { default as RemoveMarketScriptJson } from "../scripts/RemoveMarket.ral.json";
import { default as SetValueScriptJson } from "../scripts/SetValue.ral.json";
import { default as WithdrawScriptJson } from "../scripts/Withdraw.ral.json";
import { OracleValue, Position, AllStructs } from "./types";

export const AddMarket = new ExecutableScript<{
  alphTrade: HexString;
  ticker: HexString;
}>(Script.fromJson(AddMarketScriptJson, "", AllStructs), getContractByCodeHash);

export const ClosePosition = new ExecutableScript<{
  alphTrade: HexString;
  positionIndex: bigint;
}>(
  Script.fromJson(ClosePositionScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const Deposit = new ExecutableScript<{
  alphTrade: HexString;
  amount: bigint;
}>(Script.fromJson(DepositScriptJson, "", AllStructs), getContractByCodeHash);

export const Liquidate = new ExecutableScript<{
  alphTrade: HexString;
  positionIndex: bigint;
}>(Script.fromJson(LiquidateScriptJson, "", AllStructs), getContractByCodeHash);

export const Mint = new ExecutableScript<{ token: HexString; amount: bigint }>(
  Script.fromJson(MintScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const OpenPosition = new ExecutableScript<{
  alphTrade: HexString;
  market: HexString;
  type: bigint;
  colateral: bigint;
  leverage: bigint;
}>(
  Script.fromJson(OpenPositionScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const RemoveMarket = new ExecutableScript<{
  alphTrade: HexString;
  ticker: HexString;
}>(
  Script.fromJson(RemoveMarketScriptJson, "", AllStructs),
  getContractByCodeHash
);

export const SetValue = new ExecutableScript<{
  oracle: HexString;
  key: HexString;
  value: bigint;
}>(Script.fromJson(SetValueScriptJson, "", AllStructs), getContractByCodeHash);

export const Withdraw = new ExecutableScript<{
  alphTrade: HexString;
  amount: bigint;
}>(Script.fromJson(WithdrawScriptJson, "", AllStructs), getContractByCodeHash);
