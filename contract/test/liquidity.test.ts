import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { balanceOf, deployALPHTrade, deployOracle, deployToken } from '../src/utils'
import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { setValue } from '../src/oracleUtils'
import { addMarket, closePosition, deposit, openPosition, withdraw } from '../src/alphTradeUtils'
import { mint } from '../src/tokenUtils'
import { MAX_VALUE, ONE_TOKEN } from '../src/consts'

let signer: PrivateKeyWallet

describe('liquidity tests', () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    signer = await getSigner(ONE_ALPH * 1000n, 0)
  })

  test('deposit works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await mint(USDC, ONE_TOKEN, signer)

    const balanceBefore = (await alphTrade.fetchState()).fields.balance
    const liquidityBefore = (await alphTrade.fetchState()).fields.liquidity
    const alphTradeLpBalanceBefore = await balanceOf(alphTrade.contractId, alphTrade.address)
    const alphTradeUSDCBalanceBefore = await balanceOf(USDC.contractId, alphTrade.address)
    const signerLpBalanceBefore = await balanceOf(alphTrade.contractId, signer.address)
    const signerUSDCBalanceBefore = await balanceOf(USDC.contractId, signer.address)
    expect(balanceBefore).toBe(MAX_VALUE)
    expect(liquidityBefore).toBe(0n)
    expect(alphTradeLpBalanceBefore).toBe(MAX_VALUE)
    expect(alphTradeUSDCBalanceBefore).toBe(0n)
    expect(signerLpBalanceBefore).toBe(0n)
    expect(signerUSDCBalanceBefore).toBe(ONE_TOKEN)

    await deposit(alphTrade, ONE_TOKEN, signer)

    const balance = (await alphTrade.fetchState()).fields.balance
    const liquidity = (await alphTrade.fetchState()).fields.liquidity
    const alphTradeLpBalance = await balanceOf(alphTrade.contractId, alphTrade.address)
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerLpBalance = await balanceOf(alphTrade.contractId, signer.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(balance).toBe(MAX_VALUE - ONE_TOKEN)
    expect(liquidity).toBe(ONE_TOKEN)
    expect(alphTradeLpBalance).toBe(MAX_VALUE - ONE_TOKEN)
    expect(alphTradeUSDCBalance).toBe(ONE_TOKEN)
    expect(signerLpBalance).toBe(ONE_TOKEN)
    expect(signerUSDCBalance).toBe(0n)
  })

  test('withdraw works', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await mint(USDC, ONE_TOKEN, signer)
    await deposit(alphTrade, ONE_TOKEN, signer)
    await withdraw(alphTrade, ONE_TOKEN / 2n, signer)

    const balance = (await alphTrade.fetchState()).fields.balance
    const liquidity = (await alphTrade.fetchState()).fields.liquidity
    const alphTradeLpBalance = await balanceOf(alphTrade.contractId, alphTrade.address)
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerLpBalance = await balanceOf(alphTrade.contractId, signer.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(balance).toBe(MAX_VALUE - ONE_TOKEN / 2n)
    expect(liquidity).toBe(ONE_TOKEN / 2n)
    expect(alphTradeLpBalance).toBe(MAX_VALUE - ONE_TOKEN / 2n)
    expect(alphTradeUSDCBalance).toBe(ONE_TOKEN / 2n)
    expect(signerLpBalance).toBe(ONE_TOKEN / 2n)
    expect(signerUSDCBalance).toBe(ONE_TOKEN / 2n)

    await withdraw(alphTrade, ONE_TOKEN / 2n, signer)

    const balanceAfter = (await alphTrade.fetchState()).fields.balance
    const liquidityAfter = (await alphTrade.fetchState()).fields.liquidity
    const alphTradeLpBalanceAfter = await balanceOf(alphTrade.contractId, alphTrade.address)
    const alphTradeUSDCBalanceAfter = await balanceOf(USDC.contractId, alphTrade.address)
    const signerLpBalanceAfter = await balanceOf(alphTrade.contractId, signer.address)
    const signerUSDCBalanceAfter = await balanceOf(USDC.contractId, signer.address)
    expect(balanceAfter).toBe(MAX_VALUE)
    expect(liquidityAfter).toBe(0n)
    expect(alphTradeLpBalanceAfter).toBe(MAX_VALUE)
    expect(alphTradeUSDCBalanceAfter).toBe(0n)
    expect(signerLpBalanceAfter).toBe(0n)
    expect(signerUSDCBalanceAfter).toBe(ONE_TOKEN)
  })

  test('withdraw after liquidity increased', async () => {
    const USDC = await deployToken('USDC', 'USD Coin', 6n, ONE_TOKEN * 100n, signer)
    const oracle = await deployOracle(50000_00000000n, 2500_00000000n, 1_50000000n, signer)
    const alphTrade = await deployALPHTrade('ATLP', 'alph trade lp', 6n, USDC.contractId, oracle.contractId, signer)

    await mint(USDC, ONE_TOKEN * 5n, signer)
    await deposit(alphTrade, ONE_TOKEN * 4n, signer)
    await addMarket(alphTrade, 'BTC/USD', signer)
    await openPosition(alphTrade, 'BTC/USD', 0n, ONE_TOKEN, 2n, signer)
    await setValue(oracle, 'BTC/USD', 60000_00000000n, signer)
    await closePosition(alphTrade, 0n, signer)

    await withdraw(alphTrade, ONE_TOKEN * 2n, signer)
    const balance = (await alphTrade.fetchState()).fields.balance
    const liquidity = (await alphTrade.fetchState()).fields.liquidity
    const alphTradeLpBalance = await balanceOf(alphTrade.contractId, alphTrade.address)
    const alphTradeUSDCBalance = await balanceOf(USDC.contractId, alphTrade.address)
    const signerLpBalance = await balanceOf(alphTrade.contractId, signer.address)
    const signerUSDCBalance = await balanceOf(USDC.contractId, signer.address)
    expect(balance).toBe(MAX_VALUE - ONE_TOKEN * 2n)
    // ((4 + 1) - (1 - (1 * 2 * 0.00005) - (1 - (60000 * 0.995) / (50000 * 1.005)) * 1 * 2)) * (2 / 4) = 1.811990 (rounded up)
    expect(liquidity).toBe(1811991n)
    expect(alphTradeLpBalance).toBe(MAX_VALUE - ONE_TOKEN * 2n)
    expect(alphTradeUSDCBalance).toBe(1811991n)
    expect(signerLpBalance).toBe(ONE_TOKEN * 2n)
    expect(signerUSDCBalance).toBe(ONE_TOKEN * 5n - 1811991n)
  })
})
