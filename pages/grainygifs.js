import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { decompressFrames, parseGIF } from 'gifuct-js'
import gifshot from 'gifshot'

export default function GrainyGifs() {
  const [gifFrames, setGifFrames] = useState([])
  const [image, setImage] = useState(null)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [gifUrl, setGifUrl] = useState('')
  const [noiseAmount, setNoiseAmount] = useState(50)

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

    const drawFrame = async (frame) => {
      const img = await loadImage(frame)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = imgHeight
      const tempContext = tempCanvas.getContext('2d')
      tempContext.drawImage(img, 0, 0, imgWidth, imgHeight)
      addGrainEffect(tempContext, imgWidth, imgHeight, noiseAmount)
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
        a.download = `grainy-${Date.now()}.gif`
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
            Noise Amount
          </label>
          <input type="range" min={0} max={100} value={noiseAmount} onChange={(e) => setNoiseAmount(Number(e.target.value))} />
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
