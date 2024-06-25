// add grainy effect to an image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Pixelate() {
  // input an image and pixelate it
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(10) // [1, 100


  // function for grainy effect 
  function applyGrainyEffect(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const grain = Math.random() * pixelSize
      data[i] += grain
      data[i + 1] += grain
      data[i + 2] += grain
    }
    ctx.putImageData(imageData, 0, 0)
  }

  useEffect(() => {
    // add grainy effect to an image
    if (image) {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        applyGrainyEffect(ctx, img.width, img.height)
      }   
    }
  }, [image, pixelSize])

  return (
    <>
      <Head>
        <title>Grainy</title>
        <meta name="description" content="Add grainy effect to an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: 1500,
      }}>

        <h1>Grainy</h1>
        <h2 className={styles.description}>
          Add grainy effect to an image
        </h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label>Noise: {pixelSize}</label>
        <input type="range" min={2} max={500} defaultValue={pixelSize} onChange={(e) => setPixelSize(e.target.value)} />
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
          a.download = `grainy-${new Date().getTime()}.png`
          a.click()
        }}>Download
        </button>
      </main>

    </>
  )
}
