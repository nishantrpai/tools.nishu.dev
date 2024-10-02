import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function PaintingTool() {
  const [img, setImg] = useState(null)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(40) // Added brush size state
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    if (img) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image, 0, 0)
        contextRef.current = ctx
      }
      image.src = img
    }
  }, [img])

  const startPainting = (e) => {
    // only allow painting when user is left clicking else return
    if(e.button !== 0) return

    const canvas = canvasRef.current
    const ctx = contextRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.fillStyle = color
    ctx.fillRect(x, y, brushSize, brushSize) // Paint a square with configurable brush size
  }
  
  const getHex = (r, g, b) => {
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
  }

  const handleRightClick = (e) => {
    if(e.button !== 2) return
    e.preventDefault()
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = contextRef.current
    const pixel = ctx.getImageData(x, y, 1, 1).data
    const pickedColor = getHex(pixel[0], pixel[1], pixel[2])
    setColor(pickedColor)
  }

  const resetCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0)
    }
    image.src = img
  }

  return (
    <>
      <Head>
        <title>Painting Tool</title>
        <meta name="description" content="Paint any surface with color" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>Painting Tool</h1>
        <h2 className={styles.description}>Paint any surface with color. Right click to select color, left click to paint.</h2>
        <div style={{ position: 'relative' }}>
          <canvas 
            ref={canvasRef}
            width={1000}
            height={1000

            }
            onMouseDown={startPainting}
            onContextMenu={handleRightClick}
            style={{ border: '1px solid #333', borderRadius: 10, width: '100%', height: '100%' }}
          />
        </div>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0]
            setImg(URL.createObjectURL(file))
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <span>{color}</span>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
          />
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))} // Brush size input
          />
          <span>{brushSize}px</span>
          <button onClick={resetCanvas}>Reset</button>
        </div>
      </main>
    </>
  )
}
