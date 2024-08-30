import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { decompressFrames, parseGIF } from 'gifuct-js'
import gifshot from 'gifshot'

export default function GlitchGifs() {
  const [gifFrames, setGifFrames] = useState([])
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [gifUrl, setGifUrl] = useState('')
  const [glitchAmount, setGlitchAmount] = useState(50)

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, imgWidth, imgHeight)
      addVHSGlitchEffect(context, imgWidth, imgHeight, glitchAmount)
    }
  }, [image, imgWidth, imgHeight, glitchAmount])

  const addVHSGlitchEffect = (context, width, height, amount) => {
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data

    // VHS-like color separation
    for (let y = 0; y < height; y++) {
      if (Math.random() < amount / 100) {
        const randomOffset = Math.floor(Math.random() * 10) - 5
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4
          if (x + randomOffset >= 0 && x + randomOffset < width) {
            data[i] = data[i + (randomOffset * 4)]  // Red channel
            data[i + 1] = data[i + 1]  // Green channel (unchanged)
            data[i + 2] = data[i + 2 - (randomOffset * 4)]  // Blue channel
          }
        }
      }
    }

    // Small horizontal bars
    for (let y = 0; y < height; y++) {
      if (Math.random() < amount / 200) {
        const barHeight = Math.floor(Math.random() * 3) + 1
        const barWidth = Math.floor(Math.random() * (width / 4)) + 10  // Random width between 10 and 1/4 of the image width
        const startX = Math.floor(Math.random() * (width - barWidth))
        for (let i = 0; i < barHeight; i++) {
          if (y + i < height) {
            for (let x = startX; x < startX + barWidth; x++) {
              const index = ((y + i) * width + x) * 4
              data[index] = 255  // White bar
              data[index + 1] = 255
              data[index + 2] = 255
            }
          }
        }
      }
    }

    // Vertical color bars
    for (let x = 0; x < width; x++) {
      if (Math.random() < amount / 500) {
        const barWidth = Math.floor(Math.random() * 5) + 1
        const r = Math.random() * 255
        const g = Math.random() * 255
        const b = Math.random() * 255
        for (let i = 0; i < barWidth; i++) {
          if (x + i < width) {
            for (let y = 0; y < height; y++) {
              const index = (y * width + x + i) * 4
              data[index] = r
              data[index + 1] = g
              data[index + 2] = b
            }
          }
        }
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  const downloadAsGif = async () => {
    setProcessing(true)
    const canvas = document.getElementById('canvas')

    const drawFrame = async (frame) => {
      const img = await loadImage(frame)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = imgHeight
      const tempContext = tempCanvas.getContext('2d')
      tempContext.drawImage(img, 0, 0, imgWidth, imgHeight)
      addVHSGlitchEffect(tempContext, imgWidth, imgHeight, glitchAmount)
      return tempCanvas.toDataURL('image/png')
    }

    const gifFramesWithImages = await Promise.all(gifFrames.map((frame) => drawFrame(frame.url)))

    gifshot.createGIF({
      gifWidth: imgWidth,
      gifHeight: imgHeight,
      images: gifFramesWithImages,
      frameDuration: gifFrames[0].delay / 100,
    }, function (obj) {
      if (!obj.error) {
        const a = document.createElement('a')
        a.href = obj.image
        a.download = `vhs-glitch-${Date.now()}.gif`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setProcessing(false)
      }
    })
  }

  const handleGifLoad = (gifData, isUrl = false) => {
    const processGif = (buffer) => {
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);

      const gifCanvas = document.createElement('canvas');
      gifCanvas.width = gif.lsd.width;
      gifCanvas.height = gif.lsd.height;
      const gifContext = gifCanvas.getContext('2d');

      frames.forEach((frame, frameIndex) => {
        const { patch, dims, disposalType } = frame;
        if (frameIndex > 0 && disposalType === 2) {
          gifContext.clearRect(dims.left, dims.top, dims.width, dims.height);
        }

        const imageData = gifContext.createImageData(dims.width, dims.height);
        imageData.data.set(patch);

        gifContext.putImageData(imageData, dims.left, dims.top);
        frame.url = gifCanvas.toDataURL('image/png');
      });

      setGifFrames(frames);
      setImgWidth(gif.lsd.width);
      setImgHeight(gif.lsd.height);
      
      // Set the first frame as the preview image
      const previewImage = new Image();
      previewImage.src = frames[0].url;
      previewImage.onload = () => {
        setImage(previewImage);
      };
    };

    if (isUrl) {
      fetch(`https://api.codetabs.com/v1/proxy/?quest=${gifData}`)
        .then((res) => res.arrayBuffer())
        .then(processGif);
    } else {
      processGif(gifData);
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      handleGifLoad(reader.result);
    };
    reader.readAsArrayBuffer(file);
  }

  const handleUrlInput = () => {
    handleGifLoad(gifUrl, true);
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
        <title>VHS Glitch Gifs</title>
        <meta name="description" content="Add VHS glitch effect to your gifs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          VHS Glitch Gifs
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add VHS glitch effect to your gifs
        </span>
        
        <canvas id="canvas" width="800" height="800" style={{
          border: '1px solid #333',
          borderRadius: 10,
          width: '100%',
          height: 'auto',
          margin: '20px 0'
        }}></canvas>
        <div style={{ display: 'flex', gap: 20, flexDirection: 'column', width: '50%' }}>
        <input type="file" accept="image/gif" onChange={handleFileUpload} />
        <div style={{display: 'flex', gap: 20}}>
        <input type="text" placeholder="Enter GIF URL" value={gifUrl} onChange={(e) => setGifUrl(e.target.value)} style={{
          width: '100%',
          borderRadius: 10,
          padding: 10,
          border: '1px solid #333',
          outline: 'none',
          backgroundColor: '#000',
          color: '#fff'
        }}/>
        <button onClick={handleUrlInput}>Load</button>
        </div>
          <label>
            Glitch Intensity
          </label>
          <input type="range" min={0} max={100} value={glitchAmount} onChange={(e) => setGlitchAmount(Number(e.target.value))} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `vhs-glitch-${Date.now()}.png`
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
