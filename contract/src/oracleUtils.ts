import { SignerProvider } from '@alephium/web3'
import { OracleInstance, SetValue } from '../artifacts/ts'
import { OracleValue } from '../artifacts/ts/types'

export const getValue = async (oracle: OracleInstance, key: string): Promise<OracleValue> => {
  const result = await oracle.view.getValue({ args: { key: Buffer.from(key, 'utf8').toString('hex') } })
  return result.returns
}

export const setValue = async (oracle: OracleInstance, key: string, value: bigint, signer: SignerProvider) => {
  return await SetValue.execute(signer, {
    initialFields: { oracle: oracle.address, key: Buffer.from(key, 'utf8').toString('hex'), value }
  })
}
