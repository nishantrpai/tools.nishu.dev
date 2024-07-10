// add black and white filter on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function BWFilter() {
  const [image, setImage] = useState(null)
  
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
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg
        data[i + 1] = avg
        data[i + 2] = avg
      }
      context.putImageData(imageData, 0, 0)
      context.closePath()
    }
  }, [image])

  return (
    <>
      <Head>
        <title>Black and White Filter</title>
        <meta name="description" content="Black and White Filter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Black and White Filter
        </h1>
        <h2 className={styles.description}>
          Add black and white filter on any image
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
          <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
          {image && <img src={image.src} alt="bw" />}
          <canvas id="canvas"  />
          </div>
          <button onClick={() => {
            const dataURL = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = dataURL
            a.download = 'bw.png'
            a.click()
          }} style={{
            marginTop: 20,
          }}>Download</button>
        </span>
      </main>
    </>
  )
}