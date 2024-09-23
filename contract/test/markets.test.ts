import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { addMarket, getMarkets, removeMarket } from '../src/alphTradeUtils'
import { ONE_TOKEN } from '../src/consts'

let signer: PrivateKeyWallet

describe('markets tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('add market works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    const marketsBefore = await getMarkets(alphTrade)
    const marketsIndexBefore = (await alphTrade.fetchState()).fields.marketsIndex
    expect(marketsBefore[0]).toBe('')
    expect(marketsIndexBefore).toBe(0n)

    await addMarket(alphTrade, 'BTC/USD', signer)

    const markets = await getMarkets(alphTrade)
    const marketsIndex = (await alphTrade.fetchState()).fields.marketsIndex
    expect(markets[0]).toBe(Buffer.from('BTC/USD', 'utf8').toString('hex'))
    expect(marketsIndex).toBe(1n)
  })

  test('remove market works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await addMarket(alphTrade, 'BTC/USD', signer)

    const marketsBefore = await getMarkets(alphTrade)
    const marketsIndexBefore = (await alphTrade.fetchState()).fields.marketsIndex
    expect(marketsBefore[0]).toBe(Buffer.from('BTC/USD', 'utf8').toString('hex'))
    expect(marketsIndexBefore).toBe(1n)

    await removeMarket(alphTrade, 'BTC/USD', signer)

    const markets = await getMarkets(alphTrade)
    const marketsIndex = (await alphTrade.fetchState()).fields.marketsIndex
    expect(markets[0]).toBe('')
    expect(marketsIndex).toBe(0n)
  })
})
