import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { balanceOf, deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { mint } from '../src/tokenUtils'
import { MAX_VALUE, ONE_TOKEN } from '../src/consts'
import { closePosition, deposit, getPosition, liquidate, openPosition } from '../src/alphTradeUtils'
import { setValue } from '../src/oracleUtils'

let signer: PrivateKeyWallet

describe('token tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('open position works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await mint(USDC, ONE_TOKEN * 5n, signer)
    await deposit(alphTrade, ONE_TOKEN * 4n, signer)

    const positionsIndexBefore = (await alphTrade.fetchState()).fields.positionsIndex
    const longPositionsSizeBefore = (await alphTrade.fetchState()).fields.longPositionsSize
    const shortPositionsSizeBefore = (await alphTrade.fetchState()).fields.shortPositionsSize
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(alphTradeUSDCBalance).toBe(ONE_TOKEN * 4n)
    expect(signerUSDCBalance).toBe(ONE_TOKEN)
    expect(positionsIndexBefore).toBe(0n)
    expect(longPositionsSizeBefore).toBe(0n)
    expect(shortPositionsSizeBefore).toBe(0n)

    await openPosition(alphTrade, 0n, ONE_TOKEN, 2n, signer)

    const positionsIndex = (await alphTrade.fetchState()).fields.positionsIndex
    const longPositionsSize = (await alphTrade.fetchState()).fields.longPositionsSize
    const shortPositionsSize = (await alphTrade.fetchState()).fields.shortPositionsSize
    const alphTradeUSDCBalanceAfter = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalanceAfter = await balanceOf(USDC.contractId, signer.address)
    expect(positionsIndex).toBe(1n)
    expect(longPositionsSize).toBe(ONE_TOKEN * 2n)
    expect(shortPositionsSize).toBe(0n)
    expect(alphTradeUSDCBalanceAfter).toBe(ONE_TOKEN * 5n)
    expect(signerUSDCBalanceAfter).toBe(0n)

    const position = await getPosition(alphTrade, 0n)
    expect(position.owner).toBe(signer.address)
    expect(position.type).toBe(0n)
    expect(position.colateral).toBe(ONE_TOKEN)
    expect(position.leverage).toBe(2n)
    expect(position.entryPrice).toBe(BigInt(Math.round(50000_00000000 * 1.005)))
  })

  test('close position works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await mint(USDC, ONE_TOKEN * 5n, signer)
    await deposit(alphTrade, ONE_TOKEN * 4n, signer)
    await openPosition(alphTrade, 0n, ONE_TOKEN, 2n, signer)

    const positionsIndexBefore = (await alphTrade.fetchState()).fields.positionsIndex
    const longPositionsSizeBefore = (await alphTrade.fetchState()).fields.longPositionsSize
    const shortPositionsSizeBefore = (await alphTrade.fetchState()).fields.shortPositionsSize
    expect(positionsIndexBefore).toBe(1n)
    expect(longPositionsSizeBefore).toBe(ONE_TOKEN * 2n)
    expect(shortPositionsSizeBefore).toBe(0n)
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(alphTradeUSDCBalance).toBe(ONE_TOKEN * 5n)
    expect(signerUSDCBalance).toBe(0n)

    await closePosition(alphTrade, 0n, signer)

    const positionsIndex = (await alphTrade.fetchState()).fields.positionsIndex
    const longPositionsSize = (await alphTrade.fetchState()).fields.longPositionsSize
    const shortPositionsSize = (await alphTrade.fetchState()).fields.shortPositionsSize
    expect(positionsIndex).toBe(0n)
    expect(longPositionsSize).toBe(0n)
    expect(shortPositionsSize).toBe(0n)
    const alphTradeUSDCBalanceAfter = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalanceAfter = await balanceOf(USDC.contractId, signer.address)
    expect(alphTradeUSDCBalanceAfter).toBe(4020001n)
    // 1 - (1 * 2 * 0.00005) - (1 - (50000 * 0.995) / (50000 * 1.005)) * 1 * 2 = 0.979999...
    expect(signerUSDCBalanceAfter).toBe(979999n)
  })

  test('liquidate works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await mint(USDC, ONE_TOKEN * 5n, signer)
    await deposit(alphTrade, ONE_TOKEN * 4n, signer)
    await openPosition(alphTrade, 0n, ONE_TOKEN, 2n, signer)
    await setValue(oracle, 'BTC/USDC', 27500_00000000n, signer)
    await liquidate(alphTrade, 0n, signer)

    const positionsIndex = (await alphTrade.fetchState()).fields.positionsIndex
    const longPositionsSize = (await alphTrade.fetchState()).fields.longPositionsSize
    const shortPositionsSize = (await alphTrade.fetchState()).fields.shortPositionsSize
    const liquidity = (await alphTrade.fetchState()).fields.liquidity
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(positionsIndex).toBe(0n)
    expect(longPositionsSize).toBe(0n)
    expect(shortPositionsSize).toBe(0n)
    expect(liquidity).toBe(4990000n)
    expect(alphTradeUSDCBalance).toBe(4990000n)
    expect(signerUSDCBalance).toBe(10000n)
  })
})
