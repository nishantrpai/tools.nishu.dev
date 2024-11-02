import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '@/styles/Home.module.css'
import { ethers } from 'ethers'

export default function GradientPunks() {
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

  const [punkID, setPunkId] = useState(1)
  const [gradientColors, setGradientColors] = useState(['#000000', '#000000', '#000000'])
  const [punkImg, setPunkImg] = useState('')
  const [loading, setLoading] = useState(false)
  const [chain, setChain] = useState('ETHEREUM')
  const [status, setStatus] = useState('')
  const [gradientOffsetX, setGradientOffsetX] = useState(0)
  const [gradientOffsetY, setGradientOffsetY] = useState(0)
  const [gradientScale, setGradientScale] = useState(1)
  const punkContract = '0x5537d90a4a2dc9d9b37bab49b490cf67d4c54e91'

  const getNFTData = async (collection_address, id) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_CHAINS[chain].rpc)
      const contract = new ethers.Contract(collection_address, ['function tokenURI(uint256) view returns (string)'], provider)
      const tokenURI = await contract.tokenURI(id)
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
      console.log(e)
    }
  }

  const generateGradient = async () => {
    setLoading(true)
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Given the punk ID: "${punkID}", suggest 3 colors that would make a beautiful gradient. The colors should flow well together and match the punk's theme. Provide exactly 3 colors in hex format (e.g., #RRGGBB). Response should be in format: {"colors": ["#123456", "#789ABC", "#DEF012"]}`
      })
    })
    const data = await res.json()
    const colorData = JSON.parse(data.response)
    setGradientColors(colorData.colors)
    setLoading(false)
  }

  const blendUpdateCanvas = (punkImage, gradientColors) => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    if (!punkImage || gradientColors.length === 0) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradientColors.forEach((color, index) => {
        gradient.addColorStop(index / (gradientColors.length - 1), color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw punk
      ctx.globalCompositeOperation = 'multiply'
      ctx.drawImage(img, gradientOffsetX, gradientOffsetY, img.width * gradientScale, img.height * gradientScale)
      ctx.globalCompositeOperation = 'source-over'

      setStatus('')
    }
    img.src = punkImage
  }

  useEffect(() => {
    if (!punkID) return

    setStatus('fetching punk...')
    getNFTData(punkContract, punkID).then(punk => {
      if (punk.image)
        setPunkImg(punk.image)
    });
  }, [punkID])

  useEffect(() => {
    if (!punkImg || gradientColors.length === 0) return

    setStatus('blending...')
    blendUpdateCanvas(punkImg, gradientColors)
  }, [punkImg, gradientColors, gradientOffsetX, gradientOffsetY, gradientScale])

  return (
    <>
      <Head>
        <title>Gradient Punks</title>
        <meta name="description" content="Generate beautiful gradient wallpapers based on punk themes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>Gradient Punks</h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Generate beautiful gradient wallpapers based on punk themes
        </span>

        <canvas id="canvas" width="500" height="500"
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20,
            width: '100%'
          }}
        ></canvas>

        <div style={{ margin: 0, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
          <input
            type="text"
            value={punkID}
            onChange={(e) => setPunkId(e.target.value)}
            placeholder='Enter Punk ID'
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #333',
              borderRadius: '5px',
              background: 'none',
              color: '#fff',
              outline: 'none'
            }}
          />
          <button
            onClick={generateGradient}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#333',
              border: 'none',
              borderRadius: '5px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate Gradient'}
          </button>

          <div style={{ display: 'flex', gap: 20, flexDirection: 'column' }}>
            {gradientColors.map((color, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label>Color {index + 1}</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...gradientColors]
                    newColors[index] = e.target.value
                    setGradientColors(newColors)
                  }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...gradientColors]
                    newColors[index] = e.target.value
                    setGradientColors(newColors)
                  }}
                  style={{
                    width: '100px',
                    padding: '5px',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    background: 'none',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>
            ))}
            
            <label>Gradient Offset X</label>
            <input type="range" min="-500" max="500" value={gradientOffsetX} onChange={(e) => setGradientOffsetX(Number(e.target.value))} />
            
            <label>Gradient Offset Y</label>
            <input type="range" min="-500" max="500" value={gradientOffsetY} onChange={(e) => setGradientOffsetY(Number(e.target.value))} />
            
            <label>Gradient Scale</label>
            <input type="range" min="0.1" max="2" step="0.1" value={gradientScale} onChange={(e) => setGradientScale(Number(e.target.value))} />
          </div>

          <span style={{ height: 10, fontFamily: 'monospace', color: '#eee' }}>{status}</span>
        </div>

        <button
          onClick={() => {
            const canvas = document.getElementById('canvas')
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'gradient-punk.png'
            a.click()
          }}
          style={{
            padding: '10px 20px',
            background: '#333',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Download Image
        </button>
      </main>
    </>
  )
}
