import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { ONE_TOKEN } from '../src/consts'

let signer: PrivateKeyWallet

describe('alph trade tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('deploy works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
    await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)
  })
})
