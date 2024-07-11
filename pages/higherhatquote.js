import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function HigherHat() {
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [offsetY, setOffsetY] = useState(60)
  const [scale, setScale] = useState(0.15)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)
  const [hatText, setHatText] = useState('HIGHER')
  const [hatFontSize, setHatFontSize] = useState(20)
  const [textX, setTextX] = useState(250) // X position of text relative to the hat
  const [textY, setTextY] = useState(230) // Y position of text relative to the hat
  const [textTheta, setTextTheta] = useState(0) // rotation of text

  const higherHat = '/higherhat_empty.png'

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const hat = new Image()
      hat.src = higherHat

      hat.onload = () => {
        context.save()
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(hat, 0, 0, hat.width * scale, hat.height * scale)

        context.font = `${hatFontSize}px Helvetica`
        context.fillStyle = '#000'
        context.textAlign = 'center'
        context.translate(textX, textY)
        context.rotate(textTheta * Math.PI / 180)
        context.fillText(hatText, 0, 0)
        
        context.restore()
      }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatText, hatFontSize, textX, textY, textTheta])

  return (
    <>
      <Head>
        <title>Higher Hat</title>
        <meta name="description" content="Higher Hat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Hat
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add your quotes on higher hat
        </span>

        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const img = new Image()
            img.src = reader.result
            img.onload = () => {
              setOffsetX(38)
              setOffsetY(60)
              setScale(0.15)
              setOffsetTheta(0)
              setImgWidth(img.width)
              setImgHeight(img.height)
              setImage(img)
            }
          }
          reader.readAsDataURL(file)
        }} />
        <canvas id="canvas" width="800" height="800" style={{
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
          <input type="range" min={-(imgWidth * 1.5)} max={(imgWidth * 1.5)} value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))} />
          <label>
            Offset Y
          </label>
          <input type="range" min={-(imgHeight * 1.5)} max={(imgHeight * 1.5)} value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} />
          <label>
            Scale
          </label>
          <input type="range" min={0} max={10} step={0.01} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
          <label>
            Rotate Hat
          </label>
          <input type="range" min={-360} max={360} value={offsetTheta} onChange={(e) => setOffsetTheta(parseInt(e.target.value))} />

          <label>
            Text
          </label>
          <input type="text" value={hatText} onChange={(e) => setHatText(e.target.value)} style={{
            padding: 10,
            background: '#000',
            border: '1px solid #333',
            borderRadius: 5,
          }} />

          <label>
            Font Size
          </label>
          <input type="range" min={10} max={250} value={hatFontSize} onChange={(e) => setHatFontSize(parseInt(e.target.value))} />

          <label>
            Text X
          </label>
          <input type="range" min={-500} max={500} value={textX} onChange={(e) => setTextX(parseInt(e.target.value))} />

          <label>
            Text Y
          </label>
          <input type="range" min={-500} max={500} value={textY} onChange={(e) => setTextY(parseInt(e.target.value))} />

          <label>
            Rotate Text
          </label>
          <input type="range" min={-360} max={360} value={textTheta} onChange={(e) => setTextTheta(parseInt(e.target.value))} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `higher-hat-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
        <div style={{ textAlign: 'center', marginTop: 20, color: '#777', fontSize: 12 }}>
          Higher hat by  <a href="https://warpcast.com/clfx.eth" style={{ color: '#fff', textDecoration: 'underline' }} target='_blank'>clfx</a>
        </div>
      </main>
    </>
  )
}
