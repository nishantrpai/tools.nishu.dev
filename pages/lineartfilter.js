import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function AnimeFilter() {
  const [image, setImage] = useState(null)
  const [edgeThreshold, setEdgeThreshold] = useState(30)
  const [saturation, setSaturation] = useState(140)
  const [contrast, setContrast] = useState(120)
  const [colorSimplification, setColorSimplification] = useState(32)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, edgeThreshold, saturation, contrast, colorSimplification])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    context.drawImage(image, 0, 0, image.width, image.height)
    
    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Create a copy for edge detection
    const edgeData = new Uint8ClampedArray(data)

    // Apply edge detection
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = (y * canvas.width + x) * 4
        
        // Sobel operator for edge detection
        const gx = 
          -1 * data[idx - 4 - canvas.width * 4] +
          -2 * data[idx - 4] +
          -1 * data[idx - 4 + canvas.width * 4] +
          1 * data[idx + 4 - canvas.width * 4] +
          2 * data[idx + 4] +
          1 * data[idx + 4 + canvas.width * 4]

        const gy = 
          -1 * data[idx - canvas.width * 4 - 4] +
          -2 * data[idx - canvas.width * 4] +
          -1 * data[idx - canvas.width * 4 + 4] +
          1 * data[idx + canvas.width * 4 - 4] +
          2 * data[idx + canvas.width * 4] +
          1 * data[idx + canvas.width * 4 + 4]

        const magnitude = Math.sqrt(gx * gx + gy * gy)
        
        // Apply threshold
        edgeData[idx] = edgeData[idx + 1] = edgeData[idx + 2] = 
          magnitude > edgeThreshold ? 0 : 255
      }
    }

    // Process colors and apply anime style
    for (let i = 0; i < data.length; i += 4) {
      // Adjust saturation
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = data[i] + (data[i] - avg) * (saturation / 100)
      data[i + 1] = data[i + 1] + (data[i + 1] - avg) * (saturation / 100)
      data[i + 2] = data[i + 2] + (data[i + 2] - avg) * (saturation / 100)

      // Adjust contrast
      data[i] = ((data[i] / 255 - 0.5) * (contrast / 100) + 0.5) * 255
      data[i + 1] = ((data[i + 1] / 255 - 0.5) * (contrast / 100) + 0.5) * 255
      data[i + 2] = ((data[i + 2] / 255 - 0.5) * (contrast / 100) + 0.5) * 255

      // Color simplification
      data[i] = Math.round(data[i] / colorSimplification) * colorSimplification
      data[i + 1] = Math.round(data[i + 1] / colorSimplification) * colorSimplification
      data[i + 2] = Math.round(data[i + 2] / colorSimplification) * colorSimplification

      // Blend with edge detection
      if (edgeData[i] === 0) {
        data[i] = data[i + 1] = data[i + 2] = 255
      }

      // Ensure values are in valid range
      data[i] = Math.max(0, Math.min(255, data[i]))
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1]))
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2]))
    }

    context.putImageData(imageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Line Art</title>
        <meta name="description" content="Line Art Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Line Art</h1>
        <h2 className={styles.description}>Transform your images into line art</h2>
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
            <label htmlFor="edgeThreshold">Edge Detection: </label>
            <input
              type="range"
              id="edgeThreshold"
              min="0"
              max="100"
              value={edgeThreshold}
              onChange={(e) => setEdgeThreshold(Number(e.target.value))}
            />
            <input type="number" value={edgeThreshold} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setEdgeThreshold(Number(e.target.value))} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="saturation">Color Saturation: </label>
            <input
              type="range"
              id="saturation"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
            />
            <input type="number" value={saturation} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setSaturation(Number(e.target.value))} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="contrast">Contrast: </label>
            <input
              type="range"
              id="contrast"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
            />
            <input type="number" value={contrast} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setContrast(Number(e.target.value))} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label htmlFor="colorSimplification">Color Simplification: </label>
            <input
              type="range"
              id="colorSimplification"
              min="1"
              max="64"
              value={colorSimplification}
              onChange={(e) => setColorSimplification(Number(e.target.value))}
            />
            <input type="number" value={colorSimplification} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setColorSimplification(Number(e.target.value))} />
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'line_art.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
