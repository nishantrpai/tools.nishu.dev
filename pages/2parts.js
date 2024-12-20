import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const HalfCombine = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [percentage, setPercentage] = useState(50)

  const handleImage1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage1(image)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImage2 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage2(image)
      }
    }
    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = `half-combined-image-${new Date().getTime()}.png`
    a.click()
  }

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    setCanvas(canvas)
    setCtx(ctx)
  }, [])

  useEffect(() => {
    if (image1 && image2) {
      const maxHeight = Math.max(image1.height, image2.height)
      canvas.height = maxHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const width1 = (canvas.width * percentage) / 100
      const width2 = canvas.width - width1
      ctx.drawImage(image1, 0, 0, width1, maxHeight, 0, 0, width1, maxHeight)
      ctx.drawImage(image2, width1, 0, width2, maxHeight, width1, 0, width2, maxHeight)
    }
  }, [image1, image2, percentage])

  return (
    <>
      <Head>
        <title>Combine two parts of an image</title>
        <meta name="description" content="Combine two parts of images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Combine two parts of an image
        </h1>

        <p className={styles.description}>
          Combine two parts of images
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="file" onChange={handleImage1} />
            <input type="file" onChange={handleImage2} />
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              style={{ width: '100px', margin: '10px 0' }}
            />
            <canvas id="canvas" width={500} height={500}></canvas>
            <button style={{ border: '1px solid #333' }} onClick={downloadImage}>Download Combined Image</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default HalfCombine