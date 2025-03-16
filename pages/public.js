import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default function PublicDraft() {
  const [draftText, setDraftText] = useState("")
  const [scale, setScale] = useState(1)
  const [baseFontSize, setBaseFontSize] = useState(48)
  const canvasRef = useRef(null)

  // Updated helper function with uniform font size calculations
  const drawCanvas = (ctx, width, height, text, scaleFactor, fontSize) => {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)
    ctx.save()
    ctx.scale(scaleFactor, scaleFactor)
    const effectiveWidth = width / scaleFactor
    const effectiveHeight = height / scaleFactor
    const margin = 20
    const availableWidth = effectiveWidth - margin * 2
    const availableHeight = effectiveHeight - margin * 2
    const lineHeightMultiplier = 1.2

    // Process lines to uppercase
    const lines = text.split('\n').map(line => line.toUpperCase())
    // Measure each line at base font size to determine maximum width
    ctx.font = `bold ${fontSize}px Arial`
    const measuredWidths = lines.map(line => ctx.measureText(line).width)
    const maxWidth = measuredWidths.length ? Math.max(...measuredWidths) : 0

    // Determine scaling factors for width and height (allow up or down scaling)
    const scaleWidth = maxWidth > 0 ? (availableWidth / maxWidth) : 1
    const scaleHeight = lines.length > 0 ? (availableHeight / (lines.length * fontSize * lineHeightMultiplier)) : 1
    const factor = Math.min(scaleWidth, scaleHeight)
    const uniformFontSize = fontSize * factor

    // Compute total height needed
    const totalHeight = lines.length * uniformFontSize * lineHeightMultiplier
    let startY = (effectiveHeight - totalHeight) / 2 + uniformFontSize * lineHeightMultiplier / 2

    // Draw each line with uniform font size
    lines.forEach(line => {
      ctx.font = `bold ${uniformFontSize}px Arial`
      ctx.fillStyle = "#000000"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(line, effectiveWidth / 2, startY)
      startY += uniformFontSize * lineHeightMultiplier
    })
    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1000
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    drawCanvas(ctx, canvas.width, canvas.height, draftText, scale, baseFontSize)
  }, [draftText, scale, baseFontSize])

  const downloadImage = () => {
    const offscreen = document.createElement('canvas')
    const multiplier = 2
    offscreen.width = 1000 * multiplier
    offscreen.height = 1000 * multiplier
    const ctx = offscreen.getContext('2d')
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, offscreen.width, offscreen.height)
    drawCanvas(ctx, offscreen.width, offscreen.height, draftText, scale, baseFontSize)
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
        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder="Enter your draft text here..."
          rows={6}
          style={{ width: "100%", marginBottom: 20, fontSize: 16, padding: 10 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <label>
            Scale: {scale}
            <input type="range" min="0.05" max="10" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
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
