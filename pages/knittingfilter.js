import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function KnittingFilter() {
  const [image, setImage] = useState(null)
  const [stitchSize, setStitchSize] = useState(8)
  const [contrast, setContrast] = useState(120)
  const [yarnTexture, setYarnTexture] = useState(50)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, stitchSize, contrast, yarnTexture])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    // Draw initial image
    context.drawImage(image, 0, 0, image.width, image.height)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Create knitting pattern
    for (let y = 0; y < canvas.height; y += stitchSize) {
      for (let x = 0; x < canvas.width; x += stitchSize) {
        // Get average color for this stitch
        let r = 0, g = 0, b = 0, count = 0
        
        for (let sy = 0; sy < stitchSize && y + sy < canvas.height; sy++) {
          for (let sx = 0; sx < stitchSize && x + sx < canvas.width; sx++) {
            const i = ((y + sy) * canvas.width + (x + sx)) * 4
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
        }
        
        r = Math.round(r / count)
        g = Math.round(g / count)
        b = Math.round(b / count)

        // Apply contrast
        r = ((r / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        g = ((g / 255 - 0.5) * (contrast / 100) + 0.5) * 255
        b = ((b / 255 - 0.5) * (contrast / 100) + 0.5) * 255

        // Draw knit stitch
        context.save()
        context.translate(x, y)

        // Create yarn texture effect
        const noise = (Math.random() - 0.5) * (yarnTexture / 100)
        
        // Draw oval-shaped stitch
        context.beginPath()
        context.ellipse(
          stitchSize/2, 
          stitchSize/2, 
          stitchSize/2, 
          stitchSize/1.5, 
          Math.PI/4, 
          0, 
          2 * Math.PI
        )
        context.fillStyle = `rgb(${r + noise * 255}, ${g + noise * 255}, ${b + noise * 255})`
        context.fill()
        
        // Add stitch highlight
        context.beginPath()
        context.ellipse(
          stitchSize/2.5, 
          stitchSize/2.5, 
          stitchSize/6, 
          stitchSize/4, 
          Math.PI/4, 
          0, 
          2 * Math.PI
        )
        context.fillStyle = `rgba(255, 255, 255, 0.2)`
        context.fill()
        
        context.restore()
      }
    }
  }

  return (
    <>
      <Head>
        <title>Knitting Filter</title>
        <meta name="description" content="Transform your images into knitted patterns" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Knitting Filter</h1>
        <h2 className={styles.description}>Transform your images into knitted patterns</h2>
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
            <label htmlFor="stitchSize">Stitch Size: </label>
            <input
              type="range"
              id="stitchSize"
              min="4"
              max="20"
              value={stitchSize}
              onChange={(e) => setStitchSize(Number(e.target.value))}
            />
            <input type="number" value={stitchSize} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setStitchSize(Number(e.target.value))} />
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
            <label htmlFor="yarnTexture">Yarn Texture: </label>
            <input
              type="range"
              id="yarnTexture"
              min="0"
              max="100"
              value={yarnTexture}
              onChange={(e) => setYarnTexture(Number(e.target.value))}
            />
            <input type="number" value={yarnTexture} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setYarnTexture(Number(e.target.value))} />
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'knitting_filter.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
