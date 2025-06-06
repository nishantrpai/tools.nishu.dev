import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function CamcorderFilter() {
  const [image, setImage] = useState(null)
  const [saturation, setSaturation] = useState(80)
  const [contrast, setContrast] = useState(120)
  const [brightness, setBrightness] = useState(110)
  const [noise, setNoise] = useState(20)
  const [scanlines, setScanlines] = useState(30)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, saturation, contrast, brightness, noise, scanlines])

  const applyFilter = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4

        // Apply saturation, contrast, and brightness
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // Saturation
        const avg = (r + g + b) / 3
        r = r + (r - avg) * (saturation / 100 - 1)
        g = g + (g - avg) * (saturation / 100 - 1)
        b = b + (b - avg) * (saturation / 100 - 1)

        // Contrast
        r = ((r / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        g = ((g / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        b = ((b / 255 - 0.5) * (contrast / 100) + 0.5) * 255

        // Brightness
        r *= brightness / 100
        g *= brightness / 100
        b *= brightness / 100

        // Add noise
        const noiseValue = (Math.random() - 0.5) * noise
        r += noiseValue
        g += noiseValue
        b += noiseValue

        // Apply scanlines
        if (y % 2 === 0) {
          r *= (100 - scanlines) / 100
          g *= (100 - scanlines) / 100
          b *= (100 - scanlines) / 100
        }

        // Clamp values
        data[i] = Math.max(0, Math.min(255, r))
        data[i + 1] = Math.max(0, Math.min(255, g))
        data[i + 2] = Math.max(0, Math.min(255, b))
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  const handleCanvasClick = () => {
    // This function is left empty as we don't need click functionality for this filter
  }

  return (
    <>
      <Head>
        <title>2000s Camcorder Filter</title>
        <meta name="description" content="2000s Camcorder Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>2000s Camcorder Filter</h1>
        <h2 className={styles.description}>Transform your images with a 2000s camcorder effect</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
            onClick={handleCanvasClick}
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
            <label htmlFor="saturation">Saturation: </label>
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
            <label htmlFor="brightness">Brightness: </label>
            <input
              type="range"
              id="brightness"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
            />
            <input type="number" value={brightness} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setBrightness(Number(e.target.value))} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="noise">Noise: </label>
            <input
              type="range"
              id="noise"
              min="0"
              max="500"
              value={noise}
              onChange={(e) => setNoise(Number(e.target.value))}
            />
            <input type="number" value={noise} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setNoise(Number(e.target.value))} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="scanlines">Scanlines: </label>
            <input
              type="range"
              id="scanlines"
              min="0"
              max="50"
              value={scanlines}
              onChange={(e) => setScanlines(Number(e.target.value))}
            />
            <input type="number" value={scanlines} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setScanlines(Number(e.target.value))} />
          </div>
          <button onClick={() => {
            if (canvasRef.current && image) {
              const canvas = canvasRef.current
              const context = canvas.getContext('2d')
              context.clearRect(0, 0, canvas.width, canvas.height)
              context.drawImage(image, 0, 0)
              applyFilter()
            }
          }}>Reset</button>
          <button onClick={() => {
            const canvas = canvasRef.current
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'camcorder_filter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
