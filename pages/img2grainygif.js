import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import gifshot from 'gifshot'

export default function GrainyGifs() {
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [noiseAmount, setNoiseAmount] = useState(50)
  const [frameCount, setFrameCount] = useState(10)

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, imgWidth, imgHeight)
      addGrainEffect(context, imgWidth, imgHeight, noiseAmount)
    }
  }, [image, imgWidth, imgHeight, noiseAmount])

  const addGrainEffect = (context, width, height, amount) => {
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * amount - amount / 2
      data[i] += noise
      data[i + 1] += noise
      data[i + 2] += noise
    }
    context.putImageData(imageData, 0, 0)
  }

  const downloadAsGif = async () => {
    setProcessing(true)
    const canvas = document.getElementById('canvas')

    const drawFrame = async () => {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = imgHeight
      const tempContext = tempCanvas.getContext('2d')
      tempContext.drawImage(image, 0, 0, imgWidth, imgHeight)
      addGrainEffect(tempContext, imgWidth, imgHeight, noiseAmount)
      return tempCanvas.toDataURL('image/png')
    }

    const gifFramesWithImages = await Promise.all(
      Array.from({ length: frameCount }).map(() => drawFrame())
    )

    gifshot.createGIF({
      gifWidth: imgWidth,
      gifHeight: imgHeight,
      images: gifFramesWithImages,
      frameDuration: 0.1,
    }, function (obj) {
      if (!obj.error) {
        const a = document.createElement('a')
        a.href = obj.image
        a.download = `grainy-${Date.now()}.gif`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setProcessing(false)
      }
    })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result
      img.onload = () => {
        setImage(img)
        setImgWidth(img.width)
        setImgHeight(img.height)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Head>
        <title>Grainy Gifs</title>
        <meta name="description" content="Add grainy effect to your gifs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Grainy Gifs
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add grainy effect to your gifs
        </span>
        
        <canvas id="canvas" width="800" height="800" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
          <label>
            Noise Amount
          </label>
          <input type="range" min={0} max={100} value={noiseAmount} onChange={(e) => setNoiseAmount(Number(e.target.value))} />
          <label>
            Frame Count
          </label>
          <input type="number" min={1} max={100} value={frameCount} onChange={(e) => setFrameCount(Number(e.target.value))} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `grainy-${Date.now()}.png`
          a.click()
        }} style={{
          marginTop: 20
        }}>
          Download Image
        </button>
        <button onClick={downloadAsGif} style={{
          marginTop: 20
        }}>
          {processing ? 'Processing...' : 'Download as GIF'}
        </button>
      </main>
    </>
  )
}
