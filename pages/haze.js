import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function MotionEffect() {
  const [image, setImage] = useState(null)
  const [hazeAmount, setHazeAmount] = useState(5)
  const [ghostAmount, setGhostAmount] = useState(5)
  const [trailAmount, setTrailAmount] = useState(5)
  const [trailOpacity, setTrailOpacity] = useState(0.5)
  const [hazeDirection, setHazeDirection] = useState('left')
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (image) {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        // Set canvas dimensions based on scale
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        // Clear canvas and draw scaled image
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Apply motion haze effect
        ctx.globalAlpha = trailOpacity
        // Use ghosting and motion trails based on ghostAmount and trailAmount
        for (let i = 1; i <= ghostAmount; i++) {
          ctx.drawImage(canvas, i * (hazeDirection === 'left' ? 1 : -1), 0, canvas.width - i, canvas.height, 0, 0, canvas.width - i, canvas.height)
        }
        for (let j = 1; j <= trailAmount; j++) {
          ctx.drawImage(canvas, j * (hazeDirection === 'left' ? 1 : -1), 0, canvas.width - j, canvas.height, 0, 0, canvas.width - j, canvas.height)
        }
        ctx.globalAlpha = 1.0
      }
    }
  }, [image, hazeAmount, ghostAmount, trailAmount, trailOpacity, hazeDirection, scale])

  const downloadImage = () => {
    const canvas = document.getElementById('canvas')
    const a = document.createElement('a')
    a.href = canvas.toDataURL()
    a.download = 'haze_effect.png'
    a.click()
  }

  return (
    <>
      <Head>
        <title>Motion Effect</title>
        <meta name="description" content="Add motion haze effect to your images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Motion Effect</h1>
        <h2 className={styles.description}>Add motion haze effect to your images</h2>
        

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          {/* <img 
            src={image ? URL.createObjectURL(image) : ''} 
            alt="" 
            style={{ objectFit: 'cover', width: '100%', maxWidth: 500, height: 'auto' }} 
          /> */}
          <canvas 
            id="canvas" 
            style={{ width: '100%', maxWidth: 500, height: 'auto' }} 
          />
        </div>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        
        <div>
          <label>Haze Amount: {hazeAmount}</label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            value={hazeAmount} 
            onChange={(e) => setHazeAmount(parseInt(e.target.value))} 
            style={{ display: 'block' }}
          />
        </div>
        
        <div>
          <label>Ghost Amount: {ghostAmount}</label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            value={ghostAmount} 
            onChange={(e) => setGhostAmount(parseInt(e.target.value))} 
            style={{ display: 'block' }}
          />
        </div>

        <div>  
          <label>Trail Amount: {trailAmount}</label>
          <input 
            type="range" 
            min={0} 
            max={100} 
            value={trailAmount} 
            onChange={(e) => setTrailAmount(parseInt(e.target.value))} 
            style={{ display: 'block' }}
          />
        </div>

        <div>
          <label>Trail Opacity: {trailOpacity}</label>
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01}
            value={trailOpacity} 
            onChange={(e) => setTrailOpacity(parseFloat(e.target.value))} 
            style={{ display: 'block' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexDirection: 'column', alignItems: 'flex-start' }}>
          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={downloadImage}>Download</button>
        </div>
      </main>
    </>
  )
}
