// compare two nfts side by side
import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const NFTCompare = () => {
  let RPC_CHAINS = {
    'ETHEREUM': {
      'rpc': 'https://eth.llamarpc.com',
      'chainId': 1,
      'network': 'mainnet',
    },
    'ZORA': {
      'rpc': 'https://rpc.zora.energy',
      'chainId': 1,
      'network': 'mainnet',
    }
  }
  const [collectionAddress, setCollectionAddress] = useState('')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('')
  const [token2, setToken2] = useState('')
  const [token1Data, setToken1Data] = useState({})
  const [token2Data, setToken2Data] = useState({})

  const getNFTData = async (collection_address, id) => {
    // get metadata of nft and ipfs hash
    const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
    const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider)
    const tokenURI = await contract.tokenURI(id)
    // if tokenURI is a url, fetch the metadata, if it is ipfs replace with ipfs.io
    if (tokenURI.startsWith('http')) {
      const response = await fetch(tokenURI)
      const metadata = await response.json()
      return metadata
    } else {
      const ipfsHash = tokenURI.split('ipfs://')[1]
      const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
      const response = await fetch(ipfsUrl)
      const metadata = await response.json()
      return metadata
    }
  }

  useEffect(() => {
    if (collectionAddress && token1) {
      getNFTData(collectionAddress, token1).then(data => {
        // in metadata image if there is ipfs replace with ipfs.io
        let image = data.image
        if (image.startsWith('ipfs')) {
          const ipfsHash = image.split('ipfs://')[1]
          image = `https://ipfs.io/ipfs/${ipfsHash}`
        }
        data.image = image
        setToken1Data(data)
      })
    }
  }, [token1])

  useEffect(() => {
    if (collectionAddress && token2) {
      getNFTData(collectionAddress, token2).then(data => {
        let image = data.image
        if (image.startsWith('ipfs')) {
          const ipfsHash = image.split('ipfs://')[1]
          image = `https://ipfs.io/ipfs/${ipfsHash}`
        }
        data.image = image
        setToken2Data(data)
      })
    }
  }, [token2])

  return (
    // one input for collection address and two inputs for token ids
    <main className={styles.main}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1>Compare 2 nfts side by side from the same collection</h1>
        {/* create a select with RPC chains */}
        <select style={{ border: 'none', padding: '10px', borderRadius: '5px', outline: 'none' }}
          onChange={(e) => {
            setChain(e.target.value)
          }}
        >
          <option>ETHEREUM</option>
          <option>ZORA</option>
        </select>
        <div className={styles.searchContainer}>
          <input className={styles.search} placeholder="Collection Address"
            onChange={(e) => {
              setCollectionAddress(e.target.value)
            }}
          ></input>
        </div>
      </div>
      <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
        {/* display the two nfts side by side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '50%' }}>

          <div className={styles.searchContainer}>
            <input className={styles.search} placeholder="Token ID"
              onChange={(e) => {
                setToken1(e.target.value)
              }}
            ></input>
          </div>
          {Object.keys(token1Data).length ?
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
              <img src={token1Data.image} style={{ width: '200px', height: '200px' }}></img>
              <b>{token1Data.name}</b>
              <div style={{
                color: 'gray',
                fontSize: '14px'
              }}>
                {token1Data.attributes && token1Data.attributes.map((attr, index) => (
                  <div key={index}>{attr.trait_type}: {attr.value}</div>
                ))}
              </div>
            </div> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '50%' }}>
          <div className={styles.searchContainer}>
            <input className={styles.search} placeholder="Token ID"
              onChange={(e) => {
                setToken2(e.target.value)
              }}
            ></input>
          </div>
          {Object.keys(token2Data).length ?
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
              <img src={token2Data.image} style={{ width: '200px', height: '200px' }}></img>
              <b>{token2Data.name}</b>
              <div style={{
                color: 'gray',
                fontSize: '14px'
              }}>
                {token2Data.attributes && token2Data.attributes.map((attr, index) => (
                  <div key={index}>{attr.trait_type}: {attr.value}</div>
                ))}
              </div>
            </div>
          : null  
          }
        </div>

      </div>
    </main>
  )
}

export default NFTCompare;