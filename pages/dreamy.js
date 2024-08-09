import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function LensFlareEffect() {
  const [image, setImage] = useState(null)
  const [blur, setBlur] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [flareX, setFlareX] = useState(50) // percentage of canvas width
  const [flareY, setFlareY] = useState(50) // percentage of canvas height
  const [flareBrightness, setFlareBrightness] = useState(50) // opacity of lens flare

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')

    if (image) {
      canvas.width = image.width
      canvas.height = image.height
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      
      // Apply initial filters
      context.filter = `blur(${blur}px) brightness(${brightness}%)`
      context.drawImage(image, 0, 0, image.width, image.height)

      // Create glow effect by adding more blur and blending with the original image
      context.globalAlpha = 0.6
      context.drawImage(canvas, 0, 0)
      context.filter = 'blur(5px)'
      context.drawImage(canvas, 0, 0)

      // Create lens flare effect
      context.globalAlpha = 1.0 // Reset alpha to full opacity for the lens flare
      context.globalCompositeOperation = 'lighter'
      const x = (flareX / 100) * canvas.width
      const y = (flareY / 100) * canvas.height

      const gradient = context.createRadialGradient(
        x,              // x position
        y,              // y position
        0,              // inner radius
        x,              // x position
        y,              // y position
        canvas.width / 2 // outer radius
      )

      const opacity = flareBrightness / 100;
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.5 * opacity})`)
      gradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.2 * opacity})`)
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.1 * opacity})`)
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

      context.fillStyle = gradient
      context.beginPath()
      context.arc(x, y, canvas.width / 2, 0, Math.PI * 2, false)
      context.fill()
      context.globalCompositeOperation = 'source-over'
    }
  }, [image, blur, brightness, flareX, flareY, flareBrightness])

  return (
    <>
      <Head>
        <title>Lens Flare Effect</title>
        <meta name="description" content="Lens Flare Effect" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Lens Flare Effect
        </h1>
        <h2 className={styles.description}>
          Add lens flare effect to any image
        </h2>
        <span style={{
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result
              img.onload = () => {
                setImage(img)
              }
            }
            reader.readAsDataURL(file)
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
            <canvas id="canvas" style={{ width: '100%', height: '100%', border: '1px solid #333', borderRadius: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', margin: 'auto', gap: 20 }}>
              <label>Blur</label>
              <input type="range" min="0" max="50" step={0.5} value={blur} onChange={(e) => setBlur(e.target.value)} />
              <label>Brightness</label>
              <input type="range" min="0" max="500" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
              <label>Flare X Position</label>
              <input type="range" min="0" max="100" value={flareX} onChange={(e) => setFlareX(e.target.value)} />
              <label>Flare Y Position</label>
              <input type="range" min="0" max="100" value={flareY} onChange={(e) => setFlareY(e.target.value)} />
              <label>Flare Brightness</label>
              <input type="range" min="0" max="100" value={flareBrightness} onChange={(e) => setFlareBrightness(e.target.value)} />
            </div>
          </div>
          <button onClick={() => {
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = `lens-flare-${Date.now()}.png`
            a.click()
          }} style={{
            marginTop: 20,
          }}>Download</button>
        </span>
      </main>
    </>
  )
}
