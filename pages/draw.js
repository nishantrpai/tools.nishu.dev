// simple tool for sketching and copying that image to clipboard
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Draw() {
  const [drawing, setDrawing] = useState(false)
  const [canvas, setCanvas] = useState(null)
  const [context, setContext] = useState(null)
  const [image, setImage] = useState(null)
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    setCanvas(canvas)
    setContext(context)
  }, [])

  const startDrawing = (event) => {
    setDrawing(true)
    context.beginPath()
    // background
    context.strokeStyle = 'black'
    context.lineWidth = 4
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
  }

  const stopDrawing = () => {
    setDrawing(false)
  }

  const restCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const draw = (event) => {
    if (!drawing) return
    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    context.stroke()
  }

  const copyToClipboard = () => {
    const dataURL = canvas.toDataURL('image/png')
    const img = new Image()
    img.src = dataURL
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      canvas.style.background = 'white'
      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]).then(() => {
          setCopy(true)
          setTimeout(() => {
            setCopy(false)
          }, 3000)
        })
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Draw</title>
        <meta name="description" content="Simple tool for sketching and copying that image to clipboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <a href='/' className={styles.home}>🏠</a>
        <h1 className={styles.title}>
          Draw
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Simple tool for sketching and copying that image to clipboard
        </span>
        <canvas
          id="canvas"
          width="800"
          height="600"
          style={{ border: '1px solid white', background: 'white' }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onPointerDown={startDrawing}
          onPointerUp={stopDrawing}
        ></canvas>
        <button onClick={restCanvas}>Reset</button>
        <button onClick={copyToClipboard}>Copy to clipboard</button>
        {copy && <p>Copied to clipboard</p>}
      </main>
    </div>
  )
}
