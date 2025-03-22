import { useState, useEffect, useRef } from 'react'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'

export default function PublicDraft() {
  const [draftLines, setDraftLines] = useState([]) // Store array of {text, color} objects
  const [currentText, setCurrentText] = useState("")
  const [scale, setScale] = useState(1)
  const [baseFontSize, setBaseFontSize] = useState(48)
  const [fontColor, setFontColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const canvasRef = useRef(null)

  const drawCanvas = (ctx, width, height, lines, scaleFactor, fontSize) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    ctx.save()
    ctx.scale(scaleFactor, scaleFactor)
    const effectiveWidth = width / scaleFactor
    const effectiveHeight = height / scaleFactor
    const margin = 20
    const availableWidth = effectiveWidth - margin * 2
    const availableHeight = effectiveHeight - margin * 2
    const lineHeightMultiplier = 1.2

    // Instead of processing text.split('\n'), use the stored lines
    const processedLines = lines.map(line => ({
      text: line.text.toUpperCase(),
      color: line.color
    }))
    
    // Measure each line at base font size to determine maximum width
    ctx.font = `bold ${fontSize}px Arial`
    const measuredWidths = processedLines.map(line => ctx.measureText(line.text).width)
    const maxWidth = measuredWidths.length ? Math.max(...measuredWidths) : 0

    // Determine scaling factors for width and height (allow up or down scaling)
    const scaleWidth = maxWidth > 0 ? (availableWidth / maxWidth) : 1
    const scaleHeight = processedLines.length > 0 ? (availableHeight / (processedLines.length * fontSize * lineHeightMultiplier)) : 1
    const factor = Math.min(scaleWidth, scaleHeight)
    const uniformFontSize = fontSize * factor

    // Compute total height needed
    const totalHeight = processedLines.length * uniformFontSize * lineHeightMultiplier
    let startY = (effectiveHeight - totalHeight) / 2 + uniformFontSize * lineHeightMultiplier / 2

    // Draw each line with its stored color
    processedLines.forEach(line => {
      ctx.font = `bold ${uniformFontSize}px Arial`
      ctx.fillStyle = line.color
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(line.text, effectiveWidth / 2, startY)
      startY += uniformFontSize * lineHeightMultiplier
    })
    ctx.restore()
  }

  // Handle text input with color
  const handleTextChange = (e) => {
    const newText = e.target.value
    setCurrentText(newText)
    
    
    // Split into lines and only preserve colors for lines that exist
    const lines = newText.split('\n')
    if (lines.length === 0) {
      setDraftLines([])
      return
    }
    const newLines = lines.map((text, index) => ({
      text,
      color: index < draftLines.length ? draftLines[index].color : fontColor
    }))
    
    setDraftLines(newLines)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1000
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    drawCanvas(ctx, canvas.width, canvas.height, draftLines, scale, baseFontSize)
  }, [draftLines, scale, baseFontSize, backgroundColor])

  const downloadImage = () => {
    const offscreen = document.createElement('canvas')
    const multiplier = 2
    offscreen.width = 1000 * multiplier
    offscreen.height = 1000 * multiplier
    const ctx = offscreen.getContext('2d')
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, offscreen.width, offscreen.height)
    drawCanvas(ctx, offscreen.width, offscreen.height, draftLines, scale, baseFontSize)
    const dataURL = offscreen.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = "public-draft-hq.png"
    a.click()
  }

  return (
    <>
      <Head>
        <title>Public Draft Composer</title>
        <meta name="description" content="Compose a public draft" />
      </Head>
      <main style={{ padding: 20 }}>
        <h1>Public Draft Composer</h1>
        <h2 className={styles.description}>Compose a public draft</h2>
        <textarea
          value={currentText}
          onChange={handleTextChange}
          placeholder="Enter your draft text here..."
          rows={6}
          style={{ width: "100%", marginBottom: 20, fontSize: 16, padding: 10 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <label>
            Scale: {scale}
            <input type="range" min="0.05" max="10" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          </label>
          <label>
            Font Color: 
            <input 
              type="color" 
              value={fontColor} 
              onChange={(e) => setFontColor(e.target.value)} 
              style={{ marginLeft: 10, verticalAlign: 'middle' }} 
            />
          </label>
          <label>
            Background Color: 
            <input 
              type="color" 
              value={backgroundColor} 
              onChange={(e) => setBackgroundColor(e.target.value)} 
              style={{ marginLeft: 10, verticalAlign: 'middle' }} 
            />
          </label>
        </div>
        <canvas 
          ref={canvasRef} 
          width={1000} 
          height={1000} 
          style={{ border: "1px solid #333", display: "block", marginBottom: 20 }}
        ></canvas>
        <button onClick={downloadImage}>Download</button>
      </main>
    </>
  )
}
