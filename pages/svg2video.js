import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'
import gifshot from 'gifshot'

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
  const lastFrameTimeRef = useRef(0)
  const framesRef = useRef([])
  const fpsRef = useRef(30)
  const recordDimsRef = useRef({ w: 0, h: 0 })
  const [format, setFormat] = useState('webm') // 'mp4' | 'webm' | 'gif'
  const [fps, setFps] = useState(30)

  // Pick best available MediaRecorder mimeType (prefer MP4/H.264)
  const pickRecorderType = (preferred) => {
    const mp4Candidates = [
      { mimeType: 'video/mp4;codecs=avc1.42E01E', ext: 'mp4' },
      { mimeType: 'video/mp4', ext: 'mp4' },
    ]
    const webmCandidates = [
      { mimeType: 'video/webm;codecs=vp9', ext: 'webm' },
      { mimeType: 'video/webm;codecs=vp8', ext: 'webm' },
      { mimeType: 'video/webm', ext: 'webm' },
    ]
    const order = preferred === 'mp4' ? [...mp4Candidates, ...webmCandidates]
      : preferred === 'webm' ? [...webmCandidates, ...mp4Candidates]
        : [...mp4Candidates, ...webmCandidates]
    for (const c of order) {
      try {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(c.mimeType)) {
          return c
        }
      } catch (_) { }
    }
    return { mimeType: '', ext: 'webm' }
  }

  // No external loader needed; using gifshot directly

  const handleSvgChange = (e) => {
    setSvgCode(e.target.value)
  }

  const svgDataUri = svgCode ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}` : ''

  const startRecording = async () => {
    if (!svgCode || isRecording) return
    setLoading(true)
    setFrameCount(0)

    // Create or get canvas
    let canvas = canvasRef.current
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvasRef.current = canvas
    }

    // Ensure canvas exists; it's fine to keep it off-DOM for GIF capture

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = svgDataUri
    imgRef.current = img

    img.onload = async () => {
      const w = width || img.naturalWidth || 300
      const h = height || img.naturalHeight || 300

      console.log('Recording dimensions:', w, h)
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      recordDimsRef.current = { w, h }

      // Branch by format
      if (format === 'gif') {
        recorderRef.current = { kind: 'gif' }
        fpsRef.current = fps
        framesRef.current = []
        setIsRecording(true)
        isRecordingRef.current = true
        setLoading(false)
        lastFrameTimeRef.current = 0
      } else {
        // Create MediaRecorder from canvas stream
        const stream = canvas.captureStream(fps) // Use configurable FPS
        const { mimeType, ext } = pickRecorderType(format)
        const options = mimeType ? { mimeType, videoBitsPerSecond: 2500000 } : { videoBitsPerSecond: 2500000 }
        const mediaRecorder = new MediaRecorder(stream, options)

        const chunks = []

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType || 'video/webm' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `svg-animation.${(ext || 'webm')}`
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
        recorderRef.current._ext = ext
        recorderRef.current._mime = mimeType
      }

      // Animation loop - draw the same animated <img> every frame
      const animate = (ts) => {
        if (!isRecordingRef.current) return
        ctx.clearRect(0, 0, w, h)
        const curImg = imgRef.current
        if (curImg && curImg.complete) {
          ctx.drawImage(curImg, 0, 0, w, h)
          // Add frame to GIF at target FPS if requested
          if (format === 'gif' && recorderRef.current?.kind === 'gif') {
            const last = lastFrameTimeRef.current || 0
            const intervalMs = Math.round(1000 / fpsRef.current)
            if (!last || (ts && ts - last >= intervalMs)) {
              try {
                framesRef.current.push(canvas.toDataURL('image/png'))
              } catch (_) { }
              lastFrameTimeRef.current = ts || 0
            }
          }
          setFrameCount((prev) => prev + 1)
        }
        animationIdRef.current = requestAnimationFrame(animate)
      }

      animationIdRef.current = requestAnimationFrame(animate)
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

      if (format === 'gif' && recorderRef.current?.kind === 'gif') {
        const { w, h } = recordDimsRef.current
        const fps = fpsRef.current || 30
        const images = framesRef.current.slice()
        framesRef.current = []
        gifshot.createGIF({
          gifWidth: w,
          gifHeight: h,
          images,
          frameDuration: 1 / fps,
          numWorkers: 2,
          sampleInterval: 1,
          numFrames: images.length,
          quality: 1,
          dither: false,
        }, (obj) => {
          if (!obj.error) {
            const a = document.createElement('a')
            a.href = obj.image
            a.download = 'svg-animation.gif'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          } else {
            alert('GIF encode failed')
          }
          setLoading(false)
        })
        recorderRef.current = null
      } else {
        recorderRef.current.stop()
        recorderRef.current = null
      }
    }
  }

  return (
    <>
      <Head>
        <title>SVG to Video Converter</title>
        <meta name="description" content="Convert animated SVG to video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          SVG to Video Converter
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>
          Paste your animated SVG code and download it as video.
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

        <div style={{ margin: '20px 0', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
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
          <label>
            FPS:
            <input
              type="number"
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              placeholder="30"
              style={{ marginLeft: '5px', width: '60px' }}
            />
          </label>
          <label>
            Format:
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ marginLeft: '8px' }}>
              <option value="mp4">MP4 (H.264)</option>
              <option value="webm">WebM (VP9/VP8)</option>
              <option value="gif">GIF</option>
            </select>
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
