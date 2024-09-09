import { ALPH_TOKEN_ID, node, NodeProvider, SignerProvider, web3 } from '@alephium/web3'
import { Token, TokenInstance } from '../artifacts/ts'

export async function deployToken(
  symbol: string,
  name: string,
  decimals: bigint,
  supply: bigint,
  signer: SignerProvider
): Promise<TokenInstance> {
  const deployResult = await waitTxConfirmed(
    Token.deploy(signer, {
      initialFields: {
        symbol: Buffer.from(symbol, 'utf8').toString('hex'),
        name: Buffer.from(name, 'utf8').toString('hex'),
        decimals,
        supply,
        balance: supply
      },
      issueTokenAmount: supply
    })
  )
  return Token.at(deployResult.contractInstance.address)
}

export async function waitTxConfirmed<T extends { txId: string }>(promise: Promise<T>): Promise<T> {
  const result = await promise
  await _waitTxConfirmed(web3.getCurrentNodeProvider(), result.txId, 1)
  return result
}

async function _waitTxConfirmed(provider: NodeProvider, txId: string, confirmations: number): Promise<node.Confirmed> {
  const status = await provider.transactions.getTransactionsStatus({
    txId: txId
  })
  if (isConfirmed(status) && status.chainConfirmations >= confirmations) {
    return status
  }
  await new Promise((r) => setTimeout(r, 1000))
  return _waitTxConfirmed(provider, txId, confirmations)
}

function isConfirmed(txStatus: node.TxStatus): txStatus is node.Confirmed {
  return txStatus.type === 'Confirmed'
}

export async function balanceOf(tokenId: string, address: string): Promise<bigint> {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(address)
  if (tokenId == ALPH_TOKEN_ID) {
    return BigInt(balances.balance)
  }
  const balance = balances.tokenBalances?.find((t) => t.id === tokenId)
  return balance === undefined ? 0n : BigInt(balance.amount)
}
