import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function InvertColors() {
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(1)
  const [invertedData, setInvertedData] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [invertedSize, setInvertedSize] = useState(0)

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
        let inverted = ''
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            const color = ctx.getImageData(i * pixelSize, j * pixelSize, 1, 1).data
            const invertedColor = color.slice(0, 3).map(c => 255 - c)
            ctx.fillStyle = `rgba(${invertedColor.join(',')}, 1)`
            ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize)
            inverted += `${invertedColor.join(',')},`
          }
        }
        setInvertedData(inverted)
        setOriginalSize(image.size / 1024) // size in KB
        setInvertedSize(new Blob([inverted]).size / 1024) // size in KB
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
      a.download = 'side_by_side_inverted.png'
      a.click()
    }
  }

  return (
    <>
      <Head>
        <title>Invert Colors</title>
        <meta name="description" content="Invert colors of your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '100%',
        padding: '0 20px',
      }}>
        <h1>Invert Colors</h1>
        <h2 className={styles.description}>Invert colors of your image</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <img src={image ? URL.createObjectURL(image) : ''} alt="" style={{ objectFit: 'cover', width: '100%', maxWidth: 500, height: 'auto' }} />
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'inverted.png'
          a.click()
        }}>Download Inverted
        </button>
        <button onClick={downloadSideBySide}>Download Side by Side</button>
      </main>
    </>
  )
}
