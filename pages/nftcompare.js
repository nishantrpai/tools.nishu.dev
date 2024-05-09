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
    // if token uri is data:// json parse it
    if (tokenURI.startsWith('data:')) {
      const metadata = JSON.parse(atob(tokenURI.split('data:application/json;base64,')[1]))
      return metadata
    }
    else if (tokenURI.startsWith('http')) {
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


  const renderCard = (token1Data) => {
    return (
      <div className={styles.nftcard} style={{ width: '100%'}}>
        {Object.keys(token1Data).length ?
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}
          >
            {/* add a layer on top */}
            <div style={{
              minHeight: 200,
              display: 'flex',
              justifyContent: 'center',
              background: '#000',
              borderRadius: '0 10px 10px 10px',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
              <img src={token1Data.image}></img>
            </div>
            <div style={{
              color: 'gray',
              fontSize: '14px',
              marginTop: '10px',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
              className={styles.nftdata}
            >
              <b style={{ color: "#fff", fontSize: 20 }}>{token1Data.name}</b>
              {token1Data.attributes && token1Data.attributes.map((attr, index) => (
                <div key={index}>{attr.trait_type}: {attr.value}</div>
              ))}
            </div>
          </div> : null}
      </div>

    )
  }

  return (
    // one input for collection address and two inputs for token ids
    <main className={styles.main}>
      <a href='/' className={styles.home}>🏠</a>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <h1>NFT v/s NFT</h1>
        <span style={
          {
            color: 'gray',
            fontSize: '14px'
          }
        }>Enter the collection address and token ids of two nfts to compare
        </span>

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
          {renderCard(token1Data)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '50%' }}>
          <div className={styles.searchContainer}>
            <input className={styles.search} placeholder="Token ID"
              onChange={(e) => {
                setToken2(e.target.value)
              }}
            ></input>
          </div>
          {renderCard(token2Data)}
        </div>

      </div>
    </main>
  )
}

export default NFTCompare;