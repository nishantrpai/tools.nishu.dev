import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function Spotlight() {
  const [image, setImage] = useState(null)
  const [spotlightX, setSpotlightX] = useState(50) // Percentage across width
  const [spotlightY, setSpotlightY] = useState(50) // Percentage across height
  const [spotlightSize, setSpotlightSize] = useState(30)
  const [brightness, setBrightness] = useState(0.3) // Darkness outside spotlight
  const [spotlightColor, setSpotlightColor] = useState('#FFFFFF') // Default white spotlight
  const canvasRef = useRef(null)

  const applySpotlight = (ctx, img) => {
    const width = img.width
    const height = img.height

    // Clear and draw original image
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0)

    // Create radial gradient for spotlight effect
    const centerX = (spotlightX / 100) * width
    const centerY = (spotlightY / 100) * height
    const radius = (spotlightSize / 100) * Math.min(width, height)
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    )
    
    gradient.addColorStop(0, `${spotlightColor}00`) // Transparent spotlight color at center
    gradient.addColorStop(1, `rgba(0, 0, 0, ${1 - brightness})`) // Dark at edges

    // Apply spotlight mask
    ctx.fillStyle = gradient
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillRect(0, 0, width, height)
  }

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        applySpotlight(ctx, img)
      }
    }
  }, [image, spotlightX, spotlightY, spotlightSize, brightness, spotlightColor])

  return (
    <>
      <Head>
        <title>Spotlight Effect</title>
        <meta name="description" content="Add spotlight effect to images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Spotlight Effect</h1>
        <h2 className={styles.description}>Add a spotlight effect to your image</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        
        <canvas 
          ref={canvasRef}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div>
          <label>Spotlight X Position: {spotlightX}%</label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            value={spotlightX} 
            onChange={(e) => setSpotlightX(Number(e.target.value))} 
          />
        </div>

        <div>
          <label>Spotlight Y Position: {spotlightY}%</label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            value={spotlightY} 
            onChange={(e) => setSpotlightY(Number(e.target.value))} 
          />
        </div>

        <div>
          <label>Spotlight Size: {spotlightSize}%</label>
          <input 
            type="range" 
            min={1} 
            max={100} 
            value={spotlightSize} 
            onChange={(e) => setSpotlightSize(Number(e.target.value))} 
          />
        </div>

        <div>
          <label>Background Brightness: {Math.round(brightness * 100)}%</label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            value={brightness * 100} 
            onChange={(e) => setBrightness(Number(e.target.value) / 100)} 
          />
        </div>

        <div>
          <label>Spotlight Color: </label>
          <input 
            type="color" 
            value={spotlightColor} 
            onChange={(e) => setSpotlightColor(e.target.value)} 
          />
        </div>


        <button onClick={() => {
          setImage(null)
        }}>Clear</button>

        <button onClick={() => {
          const canvas = canvasRef.current
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'spotlight_effect.png'
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}
