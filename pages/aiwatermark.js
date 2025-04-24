import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function AIWatermark() {
  const [image, setImage] = useState(null)
  const [watermarkSize, setWatermarkSize] = useState(150) // Default size for watermark

  useEffect(() => {
    if (!image) return
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = image

    const watermarkImg = new Image()
    watermarkImg.src = '/dalle_watermark.svg'

    // wait for both images to load
    img.onload = () => {
      watermarkImg.onload = () => {
        console.log('Images loaded')
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Calculate watermark position (bottom right corner)
        const padding = 0 // Padding from the edge
        const wmWidth = watermarkSize
        const wmHeight = watermarkSize/4.5
        const posX = canvas.width - wmWidth - padding
        const posY = canvas.height - wmHeight - padding
        
        // Draw watermark with slight transparency
        ctx.globalAlpha = 1.0
        ctx.drawImage(watermarkImg, posX, posY, wmWidth, wmHeight)
        ctx.globalAlpha = 1.0
      }
    }
  }, [image, watermarkSize])

  const download = () => {
    const canvas = document.getElementById('canvas')
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = 'ai-watermarked.png'
    a.click()
  }

  return (
    <>
      <Head>
        <title>AI Watermark</title>
        <meta name="description" content="Add AI watermark to any image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>AI Watermark</h1>
        <span style={{
          fontSize: '14px',
          color: 'gray',
          marginBottom: '20px',
          display: 'block'
        }}>
          Add DALL·E watermark to the bottom right of any image
        </span>
        <form>
          <input type="file" onChange={e => {
            setImage(null)
            setImage(URL.createObjectURL(e.target.files[0]))
          }} placeholder='Choose your file' />
        </form>
        
        {image && (
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="watermark-size">Watermark Size: {watermarkSize}px</label>
            <input 
              id="watermark-size"
              type="range" 
              min="50" 
              max="300" 
              value={watermarkSize} 
              onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
              style={{ margin: '0 10px', verticalAlign: 'middle' }}
            />
          </div>
        )}
        
        <canvas id="canvas" width="300" height="300" style={{
          width: '100%',
          height: 'auto',
          marginTop: '20px',
          borderRadius: '10px',
          border: image ? '1px solid #333' : 'none'
        }}></canvas>
        
        {image && <button onClick={download}>Download</button>}
      </main>
    </>
  )
}