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
    },
    'BASE': {
      'rpc': 'https://base.llamarpc.com',
      'chainId': 8453,
      'network': 'mainnet',
    }
  }


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
      return '';
    }
  }

  const basedCap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <ellipse id="dark" transform="rotate(-87.495 21.25 5.018)" fill="#2B7BB9" cx="21.249" cy="5.018" rx=".944" ry="1.565"/>
  <path id="darker" fill="#2B7BB9" opacity="0.2" d="M5.185.088c.125-1.17-3.311-2.035-3.311-2.035l-1.874 1.947zM7.527 25.549S2.271 33.375.77 32.031c0 0-.425-1.397 1.23-4.218 1.656-2.822 5.527-2.264 5.527-2.264z"/>
  <path id="dark" fill="#2B7BB9" d="M19.766 4.82s-8.537.43-13.735 16.348c7.494 0 16.785.555 16.785.555s7.799 3.982 8.889 4.469c1.089.487 3.311 1.637 3.311 1.637s1.089-5.531.305-9.69S30.79 4.997 19.766 4.82z"/>
  <path id="dark" fill="#1C6399" d="M3.354 25.167C1.521 28.209.138 30.988.77 32.031c0 0-.203-.761.775-1.633.892-.795 2.805-1.522 6.461-1.522 5.534 0 13.006 4.498 16.119 5.562 2.375.812 2.875.188 4.188-1.25 1.4-1.534 3.716-6.904 3.716-6.904s-7.47-4.107-11.871-5.726-5.358-1.427-6.752-1.401c-3.056.057-5.314.671-7.375 2.011 0 0-1.494 2.036-2.677 3.999z"/>
  <path id="light" fill="#50A5E6" d="M30.588 11.339c-.61-3.443-4.011-5.076-4.011-5.076-1.895-.883-4.158-1.448-6.864-1.491 0 0-12.192-.105-13.681 16.395 0 0 2.541-1.115 7.92-.793 7.299.438 14.414 4.117 15.986 4.812.83-2.779 1.367-9.798.65-13.847z"/>
  <ellipse r="3" cx="15" cy="14" fill="#fff" rx="2.044" ry="1.965" transform="rotate(4)" />
    <ellipse id="light" r="1" cx="14" cy="14" fill="#2B7BB9" rx="1.044" ry="0.018" transform="rotate(4)" />
</svg>`



  const [collectionAddress, setCollectionAddress] = useState('0x7bc1c072742d8391817eb4eb2317f98dc72c61db')
  const [chain, setChain] = useState('BASE')
  const [token1, setToken1] = useState('0')


  const parseSvg = (svg) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svg, 'image/svg+xml')
    // get all light, dark and darker elements and change color to currenthex
    doc.querySelectorAll('#light').forEach((el) => {
      el.setAttribute('fill', darker(currentHex, -5))
    })
    doc.querySelectorAll('#dark').forEach((el) => {
      el.setAttribute('fill', darker(currentHex, -20))
    })
    doc.querySelectorAll('#darker').forEach((el) => {
      el.setAttribute('fill', darker(currentHex, -40))
    })
    
    console.log(doc)
    return doc.documentElement
  }

  const svgDataUri = (svg) => {
    return 'data:image/svg+xml,' + encodeURIComponent(svg)
  }

  const darker = (hex, percent) => {
    const num = parseInt(hex.slice(1), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.8)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)
  const [currentHex, setCurrentHex] = useState('#000000')



  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const hat = new Image()
      hat.src = svgDataUri(`${parseSvg(basedCap).outerHTML}`)
      hat.onload = () => {
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
        context.closePath()
      }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType, currentHex])


  useEffect(() => {
    if (!collectionAddress || !token1) return
    getNFTData(collectionAddress, token1).then((data) => {
      if (!data) return
      setCurrentHex(data.name)
    })
  }, [token1, collectionAddress])

  return (
    <>
      <Head>
        <title>Based Hat</title>
        <meta name="description" content="Based Hat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Based Hat
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add based hat on any image
        </span>

        {/* upload photo */}
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(38)
              setOffsetY(60)
              setScale(0.8)
              setOffsetTheta(0)
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" width="800" height="800" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <span style={{
            backgroundColor: currentHex,
            padding: 10,
            borderRadius: 5,
            border: '1px solid #333',
            width: '20',
            height: '20',
          }}/>
          <input type="text" value={token1} onChange={(e) => setToken1(e.target.value)} placeholder="Token ID" style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: '1px solid #333',
            color: '#fff',
            backgroundColor: '#000'
          }} />
          <label>
            Offset X
          </label>
          <input type="range" min={-(imgWidth * 1.5)} max={(imgWidth * 1.5)} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-(imgHeight * 1.5)} max={(imgHeight * 1.5)} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.01} value={scale} onChange={(e) => setScale(e.target.value)} />
          <label>
            Rotate
          </label>
          <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `based-hat-${Date.now()}.png`
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