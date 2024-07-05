// there'll be a canvas with an image drawn on it right side
//  image will be taken from contract
// will have a little fade on the image at the bottom
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import html2canvas from 'html2canvas'

export default function OpepenChat() {
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
  const [collectionAddress, setCollectionAddress] = useState('0x6339e5e072086621540d0362c4e3cea0d643e114')
  const [chain, setChain] = useState('ETHEREUM')
  const [token1, setToken1] = useState('1')
  const [opepen, setOpepen] = useState('')
  const [title, setTitle] = useState('')

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
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`
        }
        return metadata
      }
      else if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI)
        const metadata = await response.json()
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`
        }

        return metadata
      } else {
        const ipfsHash = tokenURI.split('ipfs://')[1]
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
        const response = await fetch(ipfsUrl)
        const metadata = await response.json()
        if (metadata.image.startsWith('ipfs://')) {
          metadata.image = `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`
        }

        return metadata
      }
    } catch (e) {
      return '';
    }
  }

  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (opepen) {
      const image = new Image()
      image.src = opepen
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        // resize image to fit canvas and draw 20px away from right
        const scaleX = canvas.width / image.width
        const scaleY = canvas.height / image.height
        const scale = Math.max(scaleX, scaleY)
        const x = (canvas.width / 2) - (image.width / 2) * scale
        const y = 0
        context.drawImage(image, x, y, image.width * scale, image.height * scale)
        context.fillStyle = 'rgba(0, 0, 0, 0.5)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.closePath()
      }
    }
  }, [opepen])


  return (
    <>
      <Head>
        <title>Opepen Chat</title>
        <meta name="description" content="Opepen Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Opepen Chat
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Create cover for twitter spaces
        </span>

        <div style={{
          width: 'max-content',
          position: 'relative',
        }} id="opepen-cover">
          {/* title on top of canvas on top left */}

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            color: '#aaa',
            padding: '10px',
            fontFamily: 'opepen',
            fontSize: '2em',
            whiteSpace: 'pre',
          }}>
            Opepen Chat
          </div>

          <div style={{
            position: 'absolute',
            top: 40,
            left: 0,
            color: '#fff',
            padding: '10px',
            fontFamily: 'opepen',
            fontSize: '8em',
            whiteSpace: 'pre',
          }}>
            {title}
          </div>
          <canvas id="canvas" width={1024} height={700} style={{ border: '1px solid #333' }}>

          </canvas>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', marginTop: '20px' }}>
          {/* <input type="text" placeholder="Collection Address" value={collectionAddress} onChange={(e) => setCollectionAddress(e.target.value)} /> */}
          <textarea placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Token ID" value={token1} onChange={(e) => setToken1(e.target.value)} />
          <button onClick={() => {
            getNFTData(collectionAddress, token1).then((data) => {
              if (!data) return
              setOpepen(data.image)
            })
          }}>Get Opepen</button>
          <button onClick={() => {
            // copy tier-list to clipboard as image
            const opepenCover = document.getElementById('opepen-cover')
            html2canvas(opepenCover, {
              allowTaint: true,
              backgroundColor: 'transparent',
              useCORS: true,
            }).then(canvas => {
              let img = canvas.toDataURL('image/png')
              let a = document.createElement('a')
              a.href = img
              a.download = 'profile.png'
              a.click()
            });
          }}>
            Download
          </button>
        </div>

      </main>
    </>
  )
}
