import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function PixelateArea() {
  const [img, setImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle')
  const [brushSize, setBrushSize] = useState(10)
  const [pixelationLevel, setPixelationLevel] = useState(10)
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

  const pixelate = (x, y, size, pixelation) => {
    const ctx = contextRef.current
    const imageData = ctx.getImageData(x, y, size, size)
    const data = imageData.data

    for (let i = 0; i < size; i += pixelation) {
      for (let j = 0; j < size; j += pixelation) {
        const index = (i * size + j) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]

        for (let dx = 0; dx < pixelation; dx++) {
          for (let dy = 0; dy < pixelation; dy++) {
            if (i + dx < size && j + dy < size) {
              const newIndex = ((i + dx) * size + (j + dy)) * 4
              data[newIndex] = r
              data[newIndex + 1] = g
              data[newIndex + 2] = b
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, x, y)
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
    lastPositionRef.current = null
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    pixelate(x, y, brushSize, pixelationLevel)

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
        <title>Pixelate Area</title>
        <meta name="description" content="Pixelate specific areas of an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Pixelate Area
        </h1>
        <h2 className={styles.description}>
          Click and drag on the image to pixelate specific areas
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
        <div>
          <label htmlFor="pixelationLevel">Pixelation Level: </label>
          <input 
            type="range" 
            id="pixelationLevel" 
            min="1" 
            max="50" 
            value={pixelationLevel} 
            onChange={(e) => setPixelationLevel(Number(e.target.value))}
          />
          <span>{pixelationLevel}px</span>
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
            a.download = 'pixelated_image.png'
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
