import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function HigherGradient() {
  const [image, setImage] = useState(null)
  const [startGreenIntensity, setStartGreenIntensity] = useState(84)
  const [endGreenIntensity, setEndGreenIntensity] = useState(139)
  const [filterThreshold, setFilterThreshold] = useState(50)
  const [gradientDirection, setGradientDirection] = useState('horizontal') // horizontal, vertical, diagonal
  
  useEffect(() => {
    if (image) {
      applyGradient()
    }
  }, [image, startGreenIntensity, endGreenIntensity, filterThreshold, gradientDirection])

  const applyGradient = () => {
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

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4
        
        let gradientFactor
        switch(gradientDirection) {
          case 'horizontal':
            gradientFactor = x / canvas.width
            break
          case 'vertical':
            gradientFactor = y / canvas.height
            break
          case 'diagonal':
            gradientFactor = (x + y) / (canvas.width + canvas.height)
            break
          default:
            gradientFactor = 1
        }

        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        if (avg > filterThreshold) {
          data[i] = 84 // Red channel
          data[i + 1] = Math.round(startGreenIntensity + (endGreenIntensity - startGreenIntensity) * gradientFactor) // Green channel with gradient
          data[i + 2] = 86 // Blue channel
          data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
        }
      }
    }
    context.putImageData(imageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Higher Gradient</title>
        <meta name="description" content="Higher Gradient Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{
        maxWidth: '100%',
      }}>
        <h1>Higher Gradient</h1>
        <h2 className={styles.description}>Add higher gradient filter on any image</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas 
            id="canvas" 
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
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
          <label>Gradient Direction: </label>
          <select 
            value={gradientDirection}
            onChange={(e) => setGradientDirection(e.target.value)}
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="diagonal">Diagonal</option>
          </select>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label htmlFor="startGreenIntensity">Start Green Intensity: </label>
          <input
            type="range"
            id="startGreenIntensity"
            min="0"
            max="255"
            value={startGreenIntensity}
            onChange={(e) => setStartGreenIntensity(Number(e.target.value))}
          />
          <span>{startGreenIntensity}</span>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label htmlFor="endGreenIntensity">End Green Intensity: </label>
          <input
            type="range"
            id="endGreenIntensity"
            min="0"
            max="255"
            value={endGreenIntensity}
            onChange={(e) => setEndGreenIntensity(Number(e.target.value))}
          />
          <span>{endGreenIntensity}</span>
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
          const a = document.createElement('a')
          a.href = canvas.toDataURL('image/png')
          a.download = 'higher_gradient.png'
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}
