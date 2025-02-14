import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function XCopyFilter() {
  // For image processing
  const [image, setImage] = useState(null)
  // For video processing
  const [videoSrc, setVideoSrc] = useState(null)
  const [videoFps, setVideoFps] = useState(30)
  const videoRef = useRef(null)
  // Common parameters
  const [edgeThreshold, setEdgeThreshold] = useState(30)
  const [saturation, setSaturation] = useState(140)
  const [contrast, setContrast] = useState(120)
  const [colorSimplification, setColorSimplification] = useState(32)
  const [paperTexture, setPaperTexture] = useState(20)
  const [halftoneSize, setHalftoneSize] = useState(4)
  const [inputType, setInputType] = useState(null) // 'image' or 'video'
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const recordingChunks = useRef([])

  // For video drawing loop
  const videoAnimationRef = useRef(null)

  useEffect(() => {
    // If an image was uploaded, process it immediately.
    if (image && inputType === 'image') {
      applyImageFilter()
    }
  }, [image, halftoneSize, edgeThreshold, saturation, contrast, colorSimplification, paperTexture])

  // Calculate video's fps when metadata is loaded
  useEffect(() => {
    if (inputType === 'video' && videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        const duration = videoRef.current.duration
        let totalFrames = 0
        if (videoRef.current.getVideoPlaybackQuality) {
          const quality = videoRef.current.getVideoPlaybackQuality()
          totalFrames = quality.totalVideoFrames
        } else if (videoRef.current.webkitDecodedFrameCount) {
          totalFrames = videoRef.current.webkitDecodedFrameCount
        }
        if (duration > 0 && totalFrames > 0) {
          setVideoFps(Math.floor(totalFrames / duration))
        }
      }
    }
  }, [inputType, videoSrc])

  // Filter logic for an image
  const applyImageFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height

    // Draw the original image to extract pixel data
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Define cell size based on halftone value
    const cellSize = halftoneSize * 10

    // Clear canvas and set background to black
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Process each cell and draw a white dot based on brightness
    for (let y = 0; y < canvas.height; y += cellSize) {
      for (let x = 0; x < canvas.width; x += cellSize) {
        let total = 0, count = 0

        for (let yy = y; yy < y + cellSize && yy < canvas.height; yy++) {
          for (let xx = x; xx < x + cellSize && xx < canvas.width; xx++) {
            const idx = (yy * canvas.width + xx) * 4
            const brightness = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
            total += brightness
            count++
          }
        }

        const avg = total / count
        const maxRadius = cellSize / 2
        const radius = maxRadius * (avg / 255)

        if (radius > 1) {
          context.beginPath()
          context.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, 2 * Math.PI)
          context.fillStyle = 'white'
          context.fill()
        }
      }
    }
  }

  // Filter logic for each video frame with similar processing
  const applyVideoFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const videoEl = videoRef.current

    if (videoEl && videoEl.readyState >= 2) {
      canvas.width = videoEl.videoWidth
      canvas.height = videoEl.videoHeight

      // Draw current video frame
      context.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      const cellSize = halftoneSize * 10
      context.fillStyle = 'black'
      context.fillRect(0, 0, canvas.width, canvas.height)

      for (let y = 0; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
          let total = 0, count = 0

          for (let yy = y; yy < y + cellSize && yy < canvas.height; yy++) {
            for (let xx = x; xx < x + cellSize && xx < canvas.width; xx++) {
              const idx = (yy * canvas.width + xx) * 4
              const brightness = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
              total += brightness
              count++
            }
          }

          const avg = total / count
          const maxRadius = cellSize / 2
          const radius = maxRadius * (avg / 255)

          if (radius > 1) {
            context.beginPath()
            context.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, 2 * Math.PI)
            context.fillStyle = 'white'
            context.fill()
          }
        }
      }
    }
    videoAnimationRef.current = requestAnimationFrame(applyVideoFilter)
  }

  // Handle file upload (both image and video)
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fileType = file.type
    if (fileType.startsWith('video')) {
      setInputType('video')
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      // set image to null in video mode
      setImage(null)
    } else if (fileType.startsWith('image')) {
      setInputType('image')
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          setImage(img)
        }
      }
      reader.readAsDataURL(file)
      // clear any video state
      setVideoSrc(null)
      if (videoAnimationRef.current) {
        cancelAnimationFrame(videoAnimationRef.current)
      }
    }
  }

  // Video control functions
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
      applyVideoFilter()
    }
  }

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
      if (videoAnimationRef.current) {
        cancelAnimationFrame(videoAnimationRef.current)
      }
    }
  }

  // Download processed video from canvas using MediaRecorder
  const handleDownloadVideo = () => {
    handlePauseVideo()
    handlePlayVideo()
    const canvas = document.getElementById('canvas')
    // use calculated videoFps instead of static 30 fps
    const stream = canvas.captureStream(videoFps)
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 8000000,
    })
    recordingChunks.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordingChunks.current.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordingChunks.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `iafilter-${Date.now()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    mediaRecorder.start()
    setIsRecording(true)

    // Stop recording after video ends or after a fixed time.
    videoRef.current.onended = () => {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  return (
    <>
      <Head>
        <title>Intelligence Age Filter</title>
        <meta name="description" content="Transform your images or videos into Intelligence Age Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Intelligence Age Filter</h1>
        <h2 className={styles.description}>
          Transform your images or videos into Intelligence Age Filter
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
          <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />

          {inputType === 'video' && (
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={handlePlayVideo} disabled={isVideoPlaying}>
                Play
              </button>
              <button onClick={handlePauseVideo} disabled={!isVideoPlaying}>
                Pause
              </button>
              <button onClick={handleDownloadVideo} disabled={isRecording}>
                {isRecording ? 'Recording...' : 'Download Video'}
              </button>
            </div>
          )}

          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="halftoneSize">Halftone Pattern Size: </label>
            <input
              type="range"
              id="halftoneSize"
              min="1"
              max="10"
              value={halftoneSize}
              onChange={(e) => setHalftoneSize(Number(e.target.value))}
            />
            <input
              type="number"
              value={halftoneSize}
              style={{
                width: 50,
                background: 'none',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: 5,
                padding: 5,
                marginLeft: 10
              }}
              onChange={(e) => setHalftoneSize(Number(e.target.value))}
            />
          </div>
          {inputType === 'video' && (
            <div style={{ marginTop: '20px', width: '100%' }}>
              <label htmlFor="fpsValue">Video FPS: </label>
              <input
                type="number"
                id="fpsValue"
                min="1"
                value={videoFps}
                onChange={(e) => setVideoFps(Number(e.target.value))}
                style={{
                  width: 70,
                  background: 'none',
                  border: '1px solid #333',
                  color: '#fff',
                  borderRadius: 5,
                  padding: 5,
                  marginLeft: 10
                }}
              />
            </div>
          )}
          <button onClick={() => { setImage(null); setVideoSrc(null); if (videoAnimationRef.current) { cancelAnimationFrame(videoAnimationRef.current) } }}>
            Clear
          </button>
        </div>

        {inputType === 'video' ? (
          <video ref={videoRef} src={videoSrc} style={{ display: 'none' }} />
        ) :
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'iafilter.png'
            a.click()
          }}>Download</button>
        }

      </main>
    </>
  )
}
