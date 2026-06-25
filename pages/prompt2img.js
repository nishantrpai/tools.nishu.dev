import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

const CANVAS_ASPECT = 600 / 900 // 3:2

function drawCanvas(ctx, prompt, mode) {
  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height
  const padding = Math.round(canvasWidth * 0.022) // ~20px at base width

  const background = mode === 'dark' ? '#000' : '#fff'
  const textColor = mode === 'dark' ? '#e8e8e8' : '#333333'

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  const textToRender = prompt.length ? prompt : 'Paste your prompt here and render it as an image.'
  const lines = textToRender.split('\n')

  // Auto-scale font so all lines fit within the canvas.
  // Start at the largest size that fits the height, then shrink only if a line is too wide.
  const availableWidth = canvasWidth - padding * 2
  const availableHeight = canvasHeight - padding * 2
  let fontSize = Math.max(8, Math.floor(availableHeight / (lines.length * 1.4)))
  let lineHeight = fontSize * 1.4
  while (fontSize > 8) {
    ctx.font = `${fontSize}px "Monaco", "SF Mono", "Courier New", monospace`
    lineHeight = fontSize * 1.4
    const maxLineWidth = Math.max(...lines.map((l) => (l.length ? ctx.measureText(l).width : 0)))
    if (maxLineWidth <= availableWidth) break
    fontSize--
  }

  ctx.fillStyle = prompt.length ? textColor : (mode === 'dark' ? '#666' : '#999')
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'

  lines.forEach((line, i) => {
    ctx.fillText(line, padding, padding + i * lineHeight)
  })
}

export default function Prompt2Img() {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('dark')
  const [status, setStatus] = useState('Ready')
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [canvasDims, setCanvasDims] = useState({ width: 900, height: Math.round(900 * CANVAS_ASPECT) })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width)
      if (width > 0) setCanvasDims({ width, height: Math.round(width * CANVAS_ASPECT) })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    drawCanvas(ctx, prompt, mode)
  }, [prompt, mode, canvasDims])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const off = document.createElement('canvas')
    off.width = canvas.width * 2
    off.height = canvas.height * 2
    const offCtx = off.getContext('2d')
    if (!offCtx) return

    drawCanvas(offCtx, prompt, mode)

    off.toBlob((blob) => {
      if (!blob) return
      const link = document.createElement('a')
      link.download = `prompt-image-${Date.now()}.png`
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
      setStatus('Image downloaded')
    }, 'image/png')
  }

  const copyImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const off = document.createElement('canvas')
    off.width = canvas.width * 2
    off.height = canvas.height * 2
    const offCtx = off.getContext('2d')
    if (!offCtx) return

    drawCanvas(offCtx, prompt, mode)

    off.toBlob(async (blob) => {
      if (!blob) return
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setStatus('Image copied to clipboard')
      } catch (error) {
        setStatus('Failed to copy image')
      }
    }, 'image/png')
  }

  const shareImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (navigator.canShare && navigator.canShare({ files: [] })) {
      const canvas = canvasRef.current
      if (!canvas) return
      const off = document.createElement('canvas')
      off.width = canvas.width * 2
      off.height = canvas.height * 2
      const offCtx = off.getContext('2d')
      if (!offCtx) return

      drawCanvas(offCtx, prompt, mode)

      off.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'prompt-image.png', { type: 'image/png' })
        try {
          await navigator.share({ files: [file], title: 'Prompt Image', text: (prompt || '').slice(0, 120) || 'Prompt image' })
          setStatus('Shared successfully')
        } catch (error) {
          setStatus('Share canceled or failed')
        }
      }, 'image/png')
      return
    }

    downloadImage()
    setStatus('Share not supported — downloaded image instead')
  }

  return (
    <>
      <Head>
        <title>Prompt to Image</title>
        <meta name="description" content="Paste a prompt, render text in mono font on canvas, and share it." />
      </Head>

      <main>
        <h1>Prompt to Image</h1>
        <p>Paste your prompt into the textarea, render it as a monospace canvas image, and share it with anyone.</p>

        <div>
          <button type="button" onClick={() => setMode('dark')}>Dark mode</button>
          <button type="button" onClick={() => setMode('light')}>Light mode</button>
        </div>

        <label>Prompt</label>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Paste or type your prompt here"
          rows={12}
        />

        <div>
          <button type="button" onClick={downloadImage}>Download PNG</button>
          <button type="button" onClick={copyImage}>Copy Image</button>
          <button type="button" onClick={shareImage}>Share Image</button>
        </div>

        <p>{status}</p>

        <div ref={containerRef} style={{ width: '100%' }}>
          <canvas
            ref={canvasRef}
            width={canvasDims.width}
            height={canvasDims.height}
            style={{ display: 'block', border: '1px solid #333', borderRadius: 5 }}
          />
        </div>
      </main>
    </>
  )
}
