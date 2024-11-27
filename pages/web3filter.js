import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Web3Filter() {
  const [image, setImage] = useState(null)
  const [startPinkIntensity, setStartPinkIntensity] = useState(255)
  const [endBlueIntensity, setEndBlueIntensity] = useState(255)
  const [filterThreshold, setFilterThreshold] = useState(50)
  const [gradientDirection, setGradientDirection] = useState('horizontal')

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, startPinkIntensity, endBlueIntensity, filterThreshold, gradientDirection])

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

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4

        let gradientFactor
        switch (gradientDirection) {
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
          // Light pink to light blue gradient
          data[i] = Math.round(255 - (255 - startPinkIntensity) * gradientFactor) // Red channel
          data[i + 1] = Math.round(182 + (225 - 182) * gradientFactor) // Green channel
          data[i + 2] = Math.round(193 + (endBlueIntensity - 193) * gradientFactor) // Blue channel
          data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
        }
      }
    }
    context.putImageData(imageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Web3 Filter</title>
        <meta name="description" content="Transform your images with a cyberpunk web3 aesthetic" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Web3 Filter</h1>
        <h2 className={styles.description}>Transform your images with a cyberpunk web3 aesthetic</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            id="canvas"
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
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
            <label htmlFor="startPinkIntensity">Start Pink Intensity: </label>
            <input
              type="range"
              id="startPinkIntensity"
              min="0"
              max="255"
              value={startPinkIntensity}
              onChange={(e) => setStartPinkIntensity(Number(e.target.value))}
            />
            <span>{startPinkIntensity}</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="endBlueIntensity">End Blue Intensity: </label>
            <input
              type="range"
              id="endBlueIntensity"
              min="0"
              max="255"
              value={endBlueIntensity}
              onChange={(e) => setEndBlueIntensity(Number(e.target.value))}
            />
            <span>{endBlueIntensity}</span>
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

            // Draw the original canvas on top
            tempContext.drawImage(canvas, 0, 0)

            const a = document.createElement('a')
            a.href = tempCanvas.toDataURL('image/png')
            a.download = 'web3_filter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
