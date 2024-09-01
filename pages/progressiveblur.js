// input an image and apply progressive blur
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function ProgressiveBlur() {
  const [image, setImage] = useState(null)
  const [blurAmount, setBlurAmount] = useState(5) // Added blurAmount state
  const [direction, setDirection] = useState('top')
  const [linePosition, setLinePosition] = useState(0)
  const canvasRef = useRef(null)

  const applyBlur = (ctx, img, blurAmount, direction, linePosition) => {
    const width = img.width
    const height = img.height
  
    ctx.drawImage(img, 0, 0)
  
    // Apply blur filter to the specific area
    ctx.filter = `blur(${blurAmount}px)`
    switch (direction) {
      case 'top':
        ctx.drawImage(canvasRef.current, 0, linePosition, width, height - linePosition, 0, linePosition, width, height - linePosition)
        break
      case 'bottom':
        ctx.drawImage(canvasRef.current, 0, 0, width, height - linePosition, 0, 0, width, height - linePosition)
        break
      case 'left':
        ctx.drawImage(canvasRef.current, linePosition, 0, width - linePosition, height, linePosition, 0, width - linePosition, height)
        break
      case 'right':
        ctx.drawImage(canvasRef.current, 0, 0, width - linePosition, height, 0, 0, width - linePosition, height)
        break
      default:
        break
    }
    ctx.filter = 'none'
  }
  

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        applyBlur(ctx, img, blurAmount, direction, linePosition) // Added blurAmount
      }
    }
  }, [image, blurAmount, direction, linePosition]) // Added blurAmount

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        applyBlur(ctx, img, blurAmount, direction, linePosition) // Added blurAmount
      }
    }
  }, [blurAmount, direction, linePosition]) // Added blurAmount

  return (
    <>
      <Head>
        <title>Progressive Blur</title>
        <meta name="description" content="Add progressive blur to your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Progressive Blur</h1>
        <h2 className={styles.description}>Add progressive blur to your image</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label>Blur Amount: {blurAmount}</label> {/* Added blur amount input */}
        <input type="range" min={0} max={20} value={blurAmount} onChange={(e) => setBlurAmount(e.target.value)} /> {/* Added blur amount input */}
        <label>Direction: </label>
        <select value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
        <label>Line Position: {linePosition}</label>
        <input type="range" min={0} max={direction === 'top' || direction === 'bottom' ? canvasRef.current?.height || 0 : canvasRef.current?.width || 0} value={linePosition} onChange={(e) => setLinePosition(e.target.value)} />
        <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', cursor: 'crosshair' }} />
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = canvasRef.current
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'progressive_blur.png'
          a.click()
        }}>Download
        </button>
      </main>
    </>
  )
}
