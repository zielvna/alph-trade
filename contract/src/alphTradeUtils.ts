import { SignerProvider } from '@alephium/web3'
import { ALPHTradeInstance, Deposit, Withdraw } from '../artifacts/ts'

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
