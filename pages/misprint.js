import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Misprint() {
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(4) // Larger pixel size for more visible effect
  const [offset, setOffset] = useState(2) // Offset for misprint effect
  const [colors] = useState(['#ff0099', '#00ccff']) // Pink and blue colors from reference
  const [threshold, setThreshold] = useState(128) // Threshold for grayscale conversion

  useEffect(() => {
    if (image) {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const w = Math.floor(img.width / pixelSize)
        const h = Math.floor(img.height / pixelSize)

        // Create misprint effect
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            const x = i * pixelSize
            const y = j * pixelSize
            const color = ctx.getImageData(x, y, 1, 1).data
            
            // Convert to grayscale
            const gray = (color[0] + color[1] + color[2]) / 3

            if (gray < threshold) {
              // Draw offset pixels in different colors
              ctx.fillStyle = colors[0]
              ctx.fillRect(x - offset, y - offset, pixelSize, pixelSize)
              
              ctx.fillStyle = colors[1]
              ctx.fillRect(x + offset, y + offset, pixelSize, pixelSize)
            }
          }
        }
      }
    }
  }, [image, pixelSize, offset, colors, threshold])

  const downloadSideBySide = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const originalCanvas = document.getElementById('canvas')
    const img = new Image()
    img.src = URL.createObjectURL(image)
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      ctx.drawImage(originalCanvas, img.width, 0)
      const a = document.createElement('a')
      a.href = canvas.toDataURL()
      a.download = 'side_by_side_misprint.png'
      a.click()
    }
  }

  return (
    <>
      <Head>
        <title>Misprint Effect</title>
        <meta name="description" content="Create misprint effect on your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '100%',
        padding: '0 20px',
      }}>
        <h1>Misprint Effect</h1>
        <h2 className={styles.description}>Create a misprint effect on your image</h2>
        <div>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <div>
            <label>Pixel Size: </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={pixelSize} 
              onChange={(e) => setPixelSize(parseInt(e.target.value))} 
            />
            <span>{pixelSize}px</span>
          </div>
          <div>
            <label>Offset: </label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={offset} 
              onChange={(e) => setOffset(parseInt(e.target.value))} 
            />
            <span>{offset}px</span>
          </div>
          <div>
            <label>Threshold: </label>
            <input 
              type="range" 
              min="0" 
              max="255" 
              value={threshold} 
              onChange={(e) => setThreshold(parseInt(e.target.value))} 
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <img src={image ? URL.createObjectURL(image) : ''} alt="" style={{ objectFit: 'cover', width: '100%', maxWidth: 500, height: 'auto' }} />
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'misprint.png'
          a.click()
        }}>Download Misprint
        </button>
        <button onClick={downloadSideBySide}>Download Side by Side</button>
      </main>
    </>
  )
}
