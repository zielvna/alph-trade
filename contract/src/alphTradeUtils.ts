import { ALPH_TOKEN_ID, MAP_ENTRY_DEPOSIT, ONE_ALPH, SignerProvider } from '@alephium/web3'
import { ALPHTradeInstance, ClosePosition, Deposit, OpenPosition, Withdraw } from '../artifacts/ts'
import { Position } from '../artifacts/ts/types'

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
  type: bigint,
  colateral: bigint,
  leverage: bigint,
  signer: SignerProvider
) => {
  const usdcId = (await alphTrade.fetchState()).fields.usdcId
  return await OpenPosition.execute(signer, {
    initialFields: { alphTrade: alphTrade.address, type, colateral, leverage },
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
