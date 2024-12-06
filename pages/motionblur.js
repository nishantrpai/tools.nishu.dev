// input an image and apply motion blur effect
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function MotionBlur() {
  const [image, setImage] = useState(null)
  const [blurAmount, setBlurAmount] = useState(20) // Controls blur intensity
  const [steps, setSteps] = useState(15) // Controls the number of steps
  const [angle, setAngle] = useState(0) // Angle of motion blur in degrees

  useEffect(() => {
    if (image) {
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = URL.createObjectURL(image)
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Save the current context state
        ctx.save()
        
        // Translate to center for rotation
        ctx.translate(canvas.width/2, canvas.height/2)
        ctx.rotate(angle * Math.PI / 180)
        ctx.translate(-canvas.width/2, -canvas.height/2)
        
        // Draw multiple semi-transparent copies of the image
        const steps = 15
        const alpha = 1 / steps
        
        for(let i = 0; i < steps; i++) {
          const offset = (i - steps/2) * (blurAmount/steps)
          ctx.globalAlpha = alpha
          ctx.drawImage(img, offset, 0, img.width, img.height)
        }
        
        // Restore the context state
        ctx.restore()
      }
    }
  }, [image, blurAmount, angle, steps])

  return (
    <>
      <Head>
        <title>Motion Blur</title>
        <meta name="description" content="Apply motion blur effect to an image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Motion Blur</h1>
        <h2 className={styles.description}>Apply motion blur effect to an image</h2>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <div>
          <label>Blur Amount: {blurAmount}</label>
          <input 
            type="range" 
            min={1} 
            max={100} 
            value={blurAmount} 
            onChange={(e) => setBlurAmount(parseInt(e.target.value))} 
          />
        </div>
        <div>
          <label>Steps: {steps}</label>
          <input 
            type="range" 
            min={1} 
            max={100} 
            value={steps} 
            onChange={(e) => setSteps(parseInt(e.target.value))} 
          />
        </div>
        <div>
          <label>Angle: {angle}°</label>
          <input 
            type="range" 
            min={0} 
            max={360} 
            value={angle} 
            onChange={(e) => setAngle(parseInt(e.target.value))} 
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <img 
            src={image ? URL.createObjectURL(image) : ''} 
            alt="" 
            style={{ objectFit: 'cover', width: '100%', maxWidth: 500, height: 'auto' }} 
          />
          <canvas id="canvas" style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const a = document.createElement('a')
          a.href = canvas.toDataURL()
          a.download = 'motion-blur.png'
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}
