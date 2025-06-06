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
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    context.drawImage(image, 0, 0, image.width, image.height)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Process image for xerox effect
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4

        // Convert to grayscale
        const brightness = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
        
        // Apply contrast
        let adjusted = ((brightness / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        
        // Apply halftone pattern
        const pattern = Math.sin(x / halftoneSize) * Math.sin(y / halftoneSize) * 255
        adjusted = adjusted + pattern * (saturation / 200)
        
        // Apply threshold
        const threshold = (edgeThreshold * 2) + 50
        adjusted = adjusted > threshold ? 255 : 0
        
        // Add paper texture
        const textureNoise = (Math.random() - 0.5) * paperTexture
        adjusted = Math.max(0, Math.min(255, adjusted + textureNoise))
        
        data[i] = data[i + 1] = data[i + 2] = adjusted
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Photocopy Filter</title>
        <meta name="description" content="Transform your images into Photocopy style" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Photocopy Filter</h1>
        <h2 className={styles.description}>Transform your images into Photocopy style</h2>
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

          <div style={{ marginTop: '20px', width: '100%' }}>
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

          <div style={{ marginTop: '20px', width: '100%' }}>
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

          <div style={{ marginTop: '20px', width: '100%' }}>
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

          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="paperTexture">Paper Texture: </label>
            <input
              type="range"
              id="paperTexture"
              min="0"
              max="50"
              value={paperTexture}
              onChange={(e) => setPaperTexture(Number(e.target.value))}
            />
            <input 
              type="number" 
              value={paperTexture} 
              style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} 
              onChange={(e) => setPaperTexture(Number(e.target.value))} 
            />
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'photocopy.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
