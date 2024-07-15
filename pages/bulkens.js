// get eth address from many ens names
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export default function BulkENS() {
  // will use a textarea for input
  // resolve them all at once
  const [ensAddresses, setEnsAddresses] = useState([])
  const [ethAddresses, setEthAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [convertType, setConvertType] = useState('ens')

  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth-pokt.nodies.app',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }

  const [chain, setChain] = useState('ETHEREUM')


  const getENsLinkedAddress = async (address) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const ens = await provider.lookupAddress(address)
      return ens
    } catch (e) {
      return 'N/A'
    }
  }

  const resolveEns = async (ens) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const address = await provider.resolveName(ens)
      return address
    } catch (e) {
      return 'N/A'
    }
  }

  const resolveAll = async () => {
    setLoading(true)
    setError('')
    // if the input is addresses lookup ens
    // if the input is ens resolve them
    let addresses = []
    for (let i = 0; i < ensAddresses.length; i++) {
      if (convertType === 'ens') {
        const address = await resolveEns(ensAddresses[i])
        addresses.push(address)
      } else {
        const ens = await getENsLinkedAddress(ensAddresses[i])
        addresses.push(ens)
      }
    }
    addresses = addresses.filter((address) => address !== '')
    setEthAddresses(addresses)
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Bulk ENS Resolver</title>
        <meta name="description" content="Bulk ENS Resolver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bulk ENS Resolver
        </h1>
        <p className={styles.description}>Enter ENS names/address separated by new line</p>
        <textarea onChange={(e) => setEnsAddresses(e.target.value.trim().split('\n'))}
          style={{
            width: '100%',
            border: '1px solid #333',
            borderRadius: 5,
            padding: '10px',
            outline: 'none',
            height: '300px'
          }}
          placeholder='Enter ENS names or addresses separated by new line'
          ></textarea>
        <select onChange={(e) => setConvertType(e.target.value)} style={{
          padding: '10px',
          margin: '10px 0',
          border: '1px solid #333',
          width: '100%',
          borderRadius: 5
        }}>
          <option value="ens">ENS to Address</option>
          <option value="address">Address to ENS</option>
        </select>
        <button onClick={resolveAll}>Resolve All</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {/* show as table and ability to copy paste addresses as string */}
        {ethAddresses.length ? <table style={{
          width: '100%',
          border: '1px solid #333',
          marginTop: '10px',
          overflow: 'hidden',
          borderRadius: 5,
          padding: '10px'
        }}>
          <thead style={{
            border: '1px solid #333',
            gap: '5px',
            padding: '5px 15px'
          }}>
            <tr>
              <th>ENS</th>
              <th>Address</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody style={{
            border: '1px solid #333',
            maxWidth: '500px',
            gap: '5px',
            padding: '5px 15px',
            fontSize: '12px',
            height: '100px',
            textAlign: 'center'
          }}>
            {ethAddresses.map((address, index) => (
              <tr key={index} style={{
                padding: 10,
                margin: 10,
              }}>
                <td>
                  <span style={{
                    padding: 5,
                  }}>
                    {ensAddresses[index]}
                  </span>
                </td>
                <td>
                  <span style={{
                    padding: 5
                  }}>{address}</span>
                </td>
                <td>
                  <button style={{
                    padding: '5px 10px',
                    background: '#000',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: 5,
                    fontSize: 12
                  }}
                  id={`copy-${index}`}
                   onClick={() => {
                    navigator.clipboard.writeText(address)
                    document.getElementById(`copy-${index}`).innerText = 'Copied'
                    setTimeout(() => {
                      document.getElementById(`copy-${index}`).innerText = 'Copy'
                    }, 1000)
                  }}>Copy</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table> : null}
      </main>
    </div>
  )

}