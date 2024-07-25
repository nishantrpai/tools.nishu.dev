// add higher hat on any image
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { decompressFrames, parseGIF } from 'gifuct-js'
import gifshot from 'gifshot'

export default function HigherHat() {
  // if you are here to copy the code, here is how i did it https://www.youtube.com/watch?v=dQw4w9WgXcQ
  const [gifFrames, setGifFrames] = useState([])
  const [image, setImage] = useState(null)
  const [offsetX, setOffsetX] = useState(38)
  const [gif, setGif] = useState(null)
  const [offsetY, setOffsetY] = useState(104)
  const [scale, setScale] = useState(2.4)
  const [offsetTheta, setOffsetTheta] = useState(0)
  const [imgWidth, setImgWidth] = useState(0)
  const [imgHeight, setImgHeight] = useState(0)
  const [hatType, setHatType] = useState(0)
  const [processing, setProcessing] = useState(false)

  const higherHat = '/highertm.svg'

  useEffect(() => {
    // draw image on canvas
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.beginPath()
    if (image) {
      canvas.width = imgWidth
      canvas.height = imgHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, image.width, image.height)
      const hat = new Image()
      if (hatType === 0)
        hat.src = higherHat
      else if (hatType === 1)
        hat.src = higherHat2
      else if (hatType === 2)
        hat.src = higherHat3

      hat.onload = () => {
        context.translate(offsetX, offsetY)
        context.rotate(offsetTheta * Math.PI / 180)
        context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
        context.closePath()
      }
    }
  }, [image, offsetX, offsetY, scale, offsetTheta, hatType])

  const downloadAsGif = async () => {
    setProcessing(true)
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const hat = new Image()
    hat.src = higherHat

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(img)
      })
    }

    await new Promise((resolve) => {
      hat.onload = resolve
    })

    const drawFrame = async (frame) => {
      const img = await loadImage(frame)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = imgHeight
      const tempContext = tempCanvas.getContext('2d')
      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(img, 0, 0, imgWidth, imgHeight)
      tempContext.translate(offsetX, offsetY)
      tempContext.rotate(offsetTheta * Math.PI / 180)
      tempContext.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
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
        a.download = `highertm-${Date.now()}.gif`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setProcessing(false)
      }
    })
  }


  return (
    <>
      <Head>
        <title>Higher Gifs</title>
        <meta name="description" content="Higher Gifs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className={styles.title}>
          Higher Gifs
        </h1>
        <span style={{
          width: '100%',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Add higher tm to your gifs
        </span>

        {/* upload photo */}
        <input type="file" accept="image/*" onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.onload = () => {
            const gifData = reader.result
            fetch(gifData).then((res) => res.arrayBuffer()).then((buffer) => {
              const gif = parseGIF(buffer);
              console.log(gif);
              const frames = decompressFrames(gif, true); // ensure buildPatch is true
              console.log(frames);

              // create a canvas for the full gif dimensions
              const gifCanvas = document.createElement('canvas');
              gifCanvas.width = gif.lsd.width;
              gifCanvas.height = gif.lsd.height;
              const gifContext = gifCanvas.getContext('2d');

              frames.forEach((frame, frameIndex) => {
                const { patch, dims, disposalType } = frame;
                console.log('patch []', patch);
                // handle disposal
                if (frameIndex > 0 && disposalType === 2) { // restore to background color
                  gifContext.clearRect(dims.left, dims.top, dims.width, dims.height);
                }

                const imageData = gifContext.createImageData(dims.width, dims.height);
                imageData.data.set(patch);

                gifContext.putImageData(imageData, dims.left, dims.top);
                frame.url = gifCanvas.toDataURL('image/png');
              });

              console.log('frames []', frames);
              setGifFrames(frames);
            });


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
          a.download = `highertm-${Date.now()}.png`
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