import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function Liquify() {
  const [img, setImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle')
  const [brushSize, setBrushSize] = useState(50)
  const [isWarping, setIsWarping] = useState(false)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const cursorCanvasRef = useRef(null)
  const lastPositionRef = useRef(null)
  const originalImageRef = useRef(null)

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

        // Store the original image for reset functionality
        originalImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Set up cursor canvas
        const cursorCanvas = cursorCanvasRef.current
        cursorCanvas.width = canvas.width
        cursorCanvas.height = canvas.height
      }
      image.src = img
    }
  }, [img])

  const startWarping = (e) => {
    setIsWarping(true)
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    lastPositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    warp(e)
  }

  const stopWarping = () => {
    setIsWarping(false)
    lastPositionRef.current = null
  }

  const warp = (e) => {
    if (!isWarping) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = contextRef.current
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    for (let py = 0; py < canvas.height; py++) {
      for (let px = 0; px < canvas.width; px++) {
        const dx = px - x
        const dy = py - y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < brushSize) {
          const amount = (brushSize - distance) / brushSize
          const ax = dx * amount
          const ay = dy * amount
          
          const sx = Math.round(px + ax)
          const sy = Math.round(py + ay)
          
          if (sx >= 0 && sx < canvas.width && sy >= 0 && sy < canvas.height) {
            const sourceIndex = (sy * canvas.width + sx) * 4
            const targetIndex = (py * canvas.width + px) * 4
            
            pixels[targetIndex] = pixels[sourceIndex]
            pixels[targetIndex + 1] = pixels[sourceIndex + 1]
            pixels[targetIndex + 2] = pixels[sourceIndex + 2]
            pixels[targetIndex + 3] = pixels[sourceIndex + 3]
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0)
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

    warp(e)
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

  const resetImage = () => {
    if (originalImageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.putImageData(originalImageRef.current, 0, 0)
      setStatus('image reset')
    }
  }

  return (
    <>
      <Head>
        <title>Liquify Tool</title>
        <meta name="description" content="Liquify your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Liquify Tool
        </h1>
        <h2 className={styles.description}>
          Click and drag on the image to warp it
        </h2>
        <div style={{ position: 'relative' }}>
          <canvas 
            ref={canvasRef}
            onMouseDown={startWarping}
            onMouseUp={stopWarping}
            onMouseOut={stopWarping}
            onMouseMove={handleMouseMove}
            style={{  border: '1px solid #333', borderRadius: 10, cursor: 'none' }}
          />
          <canvas 
            ref={cursorCanvasRef}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
        </div>
        <div>
          <label htmlFor="brushSize">Warp Size: </label>
          <input 
            type="range" 
            id="brushSize" 
            min="10" 
            max="200" 
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
            a.download = 'liquify.png'
            a.click()
            setStatus('image downloaded')
          }}
        >
          Download
        </button>
        <button onClick={resetImage}>
          Reset
        </button>
      </main>
    </>
  )
}
