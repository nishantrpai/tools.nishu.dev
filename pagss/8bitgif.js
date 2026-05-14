import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { decompressFrames, parseGIF } from 'gifuct-js'
import gifshot from 'gifshot'

export default function EightBitGif() {
  const [gifFrames, setGifFrames] = useState([])
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [gifUrl, setGifUrl] = useState('')
  const [pixelSize, setPixelSize] = useState(40)

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.imageSmoothingEnabled = false
      context.drawImage(image, 0, 0, imgWidth, imgHeight)
      applyPixelateEffect(context, imgWidth, imgHeight, pixelSize)
    }
  }, [image, imgWidth, imgHeight, pixelSize])

  const applyPixelateEffect = (context, width, height, size) => {
    const blockSize = Math.max(1, size)
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let red = 0
        let green = 0
        let blue = 0
        let alpha = 0
        let count = 0

        for (let yy = y; yy < Math.min(y + blockSize, height); yy++) {
          for (let xx = x; xx < Math.min(x + blockSize, width); xx++) {
            const index = (yy * width + xx) * 4
            red += data[index]
            green += data[index + 1]
            blue += data[index + 2]
            alpha += data[index + 3]
            count++
          }
        }

        const avgRed = Math.round(red / count)
        const avgGreen = Math.round(green / count)
        const avgBlue = Math.round(blue / count)
        const avgAlpha = Math.round(alpha / count)

        for (let yy = y; yy < Math.min(y + blockSize, height); yy++) {
          for (let xx = x; xx < Math.min(x + blockSize, width); xx++) {
            const index = (yy * width + xx) * 4
            data[index] = avgRed
            data[index + 1] = avgGreen
            data[index + 2] = avgBlue
            data[index + 3] = avgAlpha
          }
        }
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  const downloadAsGif = async () => {
    if (!gifFrames.length) return
    setProcessing(true)

    const drawFrame = async (frame) => {
      const img = await loadImage(frame)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = imgHeight
      const tempContext = tempCanvas.getContext('2d')
      tempContext.imageSmoothingEnabled = false
      tempContext.clearRect(0, 0, imgWidth, imgHeight)
      tempContext.drawImage(img, 0, 0, imgWidth, imgHeight)
      applyPixelateEffect(tempContext, imgWidth, imgHeight, pixelSize)
      return tempCanvas.toDataURL('image/png')
    }

    const gifFramesWithImages = await Promise.all(gifFrames.map((frame) => drawFrame(frame.url)))

    gifshot.createGIF(
      {
        gifWidth: imgWidth,
        gifHeight: imgHeight,
        images: gifFramesWithImages,
        frameDuration: gifFrames[0]?.delay ? gifFrames[0].delay / 100 : 0.1,
      },
      function (obj) {
        if (!obj.error) {
          const a = document.createElement('a')
          a.href = obj.image
          a.download = `8bit-${Date.now()}.gif`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        setProcessing(false)
      }
    )
  }

  const handleGifLoad = (gifData, isUrl = false) => {
    const processGif = (buffer) => {
      const gif = parseGIF(buffer)
      const frames = decompressFrames(gif, true)

      const gifCanvas = document.createElement('canvas')
      gifCanvas.width = gif.lsd.width
      gifCanvas.height = gif.lsd.height
      const gifContext = gifCanvas.getContext('2d')

      frames.forEach((frame, frameIndex) => {
        const { patch, dims, disposalType } = frame
        if (frameIndex > 0 && disposalType === 2) {
          gifContext.clearRect(dims.left, dims.top, dims.width, dims.height)
        }

        const imageData = gifContext.createImageData(dims.width, dims.height)
        imageData.data.set(patch)
        gifContext.putImageData(imageData, dims.left, dims.top)
        frame.url = gifCanvas.toDataURL('image/png')
      })

      setGifFrames(frames)
      setImgWidth(gif.lsd.width)
      setImgHeight(gif.lsd.height)

      const previewImage = new Image()
      previewImage.src = frames[0].url
      previewImage.onload = () => {
        setImage(previewImage)
      }
    }

    if (isUrl) {
      fetch(`https://api.codetabs.com/v1/proxy/?quest=${gifData}`)
        .then((res) => res.arrayBuffer())
        .then(processGif)
    } else {
      processGif(gifData)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      handleGifLoad(reader.result)
    }
    reader.readAsArrayBuffer(file)
  }

  const handleUrlInput = () => {
    if (!gifUrl) return
    handleGifLoad(gifUrl, true)
  }

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(img)
    })
  }

  return (
    <>
      <Head>
        <title>8bit GIF</title>
        <meta name="description" content="Turn gifs into 8bit pixelized gifs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>8bit GIF</h1>
        <span
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Upload a gif, choose square size, and export a pixelized 8bit gif
        </span>

        <canvas
          id="canvas"
          width="800"
          height="800"
          style={{
            border: '1px solid #333',
            borderRadius: 10,
            width: '100%',
            height: 'auto',
            margin: '20px 0',
            imageRendering: 'pixelated',
          }}
        ></canvas>

        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
          <input type="file" accept="image/gif" onChange={handleFileUpload} />
          <div style={{ display: 'flex', gap: 20 }}>
            <input
              type="text"
              placeholder="Enter GIF URL"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              style={{
                width: '100%',
                borderRadius: 10,
                padding: 10,
                border: '1px solid #333',
                outline: 'none',
                backgroundColor: '#000',
                color: '#fff',
              }}
            />
            <button onClick={handleUrlInput}>Load</button>
          </div>

          <label>8bit Square Size: {pixelSize}px</label>
          <input
            type="range"
            min={10}
            max={200}
            value={pixelSize}
            onChange={(e) => setPixelSize(Number(e.target.value))}
          />
        </div>

        <button
          onClick={downloadAsGif}
          style={{
            marginTop: 20,
          }}
        >
          {processing ? 'Processing...' : 'Download 8bit GIF'}
        </button>
      </main>
    </>
  )
}
