import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'

export default function Text2Video() {
  const [text, setText] = useState('')
  const [frames, setFrames] = useState([])
  const [selectedFont, setSelectedFont] = useState('Helvetica')
  const [frameInterval, setFrameInterval] = useState(2)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [rotate, setRotate] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [useGradient, setUseGradient] = useState(false)
  const canvasRef = useRef(null)
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const animationRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const fonts = [
    'Helvetica',
    'Arial',
    'Times New Roman',
    'Impact',
    'Comic Sans MS'
  ]

  const generateFrames = () => {
    const words = text.split(' ').filter(word => word.length > 0)
    const newFrames = []

    words.forEach((word, index) => {
      const canvas = canvasRef.current
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      // disable alpha
      ctx.globalAlpha = 1

      // Set background
      if (useGradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, 'red')
        gradient.addColorStop(0.5, 'yellow')
        gradient.addColorStop(1, 'blue')
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = backgroundColor
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.font = `bold 120px ${selectedFont}`
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Apply transformations
      ctx.save()
      ctx.translate(canvas.width/2 + offsetX, canvas.height/2 + offsetY)
      ctx.rotate(rotate * Math.PI / 180)
      ctx.fillText(word, 0, 0)
      ctx.restore()

      newFrames.push({
        index,
        word,
        dataURL: canvas.toDataURL('image/png')
      })
    })

    setFrames(newFrames)
  }

  useEffect(() => {
    generateFrames()
  }, [text, selectedFont, offsetX, offsetY, rotate, backgroundColor, useGradient])

  const playPreview = () => {
    if (frames.length === 0) return
    setIsPreviewPlaying(true)
    let currentFrame = 0

    const animate = () => {
      if (!canvasRef.current) return

      const ctx = canvasRef.current.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)

        if (isPreviewPlaying) {
          currentFrame = (currentFrame + 1) % frames.length
          animationRef.current = setTimeout(animate, frameInterval * 1000)
        }
      }
      img.src = frames[currentFrame].dataURL
    }

    animate()
  }

  const stopPreview = () => {
    setIsPreviewPlaying(false)
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
  }

  const startRecording = () => {
    if (!canvasRef.current) return

    const stream = canvasRef.current.captureStream(30)
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8000000
    })

    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: 'video/webm'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'text-animation.webm'
      a.click()
      URL.revokeObjectURL(url)
    }

    mediaRecorder.start()
    setIsRecording(true)
    playPreview()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      stopPreview()
    }
  }

  const downloadFrames = () => {
    frames.forEach((frame, index) => {
      const a = document.createElement('a')
      a.href = frame.dataURL
      a.download = `frame-${index}.png`
      a.click()
    })
  }

  return (
    <>
      <Head>
        <title>Text 2 Video</title>
        <meta name="description" content="Convert text to video frames" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{gap: 20}}>
        <h1 className={styles.title}>Text 2 Video</h1>
        <canvas ref={canvasRef} width={1080} height={1920} style={{ display: 'block', margin: '0 auto', border: '1px solid #000', width: '100%', border: '1px solid #333' }} />
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Enter your text" 
          style={{ 
            width: '100%', 
            height: '100px', 
            padding: '10px', 
            marginBottom: '20px' 
          }}
        />

        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', marginBottom: '20px' }}>
          <div>
            <label>Font: </label>
            <select 
              value={selectedFont} 
              onChange={(e) => setSelectedFont(e.target.value)}
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Frame Interval (seconds): </label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1" 
              value={frameInterval} 
              onChange={(e) => setFrameInterval(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Offset X: </label>
            <input 
              type="range" 
              min="-500" 
              max="500" 
              value={offsetX} 
              onChange={(e) => setOffsetX(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Offset Y: </label>
            <input 
              type="range" 
              min="-500" 
              max="500" 
              value={offsetY} 
              onChange={(e) => setOffsetY(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Rotate: </label>
            <input 
              type="range" 
              min="-180" 
              max="180" 
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Background Color: </label>
            <input 
              type="color" 
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              disabled={useGradient}
            />
          </div>

          <div>
            <label>Use Animated Gradient: </label>
            <input 
              type="checkbox" 
              checked={useGradient}
              onChange={(e) => setUseGradient(e.target.checked)}
            />
          </div>

          <button onClick={generateFrames}>Generate Frames</button>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <button 
            onClick={isPreviewPlaying ? stopPreview : playPreview}
            disabled={frames.length === 0}
          >
            {isPreviewPlaying ? 'Stop Preview' : 'Play Preview'}
          </button>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            disabled={frames.length === 0}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <button 
            onClick={downloadFrames}
            disabled={frames.length === 0}
          >
            Download Frames
          </button>
        </div>
      </main>
    </>
  )
}