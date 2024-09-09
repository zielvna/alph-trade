import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { deployOracle } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { getValue, setValue } from '../src/oracleUtils'
import { SetValue } from '../artifacts/ts'

let signer: PrivateKeyWallet

describe('oracle tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('deploy works', async () => {
    await deployOracle(60_00000000n, signer)
  })

  test('withdraw works', async () => {
    const oracle = await deployOracle(60_00000000n, signer)

    const value = await getValue(oracle, 'BTC/USDC')
    expect(value.value).toBe(60_00000000n)
    await setValue(oracle, 'BTC/USDC', 70_00000000n, signer)
    const newValue = await getValue(oracle, 'BTC/USDC')
    expect(newValue.value).toBe(70_00000000n)
  })
})
