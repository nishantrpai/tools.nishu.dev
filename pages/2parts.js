import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const HalfCombine = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [percentage, setPercentage] = useState(50)
  const [horizontal, setHorizontal] = useState(true)

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
      if(!canvas || !ctx) return

      if( horizontal ) {
      const maxHeight = Math.max(image1.height, image2.height)
      const width1 = image1.width * (percentage / 100)
      const width2 = image2.width * (1 - (percentage / 100))
      canvas.width = width1 + width2
      canvas.height = maxHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // const width1 = (canvas.width * percentage) / 100
      // const width2 = canvas.width - width1
      ctx.drawImage(image1, 0, 0, width1, maxHeight, 0, 0, width1, maxHeight)
      ctx.drawImage(image2, width1, 0, width2, maxHeight, width1, 0, width2, maxHeight)
      } else {
        const maxWidth = Math.max(image1.width, image2.width)
        const height1 = image1.height * (percentage / 100)
        const height2 = image2.height * (1 - (percentage / 100))
        canvas.width = height1 + height2
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // const height1 = (canvas.height * percentage) / 100
        // const height2 = canvas.height - height1
        ctx.drawImage(image1, 0, 0, maxWidth, height1, 0, 0, maxWidth, height1)
        ctx.drawImage(image2, 0, height1, maxWidth, height2, 0, height1, maxWidth, height2)
      }
    }
  }, [image1, image2, percentage, horizontal])

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
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <input type="checkbox" checked={horizontal} onChange={(e) => setHorizontal(e.target.checked)} />
              <label>Horizontal</label>
            </div>
            <label>Percentage:</label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              style={{ width: '100px', margin: '10px 0', background: '#000', border: '1px solid #333', borderRadius: 5, padding: 5 }}
            />
            <canvas id="canvas" width={500} height={500} style={{width: '100%'}}></canvas>
            <button style={{  }} onClick={downloadImage}>Download</button>
          </div>
        </div>
      </main>
    </>
  )
}

export default HalfCombine