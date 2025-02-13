import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function CyberpunkFilter() {
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the original image
    context.drawImage(image, 0, 0, image.width, image.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // STEP 1: Apply a dark, high contrast transformation
    for (let i = 0; i < data.length; i += 4) {
      // Darken and boost contrast
      data[i] = Math.min(255, Math.max(0, (data[i] - 50) * .75))
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 50) * .75))
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 50) * 1))
    }

    // Put the high contrast image back
    context.putImageData(imageData, 0, 0)

    // STEP 2: Detect edges to add a deep blue neon glow
    // Create an offscreen canvas for the neon glow
    const edgeCanvas = document.createElement('canvas')
    edgeCanvas.width = canvas.width
    edgeCanvas.height = canvas.height
    const edgeCtx = edgeCanvas.getContext('2d')
    const edgeImageData = edgeCtx.createImageData(canvas.width, canvas.height)
    const edgeData = edgeImageData.data

    // Convert image to grayscale on the fly and compute Sobel operator
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = (y * canvas.width + x) * 4

        // Helper to get grayscale intensity at (x, y)
        const getGray = (col, row) => {
          const i = (row * canvas.width + col) * 4
          return (data[i] + data[i + 1] + data[i + 2]) / 3
        }

        const gx =
          -1 * getGray(x - 1, y - 1) +
           1 * getGray(x + 1, y - 1) +
          -2 * getGray(x - 1, y) +
           2 * getGray(x + 1, y) +
          -1 * getGray(x - 1, y + 1) +
           1 * getGray(x + 1, y + 1)
        const gy =
          -1 * getGray(x - 1, y - 1) +
          -2 * getGray(x, y - 1) +
          -1 * getGray(x + 1, y - 1) +
           1 * getGray(x - 1, y + 1) +
           2 * getGray(x, y + 1) +
           1 * getGray(x + 1, y + 1)
        const magnitude = Math.sqrt(gx * gx + gy * gy)

        // Threshold for edge detection
        if (magnitude > 0) {
          // Apply a deep blue neon glow (RGB: 0, 150, 255)
          edgeData[idx] = 0
          edgeData[idx + 1] = 150
          edgeData[idx + 2] = 255
          // Alpha proportional to the edge magnitude
          edgeData[idx + 3] = Math.min(255, magnitude * 2)
        } else {
          edgeData[idx + 3] = 0
        }
      }
    }
    edgeCtx.putImageData(edgeImageData, 0, 0)

    // Draw the neon glow on top using a light-blend effect
    context.globalCompositeOperation = 'lighter'
    // Slight blur for glow effect using shadow blur technique
    context.save()
    context.filter = 'blur(2px)'
    context.drawImage(edgeCanvas, 0, 0)
    context.restore()
    context.globalCompositeOperation = 'source-over'

    // STEP 3: Overlay a cracked glass texture for depth.
    // Ensure you have a cracked glass texture image available at '/cracked_glass.png'
    const crackedTexture = new Image()
    crackedTexture.src = '/cracked_glass.png'
    crackedTexture.onload = () => {
      context.globalAlpha = 0.3
      context.drawImage(crackedTexture, 0, 0, canvas.width, canvas.height)
      context.globalAlpha = 1.0

      // STEP 4: Apply a vignette to emphasize the center
      const vignetteGradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 4,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.2
      )
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
      context.fillStyle = vignetteGradient
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <>
      <Head>
        <title>Sea Filter</title>
        <meta name="description" content="Opensea Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Sea Filter</h1>
        <h2 className={styles.description}>Transform your images to opensea aesthetic</h2>
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
          <button onClick={() => setImage(null)}>Clear</button>
          <button onClick={() => {
            const canvas = document.getElementById('canvas')
            const a = document.createElement('a')
            a.href = canvas.toDataURL('image/png')
            a.download = 'sea.png'
            a.click()
          }}>Download</button>
        </div>
      </main>
    </>
  )
}
