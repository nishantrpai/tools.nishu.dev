// add paper noise effect to an image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function Paperize() {
  const [image, setImage] = useState(null)
  const [noiseAmount, setNoiseAmount] = useState(40)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef(null)

  function applyPaperNoise(ctx, width, height, amount) {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // random grain value per pixel
      const grain = (Math.random() - 0.5) * amount

      // apply grain with a slight warm paper tint bias
      data[i] = Math.min(255, Math.max(0, data[i] + grain + amount * 0.05))
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain + amount * 0.03))
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain))
    }

    ctx.putImageData(imageData, 0, 0)
  }

  useEffect(() => {
    if (!image || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = URL.createObjectURL(image)
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      applyPaperNoise(ctx, img.width, img.height, Number(noiseAmount))
    }
  }, [image, noiseAmount])

  const loadFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    loadFile(file)
  }, [loadFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = `paperized-${Date.now()}.png`
    a.click()
  }

  return (
    <>
      <Head>
        <title>Paperize</title>
        <meta name="description" content="Add paper noise effect to an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: 1200, padding: '0 20px' }}>
        <h1>Paperize</h1>
        <h2 className={styles.description}>Add paper noise to your image</h2>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${isDragging ? '#eee' : '#555'}`,
            borderRadius: 8,
            padding: '30px 20px',
            textAlign: 'center',
            marginBottom: 16,
            cursor: 'pointer',
            background: isDragging ? '#1a1a1a' : 'transparent',
            transition: 'all 0.2s',
          }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <p style={{ color: '#888', margin: 0 }}>
            {image ? image.name : 'Drop image here or click to upload'}
          </p>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => loadFile(e.target.files[0])}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <label>Noise: {noiseAmount}</label>
          <input
            type="range"
            min={1}
            max={200}
            value={noiseAmount}
            onChange={(e) => setNoiseAmount(e.target.value)}
          />
        </div>

        {image && (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <p style={{ color: '#888', marginBottom: 6 }}>Original</p>
              <img
                src={URL.createObjectURL(image)}
                alt="original"
                style={{ maxWidth: 500, width: '100%', height: 'auto' }}
              />
            </div>
            <div>
              <p style={{ color: '#888', marginBottom: 6 }}>Paperized</p>
              <canvas
                ref={canvasRef}
                style={{ maxWidth: 500, width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={handleDownload} disabled={!image}>Download</button>
        </div>
      </main>
    </>
  )
}
