import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { balanceOf, deployToken } from '../src/utils'
import { DUST_AMOUNT, ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Withdraw } from '../artifacts/ts'

let signer: PrivateKeyWallet

describe('token tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('deploy works', async () => {
    await deployToken('USDC', 'USD Coin', 6n, 1000000000n, signer)
  })

  test('withdraw works', async () => {
    const token = await deployToken('USDC', 'USD Coin', 6n, 1000_000000n, signer)

    const balanceBefore = await balanceOf(token.contractId, signer.address)
    await Withdraw.execute(signer, {
      initialFields: {
        token: token.address,
        amount: 1_000000n
      },
      attoAlphAmount: DUST_AMOUNT
    })
    const balanceAfter = await balanceOf(token.contractId, signer.address)

    expect(balanceBefore + 1_000000n).toBe(balanceAfter)
  })
})
