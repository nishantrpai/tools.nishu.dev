// add higher hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export default function HigherHat() {
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
  const [collectionAddress,] = useState('0x036721e5a769cc48b3189efbb9cce4471e8a48b1')
  const [chain,] = useState('ETHEREUM')
  const [tokens, setTokens] = useState('1, 12')
  const [images, setImages] = useState([])

  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(-515)
  const [offsetY, setOffsetY] = useState(104)
  const [gap, setGap] = useState(40)
  const [scale, setScale] = useState(2.4)

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

  const higherHat = '/highertm.svg'
  
  useEffect(() => {
    // draw all the images on the canvas stacked like cards with shadow for each image
    // equally spaced, but slightly offset
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (images.length > 0) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#000'
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      images.forEach((image, index) => {
        const img = new Image()
        img.src = image
        img.onload = () => {
          const offset = index * 20 // adjust this value for more or less spacing

          let width = img.width * scale
          let height = img.height * scale
          context.drawImage(img, 500 + parseFloat(offsetX) + (index * ((img.width * scale) + parseInt(gap))), 50 + parseFloat(offsetY), img.width * scale, img.height * scale)

          // draw border to the image
          context.strokeStyle = 'rgba(255, 255, 255, 0.1)'
          context.lineWidth = 5
          context.strokeRect(500 + parseFloat(offsetX) + (index * ((img.width * scale) + parseInt(gap))), 50 + parseFloat(offsetY), img.width * scale, img.height * scale)

          context.shadowColor = 'rgba(255, 255, 255, 0.0125)'
          context.shadowBlur = 1
          context.shadowOffsetX = 1
          context.shadowOffsetY = 1
          context.closePath()
        }
      })
    }
  }, [images, offsetX, offsetY,  scale, gap])
  
  useEffect(( ) => {
    try {

    let tokensArray = tokens.split(',').map(token => token.trim())
    // rmeove undefined
    tokensArray = tokensArray.filter(token => token)
    let imagesArray = []
    tokensArray.forEach(token => {
      getNFTData(collectionAddress, token).then(data => {
        // in metadata image if there is ipfs replace with ipfs.io
        let image = data.image
        if (image.startsWith('ipfs')) {
          const ipfsHash = image.split('ipfs://')[1]
          image = `https://ipfs.io/ipfs/${ipfsHash}`
        }
        imagesArray.push(image)
        setImages(imagesArray)
      })
    })
  } catch(err){
    console.log(err)
  }

  }, [tokens])

  return (
    <>
      <Head>
        <title>Checks Banner</title>
        <meta name="description" content="Checks Banner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Checks Banner
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Make your own checks banner
        </span>

        {/* upload photo */}
        <canvas id="canvas" width="1500" height="500" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <input type="text" placeholder='Add token ids separated by comma' value={tokens} onChange={(e) => setTokens(e.target.value)}  style={{
            width: '100%',
            padding: 10,
            borderRadius: 5,
            border: '1px solid #333',
            fontSize: 16,
            backgroundColor: '#000'
          }}/>
          <label>
            Offset X
          </label>
          <input type="range" min={-1500} max={1500} step={0.01} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-500} max={500} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.01} value={scale} onChange={(e) => setScale(e.target.value)} />
          <lable>
            Gap
          </lable>
          <input type="range" min={-1000} max={1000} step={0.01} value={gap} onChange={(e) => setGap(e.target.value)} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `checksbanner-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
      </main>
    </>
  )
}