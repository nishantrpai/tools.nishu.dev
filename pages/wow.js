import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'

export default function Wow() {
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const canvasRef = useRef(null)

  const wowImage = '/wow.png'

  useEffect(() => {
    if (image) {
      drawImage()
    }
  }, [image])

  const drawImage = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    canvas.width = imgWidth
    canvas.height = imgHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, image.width, image.height)

    const wow = new Image()
    wow.src = wowImage
    wow.crossOrigin = 'anonymous'

    wow.onload = () => {
      const scale = Math.min(imgWidth / wow.width, imgHeight / wow.height) * 0.75;
      const wowWidth = wow.width * scale
      const wowHeight = wow.height * scale
      const x = (imgWidth - wowWidth) / 2
      const y = (imgHeight - wowHeight) / 2

      context.drawImage(wow, x, y, wowWidth, wowHeight)
    }
  }

  return (
    <>
      <Head>
        <title>Wow</title>
        <meta name="description" content="Add !!! to your image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Wow</h1>
        <h2 className={styles.description}>Add !!! to your image</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: 'auto' }}>
          <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 500, height: 'auto' }} />
        </div>

        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />

        <button onClick={() => {
          const canvas = canvasRef.current
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `wow-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
      </main>
    </>
  )
}
