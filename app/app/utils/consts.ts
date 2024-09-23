import Contracts from "../../../contract/contracts.json";
import { ALPHTrade, Oracle, Token } from "../artifacts/ts";
import { Market } from "../enums/market";

export const ALPH_TRADE_ADDRESS = Contracts.alphTradeAddress;
export const ALPH_TRADE_CONTRACT_ID = Contracts.alphTradeContractId;
export const USDC_ADDRESS = Contracts.USDCAddress;
export const USDC_CONTRACT_ID = Contracts.USDCContractId;
export const ORACLE_ADDRESS = Contracts.oracleAddress;
export const ORACLE_CONTRACT_ID = Contracts.oracleContractId;

export const ALPH_TRADE = ALPHTrade.at(ALPH_TRADE_ADDRESS);
export const USDC = Token.at(USDC_ADDRESS);
export const ORACLE = Oracle.at(ORACLE_ADDRESS);

export const TOKEN_DECIMAL = 6n;
export const TOKEN_DENOMINATOR = 10n ** TOKEN_DECIMAL;
export const PRICE_DECIMAL = 8n;
export const PRICE_DENOMINATOR = 10n ** PRICE_DECIMAL;

export const MAX_VALUE = 2n ** 256n - 1n;
export const MIN_COLATERAL = TOKEN_DENOMINATOR;
export const PNL_LIQUIDATION_TRESHOLD = -(5 / 6) * 100;

export const MARKETS = [Market.BTC, Market.ETH, Market.ALPH];
export const ORACLE_API_URL = {
  [Market.BTC]:
    "https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000",
  [Market.ETH]:
    "https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000",
  [Market.ALPH]:
    "https://api.diadata.org/v1/assetQuotation/Alephium/tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq",
};
export const TRADING_VIEW_TICKER = {
  [Market.BTC]: "BINANCE:BTCUSD",
  [Market.ETH]: "BINANCE:ETHUSD",
  [Market.ALPH]: "MEXC:ALPHUSDT",
};
