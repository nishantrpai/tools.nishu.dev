// compare two nfts side by side
import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const NFTCompare = () => {
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
  const router = useRouter()
  const { collection, token, type } = router.query
  const [collectionAddress, setCollectionAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('1')
  const [sequence, setSequence] = useState('')
  const [sequenceTimer, setSequenceTimer] = useState(null)
  const [token2, setToken2] = useState('')
  const [token1Data, setToken1Data] = useState({})
  const [token2Data, setToken2Data] = useState({})

  const getNFTData = async (collection_address, id) => {
    // get metadata of nft and ipfs hash
    try {
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
    } catch (e) {
      console.log(e)
    }

  }

  useEffect(() => {
    try {
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
    } catch (e) {
      console.log(e)
    }
  }, [token1])

  const playSequence = () => {
    if (!sequence || type == 'embed') return
    if (sequenceTimer) return
    // play the sequence
    // split sequence into array for e.g.,  1 9 13 14 21 22 will be [1, 9, 13, 14, 21, 22]
    // each sequence will be token1 after 1 second, no token2

    const sequenceArray = sequence.split(' ')
    let i = 0
    const interval = setInterval(() => {
      if (i < sequenceArray.length) {
        setToken1(sequenceArray[i])
        i++
      } else {
        clearInterval(sequenceTimer)
        setSequenceTimer(null)
      }
    }, 500)
    setSequenceTimer(interval)
  }

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

  const renderToken = (token1Data) => {
    if (!token1Data) return null
    return (
      <div className={styles.nftcard}>
        {Object.keys(token1Data).length ?
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}
            onMouseEnter={() => {
              if (type !== 'embed')
                playSequence()
            }}
          >
            {/* add a layer on top */}
            <div style={{
              flexBasis: '70%',
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

  const Embed = () => {
    // get contract address and token id from the url
    useEffect(() => {
      getNFTData(collection, token).then(data => {
        setToken1Data(data)
      })
    })

    if (!type || type !== 'embed') return null
    return (
      <>
        <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
        {renderToken(token1Data)}
      </>
    )
  }

  const Flex = () => {
    return (
      <main className={styles.main}>
        <a href='/' className={styles.home}>🏠</a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <h1>Flex My NFT</h1>
          <span style={
            {
              color: 'gray',
              fontSize: '14px'
            }
          }>Flex your NFT, hover over the card and move out to play the animation. Enter the sequence of tokens and record away.
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
          <div className={styles.searchContainer} style={{ margin: 0 }}>
            <input className={styles.search} placeholder="Collection Address"
              onChange={(e) => {
                setCollectionAddress(e.target.value)
              }}
              value={collectionAddress}
            ></input>
          </div>
          <div className={styles.searchContainer} style={{ marginTop: 10 }}>
            <input className={styles.search} placeholder="Token ID"
              onChange={(e) => {
                setToken1(e.target.value)
              }}
              value={token1}
            ></input>
          </div>
          <div className={styles.searchContainer} style={{ marginTop: 10 }}>
            <input className={styles.search} placeholder="Enter sequence for e.g., 1 9 13 14 21 22"
              onChange={(e) => {
                setSequence(e.target.value)
              }}
              onMouseLeave={() => {
                document.body.style.cursor = 'none'
              }}
              value={sequence}
            ></input>
          </div>

        </div>
        <div style={{ display: 'flex', width: '500px', gap: '10px', alignContent: 'center', justifyContent: 'center', marginTop: 100, height: 800, width: '100%', cursor: 'none !important' }}>
          {/* display the two nfts side by side */}
          {renderToken(token1Data)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', marginTop: 20 }}>
          <button onClick={() => {
            // tools.nishu.dev/flexnft?collection=0x036721e5a769cc48b3189efbb9cce4471e8a48b1&token=1&type=embed
            const url = `${window.location.origin}/flexnft?collection=${collectionAddress}&token=${token1}&type=embed`
            navigator.clipboard.writeText(url)
            window.alert('Embed URL copied to clipboard')
          }}>
            Copy Embed
          </button>
        </div>

      </main>
    )
  }

  const isEmbed = type === 'embed' && collection && token
  return (
    // one input for collection address and two inputs for token ids
    <>
      <Head>
        <title>Flex My NFT</title>
        <meta name="description" content="Flex your NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isEmbed ? <Embed /> : <Flex />}
    </>
  )
}


export default NFTCompare;