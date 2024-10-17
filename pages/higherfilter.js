import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function HigherFilter() {
  const [image, setImage] = useState(null)
  const [greenIntensity, setGreenIntensity] = useState(214)
  const canvasRef = useRef(null)
  
  useEffect(() => {
    if (image) {
      applyFilter()
    }
  }, [image, greenIntensity])

  const applyFilter = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)

    // Create an overlay rectangle
    context.fillStyle = `rgba(84, ${greenIntensity}, 86, 0.5)`
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <>
      <Head>
        <title>Higher Filter</title>
        <meta name="description" content="Higher Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Higher Filter</h1>
        <h2 className={styles.description}>Add higher filter on any image</h2>
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
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="greenIntensity">Green Intensity: </label>
          <input
            type="range"
            id="greenIntensity"
            min="100"
            max="250"
            value={greenIntensity}
            onChange={(e) => setGreenIntensity(Number(e.target.value))}
          />
          <span>{greenIntensity}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>
        <button onClick={() => setImage(null)}>Clear</button>
        <button onClick={() => {
          const canvas = canvasRef.current
          const a = document.createElement('a')
          a.href = canvas.toDataURL('image/png')
          a.download = 'higher_filter.png'
          a.click()
        }}>Download</button>
      </main>
    </>
  )
}
