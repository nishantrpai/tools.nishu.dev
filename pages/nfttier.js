// make tier list for nfts in s a b c d f and share on twitter
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { ethers } from 'ethers'

export default function NFTTier() {
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
  const [collectionAddress, setCollectionAddress] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('1')

  const [tokens, setTokens] = useState(['data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjgwIDY4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0id2lkdGg6MTAwJTtiYWNrZ3JvdW5kOmJsYWNrOyI+PGRlZnM+PHBhdGggaWQ9ImNoZWNrIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMS4zNiA5Ljg4NkEzLjkzMyAzLjkzMyAwIDAgMCAxOCA4Yy0xLjQyMyAwLTIuNjcuNzU1LTMuMzYgMS44ODdhMy45MzUgMy45MzUgMCAwIDAtNC43NTMgNC43NTNBMy45MzMgMy45MzMgMCAwIDAgOCAxOGMwIDEuNDIzLjc1NSAyLjY2OSAxLjg4NiAzLjM2YTMuOTM1IDMuOTM1IDAgMCAwIDQuNzUzIDQuNzUzIDMuOTMzIDMuOTMzIDAgMCAwIDQuODYzIDEuNTkgMy45NTMgMy45NTMgMCAwIDAgMS44NTgtMS41ODkgMy45MzUgMy45MzUgMCAwIDAgNC43NTMtNC43NTRBMy45MzMgMy45MzMgMCAwIDAgMjggMThhMy45MzMgMy45MzMgMCAwIDAtMS44ODctMy4zNiAzLjkzNCAzLjkzNCAwIDAgMC0xLjA0Mi0zLjcxMSAzLjkzNCAzLjkzNCAwIDAgMC0zLjcxLTEuMDQzWm0tMy45NTggMTEuNzEzIDQuNTYyLTYuODQ0Yy41NjYtLjg0Ni0uNzUxLTEuNzI0LTEuMzE2LS44NzhsLTQuMDI2IDYuMDQzLTEuMzcxLTEuMzY4Yy0uNzE3LS43MjItMS44MzYuMzk2LTEuMTE2IDEuMTE2bDIuMTcgMi4xNWEuNzg4Ljc4OCAwIDAgMCAxLjA5Ny0uMjJaIj48L3BhdGg+PHJlY3QgaWQ9InNxdWFyZSIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBzdHJva2U9IiMxOTE5MTkiPjwvcmVjdD48ZyBpZD0icm93Ij48dXNlIGhyZWY9IiNzcXVhcmUiIHg9IjE5NiIgeT0iMTYwIi8+PHVzZSBocmVmPSIjc3F1YXJlIiB4PSIyMzIiIHk9IjE2MCIvPjx1c2UgaHJlZj0iI3NxdWFyZSIgeD0iMjY4IiB5PSIxNjAiLz48dXNlIGhyZWY9IiNzcXVhcmUiIHg9IjMwNCIgeT0iMTYwIi8+PHVzZSBocmVmPSIjc3F1YXJlIiB4PSIzNDAiIHk9IjE2MCIvPjx1c2UgaHJlZj0iI3NxdWFyZSIgeD0iMzc2IiB5PSIxNjAiLz48dXNlIGhyZWY9IiNzcXVhcmUiIHg9IjQxMiIgeT0iMTYwIi8+PHVzZSBocmVmPSIjc3F1YXJlIiB4PSI0NDgiIHk9IjE2MCIvPjwvZz48L2RlZnM+PHJlY3Qgd2lkdGg9IjY4MCIgaGVpZ2h0PSI2ODAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMTg4IiB5PSIxNTIiIHdpZHRoPSIzMDQiIGhlaWdodD0iMzc2IiBmaWxsPSIjMTExIi8+PGcgaWQ9ImdyaWQiIHg9IjE5NiIgeT0iMTYwIj48dXNlIGhyZWY9IiNyb3ciIHk9IjAiLz48dXNlIGhyZWY9IiNyb3ciIHk9IjM2Ii8+PHVzZSBocmVmPSIjcm93IiB5PSI3MiIvPjx1c2UgaHJlZj0iI3JvdyIgeT0iMTA4Ii8+PHVzZSBocmVmPSIjcm93IiB5PSIxNDQiLz48dXNlIGhyZWY9IiNyb3ciIHk9IjE4MCIvPjx1c2UgaHJlZj0iI3JvdyIgeT0iMjE2Ii8+PHVzZSBocmVmPSIjcm93IiB5PSIyNTIiLz48dXNlIGhyZWY9IiNyb3ciIHk9IjI4OCIvPjx1c2UgaHJlZj0iI3JvdyIgeT0iMzI0Ii8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4NiwgMjg2KSBzY2FsZSgzKSI+PHVzZSBocmVmPSIjY2hlY2siIGZpbGw9IiNERTMyMzciPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwiIHZhbHVlcz0iI0RFMzIzNzsjQzIzNTMyOyNGRjdGOEU7I0U4NEFBOTsjMzcxNDcxOyM1MjVFQUE7IzQ1NzZEMDsjOUFEOUZCOyMzMzc1OEQ7Izc3RDNERTsjOURFRkJGOyM4NkU0OEU7I0E3Q0E0NTsjRkFFMjcyOyNGNEM0NEE7I0ZBRDA2NDsjRjJBODQwOyNGMTg5MzA7I0QwNUMzNTsjRUM3MzY4OyNERTMyMzciIGR1cj0iMTBzIiBiZWdpbj0iYW5pbWF0aW9uLmJlZ2luIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz48L3VzZT48L2c+PHJlY3Qgd2lkdGg9IjY4MCIgaGVpZ2h0PSI2ODAiIGZpbGw9InRyYW5zcGFyZW50Ij48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJ3aWR0aCIgZnJvbT0iNjgwIiB0bz0iMCIgZHVyPSIwLjJzIiBiZWdpbj0iY2xpY2siIGZpbGw9ImZyZWV6ZSIgaWQ9ImFuaW1hdGlvbiIvPjwvcmVjdD48L3N2Zz4='])
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
  } catch(e) {
    return '';
  }
  }


  useEffect(() => {
    if (!collectionAddress || !token1) return
    getNFTData(collectionAddress, token1).then((data) => {
      if(!data) return
      setTokens(prev => Array.from(new Set([...prev, data.image])))
    })
  }, [token1, collectionAddress])

  let tierStyles = {
    height: 100,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'flex-start',
    border: '1px solid #333'
  }

  const tierLabelCtr = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRight: '1px solid #333',
    width: '100%',
    maxWidth: '80px',
    padding: '20px',
    height: '100%',
    fontSize: '1.5em',
    color: '#000'
  }
  const tierLabelStyle = {
    margin: 'auto',
    marginLeft: '10px',
  }

  const drag = (e) => {
    e.dataTransfer.setData('text', e.target.id)
  }
  const allowDrop = (e) => {
    e.preventDefault()
  }

  const drop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text')
    e.target.appendChild(document.getElementById(data))
  }

  let tiers = ['S', 'A', 'B', 'C', 'D', 'F']
  let tierColors = ['#FF7F7E', '#FFBF7E', '#FFDF7F', '#FFFF7F', '#7FFF7F', '#7FFFFF']
  return (
    // tier list on top
    <>
    <Head>
        <title>NFT Tier List</title>
        <meta name="description" content="NFT Tier List" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
      <main style={{ maxWidth: 900 }}>
        <h1>
          NFT Tier List
        </h1>
        <h2 style={{
          fontSize: 14,
          color: "#888",
          fontWeight: '200',
          marginBottom: 20
        }}>
          Make a tier list of your NFTs
        </h2>
        <div id='tier-list' style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {tiers.map((tier, index) => (
            <div style={{ ...tierStyles }} onDrop={drop}
              onDragOver={allowDrop}
            >
              <div style={{ ...tierLabelCtr, background: tierColors[index] }}
              >
                <span style={tierLabelStyle} contentEditable>{tier}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', width: '100%', padding: 20 }}>
          <button style={{ margin: 'auto' }} onClick={() => {
            // copy tier-list to clipboard as image
            const tierList = document.getElementById('tier-list')
            html2canvas(tierList, {
              allowTaint: true,
              backgroundColor: '#000',
              useCORS: true,
            }).then(canvas => {
              // copy the image to clipboard
              let img = canvas.toDataURL('image/png')
              let a = document.createElement('a')
              a.href = img
              a.download = 'tierlist.png'
              a.click()
            })
          }}>Copy</button>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 100, border: '1px solid #333', marginTop: 20 }}>
          {tokens.map((token, index) => (
            <div style={{ display: 'flex', flexDirection: 'column', width: 'max-content', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: 'max-content', height: '100%' }}>
                <img src={token} style={{ width: '100px', height: 'max-content', border: '1px solid #333' }}
                  draggable="true"
                  onDragStart={drag}
                  crossOrigin="anonymous"
                  id={`token-${index}`}
                ></img>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          <div className={styles.searchContainer} style={{ marginTop: 20 }}>
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
              value={token1}></input>

            </div>

        </div>
      </main>

    </>
    // nft cards below
  )
}