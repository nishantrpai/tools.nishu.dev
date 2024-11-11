// here is how i made this https://www.youtube.com/watch?v=dQw4w9WgXcQ
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { decompressFrames, parseGIF } from 'gifuct-js'
import gifshot from 'gifshot'

export default function HigherFilterGif() {
  const [gifFrames, setGifFrames] = useState([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [greenIntensity, setGreenIntensity] = useState(139)
  const [filterThreshold, setFilterThreshold] = useState(50)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [gifUrl, setGifUrl] = useState('')
  const [frameDelays, setFrameDelays] = useState([])

  useEffect(() => {
    if (gifFrames.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % gifFrames.length)
      }, frameDelays[currentFrameIndex] * 10)

      return () => clearInterval(intervalId)
    }
  }, [gifFrames, frameDelays, currentFrameIndex])

  useEffect(() => {
    if (gifFrames.length > 0) {
      applyFilter()
    }
  }, [currentFrameIndex, greenIntensity, filterThreshold])

  const applyFilter = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    canvas.width = imgWidth
    canvas.height = imgHeight
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    const img = new Image()
    img.src = gifFrames[currentFrameIndex].url
    img.onload = () => {
      context.drawImage(img, 0, 0, imgWidth, imgHeight)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        if (avg > filterThreshold) {
          data[i] = 84 // Red channel
          data[i + 1] = greenIntensity // Green channel
          data[i + 2] = 86 // Blue channel
          data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
        }
      }
      context.putImageData(imageData, 0, 0)
    }
  }

  const downloadAsGif = async () => {
    setProcessing(true)

    const applyFilterToFrame = (frame) => {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = imgHeight
      const tempContext = tempCanvas.getContext('2d')
      tempContext.fillStyle = 'black'
      tempContext.fillRect(0, 0, imgWidth, imgHeight)
      tempContext.drawImage(frame, 0, 0, imgWidth, imgHeight)
      const imageData = tempContext.getImageData(0, 0, imgWidth, imgHeight)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        if (avg > filterThreshold) {
          data[i] = 84 // Red channel
          data[i + 1] = greenIntensity // Green channel
          data[i + 2] = 86 // Blue channel
          data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
        }
      }
      tempContext.putImageData(imageData, 0, 0)
      return tempCanvas.toDataURL('image/png')
    }

    const gifFramesWithFilter = await Promise.all(gifFrames.map((frame) => {
      const img = new Image()
      img.src = frame.url
      return new Promise((resolve) => {
        img.onload = () => resolve(applyFilterToFrame(img))
      })
    }))

    gifshot.createGIF({
      gifWidth: imgWidth,
      gifHeight: imgHeight,
      images: gifFramesWithFilter,
      interval: frameDelays.map(delay => delay / 100),
      quality: 1,
      numWorkers: 10,
      sampleInterval: 1,
      progressCallback: (captureProgress) => {
        console.log(`GIF Creation Progress: ${captureProgress}`)
      },
    }, function (obj) {
      if (!obj.error) {
        const a = document.createElement('a')
        a.href = obj.image
        a.download = `higherfilter-${Date.now()}.gif`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setProcessing(false)
      } else {
        console.error('Error creating GIF:', obj.error)
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

      const delays = frames.map(frame => frame.delay);
      setFrameDelays(delays);

      frames.forEach((frame, frameIndex) => {
        const { patch, dims, disposalType } = frame;
        if (frameIndex > 0 && disposalType === 2) {
          gifContext.clearRect(dims.left, dims.top, dims.width, dims.height);
        }

        gifContext.fillStyle = 'black';
        gifContext.fillRect(0, 0, gifCanvas.width, gifCanvas.height);

        const imageData = gifContext.createImageData(dims.width, dims.height);
        imageData.data.set(patch);

        gifContext.putImageData(imageData, dims.left, dims.top);
        frame.url = gifCanvas.toDataURL('image/png');
      });

      setGifFrames(frames);
      setImgWidth(gif.lsd.width);
      setImgHeight(gif.lsd.height);
      setCurrentFrameIndex(0);
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

  return (
    <>
      <Head>
        <title>Higher Filter Gifs</title>
        <meta name="description" content="Higher Filter Gifs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Filter Gifs
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add higher filter to your gifs
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
            Green Intensity
          </label>
          <input type="range" min={0} max={255} value={greenIntensity} onChange={(e) => setGreenIntensity(Number(e.target.value))} />
          <input type="number" value={greenIntensity} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setGreenIntensity(Number(e.target.value))} />
          <label>
            Filter Threshold
          </label>
          <input type="range" min={0} max={255} value={filterThreshold} onChange={(e) => setFilterThreshold(Number(e.target.value))} />
          <input type="number" value={filterThreshold} style={{ width: 50, background: 'none', border: '1px solid #333', color: '#fff', borderRadius: 5, padding: 5, marginLeft: 10 }} onChange={(e) => setFilterThreshold(Number(e.target.value))} />
        </div>

        <button onClick={() => {
          const canvas = document.getElementById('canvas')
          const dataURL = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataURL
          a.download = `higherfilter-${Date.now()}.png`
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
