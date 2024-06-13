// input an image and pixelate it
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Pixelate() {
  // input an image and pixelate it
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(10) // [1, 100

  // pixelate the image by 1/10

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
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            const color = ctx.getImageData(i * pixelSize, j * pixelSize, 1, 1).data
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
            ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize)
          }
        }
      }
    }
  }, [image, pixelSize])

  return (
    <>
      <Head>
        <title>Pixelate</title>
        <meta name="description" content="Pixelate an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: 1500,
      }}>

        <h1>Pixelate</h1>
        <h2 className={styles.description}>Pixelate an image</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label>Pixel Size: {pixelSize}</label>
        <input type="range" min={2} max={100} defaultValue={pixelSize} onChange={(e) => setPixelSize(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, margin: 'auto' }}>
        <img src={image ? URL.createObjectURL(image) : ''} alt="" width={500} style={{ objectFit: 'cover', height: 'auto' }} />
        <canvas id="canvas" style={{ width: '100%', height: 'auto', width: 500 }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        {/* download  */}
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'pixelated.png'
          a.click()
        }}>Download
        </button>
      </main>

    </>
  )
}
