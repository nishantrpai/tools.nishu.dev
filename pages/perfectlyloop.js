// here is how i made this https://www.youtube.com/watch?v=dQw4w9WgXcQ
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { decompressFrames, parseGIF } from 'gifuct-js'
import gifshot from 'gifshot'

export default function PerfectlyLoop() {
  const [gifFrames, setGifFrames] = useState([])
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [processing, setProcessing] = useState(false)
  const [gifUrl, setGifUrl] = useState('')

  useEffect(() => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = image.width
      canvas.height = image.height
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
    }
  }, [image, offsetX, offsetY, scale])

  const downloadAsGif = async () => {
    setProcessing(true)
    const canvas = document.getElementById('canvas')
    const gifFramesWithImages = await Promise.all(gifFrames.map(frame => frame.url))

    gifshot.createGIF({
      gifWidth: canvas.width,
      gifHeight: canvas.height,
      images: gifFramesWithImages,
      frameDuration: gifFrames[0].delay / 100,
    }, function (obj) {
      if (!obj.error) {
        const a = document.createElement('a')
        a.href = obj.image
        a.download = `perfectlyloop-${Date.now()}.gif`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setProcessing(false)
      }
    })
  }

  const handleGifLoad = (gifData) => {
    fetch(`https://api.codetabs.com/v1/proxy/?quest=${gifData}`).then((res) => res.arrayBuffer()).then((buffer) => {
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);
      const gifCanvas = document.createElement('canvas');
      gifCanvas.width = gif.lsd.width;
      gifCanvas.height = gif.lsd.height;
      const gifContext = gifCanvas.getContext('2d');

      frames.forEach((frame) => {
        const { patch, dims } = frame;
        const imageData = gifContext.createImageData(dims.width, dims.height);
        imageData.data.set(patch);
        gifContext.putImageData(imageData, dims.left, dims.top);
        frame.url = gifCanvas.toDataURL('image/png');
      });

      setGifFrames(frames);
    });
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      handleGifLoad(reader.result);
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(img);
      };
    };
    reader.readAsDataURL(file);
  }

  const handleUrlInput = () => {
    handleGifLoad(gifUrl);
    const img = new Image();
    img.src = gifUrl;
    img.onload = () => {
      setImage(img);
    };
  }

  return (
    <>
      <Head>
        <title>Perfectly Loop GIFs</title>
        <meta name="description" content="Make your GIFs perfectly loop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Perfectly Loop GIFs
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Make your GIFs perfectly loop
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
        </div>

        <button onClick={downloadAsGif} style={{
          marginTop: 20
        }}>
          {processing ? 'Processing...' : 'Download as GIF'}
        </button>
      </main>
    </>
  )
}
