// blend two images together using canvas in the browser
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

const BlendLayer = () => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [blendMode, setBlendMode] = useState('normal')
  const [opacity, setOpacity] = useState(1)
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  const handleImage1 = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.src = reader.result
      image.onload = () => {
        setImage1(image)
        console.log(getImageData(image))  
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImage2 = (e) => {
    const file = e.target.files[0]
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

  const handleBlendMode = (e) => {
    setBlendMode(e.target.value)
  }

  const handleOpacity = (e) => {
    setOpacity(e.target.value)
  }

  const getImageData = (image1) => {
    let image = image1;
    return {width: image.width, height: image.height}
  }

  const downloadImage = () => {
    // get higher resolution image
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.download = 'blended-image.png'
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
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = opacity
      ctx.globalCompositeOperation = blendMode
      ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
      ctx.drawImage(image2, 0, 0, canvas.width, canvas.height)
    }
  }, [image1, image2, blendMode, opacity])

  return (
    <div className={styles.container}>
      <Head>
        <title>Blend Layer</title>
        <meta name="description" content="Blend two images together using canvas in the browser" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Blend Layer
        </h1>

        <p className={styles.description}>
          Blend two images together
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px',}}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input type="file" onChange={handleImage1} />
            <input type="file" onChange={handleImage2} />
            <select onChange={handleBlendMode}>
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="hue">Hue</option>
              <option value="saturation">Saturation</option>
              <option value="color">Color</option>
              <option value="luminosity">Luminosity</option>
            </select>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={handleOpacity} />
            <canvas id="canvas" width={image1?.width || 500} height={image1?.height || 500}></canvas>

            <button style={{border: '1px solid #333'}} onClick={downloadImage}>Download</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlendLayer