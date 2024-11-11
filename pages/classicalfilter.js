import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function ClassicalFilter() {
  const [image, setImage] = useState(null)
  const [saturation, setSaturation] = useState(120)
  const [contrast, setContrast] = useState(130)
  const [vignette, setVignette] = useState(50)
  const [radius, setRadius] = useState(4)
  const [intensity, setIntensity] = useState(55)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, saturation, contrast, vignette, radius, intensity])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw dark background
    context.fillStyle = '#2b1810'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    context.drawImage(image, 0, 0, image.width, image.height)
    
    // Apply oil paint effect
    oilPaintEffect(canvas, radius, intensity)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4

        // Calculate vignette effect
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const distX = (x - centerX) / centerX
        const distY = (y - centerY) / centerY
        const dist = Math.sqrt(distX * distX + distY * distY)
        const vignetteAmount = 1 - (dist * vignette / 100)

        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // Increase contrast
        r = ((r / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        g = ((g / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        b = ((b / 255 - 0.5) * (contrast / 100) + 0.5) * 255

        // Adjust saturation
        const avg = (r + g + b) / 3
        r = r + (r - avg) * (saturation / 100)
        g = g + (g - avg) * (saturation / 100)
        b = b + (b - avg) * (saturation / 100)

        // Apply warm color tint
        r = Math.min(255, r * 1.1)
        g = Math.min(255, g * 0.9)
        b = Math.min(255, b * 0.8)

        // Apply vignette
        r *= vignetteAmount
        g *= vignetteAmount
        b *= vignetteAmount

        // Clamp values
        data[i] = Math.max(0, Math.min(255, r))
        data[i + 1] = Math.max(0, Math.min(255, g))
        data[i + 2] = Math.max(0, Math.min(255, b))
      }
    }
    context.putImageData(imageData, 0, 0)
  }

  const oilPaintEffect = (canvas, radius, intensity) => {
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const imgData = ctx.getImageData(0, 0, width, height)
    const pixData = imgData.data
    const destCanvas = document.createElement("canvas")
    const dCtx = destCanvas.getContext("2d")
    let pixelIntensityCount = []

    destCanvas.width = width
    destCanvas.height = height

    const destImageData = dCtx.createImageData(width, height)
    const destPixData = destImageData.data
    const intensityLUT = []
    const rgbLUT = []

    for (let y = 0; y < height; y++) {
      intensityLUT[y] = []
      rgbLUT[y] = []
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const r = pixData[idx]
        const g = pixData[idx + 1]
        const b = pixData[idx + 2]
        const avg = (r + g + b) / 3

        intensityLUT[y][x] = Math.round((avg * intensity) / 255)
        rgbLUT[y][x] = { r, g, b }
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixelIntensityCount = []

        // Find intensities of nearest pixels within radius.
        for (let yy = -radius; yy <= radius; yy++) {
          for (let xx = -radius; xx <= radius; xx++) {
            if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
              const intensityVal = intensityLUT[y + yy][x + xx]

              if (!pixelIntensityCount[intensityVal]) {
                pixelIntensityCount[intensityVal] = {
                  val: 1,
                  r: rgbLUT[y + yy][x + xx].r,
                  g: rgbLUT[y + yy][x + xx].g,
                  b: rgbLUT[y + yy][x + xx].b
                }
              } else {
                pixelIntensityCount[intensityVal].val++
                pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r
                pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g
                pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b
              }
            }
          }
        }

        pixelIntensityCount.sort((a, b) => b.val - a.val)

        const curMax = pixelIntensityCount[0].val
        const dIdx = (y * width + x) * 4

        destPixData[dIdx] = ~~(pixelIntensityCount[0].r / curMax)
        destPixData[dIdx + 1] = ~~(pixelIntensityCount[0].g / curMax)
        destPixData[dIdx + 2] = ~~(pixelIntensityCount[0].b / curMax)
        destPixData[dIdx + 3] = 255
      }
    }

    ctx.putImageData(destImageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Classical Filter</title>
        <meta name="description" content="Classical Painting Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Classical Filter</h1>
        <h2 className={styles.description}>Transform your images into classical paintings</h2>
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
            <label htmlFor="vignette">Vignette: </label>
            <input
              type="range"
              id="vignette"
              min="0"
              max="100"
              value={vignette}
              onChange={(e) => setVignette(Number(e.target.value))}
            />
            <input type="number" value={vignette} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setVignette(Number(e.target.value))} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="radius">Oil Paint Radius: </label>
            <input
              type="range"
              id="radius"
              min="1"
              max="10"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
            <input type="number" value={radius} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setRadius(Number(e.target.value))} />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="intensity">Oil Paint Intensity: </label>
            <input
              type="range"
              id="intensity"
              min="1"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
            <input type="number" value={intensity} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setIntensity(Number(e.target.value))} />
          </div>
          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'classical_filter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
