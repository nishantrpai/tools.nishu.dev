import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function RemoveWatermark() {
  const [img, setImg] = useState(null)
  const [processedImg, setProcessedImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle')
  const [brushSize, setBrushSize] = useState(10)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const cursorCanvasRef = useRef(null)
  const lastPositionRef = useRef(null)

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

        // Set up cursor canvas
        const cursorCanvas = cursorCanvasRef.current
        cursorCanvas.width = canvas.width
        cursorCanvas.height = canvas.height
      }
      image.src = img
    }
  }, [img])

  const getDominantColor = (x, y, size) => {
    const ctx = contextRef.current
    const imageData = ctx.getImageData(
      Math.max(x - size / 2, 0),
      Math.max(y - size / 2, 0),
      Math.min(size, ctx.canvas.width - x + size / 2),
      Math.min(size, ctx.canvas.height - y + size / 2)
    )
    const data = imageData.data
    let r = 0, g = 0, b = 0, count = 0

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {  // Only consider non-transparent pixels
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }
    }

    if (count === 0) return 'rgba(0,0,0,0)'  // Return transparent if no valid pixels

    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    return `rgb(${r},${g},${b})`
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    lastPositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    contextRef.current.beginPath()
    lastPositionRef.current = null
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dominantColor = getDominantColor(x, y, brushSize)
    
    const ctx = contextRef.current
    ctx.strokeStyle = dominantColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (lastPositionRef.current) {
      ctx.beginPath()
      ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    lastPositionRef.current = { x, y }
  }

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    const cursorCanvas = cursorCanvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = cursorCanvas.getContext('2d')
    ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI)
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2 - 1, 0, 2 * Math.PI)
    ctx.strokeStyle = 'black'
    ctx.stroke()

    draw(e)
  }

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setImg(URL.createObjectURL(blob));
        setStatus('image pasted')
        break;
      }
    }
  }

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Remove Watermark</title>
        <meta name="description" content="Remove watermark from any image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Remove Watermark
        </h1>
        <h2 className={styles.description}>
          Click and drag on the image to remove watermark
        </h2>
        <div style={{ position: 'relative' }}>
          <canvas 
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={handleMouseMove}
            style={{  border: '1px solid #333', borderRadius: 10, cursor: 'none' }}
          />
          <canvas 
            ref={cursorCanvasRef}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
        </div>
        <div>
          <label htmlFor="brushSize">Brush Size: </label>
          <input 
            type="range" 
            id="brushSize" 
            min="1" 
            max="50" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <span>{brushSize}px</span>
        </div>
        <span>
          {loading ? (
            <>
              Processing... Status: {status}
            </>
          ) : `Upload image or paste from clipboard (Status: ${status})`}
        </span>
        
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0]
            setImg(URL.createObjectURL(file))
            setStatus('image uploaded')
          }}
        />
        <button
          onClick={() => {
            const canvas = canvasRef.current
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'removed_watermark.png'
            a.click()
            setStatus('image downloaded')
          }}
        >
          Download
        </button>
      </main>
    </>
  )
}
