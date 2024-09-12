import { getSigner } from '@alephium/web3-test'
import { ONE_TOKEN } from '../src/consts'
import { deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import fs from 'fs/promises'

export const main = async () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner(ONE_ALPH * 1000n, 0)
  const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
  const oracle = await deployOracle(50000_00000000n, signer)
  const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

  await fs.writeFile(
    './contracts.json',
    JSON.stringify({
      USDCAddress: USDC.address,
      oracleAddress: oracle.address,
      alphTradeAddress: alphTrade.address,
      USDCContractId: USDC.contractId,
      oracleContractId: oracle.contractId,
      alphTradeContractId: alphTrade.contractId
    })
  )
}

main()
