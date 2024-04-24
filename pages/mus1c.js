// a music player that plays music from the ethereum contract
import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
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

  const [collectionAddress, setCollectionAddress] = useState('0xb8da418ffc2cb675b8b3d73dca0e3f10811fbbdd')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState(4759)
  const [token2, setToken2] = useState('')
  const [token1Data, setToken1Data] = useState({})
  const [token2Data, setToken2Data] = useState({})

  const formatIPFSLink = (link) => {
    return link.replace('ipfs://', 'https://ipfs.io/ipfs/').replace('ar://', 'https://arweave.net/')
  }

  const getNFTData = async (collection_address, id) => {
    // get metadata of nft and ipfs hash
    const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
    const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider)
    let tokenURI = await contract.tokenURI(id)
    // if tokenURI is a url, fetch the metadata, if it is ipfs replace with ipfs.io
    // if token uri is data:// json parse it
    tokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
    // get metadata from the tokenURI
    const response = await fetch(tokenURI)
    const metadata = await response.json()
    setToken1Data(metadata)
  }

  useEffect(() => {
    getNFTData(collectionAddress, token1)
    // if (collectionAddress && token1) {
    //   getNFTData(collectionAddress, token1).then(data => {
    //     // in metadata image if there is ipfs replace with ipfs.io
    //     let image = data.image
    //     if (image.startsWith('ipfs')) {
    //       const ipfsHash = image.split('ipfs://')[1]
    //       image = `https://ipfs.io/ipfs/${ipfsHash}`
    //     }
    //     data.image = image
    //     setToken1Data(data)
    //   })
    // }
  }, [collectionAddress, token1])


  return (
    // one input for collection address and two inputs for token ids
    <>
      <Head>
        <title>NFT Music Player</title>
        <meta name="description" content="NFT Music Player" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <h1>NFT music player</h1>
          <span style={
            {
              color: 'gray',
              fontSize: '14px'
            }
          }>
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
            <input defaultValue={collectionAddress} className={styles.search} placeholder="Collection Address"
              onChange={(e) => {
                setCollectionAddress(e.target.value)
              }}
            ></input>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', }}>
          {/* display the two nfts side by side */}
          <div className={styles.searchContainer}>
            <input defaultValue={token1} className={styles.search} style={{ width: '100%', maxWidth: 'initial' }} placeholder="Token ID"
              onChange={(e) => {
                setToken1(e.target.value)
              }}
            ></input>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', border: '1px solid #333', borderRadius: '10px' }}>
            {/* {JSON.stringify(token1Data)} */}
            {Object.keys(token1Data).length ?
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', padding: '20px' }}>
                <img src={formatIPFSLink(token1Data.image)} style={{ width: '200px', height: '200px', margin: 'auto' }}></img>
                <b>{token1Data.name}</b>
                <div style={{
                  color: 'gray',
                  fontSize: '10px',
                  fontWeight: 'thin'
                }}>
                  {token1Data.attributes && token1Data.attributes.map((attr, index) => (
                    <div key={index}>{attr.trait_type}: {attr.value}</div>
                  ))}
                </div>
                <audio style={{
                  width: '100%',
                  margin: 'auto',
                  marginTop: '10px'
                }} controls src={formatIPFSLink(token1Data.animation_url)}

                  onEnded={() => {
                    setToken1(parseInt(token1) + 1)
                  }}
                  autoPlay
                ></audio>
              </div> : null}
          </div>
          {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '50%' }}>
          <div className={styles.searchContainer}>
            <input className={styles.search} placeholder="Token ID"
              onChange={(e) => {
                setToken2(e.target.value)
              }}
            ></input>
          </div>
        </div> */}

        </div>
      </main>
    </>
  )
}

export default NFTCompare;