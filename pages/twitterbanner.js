import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function TwitterBanner() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = '#000'
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      context.save()
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate(rotation * Math.PI / 180)
      context.translate(-canvas.width / 2, -canvas.height / 2)
      
      context.drawImage(
        image, 
        offsetX + (canvas.width - imgWidth * scale) / 2, 
        offsetY + (canvas.height - imgHeight * scale) / 2, 
        imgWidth * scale, 
        imgHeight * scale
      )
      
      context.restore()
      context.closePath()
    }
  }, [image, offsetX, offsetY, scale, rotation, imgWidth, imgHeight])

  return (
    <>
      <Head>
        <title>Twitter Banner</title>
        <meta name="description" content="Twitter Banner Creator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Twitter Banner Creator
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Create your own Twitter banner
        </span>

        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(0)
              setOffsetY(0)
              setScale(1)
              setRotation(0)
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" width="1500" height="500" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <label>
            Move X
          </label>
          <input type="range" min={-1500} max={1500} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} />
          <label>
            Move Y
          </label>
          <input type="range" min={-1500} max={1500} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} />
          <label>
            Scale
          </label>
          <input type="range" min={0.1} max={3} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          <label>
            Rotate
          </label>
          <input type="range" min={-180} max={180} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `twitter-banner-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Banner
        </button>
      </main>
    </>
  )
}
