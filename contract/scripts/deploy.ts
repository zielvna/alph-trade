import { getSigner } from '@alephium/web3-test'
import { ONE_TOKEN } from '../src/consts'
import { deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import fs from 'fs/promises'
import { mint } from '../src/tokenUtils'
import { addMarket, deposit } from '../src/alphTradeUtils'
import { setValue } from '../src/oracleUtils'

export const main = async () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner(ONE_ALPH * 1000n, 0)
  const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 1000000n, signer)
  const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
  const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

  await addMarket(alphTrade, 'BTC/USD', signer)
  await addMarket(alphTrade, 'ETH/USD', signer)
  await addMarket(alphTrade, 'ALPH/USD', signer)

  console.log('alph trade deployed')

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

  await mint(USDC, 1000n * ONE_TOKEN, signer)
  await deposit(alphTrade, 1000n * ONE_TOKEN, signer)

  console.log('deposited liquidity')

  const updatePrice = async () => {
    const btcResponse = await fetch(
      'https://api.diadata.org/v1/assetQuotation/Bitcoin/0x0000000000000000000000000000000000000000'
    )
    const ethResponse = await fetch(
      'https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000'
    )
    const alphResponse = await fetch(
      'https://api.diadata.org/v1/assetQuotation/Alephium/tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'
    )
    const { Price: btcPrice } = await btcResponse.json()
    const { Price: ethPrice } = await ethResponse.json()
    const { Price: alphPrice } = await alphResponse.json()
    await setValue(oracle, 'BTC/USD', BigInt(Math.round(btcPrice * 100000000)), signer)
    await setValue(oracle, 'ETH/USD', BigInt(Math.round(ethPrice * 100000000)), signer)
    await setValue(oracle, 'ALPH/USD', BigInt(Math.round(alphPrice * 100000000)), signer)
    console.log('updated prices')
  }

  await updatePrice()
  setInterval(async () => {
    await updatePrice()
  }, 30 * 1000)
}

main()
