// add black and white filter on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function BWFilter() {
  const [image, setImage] = useState(null)
  const [blur, setBlur] = useState(0)
  const [brightness, setBrightness] = useState(100)

  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = image.width
      canvas.height = image.height
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * (brightness / brightness)
        data[i + 1] = data[i + 1] * (brightness / brightness)
        data[i + 2] = data[i + 2] * (brightness / brightness)
      }
      // apply gaussian blur using canvas filter
      context.filter = `blur(${blur}px) brightness(${brightness}%)`
      context.putImageData(imageData, 0, 0)

      // create glow effect by adding more blur and blending with the original image
      context.globalAlpha = 0.6
      context.drawImage(canvas, 0, 0)
      context.filter = 'blur(5px)'
      context.drawImage(canvas, 0, 0)

      // update the state with the modified canvas
      context.closePath()
    }
  }, [image, blur, brightness])

  return (
    <>
      <Head>
        <title>Dreamy Effect</title>
        <meta name="description" content="Dreamy Effect" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Dreamy Effect
        </h1>
        <h2 className={styles.description}>
          Add dreamy effect on any image
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
            <canvas id="canvas" style={{ width: '100%', minHeight: 500, border: '1px solid #333', borderRadius: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', margin: 'auto', gap: 20 }}>
              <label>Blur</label>
              <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(e.target.value)} />
              <label>Brightness</label>
              <input type="range" min="0" max="500" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
            </div>
          </div>
          <button onClick={() => {
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = `dreamy-${Date.now()}.png`
            a.click()
          }} style={{
            marginTop: 20,
          }}>Download</button>
        </span>
      </main>
    </>
  )
}