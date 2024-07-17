// add higher hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherHat() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(104)
  const [scale, setScale] = useState(2.4)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)

  const higherHat = '/highertm.svg'

  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, offsetX, offsetY, imgWidth * scale, imgHeight * scale)
      const higher = new Image()
      higher.src = higherHat
      higher.onload = () => {
        context.drawImage(higher, 800, 120, higher.width * 2, higher.height * 2)
        context.closePath()
      }
      // if (hatType === 0)
      //   hat.src = higherHat
      // else if (hatType === 1)
      //   hat.src = higherHat2
      // else if (hatType === 2)
      //   hat.src = higherHat3

      // hat.onload = () => {
      //   context.translate(offsetX, offsetY)
      //   context.rotate(offsetTheta * Math.PI / 180)
      //   context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
      //   context.closePath()
      // }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType])

  return (
    <>
      <Head>
        <title>Higher Banner</title>
        <meta name="description" content="Higher Banner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Banner
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Make your own higher banner
        </span>

        {/* upload photo */}
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(0)
              setOffsetY(104)
              setScale(2.4)
              setOffsetTheta(0)
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
            Offset X
          </label>
          <input type="range" min={-(imgWidth * 1.5)} max={(imgWidth * 1.5)} value={offsetX} onChange={(e) => setOffsetX(e.target.value)} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-(imgHeight * 1.5)} max={(imgHeight * 1.5)} value={offsetY} onChange={(e) => setOffsetY(e.target.value)} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.01} value={scale} onChange={(e) => setScale(e.target.value)} />
          <label>
            Rotate
          </label>
          <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(e.target.value)} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `higherbanner-${Date.now()}.png`
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