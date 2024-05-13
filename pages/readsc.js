import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { JsonRpcProvider, EtherscanProvider as Provider } from 'ethers';
import { Contract } from 'sevm';
import 'sevm/4bytedb'

export default function AskSC() {

  const [contract, setContract] = useState(null)
  const [functions, setFunctions] = useState([])
  const [address, setAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')

  async function getContract() {
    setContract('Loading...')
    setFunctions(['Loading...'])
    const provider = new JsonRpcProvider('https://eth.llamarpc.com')
    const bytecode = await provider.getCode(address)
    console.log(bytecode.length)
    const contract = new Contract(bytecode).patchdb();
    setFunctions(contract.getFunctions())
    setContract(contract.solidify())
  }

  useEffect(() => {
    getContract()
  }, [address])

  return (
    <>
      <Head>
        <title>Read Smart Contract</title>
        <meta name="description" content="Read Smart Contract, regardless whether it is verified or not" />
      </Head>
      <main style={{ maxWidth: 1200 }}>
        <h1>Read Smart Contract</h1>
        <p style={{ color: '#333', fontSize: 12 }}>Enter the contract address to read the smart contract</p>
        <div style={{ display: 'flex', width: '100%', border: '1px solid #333', borderRadius: '5px' }}>
          <input type="text" style={{ flexBasis: '100%', padding: '10px', border: 'none', outline: 'none', background: 'none', color: '#fff' }} placeholder="Paste youtube video url" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className={styles.row} style={{ gap: '20px', width: '100%', margin: 'auto' }}>
          <div style={{ flexBasis: '60%', border: '1px solid #333', height: '500px' }}>
            <p style={{ whiteSpace: 'pre-wrap', overflow: 'scroll', maxHeight: '460px', fontSize: '10px', fontFamily: 'monospace', color: '#888' }}>{contract}</p>
          </div>
          <div style={{ flexBasis: '40%', border: '1px solid #333', height: '500px', display: 'flex', overflow: 'scroll', flexDirection: 'column' }}>
            {functions.map((func, index) => (
              <div key={index} style={{ padding: '20px 0px', borderBottom: '1px solid #333', color: '#333' }}>
                <p style={{
                  color: '#888',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
                >{func}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}