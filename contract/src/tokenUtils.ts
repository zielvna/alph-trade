import { DUST_AMOUNT, SignerProvider } from '@alephium/web3'
import { TokenInstance, Withdraw } from '../artifacts/ts'

export const withdraw = async (token: TokenInstance, amount: bigint, signer: SignerProvider) => {
  return await Withdraw.execute(signer, {
    initialFields: {
      token: token.address,
      amount
    },
    attoAlphAmount: DUST_AMOUNT
  })
}
