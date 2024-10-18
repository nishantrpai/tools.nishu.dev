import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherFilter() {
  const [image, setImage] = useState(null)
  const [greenIntensity, setGreenIntensity] = useState(139)
  const [filterThreshold, setFilterThreshold] = useState(50)
  
  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, greenIntensity, filterThreshold])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    // Draw a black rectangle as background
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (avg > filterThreshold) {  // Use the dynamic filterThreshold
        data[i] = 84 // Red channel
        data[i + 1] = greenIntensity // Green channel
        data[i + 2] = 86 // Blue channel
        data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
      }
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>

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
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="filterThreshold">Filter Threshold: </label>
          <input
            type="range"
            id="filterThreshold"
            min="0"
            max="255"
            value={filterThreshold}
            onChange={(e) => setFilterThreshold(Number(e.target.value))}
          />
          <span>{filterThreshold}</span>
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const tempCanvas = document.createElement('canvas')
          const tempContext = tempCanvas.getContext('2d')
          tempCanvas.width = canvas.width
          tempCanvas.height = canvas.height
          
          // Draw black background
          tempContext.fillStyle = 'black'
          tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
          
          // Draw the filtered image on top
          tempContext.drawImage(canvas, 0, 0)
          
          const a = document.createElement('a')
          a.href = tempCanvas.toDataURL('image/png')
          a.download = 'higher_filter.png'
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}
