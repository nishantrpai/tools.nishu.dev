import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { useState, useEffect } from 'react'

export default function CanvasLines() {
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [gap, setGap] = useState(10)
  const [dash, setDash] = useState(5)
  const [fontSize, setFontSize] = useState(10)
  const [opacity, setOpacity] = useState(0.15)
  const [gridColor, setGridColor] = useState('#ffffff')

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (image) {
      // clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // set canvas size to image size or default
      canvas.width = imgWidth || 800
      canvas.height = imgHeight || 600
      
      // Fill with navy blue background
      context.fillStyle = '#1a1f3a'
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      if (image) {
        context.drawImage(image, 0, 0, image.width, image.height)
      }
      
      
      // draw dashed lines
      context.save()
      const [r, g, b] = gridColor.match(/\w\w/g).map(x => parseInt(x, 16))
      context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
      context.lineWidth = 1
      context.setLineDash([dash, dash])

            // draw measurement text at top
      context.font = `${fontSize}px sans-serif`
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(opacity * 2, 1)})`
      for (let x = 0; x < canvas.width; x += gap) {
        if (x === 0) continue
        context.fillText(`${x}px`, x - 10, fontSize + 5)
      }

      // vertical lines
      for (let x = 50; x < canvas.width; x += 50) {
        context.beginPath()
        context.moveTo(x, 0)
        context.lineTo(x, canvas.height)
        context.stroke()
      }

      // horizontal lines
      for (let y = 50; y < canvas.height; y += 50) {
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(canvas.width, y)
        context.stroke()
      }

      context.restore()
    }
  }, [image, imgWidth, imgHeight, gap, dash, fontSize, opacity, gridColor])

  return (
    <>
      <Head>
        <title>Image Grid</title>
        <meta name="description" content="Draw grid on image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Image Grid
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Draw grid on any image
        </span>

        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" width="800" height="800" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>

        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <label>Gap</label>
          <input type="range" min="5" max="500" value={gap} onChange={(e) => setGap(Number(e.target.value))} />
          <input type="number" value={gap} onChange={(e) => setGap(Number(e.target.value))} />
          <label>Dash Length</label>
          <input type="range" min="1" max="20" value={dash} onChange={(e) => setDash(Number(e.target.value))} />
          <input type="number" value={dash} onChange={(e) => setDash(Number(e.target.value))} />
          <label>Font Size</label>
          <input type="range" min="8" max="72" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
          <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
          
          <label>Grid Opacity</label>
          <input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
          <input type="number" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
          
          <label>Grid Color</label>
          <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `imagegrid-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
      </main>
    </>
  )
}
