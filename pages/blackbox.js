import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function XCopyFilter() {
  // Keep only necessary state
  const [image, setImage] = useState(null)
  const [reverseSteps, setReverseSteps] = useState(2)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, reverseSteps])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height

    // Draw the full image into the canvas first.
    context.drawImage(image, 0, 0, image.width, image.height)
    
    // Get image data from the drawn image
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Create a new ImageData object to draw our jittered pixels.
    const newImageData = context.createImageData(canvas.width, canvas.height)
    const newData = newImageData.data
    
    // Determine maximum jitter in pixels – scales with reverseSteps.
    const maxJitter = (reverseSteps / 10) * 5
    
    // For each pixel, sample from a nearby (jittered) coordinate.
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        // Random jitter offsets for x and y.
        const dx = Math.round((Math.random() - 0.5) * 2 * maxJitter)
        const dy = Math.round((Math.random() - 0.5) * 2 * maxJitter)
        
        // Clamp the source coordinates within canvas bounds.
        const sx = Math.min(canvas.width - 1, Math.max(0, x + dx))
        const sy = Math.min(canvas.height - 1, Math.max(0, y + dy))
        
        // Determine the source and destination index.
        const srcIndex = (sy * canvas.width + sx) * 4
        const destIndex = (y * canvas.width + x) * 4
        
        // Copy pixel from the jittered position.
        newData[destIndex] = data[srcIndex]       // Red
        newData[destIndex + 1] = data[srcIndex + 1]   // Green
        newData[destIndex + 2] = data[srcIndex + 2]   // Blue
        newData[destIndex + 3] = 255                  // Alpha
      }
    }
    
    // Put the jittered image data back onto the canvas.
    context.putImageData(newImageData, 0, 0)
  }

  return (
    <>
      <Head>
        <title>Black Box</title>
        <meta name="description" content="See how black box works" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Black box</h1>
        <h2 className={styles.description}>See how black box works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas
            id="canvas"
            style={{ width: '100%', maxWidth: 500, height: 'auto' }}
          />
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

          <div style={{ marginTop: '20px', width: '100%' }}>
            <label htmlFor="reverseSteps">Generation Steps Back: </label>
            <input
              type="range"
              id="reverseSteps"
              min="0"
              max="5000"
              value={reverseSteps}
              onChange={(e) => setReverseSteps(Number(e.target.value))}
            />
            <input 
              type="number" 
              value={reverseSteps} 
              style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} 
              onChange={(e) => setReverseSteps(Number(e.target.value))} 
            />
          </div>

          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'reverse-diffusion.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
