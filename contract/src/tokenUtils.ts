import { DUST_AMOUNT, SignerProvider } from '@alephium/web3'
import { Mint, TokenInstance } from '../artifacts/ts'

export const mint = async (token: TokenInstance, amount: bigint, signer: SignerProvider) => {
  return await Mint.execute(signer, {
    initialFields: {
      token: token.address,
      amount
    },
    attoAlphAmount: DUST_AMOUNT
  })
}
