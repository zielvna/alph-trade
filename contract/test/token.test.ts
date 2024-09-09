import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { balanceOf, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { mint } from '../src/tokenUtils'
import { ONE_TOKEN } from '../src/consts'

let signer: PrivateKeyWallet

describe('token tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('deploy works', async () => {
    await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
  })

  test('withdraw works', async () => {
    const token = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)

    const balanceBefore = await balanceOf(token.contractId, signer.address)
    await mint(token, ONE_TOKEN, signer)
    const balanceAfter = await balanceOf(token.contractId, signer.address)

    expect(balanceBefore + ONE_TOKEN).toBe(balanceAfter)
  })
})
