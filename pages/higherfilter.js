import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherFilter() {
  const [image, setImage] = useState(null)
  const [greenIntensity, setGreenIntensity] = useState(139)
  
  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, greenIntensity])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = 3 // Red channel
      data[i + 1] = greenIntensity // Green channel
      data[i + 2] = 6 // Blue channel
      data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
    }
    context.putImageData(imageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Higher Filter</title>
        <meta name="description" content="Higher Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '100%',
        padding: '0 20px',
      }}>
        <h1>Higher Filter</h1>
        <h2 className={styles.description}>Add higher filter on any image</h2>
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="greenIntensity">Green Intensity: </label>
          <input
            type="range"
            id="greenIntensity"
            min="0"
            max="255"
            value={greenIntensity}
            onChange={(e) => setGreenIntensity(Number(e.target.value))}
          />
          <span>{greenIntensity}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const a = document.createElement('a')
          a.href = canvas.toDataURL('image/png')
          a.download = 'higher_filter.png'
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}
