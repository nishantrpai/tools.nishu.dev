// take an image and draw it on a canvas but we'll reduce the pixels to green shades that way it has structure of the image but it's compressed use @pixelate.js for reference, but the goal is to compress with green shade

import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Compressionist() {
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(10)
  const [shadeColor, setShadeColor] = useState('#00FF00') // default green shade
  const [compressedData, setCompressedData] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

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
        const w = img.width / pixelSize
        const h = img.height / pixelSize
        let compressed = ''
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            const color = ctx.getImageData(i * pixelSize, j * pixelSize, 1, 1).data
            const avg = (color[0] + color[1] + color[2]) / 3
            const greenValue = avg > 128 ? 255 : 0
            ctx.fillStyle = `rgba(0, ${greenValue}, 0, 1)`
            ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize)
            compressed += `${greenValue},`
          }
        }
        setCompressedData(compressed)
        setOriginalSize(image.size / 1024) // size in KB
        setCompressedSize(new Blob([compressed]).size / 1024) // size in KB
      }
    }
  }, [image, pixelSize])

  const downloadSideBySide = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const originalCanvas = document.getElementById('canvas')
    const originalCtx = originalCanvas.getContext('2d')
    const img = new Image()
    img.src = URL.createObjectURL(image)
    img.onload = () => {
      canvas.width = img.width * 2
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      ctx.drawImage(originalCanvas, img.width, 0)
      const a = document.createElement('a')
      a.href = canvas.toDataURL()
      a.download = 'side_by_side.png'
      a.click()
    }
  }

  return (
    <>
      <Head>
        <title>Compressionist</title>
        <meta name="description" content="Compress your image with green shades" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '100%',
        padding: '0 20px',
      }}>

        <h1>Compressionist</h1>
        <h2 className={styles.description}>Compress your image with green shades</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label>Pixel Size: {pixelSize}</label>
        <input type="range" min={2} max={100} defaultValue={pixelSize} onChange={(e) => setPixelSize(e.target.value)} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <img src={image ? URL.createObjectURL(image) : ''} alt="" style={{ objectFit: 'cover', width: '100%', maxWidth: 500, height: 'auto' }} />
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'compressed.png'
          a.click()
        }}>Download Compressed
        </button>
        <button onClick={downloadSideBySide}>Download Side by Side</button>
      </main>

    </>
  )
}