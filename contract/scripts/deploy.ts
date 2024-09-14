import { getSigner } from '@alephium/web3-test'
import { ONE_TOKEN } from '../src/consts'
import { deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import fs from 'fs/promises'
import { mint } from '../src/tokenUtils'
import { deposit } from '../src/alphTradeUtils'
import { setValue } from '../src/oracleUtils'

export const main = async () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner(ONE_ALPH * 1000n, 0)
  const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 1000000n, signer)
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

  await mint(USDC, 1000n * ONE_TOKEN, signer)
  await deposit(alphTrade, 1000n * ONE_TOKEN, signer)

  const updatePrice = async () => {
    const response = await fetch('https://api4.binance.com/api/v3/ticker/price?symbol=BTCUSDC')
    const { price } = await response.json()
    setValue(oracle, 'BTC/USDC', BigInt(price * 100000000), signer)
  }

  await updatePrice()
  setInterval(async () => {
    await updatePrice()
  }, 120 * 1000)
}

main()
