import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'

export default function Svg2Webm() {
  const [svgCode, setSvgCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [frameCount, setFrameCount] = useState(0)
  const canvasRef = useRef(null)
  const animationIdRef = useRef(null)
  const recorderRef = useRef(null)
  const isRecordingRef = useRef(false)
  const imgRef = useRef(null)

  const handleSvgChange = (e) => {
    setSvgCode(e.target.value)
  }

  const svgDataUri = svgCode ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}` : ''

  const startRecording = () => {
    if (!svgCode || isRecording) return
    setLoading(true)
    setFrameCount(0)
    
    // Create or get canvas
    let canvas = canvasRef.current
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvasRef.current = canvas
    }
    
    // Add canvas to DOM for MediaRecorder to work properly
    if (!document.body.contains(canvas)) {
      canvas.style.display = 'none'
      document.body.appendChild(canvas)
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = svgDataUri
    imgRef.current = img

    img.onload = () => {
      const w = width || img.naturalWidth || 300
      const h = height || img.naturalHeight || 300
      
      console.log('Recording dimensions:', w, h)
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      
      // Create MediaRecorder from canvas stream
      const stream = canvas.captureStream(30) // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      })
      
      const chunks = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'svg-animation.webm'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setLoading(false)
        setIsRecording(false)
      }
      
      recorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      isRecordingRef.current = true
      setLoading(false)

      // Animation loop - draw the same animated <img> every frame
      const animate = () => {
        if (!isRecordingRef.current) return
        ctx.clearRect(0, 0, w, h)
        const curImg = imgRef.current
        if (curImg && curImg.complete) {
          ctx.drawImage(curImg, 0, 0, w, h)
          setFrameCount((prev) => prev + 1)
        }
        animationIdRef.current = requestAnimationFrame(animate)
      }

      animate()
    }
    
    img.onerror = () => {
      setLoading(false)
      alert('Failed to load SVG. Please check your SVG code.')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      setIsRecording(false)
      isRecordingRef.current = false
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }

      recorderRef.current.stop()
      recorderRef.current = null
    }
  }

  return (
    <>
      <Head>
        <title>SVG to WebM Converter</title>
        <meta name="description" content="Convert animated SVG to WebM video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          SVG to WebM Converter
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Paste your animated SVG code and download it as WebM video.
        </span>

        <textarea
          value={svgCode}
          onChange={handleSvgChange}
          placeholder="Paste your SVG code here"
          style={{
            width: '100%',
            border: '1px solid #333',
            padding: '10px',
            outline: 'none',
            height: '200px',
          }}
        />

        <div style={{ margin: '20px 0' }}>
          <label style={{ marginRight: '20px' }}>
            Width: 
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(Number(e.target.value))} 
              placeholder="Auto" 
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </label>
          <label>
            Height: 
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(Number(e.target.value))} 
              placeholder="Auto" 
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </label>
        </div>

        {svgDataUri && (
          <div style={{ margin: '20px 0' }}>
            <div>Preview:</div>
            <img 
              src={svgDataUri} 
              width={width || undefined} 
              height={height || undefined} 
              onLoad={(e) => {
                if (!width) setWidth(e.target.naturalWidth)
                if (!height) setHeight(e.target.naturalHeight)
              }}
              style={{ border: '1px solid #ccc' }}
              alt="SVG Preview"
            />
          </div>
        )}

        <div style={{ margin: '20px 0' }}>
          <button onClick={startRecording} className={styles.button} disabled={loading || isRecording}>
            {isRecording ? 'Recording...' : 'Start Recording'}
          </button>
          <button onClick={stopRecording} className={styles.button} disabled={!isRecording}>
            Stop Recording
          </button>
        </div>

        {isRecording && (
          <div style={{ color: '#777', fontSize: '14px' }}>
            Frames recorded: {frameCount}
          </div>
        )}
      </main>
    </>
  )
}
