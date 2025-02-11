import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function XCopyFilter() {
  const [image, setImage] = useState(null)
  const [ditherThreshold, setDitherThreshold] = useState(128)
  const [disintegrationAmount, setDisintegrationAmount] = useState(20)
  const [pixelSize, setPixelSize] = useState(10)
  const [direction, setDirection] = useState('right') // options: left, right, random

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, ditherThreshold, disintegrationAmount, pixelSize, direction])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height

    // Draw the original image so we can sample pixel data
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Clear canvas (no background fill so original colors appear)
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Process the image in blocks of pixelSize
    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        let totalBrightness = 0
        let totalR = 0, totalG = 0, totalB = 0, count = 0

        // Loop over pixels inside the block
        for (let dy = 0; dy < pixelSize; dy++) {
          for (let dx = 0; dx < pixelSize; dx++) {
            const posX = x + dx
            const posY = y + dy
            if (posX < canvas.width && posY < canvas.height) {
              const i = (posY * canvas.width + posX) * 4
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              totalR += r
              totalG += g
              totalB += b
              const brightness = r * 0.299 + g * 0.587 + b * 0.114
              totalBrightness += brightness
              count++
            }
          }
        }
        const avgBrightness = totalBrightness / count

        // Only process blocks above threshold
        if (avgBrightness >= ditherThreshold) {
          let dxOffset = 0, dyOffset = 0
          // Apply displacement based on disintegrationAmount and direction
          if (direction === 'left') {
            dxOffset = -Math.random() * disintegrationAmount
          } else if (direction === 'right') {
            dxOffset = Math.random() * disintegrationAmount
          } else { // 'random'
            dxOffset = (Math.random() - 0.5) * 2 * disintegrationAmount
          }
          dyOffset = (Math.random() - 0.5) * 2 * disintegrationAmount

          const avgR = Math.round(totalR / count)
          const avgG = Math.round(totalG / count)
          const avgB = Math.round(totalB / count)
          context.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`
          context.fillRect(x + dxOffset, y + dyOffset, pixelSize, pixelSize)
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Dithering Disintegration Filter</title>
        <meta name="description" content="Apply a dithering disintegration effect to your images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Dithering Disintegration Filter</h1>
        <h2 className={styles.description}>
          Transform your images with a pixelated dithering disintegration effect.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            id="canvas"
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
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
            }}
          />

          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="ditherThreshold">Dither Threshold: </label>
            <input
              type="range"
              id="ditherThreshold"
              min="0"
              max="255"
              value={ditherThreshold}
              onChange={(e) => setDitherThreshold(Number(e.target.value))}
            />
            <input 
              type="number" 
              value={ditherThreshold} 
              style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} 
              onChange={(e) => setDitherThreshold(Number(e.target.value))} 
            />
          </div>
          
          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="disintegrationAmount">Disintegration Amount: </label>
            <input
              type="range"
              id="disintegrationAmount"
              min="0"
              max="50"
              value={disintegrationAmount}
              onChange={(e) => setDisintegrationAmount(Number(e.target.value))}
            />
            <input 
              type="number" 
              value={disintegrationAmount} 
              style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} 
              onChange={(e) => setDisintegrationAmount(Number(e.target.value))} 
            />
          </div>
          
          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="pixelSize">Pixel Size: </label>
            <input
              type="range"
              id="pixelSize"
              min="5"
              max="50"
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
            />
            <input 
              type="number" 
              value={pixelSize} 
              style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} 
              onChange={(e) => setPixelSize(Number(e.target.value))} 
            />
          </div>
          
          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="direction">Disintegration Direction: </label>
            <select 
              id="direction" 
              value={direction} 
              onChange={(e) => setDirection(e.target.value)}
              style={{ background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="random">Random</option>
            </select>
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'ditherdisintegration.png'
            a.click()
          }}>
            Download
          </button>
        </div>
      </main>
    </>
  )
}
