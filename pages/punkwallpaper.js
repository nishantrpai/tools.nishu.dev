import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function PunkWallpaper() {
  const [punkId, setPunkId] = useState(1)
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#000000')

  useEffect(() => {
    if (!punkId) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = `https://api.codetabs.com/v1/proxy/?quest=https://cryptopunks.app/cryptopunks/cryptopunk${punkId}.png`
    img.onload = () => {
      setOffsetX(0)
      setOffsetY(0)
      setScale(1)
      setRotation(0)
      setImgWidth(img.width)
      setImgHeight(img.height)
      setImage(img)

      // Get color from pixel 0,0
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const pixelData = ctx.getImageData(0, 0, 1, 1).data
      const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`
      setBackgroundColor(color)
    }
  }, [punkId])

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    if (image) {
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      context.save()
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate(rotation * Math.PI / 180)
      context.translate(-canvas.width / 2, -canvas.height / 2)
      
      context.drawImage(
        image, 
        offsetX + (canvas.width - imgWidth * scale) / 2, 
        offsetY + (canvas.height - imgHeight * scale) / 2, 
        imgWidth * scale, 
        imgHeight * scale
      )
      
      context.restore()
    }
  }, [image, offsetX, offsetY, scale, rotation, imgWidth, imgHeight, backgroundColor])

  const downloadWallpaper = () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `punk-wallpaper-${punkId}.png`
    a.click()
  }

  return (
    <>
      <Head>
        <title>Punk Wallpaper</title>
        <meta name="description" content="Create mobile wallpaper from CryptoPunks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.title}>
          Punk Wallpaper
        </h1>
        <h2 className={styles.description}>
          Create mobile wallpaper from CryptoPunks
        </h2>
        <input
          type="number"
          value={punkId}
          onChange={(e) => setPunkId(e.target.value)}
          placeholder="Enter Punk ID"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            background: 'none',
            color: '#fff',
            outline: 'none',
            marginBottom: '20px'
          }}
        />
        <canvas id="canvas" width="1080" height="1920" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <label>Move X</label>
          <input type="range" min={-1500} max={1500} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
          <label>Move Y</label>
          <input type="range" min={-1500} max={1500} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
          <label>Scale</label>
          <input type="range" min={0.1} max={100} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          <label>Rotate</label>
          <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
        </div>
        <button onClick={downloadWallpaper} style={{ marginTop: 20 }}>
          Download Wallpaper
        </button>
      </main>
    </>
  )
}
