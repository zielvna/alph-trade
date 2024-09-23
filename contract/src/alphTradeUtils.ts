import { MAP_ENTRY_DEPOSIT, SignerProvider } from '@alephium/web3'
import {
  ALPHTradeInstance,
  ClosePosition,
  Deposit,
  Liquidate,
  OpenPosition,
  Withdraw,
  AddMarket,
  RemoveMarket
} from '../artifacts/ts'
import { Position } from '../artifacts/ts/types'

export const addMarket = async (alphTrade: ALPHTradeInstance, ticker: string, signer: SignerProvider) => {
  return await AddMarket.execute(signer, {
    initialFields: { alphTrade: alphTrade.address, ticker: Buffer.from(ticker, 'utf8').toString('hex') },
    attoAlphAmount: MAP_ENTRY_DEPOSIT
  })
}

export const removeMarket = async (alphTrade: ALPHTradeInstance, ticker: string, signer: SignerProvider) => {
  return await RemoveMarket.execute(signer, {
    initialFields: { alphTrade: alphTrade.address, ticker: Buffer.from(ticker, 'utf8').toString('hex') }
  })
}

export const deposit = async (alphTrade: ALPHTradeInstance, amount: bigint, signer: SignerProvider) => {
  const usdcId = (await alphTrade.fetchState()).fields.usdcId
  return await Deposit.execute(signer, {
    initialFields: { alphTrade: alphTrade.address, amount },
    tokens: [{ id: usdcId, amount }]
  })
}

export const withdraw = async (alphTrade: ALPHTradeInstance, amount: bigint, signer: SignerProvider) => {
  return await Withdraw.execute(signer, {
    initialFields: { alphTrade: alphTrade.address, amount },
    tokens: [{ id: alphTrade.contractId, amount }]
  })
}

export const openPosition = async (
  alphTrade: ALPHTradeInstance,
  market: string,
  type: bigint,
  colateral: bigint,
  leverage: bigint,
  signer: SignerProvider
) => {
  const usdcId = (await alphTrade.fetchState()).fields.usdcId
  return await OpenPosition.execute(signer, {
    initialFields: {
      alphTrade: alphTrade.address,
      market: Buffer.from(market).toString('hex'),
      type,
      colateral,
      leverage
    },
    tokens: [{ id: usdcId, amount: colateral }],
    attoAlphAmount: MAP_ENTRY_DEPOSIT
  })
}

export const closePosition = async (alphTrade: ALPHTradeInstance, positionIndex: bigint, signer: SignerProvider) => {
  return await ClosePosition.execute(signer, {
    initialFields: { alphTrade: alphTrade.address, positionIndex }
  })
}

export const getPosition = async (alphTrade: ALPHTradeInstance, positionIndex: bigint): Promise<Position> => {
  const result = await alphTrade.view.getPosition({ args: { positionIndex } })
  return result.returns
}

export const liquidate = async (alphTrade: ALPHTradeInstance, positionIndex: bigint, signer: SignerProvider) => {
  return await Liquidate.execute(signer, { initialFields: { alphTrade: alphTrade.address, positionIndex } })
}

export const getMarkets = async (alphTrade: ALPHTradeInstance): Promise<string[]> => {
  const result = await alphTrade.view.getMarkets({})
  return result.returns
}
