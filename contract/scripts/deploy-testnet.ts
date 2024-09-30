import { getSigner } from '@alephium/web3-test'
import { ONE_TOKEN, TESTNET_ORACLE_ADDRESS } from '../src/consts'
import { deployALPHTrade, deployToken } from '../src/utils'
import { NodeProvider, sleep, web3 } from '@alephium/web3'
import fs from 'fs/promises'
import { mint } from '../src/tokenUtils'
import { addMarket, deposit } from '../src/alphTradeUtils'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import dotenv from 'dotenv'

dotenv.config()

export const main = async () => {
  web3.setCurrentNodeProvider('https://node.testnet.alephium.org')

  const nodeProvider = new NodeProvider('https://node.testnet.alephium.org')
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY ?? ''
  const signer = new PrivateKeyWallet({ privateKey, nodeProvider })

  const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 1000000n, signer)
  const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, TESTNET_ORACLE_ADDRESS, signer)

  await addMarket(alphTrade, 'BTC/USD', signer)
  await addMarket(alphTrade, 'ETH/USD', signer)
  await addMarket(alphTrade, 'ALPH/USD', signer)

  console.log('alph trade deployed')

  await fs.writeFile(
    './deploys/testnet.json',
    JSON.stringify({
      USDCAddress: USDC.address,
      alphTradeAddress: alphTrade.address,
      USDCContractId: USDC.contractId,
      alphTradeContractId: alphTrade.contractId
    })
  )

  await mint(USDC, 10000n * ONE_TOKEN, signer)
  await sleep(30000)
  await deposit(alphTrade, 10000n * ONE_TOKEN, signer)

  console.log('deposited liquidity')
}

main()
