import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef, useEffect } from 'react'

export default function Svg2Webm() {
  const [svgFile, setSvgFile] = useState(null)
  const [svgPaths, setSvgPaths] = useState([])
  const [selectedPath, setSelectedPath] = useState('')
  const [animationDirection, setAnimationDirection] = useState('leftToRight')
  const [duration, setDuration] = useState(2) // Duration in seconds
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [pathColor, setPathColor] = useState('#fff')
  const [isRecording, setIsRecording] = useState(false)
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(event.target.result, 'image/svg+xml')
        const paths = Array.from(svgDoc.querySelectorAll('path'))
        setSvgPaths(paths)
        setSvgFile(event.target.result)
        // draw svg on canvas
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const svgImage = new Image()
        const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(event.target.result)}`
        svgImage.src = svgDataUri
        svgImage.onload = () => {
          const imgWidth = svgImage.width
          const imgHeight = svgImage.height
          const xOffset = (canvas.width - imgWidth) / 2
          const yOffset = (canvas.height - imgHeight) / 2
          ctx.drawImage(svgImage, xOffset, yOffset, imgWidth, imgHeight)
        }
      }
      reader.readAsText(file)
    }
  }

  const handlePathChange = (e) => {
    setSelectedPath(e.target.value)
  }

  const handleDirectionChange = (e) => {
    setAnimationDirection(e.target.value)
  }
  

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value))
  }
  const animatePath = () => {
    if (!selectedPath || !svgFile) return

    const svgDoc = new DOMParser().parseFromString(svgFile, 'image/svg+xml')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const svgImage = new Image()
    const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgFile)}`
    svgImage.src = svgDataUri

    svgImage.onload = () => {
      const imgWidth = svgImage.width
      const imgHeight = svgImage.height
      const xOffset = (canvas.width - imgWidth) / 2
      const yOffset = (canvas.height - imgHeight) / 2

      const pathElement = svgDoc.querySelector(`path[d="${selectedPath}"]`)
      if (!pathElement) return

      const path2D = new Path2D(pathElement.getAttribute('d'))
      const totalLength = pathElement.getTotalLength()
      const frameCount = 60 * duration // Assuming 60 FPS
      const lengthPerFrame = totalLength / frameCount

      for (let i = 0; i <= frameCount; i++) {
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(svgImage, offsetX, offsetY, imgWidth * scale, imgHeight * scale)
        ctx.save()
        // ctx.translate(xOffset, yOffset)
        ctx.strokeStyle = pathColor
        ctx.lineWidth = 2
        ctx.setLineDash([totalLength])
        ctx.lineDashOffset = totalLength - lengthPerFrame * i
        ctx.stroke(path2D)
        ctx.restore()

        if(totalLength - lengthPerFrame * i <= 0) {
        stopRecording()
        }
        if (i === frameCount) {
        stopRecording()
        }
      }, (i * 1000) / 60)
      }
    }
  }
  

  const startRecording = () => {
    if (!canvasRef.current) return

    const stream = canvasRef.current.captureStream(60)
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
      a.download = 'animation.webm'
      a.click()
      URL.revokeObjectURL(url)
    }

    mediaRecorder.start()
    setIsRecording(true)
    animatePath()
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }
  
  useEffect(() => {
    if(svgFile) {
      let canvas = canvasRef.current
      let ctx = canvas.getContext('2d')
      let svgImage = new Image()
      let svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgFile)}`
      svgImage.src = svgDataUri
      svgImage.onload = () => {
        let imgWidth = svgImage.width
        let imgHeight = svgImage.height
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(svgImage, offsetX, offsetY, imgWidth *scale, imgHeight * scale)
      }
    }
  }, [offsetX, offsetY, scale, pathColor, svgFile, selectedPath, animationDirection])

  return (
    <>
      <Head>
        <title>SVG to WebM Animator</title>
        <meta name="description" content="Animate SVG paths and download as WebM" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h1 className={styles.title}>
          SVG to WebM Animator
        </h1>
        <span style={{ color: '#777', fontSize: '14px', marginBottom: '20px', display: 'block' }}>Upload your SVG file, select a path, and download the animation as WebM.</span>
        <canvas ref={canvasRef} width={800} height={800}  style={{ border: '1px solid #333', width: '100%', background: '#fff' }} />

        <input type="file" accept="image/svg+xml" onChange={handleFileChange} />
        {svgPaths.length > 0 && (
          <>
          <input type="color" value={pathColor} defaultValue={pathColor} onChange={(e) => setPathColor(e.target.value)} />
            <select onChange={handlePathChange} value={selectedPath}>
              <option value="">Select a path</option>
              {svgPaths.map((path, index) => (
                <option key={index} value={path.getAttribute('d')}>{`Path ${index + 1}`}</option>
              ))}
            </select>

            <select onChange={handleDirectionChange} value={animationDirection}>
              <option value="leftToRight">Left to Right</option>
              <option value="rightToLeft">Right to Left</option>
              <option value="topToBottom">Top to Bottom</option>
              <option value="bottomToTop">Bottom to Top</option>
            </select>

            <label>
              Duration (seconds):
              <input type="number" min="1" value={duration} onChange={handleDurationChange} />
            </label>

            <button onClick={isRecording ? stopRecording : startRecording} className={styles.button}>
              {isRecording ? 'Stop Recording' : 'Animate and Download as WebM'}
            </button>
            <label>
              Offset X: {offsetX}
            </label>
            <input type="range" min="-400" max="400" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
            <label>
              Offset Y: {offsetY}
            </label>
            <input type="range" min="-400" max="400" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
            <label>
              Scale: {scale}
            </label>

            <input type="range" min="0.1" max="100" step="0.1" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          </>
        )}

      </main>
    </>
  )
}