import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { balanceOf, deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { mint } from '../src/tokenUtils'
import { MAX_VALUE, ONE_TOKEN } from '../src/consts'
import { closePosition, deposit, getPosition, openPosition } from '../src/alphTradeUtils'

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
    const positionsSizeBefore = (await alphTrade.fetchState()).fields.positionsSize
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(alphTradeUSDCBalance).toBe(ONE_TOKEN * 4n)
    expect(signerUSDCBalance).toBe(ONE_TOKEN)
    expect(positionsIndexBefore).toBe(0n)
    expect(positionsSizeBefore).toBe(0n)

    await openPosition(alphTrade, 0n, ONE_TOKEN, 2n, signer)

    const positionsIndex = (await alphTrade.fetchState()).fields.positionsIndex
    const positionsSize = (await alphTrade.fetchState()).fields.positionsSize
    const alphTradeUSDCBalanceAfter = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalanceAfter = await balanceOf(USDC.contractId, signer.address)
    expect(positionsIndex).toBe(1n)
    expect(positionsSize).toBe(ONE_TOKEN * 2n)
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
    const positionsSizeBefore = (await alphTrade.fetchState()).fields.positionsSize
    expect(positionsIndexBefore).toBe(1n)
    expect(positionsSizeBefore).toBe(ONE_TOKEN * 2n)
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(alphTradeUSDCBalance).toBe(ONE_TOKEN * 5n)
    expect(signerUSDCBalance).toBe(0n)

    await closePosition(alphTrade, 0n, signer)

    const positionsIndex = (await alphTrade.fetchState()).fields.positionsIndex
    const positionsSize = (await alphTrade.fetchState()).fields.positionsSize
    expect(positionsIndex).toBe(0n)
    expect(positionsSize).toBe(0n)
    const alphTradeUSDCBalanceAfter = await balanceOf(USDC.contractId, alphTrade.address)
    const signerUSDCBalanceAfter = await balanceOf(USDC.contractId, signer.address)
    expect(alphTradeUSDCBalanceAfter).toBe(4020001n)
    expect(signerUSDCBalanceAfter).toBe(979999n)
  })
})
