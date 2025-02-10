import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function XCopyFilter() {
  const [image, setImage] = useState(null)
  const [edgeThreshold, setEdgeThreshold] = useState(30)
  const [saturation, setSaturation] = useState(140)
  const [contrast, setContrast] = useState(120)
  const [colorSimplification, setColorSimplification] = useState(32)
  const [paperTexture, setPaperTexture] = useState(20)
  const [halftoneSize, setHalftoneSize] = useState(4)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, edgeThreshold, saturation, contrast, colorSimplification, paperTexture, halftoneSize])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    
    // Draw the original image to extract pixel data
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Define the cell size (adjust multiplier as needed)
    const cellSize = halftoneSize * 10
    
    // Clear canvas and set background to black so dark areas remain dark
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    // Process each cell to compute the average brightness and draw a white dot
    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        let total = 0, count = 0
        
        // Sum brightness in the cell
        for (let yy = y; yy < y + cellSize && yy < canvas.height; yy++) {
          for (let xx = x; xx < x + cellSize && xx < canvas.width; xx++) {
            const idx = (yy * canvas.width + xx) * 4
            const brightness = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
            total += brightness
            count++
          }
        }
        
        const avg = total / count
        // Invert the dot mapping: lighter areas (high avg) get larger white dots
        const maxRadius = cellSize / 2
        const radius = maxRadius * (avg / 255)
        
        // Only draw a dot if the radius is significant
        if (radius > 1) {
          context.beginPath()
          context.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, 2 * Math.PI)
          context.fillStyle = 'white'
          context.fill()
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Intelligence Age Filter</title>
        <meta name="description" content="Transform your images into Intelligence age filter like chatgpt superbowl ad" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Intelligence Age Filter</h1>
        <h2 className={styles.description}>
          Transform your images into Intelligence age filter like chatgpt superbowl ad
        </h2>
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


          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="halftoneSize">Halftone Pattern Size: </label>
            <input
              type="range"
              id="halftoneSize"
              min="1"
              max="10"
              value={halftoneSize}
              onChange={(e) => setHalftoneSize(Number(e.target.value))}
            />
            <input 
              type="number" 
              value={halftoneSize} 
              style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} 
              onChange={(e) => setHalftoneSize(Number(e.target.value))} 
            />
          </div>
          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'iafilter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
